'use client'

import { incrementViews } from "@/lib/actions/question.action"
import { useEffect } from "react"
import { toast } from "sonner";

export function View({ questionId }: { questionId: string }) {
    const handleIncrement = async () => {
        const result = await incrementViews({ questionId });

        if (result.success) {
            toast.success('Success', {
                description: "Views incremented"
            })
        } else {
            toast.error('Error', {
                description: result.errors?.message
            })
        }
    };

    useEffect(() => {
        handleIncrement()
    }, [])

    return null;
}