'use server';

import mongoose, { ClientSession } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { CreateVoteSchema, UpdateVoteCountSchema, HasVotedSchema } from "../validations";
import { Answer, Question, Vote } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";


export async function updateVoteCount(params: UpdateVoteCountParams, session?: ClientSession): Promise<ActionResponse> {
    const validationResult = await action({
        params,
        schema: UpdateVoteCountSchema,
    });


    if (validationResult instanceof Error) {
        return handleError(validationResult, 'server') as ErrorResponse;
    }

    const { targetId, targetType, voteType, change } = validationResult.params!

    console.log('Updating vote count:', { targetId, targetType, voteType, change });

    const Model = targetType === 'question' ? Question : Answer;
    const voteField = voteType === "upvote" ? "upvotes" : "downvotes"

    try {
        const result = await Model.findByIdAndUpdate(
            targetId,
            { $inc: { [voteField]: change } },
            { new: true }
        );

        if (!result) {
            return handleError(new Error("Failed to update vote count"), 'server') as ErrorResponse;
        }

        return {
            status: 200,
            success: true,
        }

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse;
    }
}

export async function createVote(params: CreateVoteParams): Promise<ActionResponse> {
    const validationResult = await action({
        params,
        schema: CreateVoteSchema,
        authorize: true,
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult, 'server') as ErrorResponse;
    }

    const { targetId, targetType, voteType } = validationResult.params!

    const userId = validationResult.session?.user?.id;

    if (!userId) return  handleError(new Error("Unauthorized"), 'server') as ErrorResponse

    const session = await mongoose.startSession()
    session.startTransaction();

    try {
        const existingVote = await Vote.findOne({
            author: userId,
            id: targetId,
            type: targetType
        })

        if (existingVote) {
            if (existingVote.voteType === voteType) {
                await Vote.deleteOne({
                    _id: existingVote._id
                }).session(session)
                await updateVoteCount({ targetId, targetType, voteType, change: -1 }, { session })
            } else {
                await updateVoteCount({ targetId, targetType, voteType: existingVote.voteType, change: -1 }, { session })
                await Vote.findByIdAndUpdate(existingVote._id, { voteType }, { new: true, session })
                await updateVoteCount({ targetId, targetType, voteType, change: 1 }, { session })
            }
        } else {
            await Vote.create([{
                author: userId,
                id: targetId,
                type: targetType,
                voteType,
            }], { session })
            await updateVoteCount({ targetId, targetType, voteType, change: 1 }, { session })
        }

        await session.commitTransaction();
        revalidatePath(ROUTES.QUESTION(targetId))
        return {
            status: 200,
            success: true
        }

    } catch (error) {
        await session.abortTransaction();
        return handleError(error, 'server') as ErrorResponse;
    } finally {
        session.endSession()
    }
}

export async function hasVoted(params: HasVotedParams): Promise<ActionResponse<HasVotedResponse>> {
    const validationResult = await action({
        params,
        schema: HasVotedSchema,
        authorize: true,
    })

    if (validationResult instanceof Error) {
        return handleError(validationResult, 'server') as ErrorResponse;
    }
    const { targetId, targetType } = validationResult.params!
    const userId = validationResult.session?.user?.id;

    try {
        const vote = await Vote.findOne({
            author: userId,
            id: targetId,
            type: targetType
        });

        if (!vote) {
            return {
                status: 200,
                success: false,
                data: {
                    hasUpVoted: false,
                    hasDownVoted: false,
                }
            }
        }

        return {
            status: 200,
            success: true,
            data: {
                hasUpVoted: vote.voteType === "upvote",
                hasDownVoted: vote.voteType === "downvote",
            }
        }

    } catch (error) {
        return handleError(error, 'server') as ErrorResponse;
    }
}