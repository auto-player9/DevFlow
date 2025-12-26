import {Button} from "@/components/ui/button";
import ROUTES from "@/constants/routes"
import Link from "next/link";
import LocaleSearch from "@/components/search/LocalSearch"
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";
import {Question} from "@/types/global";


interface SearchParams {
    searchParams: Promise<{[key : string]:string }>
}

const questions: Question[] = [
    {
        _id: "1",
        title: "How to learn react ?",
        description: "I want to learn react , can anyone help me ?",
        tags: [
            {
                _id : "1",
                name : "React"
            },
            {
                _id : "2",
                name : "Javascript"
            }
        ],
        author: {
            _id : "1",
            name : "User1",
            image : "https://tse1.mm.bing.net/th/id/OIF.EoCwNwPtErxbfM3F5q2H3w?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
        },
        createdAt: new Date("2024-3-2"),
        upvotes: 10,
        answers: 2,
        views: 30,

    },
    {
        _id: "2",
        title: "How to learn react ?",
        description: "I want to learn react , can anyone help me ?",
        tags: [
            {
                _id : "1",
                name : "Javascript"
            },
            {
                _id : "2",
                name : "Javascript"
            }
        ],
        author: {
            _id : "2",
            name : "User2",
            image : "https://tse1.mm.bing.net/th/id/OIF.EoCwNwPtErxbfM3F5q2H3w?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
        },
        createdAt: new Date("2025-3-2"),
        upvotes: 10,
        answers: 2,
        views: 30,

    }
]

export default async function Home({searchParams} : SearchParams) {

    const {query ='' , filter = ''} = await searchParams;
    const filteredQuestions = questions.filter(question => {
        const matchQuery =  question.title.toLowerCase().includes(query.toLowerCase());
        const matchFilter = filter ? question.tags[0].name.toLowerCase(): true
        return matchQuery && matchFilter;
    })


    return (
        <>
            <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">All Questions</h1>
                <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900" asChild>
                    <Link href={ROUTES.ASK_QUESTION}>Ask a Questions</Link>
                </Button>
            </section>

            <section className="mt-11">
                <LocaleSearch route="/" imgSrc="/icons/search.svg" placeholder= "Search questions..." otherClasses = "flex-1"/>
            </section>
            <HomeFilter />

            <div className="mt-10 flex w-full flex-col gap-6">
                {filteredQuestions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                ))}
            </div>
        </>
    );
}
