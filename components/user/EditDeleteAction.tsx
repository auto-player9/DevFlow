'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { deleteQuestion } from "@/lib/actions/question.action";
import { deleteAnswer } from "@/lib/actions/answer.action";

interface Props {
    type: string,
    itemId: string
}

export default function EditDeleteAction({ type, itemId }: Props) {
    const router = useRouter();
    const handleEdit = async () => {
        router.push(ROUTES.QUESTION(itemId) + "/edit")
    }

    const handelDelete = async (itemId: string) => {
        if (type === "Question") {
            const { success, data, errors } = await deleteQuestion({ questionId: itemId })

            if (success) {
                if (data?.hasDeleted)
                    toast.success('Question deleted', { description: "Your question has been deleted successfully." })
                else {
                    toast.error('Faild to delete question', { description: "An error has occurred" })
                }
            } else {
                toast.error('Faild to delete question', { description: errors?.message || "An error has occurred" })
            }
        } else if (type === "Answer") {
            const { success, data, errors } = await deleteAnswer({ answerId: itemId })

            if (success) {
                if (data?.hasDeleted)
                    toast.success('Answer deleted', { description: "Your answer has been deleted successfully." })
                else {
                    toast.error('Faild to delete answer', { description: "An error has occurred" })
                }
            } else {
                toast.error('Faild to delete answer', { description: errors?.message || "An error has occurred" })
            }
        }
    }

    return (
        <div className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "Answer" && "gap-0 justify-center"}`}>
            {
                type === 'Question' && (
                    <Image src="/icons/edit.svg" alt="edit" width={14} height={14} className="cursor-pointer object-contain" onClick={handleEdit} />
                )
            }

            <AlertDialog>
                <AlertDialogTrigger className="cursor-pointer" asChild>
                    <Image src="/icons/trash.svg" alt="trash" width={14} height={14} />
                </AlertDialogTrigger>
                <AlertDialogContent className="background-light800_dark300">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your {type === "Question" ? "question" : "answer"} from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="!border-primary-100 !bg-primary-500 !text-light-800" onClick={() => handelDelete(itemId)}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}  