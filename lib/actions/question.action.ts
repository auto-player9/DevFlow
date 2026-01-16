"use server";

import mongoose, { FilterQuery } from "mongoose";
import Question, { IQuestion, IQuestionDoc } from "@/database/question.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
    AskQuestionSchema,
    EditQuestionSchema,
    GetQuestionSchema,
    IncrementViewsSchema,
    PaginatedSearchParamsSchema,
} from "../validations";
import Tag, { ITagDoc } from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";




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
                { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
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
        const question = await Question.findById(questionId)
        .populate("tags")
        .populate("author", "_id name image")
        ;

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

export async function getQuestions(
    params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
    const validationResult = await action({
        params,
        schema: PaginatedSearchParamsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult, "server") as ErrorResponse;
    }

    const { page = 1, pageSize = 10, query, filter } = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = Number(pageSize);

    const filterQuery: FilterQuery = {};

    if (filter === "recommended")
        return {
            status: 200,
            success: true,
            data: { questions: [], isNext: false },
        };

    if (query) {
        filterQuery.$or = [
            { title: { $regex: new RegExp(query, "i") } },
            { content: { $regex: new RegExp(query, "i") } },
        ];
    }

    let sortCritiria = {};

    switch (filter) {
        case "newest":
            sortCritiria = { createdAt: -1 };
            break;
        case "unanswerd":
            filterQuery.answers = 0;
            sortCritiria = { createdAt: -1 };
            break;
        case "popular":
            sortCritiria = { upvotes: -1 };
            break;
        default:
            sortCritiria = { createdAt: -1 };
            break;
    }

    try {
        const totalQuestions = await Question.countDocuments(filterQuery);

        const questions = await Question.find(filterQuery)
            .populate("tags", "name")
            .populate({
                path: "author",
                model: User,
                select: "name image"
            })
            .lean()
            .sort(sortCritiria)
            .skip(skip)
            .limit(limit);

        const isNext = totalQuestions > skip + questions.length;

        return {
            status: 200,
            success: true,
            data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
        }

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse;
    }
}


export async function incrementViews(params: IncrementViewsParams): Promise<ActionResponse<{ views: number }>> {
    const validationResult = await action({
        params, schema: IncrementViewsSchema,
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult, "server") as ErrorResponse
    }

    const { questionId } = validationResult.params!;

    try {
        const question = await Question.findById(questionId);
        if(!question) {
            throw new Error("Question not found")
        }

        question.views +=1;

        await question.save();

        revalidatePath(ROUTES.QUESTION(questionId))

        return {
            status: 200,
            success: true,
            data: { views: question.views },
        }
    }catch (error) {
         return handleError(validationResult, "server") as ErrorResponse
    }
}