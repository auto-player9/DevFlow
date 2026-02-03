import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { notFound, redirect } from "next/navigation";

export default async function EditQuestion({ params }: RouteParams) {
    const { id } = await params;

    if (!id) return notFound();

    const session = await auth();
    if (!session) return redirect("/sign-in")
    
    const { data: question, success } = await getQuestion({ questionId: id});
    if(!success) return notFound();
    console.log(question?.author)
    if (question?.author._id !== session?.user?.id) return(ROUTES.QUESTION(id))
    return (
        <>
            <div className="mt-9">
                <QuestionForm question={question} isEdit />
            </div>
        </>
    )
}