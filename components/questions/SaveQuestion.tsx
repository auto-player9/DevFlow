'use client';

import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use, useState } from "react";
import { toast } from "sonner";

export default function SaveQuestion({ questionId, hasSavedQuestionPromise }: { questionId: string, hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>> }) {

    const session = useSession();
    const userId = session.data?.user?.id;

    const { data } = use(hasSavedQuestionPromise); 
    const { saved: hasSaved } = data || {};

    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (isLoading) return;
        if (!userId) return toast.error("You must be logged in to save questions.");
        setIsLoading(true);
        try {
            const { success, data, errors } = await toggleSaveQuestion({ questionId });
            if (!success) {
                throw new Error(errors?.message || 'Failed to save question.');
            }

            toast.success(`${data?.saved ? 'Question saved' : 'Question unsaved'} Successfully.`);

        } catch (error) {
            toast.error('Error', { description: error instanceof Error ? error.message : 'Something went wrong.' });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Image
            src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
            width={18}
            height={18}
            alt="save"
            className={`cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
            aria-label="Save Question"
            onClick={handleSave}
        />
    )
}