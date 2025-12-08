'use client'

import React from 'react';
import {sidebarLinks,mobileSidebarLinks} from "@/constants";
import {usePathname} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {cn} from "@/lib/utils";

function NavLinks({isMobileNav}: { isMobileNav?: boolean }) {
    const pathname = usePathname()
    const links = isMobileNav ? mobileSidebarLinks : sidebarLinks;

    return (
        <>
            {links.map((item) => {
                    const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;
                    const LinkComponent = (
                        <Link href={item.route} key={item.label} className={cn(
                            isActive
                                ? "primary-gradient rounded-lg text-light-900"
                                : "text-dark300_light900",
                            "flex items-center justify-start gap-4 bg-transparent p-4"
                        )}>
                            <Image src={item.imgURL} alt={item.label} width={20} height={20}
                                   className={cn(
                                       isActive ? "base-bold" : "base-medium",
                                   )}
                            />
                            <p className={cn(!isMobileNav && "max-lg:hidden")}>{item.label}</p>
                        </Link>
                    )

                    return LinkComponent;
                }
            )}
        </>
    )
}

export default NavLinks;