import LocaleSearch from "@/components/search/LocalSearch"
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRender";
import { EMPTY_QUESTION } from "@/constants/states";
import { getSavedQuestion } from "@/lib/actions/collection.action";
import ROUTES from "@/constants/routes";
import { CollectionFilters } from "@/constants/filter";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";


interface SearchParams {
    searchParams: Promise<{ [key: string]: string }>
}


export default async function Collection({ searchParams }: SearchParams) {
    const { page, pageSize, query, filter } = await searchParams;

    const { success, data, errors } = await getSavedQuestion({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query: query || "",
        filter: filter || "",

    });

    const { collection , isNext} = data || {};



    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocaleSearch route={ROUTES.COLLECTION} imgSrc="/icons/search.svg" placeholder="Search questions..." otherClasses="flex-1" />
                <CommonFilter 
                    filters={CollectionFilters}
                    otherClasses="max-h-[56px] sm:min-w-[170px]" 
                />
            </div>
            <HomeFilter />
            <DataRenderer success={success} errors={errors} data={collection} empty={EMPTY_QUESTION} render={(collection) => (
                collection.map((item) => (
                    <QuestionCard key={item.question._id} question={item.question} />
                ))
            )} />
            <Pagination page={page} isNext={isNext || false} />
        </>
    );
}
