import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Props {
    imgUrl: string;
    alt: string;
    value: string | number;
    title: string;
    href?: string;
    textStyles: string;
    imgStyles?: string;
    titleStyles?: string,
    isAuthor?: boolean;
}

export default function Matric({ imgUrl, alt, value, title, href, textStyles = "max-sm:hidden", imgStyles, isAuthor }: Props) {
    const metricContent = <>
        {
            imgUrl ? (
                <Image src={imgUrl} alt={alt} width={16} height={16} className={`rounded-full object-contain ${imgStyles}`} />
            ) :
                (
                    <Avatar>
                        <AvatarFallback className={cn("primary-gradient font-space-grotesk font-bold tracking-wider text-white")}>
                            {alt.split('').map((word: string) => word[0]).join('').toUpperCase().slice(0,2)}
                        </AvatarFallback>
                    </Avatar>
                )
        }

        <p className={`flex items-center gap-1 ${textStyles}`}>
            {value}

            {title ? (
                <span className={cn(`small-regular line-clamp-1`, textStyles)}>
                    {title}
                </span>
            ) : null}

        </p>

    </>
    return href ? (
        <>
            <Link href={href} className="flex-center gap-1">{metricContent}</Link>
        </>
    ) : (
        <div className="flex-center gap-1">{metricContent}</div>
    )
}