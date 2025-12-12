import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {auth, signOut} from "@/auth";
import {Button} from "@/components/ui/button";
import ROUTES from "@/constants/routes"
import Link from "next/link";
import LocaleSearch from "@/components/search/LocalSearch"

export default async function Home() {
    const session = await auth();
    console.log(session);

    return (
        <>
            <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">All Questions</h1>
                <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900" asChild>
                    <Link href={ROUTES.ASK_QUESTION}>Ask a Questions</Link>
                </Button>
            </section>

            <section className="mt-11">
                <LocaleSearch route="/" imgSrc="/icons/search.svg" placeholder= "Search questions..." otherClasses = "flex-1"/>
            </section>
            HomeFilter

            <div className="mt-10 flex w-full flex-col gap-6">
                <p>Question Card 1</p>
                <p>Question Card 1</p>
                <p>Question Card 1</p>
                <p>Question Card 1</p>
                <p>Question Card 1</p>
            </div>
        </>
    );
}
