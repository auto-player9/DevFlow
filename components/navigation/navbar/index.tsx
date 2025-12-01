import React from "react";
import Link from "next/link";
import Image from "next/image";
import {Theme} from "./Theme";
function  Navbar() : React.JSX.Element {
    return (
        <>
            <nav className={'flex-between w-full z-50 p-6 sm:px-12 shadow-light-300 dark:shadow-none background-light900_dark200'}>
                <Link href="/" className={'flex items-center gap-1'}>
                    <Image src="images/site-logo.svg" width={23} height={23} alt="DevFlowLogo" />
                    <p className={"h1-old font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden"}>
                        Dev<span className={"text-primary-500 "}>Flow</span>
                    </p>
                </Link>
                <p>Global Search</p>
                <div className={"flex-between gap-5"}>
                    <Theme />
                </div>
            </nav>
        </>
    )
}

export default Navbar;