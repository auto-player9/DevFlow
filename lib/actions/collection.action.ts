'use server';


import { CollectionBaseSchema } from "../validations";
import handleError from "../handlers/error";
import { Collection, Question } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function ToggleSaveQuestion(params: CollectionBasedParams):
    Promise<ActionResponse<{ saved: boolean }>> {
    const validationResult = await action({
        params,
        schema: CollectionBaseSchema,
        authorize: true,
    })
    
    if (validationResult instanceof Error) {
        return handleError(validationResult, 'server') as ErrorResponse;
    }

    const { questionId } = validationResult.params!;
    const userId = validationResult.session?.user?.id;
    
    try {
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question Not Found");

    const collection = await Collection.findOne({ 
        question: questionId,
        author: userId 
    });


    if (collection) {
        await Collection.findByIdAndDelete(collection._id);
        return {
            status: 200,
            success: true,
            data: { saved: false }
        }
    }

    await Collection.create({
        question: questionId,
        author: userId
    })

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
        status: 200,
        success: true,
        data: { saved: true }
    }
    }catch (error) {
        return handleError(error, 'server') as ErrorResponse;
    }
}
