"use server";

import Question from "@/database/question.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
    AskQuestionSchema,
    EditQuestionSchema,
    GetQuestionSchema,
} from "../validations";
import mongoose from "mongoose";
import Tag, { ITagDoc } from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";


export async function createQuestion(
    params: CreateQuestionParams
): Promise<ActionResponse<Question>> {
    const validationResult = await action({
        params,
        schema: AskQuestionSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult, "server") as ErrorResponse;
    }

    const { title, content, tags } = validationResult.params!;
    const userId = validationResult?.session?.user?.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [question] = await Question.create(
            [{ title, content, author: userId }],
            { session }
        );

        if (!question) {
            throw new Error("Failed to create question");
        }

        const tagIds: mongoose.Types.ObjectId[] = [];
        const tagQuestionDocuments = [];

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                { $setOnInsert: { name: tag }, $inc: { question: 1 } },
                { upsert: true, new: true, session }
            );

            tagIds.push(existingTag._id);
            tagQuestionDocuments.push({
                tag: existingTag._id,
                questions: question._id,
            });
        }

        await TagQuestion.insertMany(tagQuestionDocuments, { session });
        await Question.findByIdAndUpdate(
            question._id,
            { $push: { tags: { $each: tagIds } } },
            { session }
        );

        await session.commitTransaction();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(question)),
            status: 201,
        };
    } catch (error) {
        await session.abortTransaction();
        return handleError(error, "server") as ErrorResponse;
    } finally {
        session.endSession();
    }
}

export async function editQuestion(
    params: EditQuestionParamas
): Promise<ActionResponse<Question>> {
    const validationResult = await action({
        params,
        schema: EditQuestionSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult, "server") as ErrorResponse;
    }

    const { title, content, tags, questionId } = validationResult.params!;
    const userId = validationResult?.session?.user?.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const question = await Question.findById(questionId).populate("tags");

        if (!question) throw new Error("Question not Found");
        if (question.author.toString() !== userId) throw new Error("Unauthorized");

        if (question.title !== title || question.content !== content) {
            question.title = title;
            question.content = content;
        }

        const currentTagNames = question.tags.map((t: any) => t.name.toLowerCase());
        const newTagNames = tags.map((t: string) => t.toLowerCase());

        const tagsToAdd = tags.filter(
            (t) => !currentTagNames.includes(t.toLowerCase())
        );
        const tagsToRemove = (question.tags as any[]).filter(
            (t) => !newTagNames.includes(t.name.toLowerCase())
        );

        const newTagDocuments = [];
        if (tagsToAdd.length) {
            for (const tagName of tagsToAdd) {
                const existingTag = await Tag.findOneAndUpdate(
                    { name: { $regex: new RegExp(`^${tagName}$`, "i") } },
                    {
                        $setOnInsert: { name: tagName },
                        $inc: { questions: 1 }, 
                    },
                    { upsert: true, new: true, session }
                );

                if (existingTag) {
                    newTagDocuments.push({
                        tag: existingTag._id,
                        questions: questionId,
                    });
                    question.tags.push(existingTag._id);
                }
            }
        }

        if (tagsToRemove.length) {
            const tagIdsToRemove = tagsToRemove.map((t: any) => t._id);

            await Tag.updateMany(
                { _id: { $in: tagIdsToRemove } },
                { $inc: { questions: -1 } },
                { session }
            );


            await TagQuestion.deleteMany(
                {
                    tag: { $in: tagIdsToRemove },
                    questions: questionId,
                },
                { session }
            );

            question.tags = question.tags.filter(
                (tagObj: any) =>
                    !tagIdsToRemove.some((id) => id.equals(tagObj._id || tagObj))
            );
        }

        if (newTagDocuments.length) {
            await TagQuestion.insertMany(newTagDocuments, { session });
        }
        await question.save({ session });

        await session.commitTransaction();
        return {
            success: true,
            data: JSON.parse(JSON.stringify(question)),
            status: 200,
        };
    } catch (error) {
        await session.abortTransaction();
        return handleError(error, "server") as ErrorResponse;
    } finally {
        await session.endSession();
    }
}

export async function getQuestion(
    params: GetQuestionParams
): Promise<ActionResponse<Question>> {
    const validationResult = await action({
        params,
        schema: GetQuestionSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult, "server") as ErrorResponse;
    }

    const { questionId } = validationResult.params!;

    try {
        const question = await Question.findById(questionId).populate("tags");

        if (!question) {
            throw new Error("Question not found");
        }

        return {
            status: 200,
            success: true,
            data: JSON.parse(JSON.stringify(question)),
        };
    } catch (error) {
        return handleError(error, "server") as ErrorResponse;
    }
}
