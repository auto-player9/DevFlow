import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Matric from "@/components/Matric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { getAnswers } from "@/lib/actions/answer.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";


import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";

export default async function QuestionDetails({ params }: RouteParams) {
    const { id } = await params;


    after(async () => {
        await incrementViews({ questionId: id });
    })

    const { success, data: question } = await getQuestion({
        questionId: id
    })


    if (!success || !question) return redirect("/404");

    const { success: areAnswersLoaded, data: answersResult, errors: answersError } = await getAnswers({ 
        questionId: id,
        page: 1,
        pageSize: 10,
        filter: 'latest'
    })

    console.log('ANSWERS', answersResult)

    const { author, createdAt, answers, views, tags, title, content } = question;

    return (
        <>
            <div className="flex-start w-full flex-col">
                <div className="flex w-full flex-col-reverse justify-between">
                    <div className="flex items-center justify-start gap-1">
                        <UserAvatar
                            id={author._id} name={author.name} className="size-[22px]" fallbackClassName="text-[10px]" />
                        <Link href={ROUTES.PROFILE(author._id)}>
                            <p className="paragraph-semibold text-dark300_light700">
                                {author.name}
                            </p>
                        </Link>
                    </div>
                    <div className="flex justify-end">
                        <p>Vote</p>
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
                    <AnswerForm questionId={question._id} />
                </section>

        </>
    )
}