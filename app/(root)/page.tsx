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

export default async function Home() {
    const session = await auth();
    console.log(session);

    return (
        <>
            <h1 className={'h1-bold'}>hello this is Inter font</h1>
            <h1 className={'h1-bold font-space-grotesk'}>Welcome this is sapce-grotesk font</h1>
            <DropdownMenu>
                <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <form className="px-10 py-8" action={async () => {
                'use server';
                await signOut({redirectTo: ROUTES.SIGN_IN})
            }}>
                <Button type="submit">Log out</Button>
            </form>
        </>
    );
}
