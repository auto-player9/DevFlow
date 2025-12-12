'use client';

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {cn} from "@/lib/utils";
import {formUrlQuery, removeKeysFromUrlQuery} from "@/lib/url";


export default function HomeFilter() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const filter = searchParams.get("filter");
    const [active, setActive] = useState(filter || "")
    const filters = [
        {name: "React" , value: "react"},
        {name: "Javascript" , value: "javascript"},
        // {name: "Newest", value: "newest"},
        // {name: "Popular", value: "popular"},
        // {name: "Unanswered", value: "unanswered"},
        // {name: "Recommended", value: "recommended"},
    ]

    const handleTypeClick = (filter: string) => {
        let newUrl = ''
            if (filter) {
                if (filter === active) {
                    setActive("");
                    newUrl =  removeKeysFromUrlQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["filter"],
                    });
                }else {
                    setActive(filter);
                    newUrl = formUrlQuery({
                        params: searchParams.toString(),
                        key: "filter",
                        value: filter,
                    })
                }
            }else {
                setActive("");
                newUrl =  removeKeysFromUrlQuery({
                    params: searchParams.toString(),
                    keysToRemove: ["filter"],
                });
            }
        router.push(newUrl, {scroll: false});
    }

    return (
        <>
            <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
                {filters.map(filter => (
                    <Button
                        key={filter.name}
                        className={cn(
                            "body-medium rounded-lg px-6 py-3 capitalize shadow-none",
                            filter.value === active
                                ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
                                : "bg-light-700 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-500"
                        )}

                        onClick={() => handleTypeClick(filter.value)}
                    >
                        {filter.name}
                    </Button>

                ))}
            </div>
        </>
    )
}