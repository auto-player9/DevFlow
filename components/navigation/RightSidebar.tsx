import Link from "next/link";
import ROUTES from "@/constants/routes";
import Image from "next/image";
import TagCard from "@/components/cards/TagCard";

function RightSidebar() {

    const hotQuestions = [
        {"_id": "1", title: "What is the React"},
        {"_id": "2", "title": "What is the Next"},
        {"_id": "3", "title": "What is the Vue"},
        {"_id": "4", "title": "What is the Hook"},
        {"_id": "5", "title": "What is the Tailwindcss"},
    ]

    const popularTags = [
        {_id: "1" , name: "react" , questions: 100},
        {_id: "2", name: "javascript" , questions: 200},
        {_id: "3", name: "typescript", questions: 150},
        {_id: "4", name: "nextjs", questions: 50},
        {_id: "5", name: "react-query", questions: 75},
    ]

    return (
        <>
            <section
                className="pt-12 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l shadow-light-300 dark:shadow-none p-6 max-xl:hidden">
                <div>
                    <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
                    <div className="flex flex-col w-full mt-7 gap-[30px]">
                        {hotQuestions.map(({_id, title}) => (
                            <Link key={_id} href={ROUTES.PROFILE(_id)}
                                  className="flex items-center justify-between gap-7 cursor-pointer">
                                <p className="body-medium text-dark500_light700">{title}</p>
                                <Image src="/icons/chevron-right.svg" alt="Chevron" width={20} height={20}
                                       className="invert-colors"/>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="mt-16">
                    <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
                    <div className="mt-7 flex flex-col gap-4">
                        {popularTags.map(({_id,name,questions}) => {
                            return (<TagCard _id={_id} name={name} questions={questions} key={_id} showCount compact isButton={false}/>)
                        })
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default RightSidebar;
