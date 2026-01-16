import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import Matric from "@/components/Matric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import {View} from "../view";

import Link from "next/link";
import { redirect } from "next/navigation";

export default async function QuestionDetails({ params }: RouteParams) {
    const { id } = await params;
    const { success, data: question } = await getQuestion({
        questionId: id
    })

    if (!success || !question) return redirect("/404");

    const { author, createdAt, answers, views, tags, title, content } = question;

    return (
        <>
        <View questionId={id} />
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

        </>
    )
}