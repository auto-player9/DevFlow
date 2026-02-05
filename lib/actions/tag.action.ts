import { boolean } from "zod";
import action from "../handlers/action";
import { GetQuestionSchema, GetTagQuestionsSchema, PaginatedSearchParamsSchema } from "../validations";
import handleError from "../handlers/error";
import { Question, Tag } from "@/database";
import { LinkBreak1Icon } from "@radix-ui/react-icons";
import dbConnect from "../mongoose";
import mongoose from "mongoose";

export async function getTags(params: PaginatedSearchParams): Promise<ActionResponse<{ tags: Tag[]; isNext: boolean }>> {
    const validationResult = await action({ params, schema: PaginatedSearchParamsSchema });

    if (validationResult instanceof Error) {
        return handleError(validationResult, 'server') as ErrorResponse;
    }

    const { page = 1, pageSize = 10, query, filter } = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = Number(pageSize);

    const filterQuery: mongoose._QueryFilter<typeof Tag> = {};

    if (query) {
        filterQuery.$or = [
            {
                name: { $regex: query, $options: "i" }
            },
        ]
    }

    let sortCriteria = {};

    switch (filter) {
        case 'popular':
            sortCriteria = { questions: -1 }
            break;
        case 'recent':
            sortCriteria = { createdAt: -1 }
            break;
        case 'oldest':
            sortCriteria = { createdAt: 1 }
            break;
        case 'name':
            sortCriteria = { name: 1 }
        default:
            sortCriteria = { questions: -1 }
            break;
    }

    try {
        const totalTags = await Tag.countDocuments(filterQuery);

        const tags = await Tag.find(filterQuery)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit)

        const isNext = totalTags > skip + tags.length;

        return {
            status: 200,
            success: true,
            data: {
                tags: JSON.parse(JSON.stringify(tags)),
                isNext: isNext
            }
        };

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse;
    }

}


export async function GetTagQuestions(params: GetTagQuestionsParams): Promise<ActionResponse<{ tag: Tag; questions: Question[]; isNext: boolean }>> {
    const validationResult = await action({ params, schema: GetTagQuestionsSchema } as any);

    if (validationResult instanceof Error) {
        return handleError(validationResult, 'server') as ErrorResponse;
    }

    const { tagId, page = 1, pageSize = 10, query } = params;

    const skip = (Number(page) - 1) * pageSize;
    const limit = Number(pageSize);


    try {
        const tag = await Tag.findById(tagId);
        if (!tag) throw new Error("Tag not found");


        const filterQuery: mongoose._QueryFilter<typeof Question> = {
            tags: { $in: [tagId] }
        };

        if (query) {
            filterQuery.title = { $regex: query, $options: "i" };
        }

        const totalQuestions = await Question.countDocuments(filterQuery);

        const questions = await Question.find(filterQuery)
            .select('_id title views answers upvotes downvotes author createdAt')
            .populate([
                { path: 'author', select: "name image" },
                { path: "tags", select: "name" }
            ])
            .skip(skip)
            .limit(limit)

        const isNext = totalQuestions > skip + questions.length;

        return {
            status: 200,
            success: true,
            data: {
                tag: JSON.parse(JSON.stringify(tag)),
                questions: JSON.parse(JSON.stringify(questions)),
                isNext: isNext
            }
        };

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse;
    }

}


export async function getTopTags(): Promise<ActionResponse<Tag[]>> {
    try {
        await dbConnect();
        const tags = await Tag.find()
            .sort({ questions: -1 })
            .limit(5);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(tags)),
        }
    } catch (error) {
        return handleError(error, 'server') as ErrorResponse;
    }

}