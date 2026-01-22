'use server';

import Answer, { IAnswer } from "@/database/answer.model";
import action from "../handlers/action";
import { AnswerServerSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { error } from "console";
import { Question } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function createAnswer(params: CreateAnswerParams): Promise<ActionResponse<IAnswer>> {
    const validationResult = await action({
        params,
        schema: AnswerServerSchema,
        authorize: true,
    })

    if (validationResult instanceof Error)
        return handleError(validationResult, 'server') as ErrorResponse;

    const { content, questionId } = validationResult.params!;
    const userId = validationResult?.session?.user?.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const question = await Question.findById(questionId);
        if (!question) throw new Error("Question Not Found")

        const [newAnswer] = await Answer.create(
            [
                {
                    author: userId,
                    question: questionId,
                    content
                }
            ],
            { session }
        )

        if ( !newAnswer ) throw new Error("Faild to create answer");
        question.answers +=1;

        await question.save({ session });
        await session.commitTransaction();

        revalidatePath(ROUTES.QUESTION(questionId));

        return {
            status: 201,
            success: true,
            data: JSON.parse(JSON.stringify(newAnswer)),
        }
    } catch {
        await session.abortTransaction();
        return handleError(error, 'server') as ErrorResponse;
    } finally {
        await session.endSession();
    }

}