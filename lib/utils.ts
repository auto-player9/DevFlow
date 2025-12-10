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
