'use client'

import React, {useEffect} from 'react';
import Image from "next/image";
import Link from "next/link";
import NavLinks from "@/components/navigation/navbar/NavLinks";
import Routes from "@/constants/routes";
import {Button} from "@/components/ui/button";
import {useAuth} from '@clerk/nextjs'
import {useState} from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {auth, signOut} from "@/auth";
import ROUTES from "@/constants/routes";


async function AppSidebar() {
    const session = await auth();

    return (
        <Sidebar>
            <SidebarContent
                className="background-light900_dark200 border-none pt-6"
            >
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <Link href="/public" className="flex items-center gap-1 text-xl">
                            <Image src="/images/site-logo.svg" alt="logo" width={26} height={26}/>
                            <p className={"h1-old font-space-grotesk text-dark-100 dark:text-light-900"}>
                                Dev<span className={"text-primary-500 "}>OverFlow</span>
                            </p>
                        </Link>
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="w-[240px]">

                        <div
                            className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
                            <SidebarMenu>
                                <section className="flex h-full flex-col gap-6 pt-16">
                                    <NavLinks isMobileNav/>
                                </section>
                            </SidebarMenu>
                            {!isSignedIn && <div className="flex flex-col gap-3">
                                <div>
                                    <Link href={Routes.SIGN_IN}>
                                        <Button
                                            className={"Small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"}>
                                            <span className="primary-text-gradient">Log In</span>
                                        </Button>
                                    </Link>
                                </div>
                                <div>
                                    <Link href={Routes.SIGN_UP}>
                                        <Button
                                            className={"Small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"}>
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            </div>}
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

export default AppSidebar;
