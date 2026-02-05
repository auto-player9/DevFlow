import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import ROUTES from "@/constants/routes";

import NavLinks from "./NavLinks";
import React from "react";
import Routes from "@/constants/routes";

const MobileNavigation = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Image
                    src="/icons/hamburger.svg"
                    width={36}
                    height={36}
                    alt="Menu"
                    className="invert-colors sm:hidden"
                />
            </SheetTrigger>
            <SheetContent
                side="left"
                className="background-light900_dark200 border-none"
            >
                <SheetTitle className="hidden">Navigation</SheetTitle>
                <Link href="/" className="flex items-center gap-1">
                    <Image src="/images/site-logo.svg" alt="logo" width={23} height={23} />
                    <p className={"h1-old font-space-grotesk text-dark-100 dark:text-light-900"}>
                        Dev<span className={"text-primary-500 "}>Flow</span>
                    </p>
                </Link>
                <div
                    className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
                    <SheetClose asChild>
                        <section className="flex h-full flex-col gap-3 pt-16">
                            <NavLinks isMobileNav userId={userId} />
                        </section>
                    </SheetClose>
                    <div className="flex flex-col gap-3 pb-24">
                        {
                            userId ?
                                (
                                    <SheetClose asChild>
                                        <form
                                            action={async () => {
                                                'use server';
                                                await signOut({ redirectTo: Routes.SIGN_IN })
                                            }}
                                            className="w-full"
                                        >
                                            <Button className="base-medium light-border-2 !bg-transparent hover:bg-transparent text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 pt-3 pb-3 p cursor-pointer">
                                                <LogOut className='h-12 w-12' />
                                                Log Out
                                            </Button>
                                        </form>
                                    </SheetClose>
                                )
                                : (
                                    <>
                                        <SheetClose asChild>
                                            <Link href={Routes.SIGN_IN}>
                                                <Button
                                                    className={"Small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"}>
                                                    <span className="primary-text-gradient">Log In</span>
                                                </Button>
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link href={Routes.SIGN_UP}>
                                                <Button
                                                    className={"Small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"}>
                                                    Sign Up
                                                </Button>
                                            </Link>
                                        </SheetClose>
                                    </>
                                )
                        }
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileNavigation;
