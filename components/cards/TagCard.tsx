import ROUTES from "@/constants/routes";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {cn, getDeviconClassName, getTechDescription} from "@/lib/utils";
import Image from "next/image";
import React from "react";


interface Props {
    _id: string;
    name: string;
    questions?: number;
    showCount?: boolean;
    compact?: boolean;
    remove?: boolean;
    isButton?: boolean;
    handleRemoveQuestion?: () => void;
}

const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
}

function TagCard({_id, name, questions, showCount, compact, remove, isButton, handleRemoveQuestion}: Props) {
    const iconClass = getDeviconClassName(name)
    const iconDescreption = getTechDescription(name)

    const content = (
        <>
            <Badge
                className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase flex flex-row gap-2">
                <div className="flex-center space-x-2">
                    <i className={`${iconClass} text-sm`}></i>
                    <span>{name}</span>
                </div>

                {remove && (
                    <Image src="/icons/close.svg" alt="close icon" width={12} height={12}
                           className="cursor-pointer object-contain invert-0 dark:invert"
                           onClick={handleRemoveQuestion}
                    />
                )}

            </Badge>

            {
                showCount && (
                    <p className="small-medium text-dark500_light700">{questions}</p>
                )
            }
        </>
    )

    if (compact) {
        return isButton ? (
            <button onClick={(e)=> handleClick(e)} className="flex justify-between gap-2">
                {content}
            </button>
        ) : (
            <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
                {content}
            </Link>
        )
    }


    return (
        <Link href={ROUTES.TAG(_id)} className="shadow-light100_darknone">
            <article className="light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="flex items-center justify-between gap-3">
                    <div className="w-fit rounded-sm px-5 py-1.5">
                        <p className="paragraph-semibold text-dark300_light900">{name}</p>
                    </div>
                    <i className={cn(iconClass, "text-2xl")} aria-hidden="true"/>
                </div>
                <p className="small-regular text-dark500_light700 mt-5 line-clmap-3 w-full">
                    {iconDescreption}
                </p>

                <p className="small-medium text-dark400_light500 mt-3.5">
                    <span className="body-semibold primary-text-gradient mr-2.5">
                        {questions}+
                    </span>
                    Questions
                </p>
            </article>
        </Link>
    )

}

export default TagCard;





