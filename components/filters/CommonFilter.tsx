'use client';

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectGroup, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formUrlQuery } from "@/lib/url";

interface Filter {
    name: string;
    value: string;
}

interface Props {
    filters: Filter[];
    otherClasses?: string;
    containerClasses?: string;
}

export default function CommonFilter({ filters, otherClasses = '', containerClasses = '' }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const paramsFilter = searchParams.get("filter");
    const handleUpdateFilter = (value: string) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "filter",
            value,
        });
        router.push(newUrl, { scroll: false });
    };
    return (
        <div className={cn("relative", containerClasses)}>
            <Select onValueChange={(value) => handleUpdateFilter(value)} defaultValue={paramsFilter || undefined}>
                <SelectTrigger
                    className={cn("body-regular no-focus light-border background-light800_dark200 text-dark500_light700 border px-5 py-2.5 ", otherClasses)}
                    aria-label="Filter options"
                >
                    <div className="line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder="Select a filter" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {filters.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}