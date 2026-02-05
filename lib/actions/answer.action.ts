'use server';

import Answer, { IAnswer } from "@/database/answer.model";
import action from "../handlers/action";
import { AnswerServerSchema, DeleteAnswerSchema, GetAnswersSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { error } from "console";
import { Question, User } from "@/database";
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

        if (!newAnswer) throw new Error("Faild to create answer");
        question.answers += 1;

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


export async function getAnswers(params: GetAnswerParams): Promise<ActionResponse<{
    answers: Answer[];
    isNext: boolean;
    totalAnswers: number;
}>> {
    const validationResult = await action({
        params,
        schema: GetAnswersSchema,
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult, 'server') as ErrorResponse;
    }

    const { questionId, page = 1, pageSize = 10, filter } = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = pageSize;

    let sortCriteria = {}

    switch (filter) {
        case 'latest':
            sortCriteria = { createdAt: -1 };
            break;
        case 'oldest':
            sortCriteria = { createdAt: 1 };
            break;
        case 'popular':
            sortCriteria = { upvotes: -1 };
            break;
        default:
            sortCriteria = { createdAt: -1 };
            break;
    }

    try {
        const totalAnswers = await Answer.countDocuments({ question: questionId });
        const answers = await Answer.find({ question: questionId })
        .populate({
                path: "author",
                model: User,
                select: "_id name image"
            })
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit)

        const isNext = totalAnswers > skip + answers.length;

        return {
            status: 200,
            success: true,
            data: {
                answers: JSON.parse(JSON.stringify(answers)),
                isNext,
                totalAnswers,
            }
        }
    }catch (error) {
        return handleError(error, 'server') as ErrorResponse;
    }

}


export async function deleteAnswer(
    params: DeleteAnswerParams
): Promise<ActionResponse<{ hasDeleted: boolean }>> {
    const validationResult = await action({
        params,
        schema: DeleteAnswerSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult, "server") as ErrorResponse;
    }

    const { answerId } = validationResult.params!;

    try {
        const result = await Answer.deleteOne({ _id: answerId });

        return {
            status: 200,
            success: true,
            data: { hasDeleted: result.acknowledged! },
        };
    } catch (error) {
        return handleError(error, "server") as ErrorResponse;
    }
}
