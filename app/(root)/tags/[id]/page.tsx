import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRender";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { EMPTY_QUESTION } from "@/constants/states";
import { GetTagQuestions } from "@/lib/actions/tag.action";



export default async function QuestionByTags({ params, searchParams }: RouteParams) {
    const { page, pageSize, query } = await searchParams;
    const { id } = await params; 
    const { success, data, errors } = await GetTagQuestions({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query: query || "",
        tagId: id
    });

    const { tag, questions, isNext } = data || {};



    return (
        <>
            <h1 className="h1-bold text-dark100_light900">{tag?.name}</h1>
            <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch route="/" imgSrc="/icons/search.svg" placeholder="Search questions..." otherClasses="flex-1" />
            </section>
            <DataRenderer success={success} errors={errors} data={questions} empty={EMPTY_QUESTION} render={(questions: Question[]) => (
                questions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                ))
            )} />

            <Pagination page={page} isNext={isNext || false} />
        </>
    )
}