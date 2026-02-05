import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import ProfileLink from "@/components/user/ProfileLink";
import { GetUser, getUserAnswers, getUserQuestions, getUserTags } from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import dayjs from "dayjs"
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Stats from "@/components/user/Stats";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import DataRenderer from "@/components/DataRender";
import ROUTES from "@/constants/routes";
import { EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/states";
import QuestionCard from "@/components/cards/QuestionCard";
import Pagination from "@/components/Pagination";
import AnswerCard from "@/components/cards/AnswerCard";
import TagCard from "@/components/cards/TagCard";

export default async function Profile({ params, searchParams }: RouteParams) {
    const { id } = await params;
    const { page, pageSize } = await searchParams
    if (!id) notFound();

    const loggedInUser = await auth();
    const { success, data, errors } = await GetUser({
        userId: id
    })

    if (!success) return (
        <div className="h1-bold text-dark100_light900">{errors?.message}</div>
    )

    const { user, totalQuestions, totalAnswers } = data!;

    const { success: userQuestionSuccess, data: userQuestions, errors: userQuestionErrors } = await getUserQuestions({
        userId: id,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
    })

    const { questions, isNext: hasMoreQuestions } = userQuestions!;


    const { success: userAnswersSuccess, data: userAnswers, errors: userAnswersErrors } = await getUserAnswers({
        userId: id,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
    })

    const { answers, isNext: hasMoreAnswers } = userAnswers || { answers: [], isNext: false };

    const { success: userTopTagsSuccess, data: userTopTags, errors: userTopTagsErrors } = await getUserTags({
        userId: id,
    })

    const { tags } = userTopTags! || { tags:  [] };

    const { _id, name, image, portfolio, location, username, bio, createdAt, reputation } = user

    return (
        <>
            <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
                <div className="flex flex-col items-start gap-4 lg:flex-row">
                    <UserAvatar
                        id={_id}
                        name={name}
                        imageUrl={image}
                        className="size-[140px] rounded-full object-cover"
                        fallbackClassName="text-6xl font-bolder"
                    />
                    <div className="mt-3">
                        <h2 className="h2-bold text-dark100_light900">{name}</h2>
                        <p className="paragraph-regular text-dark200_light800">@{username}</p>
                        <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
                            {portfolio && (
                                <ProfileLink
                                    imgUrl={"/icons/link.svg"}
                                    href={portfolio}
                                    title="Portfolio"
                                />
                            )}
                            {location && (
                                <ProfileLink
                                    imgUrl={"/icons/location.svg"}
                                    title="Location"
                                />
                            )}

                            <ProfileLink
                                imgUrl={"/icons/calendar.svg"}
                                href={portfolio}
                                title={dayjs(createdAt).format('MMMM YYYY')}
                            />
                        </div>
                        {bio && (
                            <p className="paragraph-regular text-dark400_light800 mt-8">
                                {bio}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
                    {loggedInUser?.user?.id == id && (
                        <Link href="/profile/edit">
                            <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3">
                                Edit Profile
                            </Button>
                        </Link>
                    )}
                </div>
            </section>
            <Stats
                totalQuestions={totalQuestions}
                totalAnswers={totalAnswers}
                badges={{
                    GOLD: 0,
                    SILVER: 0,
                    BRONZE: 0
                }}
            />
            <section className="mt-10 flex flex-col md:flex-row gap-10">
                <Tabs defaultValue="top-posts" className="flex-[2]">
                    <TabsList className="min-h-[42px]">
                        <TabsTrigger value="top-posts" className="tab">Top Posts</TabsTrigger>
                        <TabsTrigger value="answers" className="tab"  >Answers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="top-posts" className="mt-5 flex w-full flex-col gap-6">
                        <DataRenderer
                            data={questions}
                            empty={EMPTY_QUESTION}
                            success={userQuestionSuccess}
                            errors={userQuestionErrors}
                            render={(questions) => {
                                return (
                                    <div className="flex w-full flex-col gap-6">
                                        {questions.map((question) => (
                                            <QuestionCard key={question._id} question={question} showActionBtns={loggedInUser?.user?.id === question.author._id} />
                                        ))
                                        }
                                    </div>
                                );
                            }}
                        />

                        <Pagination page={page} isNext={hasMoreQuestions || false} />
                    </TabsContent>
                    <TabsContent value="answers" className="mt-5 flex w-full flex-col gap-6">
                        <DataRenderer
                            data={answers}
                            empty={EMPTY_ANSWERS}
                            success={userAnswersSuccess}
                            errors={userAnswersErrors}
                            render={(answers) => {
                                return (
                                    <div className="flex w-full flex-col gap-10">
                                        {answers.map((answer) => (
                                            <AnswerCard key={answer._id} {...answer} content={answer.content.slice(0, 200) + "..."} containerClasses="card-wrapper rounded-[10px] px-7 py-9 sm:px-11" showReadMore  showActionBtns={loggedInUser?.user?.id === answer.author._id}  />
                                        ))
                                        }
                                    </div>
                                );
                            }}
                        />

                        <Pagination page={page} isNext={hasMoreAnswers || false} />
                    </TabsContent>
                </Tabs>
                <div className="flex w-full min-w-[250px] flex-1 flex-col max-hidden">
                    <h3 className="h3-bold text-dark200_light900">Top Tech</h3>
                    <div className="mt-7 flex flex-col gap-4">
                        <DataRenderer
                            data={tags}
                            empty={EMPTY_TAGS}
                            success={userTopTagsSuccess}
                            errors={userTopTagsErrors}
                            render={(tags) => {
                                return (
                                    <div className="mt-3 flex w-full flex-col gap-4">
                                        {tags.map((tag) => (
                                            <TagCard
                                                key={tag._id}
                                                _id={tag._id}
                                                name={tag.name}
                                                questions={tag.count}
                                                showCount
                                                compact
                                            />
                                        ))
                                        }
                                    </div>
                                );
                            }}
                        />
                    </div>
                </div>
            </section>
        </>
    )
}