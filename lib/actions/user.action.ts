'use server';

import User from "@/database/user.model";
import action from "../handlers/action";
import { PaginatedSearchParamsSchema } from "../validations";
import { FilterQuery } from "mongoose";
import handleError from "../handlers/error";

export async function getUsers(params: PaginatedSearchParams)
    : Promise<ActionResponse<{ users: User[], isNext: boolean }>> {
    const validationResult = await action({
        params,
        schema: PaginatedSearchParamsSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult, 'server') as ErrorResponse;
    }

    const { page = 1, pageSize = 10, query = '', filter } = validationResult.params!;
    const skip = (Number(page) - 1) * pageSize;
    const limit = pageSize;
    const fielterQuery: FilterQuery<typeof User> = {};

    if (query) {
        fielterQuery.$or = [
            {
                name: { $regex: query, $options: "i" }
            },
            {
                email: { $regex: query, $options: "i" }
            }
        ]
        
    }

    let sortCriteria = {};

    switch (filter) {
        case 'newest':
            sortCriteria = { createdAt: -1 };
            break;
        case 'oldest':
            sortCriteria = { createdAt: 1 }; 
            break;
        case 'Popular':
            sortCriteria = { reputation: -1 };
            break;
        default:
            sortCriteria = { createdAt: -1 };
            break;
    }

    try {
        const totalUsers = await User.countDocuments(fielterQuery);
        const users = await User.find(fielterQuery)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);
        const isNext = totalUsers > skip + users.length;

        return {
            status: 200,
            success: true,
            data: {
                users: JSON.parse(JSON.stringify(users)),
                isNext: isNext
            }
        };
    }catch (error) {
        return handleError(error, 'server') as ErrorResponse;
    }
}