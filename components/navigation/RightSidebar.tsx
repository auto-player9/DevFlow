import Link from "next/link";
import ROUTES from "@/constants/routes";
import Image from "next/image";
import TagCard from "@/components/cards/TagCard";
import { getHotQuestions } from "@/lib/actions/question.action";
import DataRenderer from "../DataRender";

async function RightSidebar() {

    const { success, data: hotQuestions, errors } = await getHotQuestions();

    return (
        <>
            <section
                className="pt-12 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l shadow-light-300 dark:shadow-none p-6 max-xl:hidden">
                <div>
                    <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
                    <DataRenderer
                        data={hotQuestions}
                        empty={{
                            title: "No questions found",
                            message: "No questions have been asked yet."
                        }}
                        success={success}
                        errors={errors}
                        render={(hotQuestions: any[]) => {
                            return (
                                <div className="mt-7 flex w-full flex-col gap-[30px]">
                                    {hotQuestions.map(({ _id, title }: any) => (
                                        <Link key={_id} href={ROUTES.QUESTION(_id)}
                                            className="flex items-center justify-between gap-7 cursor-pointer">
                                            <p className="body-medium text-dark500_light700 line-clamp-2">{title}</p>
                                            <Image src="/icons/chevron-right.svg" alt="Chevron" width={20} height={20}
                                                className="invert-colors" />
                                        </Link>
                                    ))}
                                </div>
                            );
                        }}
                    />
                </div>
                {/* <div className="mt-16">
                    <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
                    <div className="mt-7 flex flex-col gap-4">
                        {popularTags.map(({ _id, name, questions }) => {
                            return (<TagCard _id={_id} name={name} questions={questions} key={_id} showCount compact isButton={false} />)
                        })
                        }
                    </div>
                </div> */}
            </section>
        </>
    )
}

export default RightSidebar;
