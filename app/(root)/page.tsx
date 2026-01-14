import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes"
import Link from "next/link";
import LocaleSearch from "@/components/search/LocalSearch"
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";
import { getQuestions } from "@/lib/actions/question.action";
import DataRenderer from "@/components/DataRender";
import { EMPTY_QUESTION } from "@/constants/states";


interface SearchParams {
    searchParams: Promise<{ [key: string]: string }>
}


export default async function Home({ searchParams }: SearchParams) {
    const { page, pageSize, query, filter } = await searchParams;

    const { success, data, errors } = await getQuestions({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query: query || "",
        filter: filter || "",

    });

    const { questions } = data || {};



    return (
        <>
            <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">All Questions</h1>
                <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900" asChild>
                    <Link href={ROUTES.ASK_QUESTION}>Ask a Questions</Link>
                </Button>
            </section>

            <section className="mt-11">
                <LocaleSearch route="/" imgSrc="/icons/search.svg" placeholder="Search questions..." otherClasses="flex-1" />
            </section>
            <HomeFilter />
            <DataRenderer success={success} errors={errors} data={questions} empty={EMPTY_QUESTION} render={(questions: Question[]) => (
                questions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                ))
            )} />           
            
        </>
    );
}
