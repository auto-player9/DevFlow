'use client';

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { formUrlQuery } from "@/lib/url";
import { useRouter, useSearchParams } from "next/navigation";


interface Props {
    page: number | undefined | string;
    isNext: boolean,
    containerClasses?: string;
}

export default function Pagination({ page = 1, isNext, containerClasses }: Props) {

    const searchParams = useSearchParams();
    const router = useRouter();

    const handleNavigation = (type: 'next' | 'prev'): void => {
        const nextPageNumber = type === 'next' ? Number(page) + 1 : Number(page) - 1;
        const value = nextPageNumber > 0 ? nextPageNumber.toString() : "";
        const url = formUrlQuery({
            params: searchParams.toString(),
            key: "page",
            value
        });
        
        router.push(url);
    }

    return (
        <div className={cn("flex w-full items-center justify-center gap-2 mt-5", containerClasses)}>
            {Number(page) > 1 && (
                <Button
                    className="!bg-transparent hover:bg-accent light-border-2 flex min-h-[36px] items-center  justify-center gap-2 border"
                    onClick={() => handleNavigation('prev')}
                >
                    <p className="body-medium text-dark200_light800">Prev</p>
                </Button>
            )}

            <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
                <p className="body-semibold text-light-900">{page}</p>
            </div>

            {(isNext && (
                <Button
                    className="!bg-transparent hover:bg-accent light-border-2 flex min-h-[36px] items-center  justify-center gap-2 border"
                    onClick={() => handleNavigation('next')}
                >
                    <p className="body-medium text-dark200_light800">Next</p>
                </Button>
            ))
            }
        </div>
    )
}