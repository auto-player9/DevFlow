import React from 'react';
import NavLinks from "@/components/navigation/navbar/NavLinks";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import Routes from "@/constants/routes";
import {auth, signOut} from "@/auth";
import Image from "next/image";
import { LogOut } from 'lucide-react';

async function LeftSidebar() {
    const session = await auth();
    const userId = session?.user?.id
    return (
        <>
            <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 pt-12 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
                <div className="flex flex-1 flex-col gap-6">
                    <NavLinks userId={userId} />
                    <div className="flex flex-col gap-3">
                        {!userId ? (
                            <div className="flex flex-col gap-3">
                                <Link href={Routes.SIGN_IN} className="w-full">
                                    <Button  className="Small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                                        <span className="primary-text-gradient max-lg:hidden">Log In</span>
                                        <Image src="/icons/account.svg" alt="Account" width={20} height={20} className="invert-colors lg:hidden"/>
                                    </Button>
                                </Link>

                                <Link href={Routes.SIGN_UP} className="w-full">
                                    <Button  className="Small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                                        <span className="max-lg:hidden">Sign Up</span>
                                        <Image src="/icons/sign-up.svg" alt="Account" width={20} height={20} className="invert-colors lg:hidden"/>

                                    </Button>
                                </Link>
                            </div>
                        ) :
                        (
                             <form
                                action={async () => {
                                    'use server';
                                    await signOut({ redirectTo: Routes.SIGN_IN })
                                }}
                                className="w-full"
                            >
                                <Button className="base-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none cursor-pointer">
                                    <LogOut className='h-12 w-12' />
                                    <span className='max-lg:hidden'>Log Out</span>
                                </Button>
                            </form>
                        )
                    }
                    </div>
                </div>
            </section>
        </>
    )
}
export default LeftSidebar;
