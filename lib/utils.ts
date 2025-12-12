import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {techMap} from "@/constants/techMap";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export function getDeviconClassName(techName: string) {
    const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

    // Dictionary mapping possible technology names to Devicon class names


    return `${techMap[normalizedTech] || "devicon-devicon-plain"} colored`;
}


export const getTimeStamp = (createdAt: Date | string): string => {
    // التأكد من أن الإدخال هو كائن Date
    const date = new Date(createdAt);
    const now = new Date();

    // الفرق بالمللي ثانية
    const diffMilliseconds = now.getTime() - date.getTime();

    // ثواني (Total seconds difference)
    const diffSeconds = Math.floor(diffMilliseconds / 1000);

    // --- 1. أقل من دقيقة ---
    if (diffSeconds < 60) {
        return diffSeconds <= 1 ? "just now" : `${diffSeconds} seconds ago`;
    }

    // --- 2. دقائق ---
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
        return `${diffMinutes} mins ago`;
    }

    // --- 3. ساعات ---
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
        return `${diffHours} hours ago`;
    }

    // --- 4. أيام ---
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) {
        return `${diffDays} days ago`;
    }

    // --- 5. أشهر (افتراض 30 يوماً للشهر لتبسيط المنطق) ---
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
        return `${diffMonths} months ago`;
    }

    // --- 6. سنوات ---
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} years ago`;
};