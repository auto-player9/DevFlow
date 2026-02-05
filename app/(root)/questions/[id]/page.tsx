import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Matric from "@/components/Matric";
import SaveQuestion from "@/components/questions/SaveQuestion";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import ROUTES from "@/constants/routes";
import { getAnswers } from "@/lib/actions/answer.action";
import { hasSavedQuestion } from "@/lib/actions/collection.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { hasVoted } from "@/lib/actions/vote.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { Suspense } from "react";

export async function generateMetadata({
    params
}: RouteParams): Promise<Metadata> {
    const { id } = await params;
    const { success, data: question } = await getQuestion({
        questionId: id
    });

    if (!success || !question) {
        return {
            title: "Question not found",
            description: "This question does not exist."
        }
    }

    return {
        title: question.title,
        description: question.content.slice(0, 100),
        twitter: {
            card: "summary_large_image",
            title: question.title,
            description: question.content.slice(0, 100),
        }
    }
}

export default async function QuestionDetails({ params, searchParams }: RouteParams) {
    const { id } = await params;

    const { page, pageSize, filter } = await searchParams;


    after(async () => {
        await incrementViews({ questionId: id });
    })

    const { success, data: question } = await getQuestion({
        questionId: id
    })


    if (!success || !question) return redirect("/404");

    const { success: areAnswersLoaded, data: answersResult, errors: answersError } = await getAnswers({
        questionId: id,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 3,
        filter: filter,
    })

    const hasVotedPromise = hasVoted({
        targetId: question._id,
        targetType: "question"
    })

    const hasSavedQuestionPromise = hasSavedQuestion({
        questionId: question._id
    })

    const { author, createdAt, answers, views, tags, title, content } = question;

    return (
        <>
            <div className="flex-start w-full flex-col">
                <div className="flex w-full flex-col-reverse justify-between">
                    <div className="flex items-center justify-start gap-1">
                        <UserAvatar
                            id={author._id} name={author.name} imageUrl={author.image} className="size-[22px]" fallbackClassName="text-[10px]" />
                        <Link href={ROUTES.PROFILE(author._id)}>
                            <p className="paragraph-semibold text-dark300_light700">
                                {author.name}
                            </p>
                        </Link>
                    </div>
                    <div className="flex justify-end itmes-center gap-4">
                        <Suspense fallback={<div>Loading...</div>}>
                            <Votes
                                upvotes={question.upvotes}
                                downvotes={question.downvotes}
                                targetType="question"
                                targetId={question._id}
                                hasVotedPromise={hasVotedPromise}
                            />
                        </Suspense>
                        <Suspense fallback={<div>Loading...</div>}>
                            <SaveQuestion questionId={question._id} hasSavedQuestionPromise={hasSavedQuestionPromise} />
                        </Suspense>
                    </div>
                </div>
                <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
                    {title}
                </h2>
            </div>
            <div className="mb-8 mt-5 flex flex-wrap gap-4">
                <Matric
                    imgUrl="/icons/clock.svg"
                    alt="clock icon"
                    value={` asked ${getTimeStamp(new Date(createdAt))}`}
                    title=""
                    textStyles="samll-regular text-dark400_light700"
                />
                <Matric
                    imgUrl="/icons/message.svg"
                    alt="message icon"
                    value={answers}
                    title=""
                    textStyles="samll-regular text-dark400_light700"
                />
                <Matric
                    imgUrl="/icons/eye.svg"
                    alt="eye icon"
                    value={formatNumber(views)}
                    title=""
                    textStyles="samll-regular text-dark400_light700"
                />
            </div>

            <Preview content={content} />

            <div className="mt-8 flex flex-wrap gap-2">
                {
                    tags.map((tag) => (
                        <TagCard
                            key={tag._id}
                            _id={tag._id as string}
                            name={tag.name}
                            compact
                        />
                    ))
                }
            </div>

            <section className="my-5">
                <AllAnswers
                    data={answersResult?.answers}
                    success={areAnswersLoaded}
                    errors={answersError}
                    totalAnswers={answersResult?.totalAnswers || 0}
                    page={Number(page) | 1}
                    isNext={answersResult?.isNext || false}
                />
            </section>

            <section className="my-5">
                <AnswerForm questionId={question._id} />
            </section>

        </>
    )
}