import React, { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import {Theme} from "./Theme";
import MobileNavigation from "@/components/navigation/navbar/MobileNavigation";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";

async function Navbar() {
    const session = await auth();

    return (
        <>
            <nav className={'flex-between w-full p-6 sm:px-12 shadow-light-300 dark:shadow-none background-light900_dark200'}>
                <Link href="/" className={'flex items-center gap-1'}>
                    <Image src="images/site-logo.svg" width={23} height={23} alt="DevFlowLogo" />
                    <p className={"h1-old font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden"}>
                        Dev<span className={"text-primary-500 "}>Flow</span>
                    </p>
                </Link>
                <p>Global Search</p>
                <div className={"flex-between gap-5"}>
                    <Theme />
                    {
                        session?.user?.id && (
                            <UserAvatar 
                                id = {session.user.id}
                                name = {session.user.name!}
                                imageUrl = {session.user.image!}
                            />
                        )
                    }
                    <MobileNavigation />
                </div>
            </nav>
        </>
    )
}

export default Navbar;