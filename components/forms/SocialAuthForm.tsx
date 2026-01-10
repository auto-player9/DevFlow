'use client';

import {JSX} from 'react';
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {toast} from "sonner"
import ROUTES from "@/constants/routes";
import {signIn} from "next-auth/react";


function  SocialAuthForm(): JSX.Element {

    const buttonClassName = "background-dark400_light900 body-medium text-dark200_light800 rounded-2 min-h-12 flex-1 px-4 py-3.5";
    const handleSignIn = async (provider: "github" | "google") => {
        try {
            const result = await signIn(provider, {
                callbackUrl: ROUTES.HOME,
                redirect: false,
            });

            if (result?.url) {
                window.location.href = result.url;
            } else if (result?.error) {
                toast("Sign-in Failed", { description: result.error });
            }
        } catch (error) {
            toast("Sign-in Failed", {
                description: error instanceof Error ? error.message : "An error occurred.",
            });
        }
    };

    return (
        <div className="mt-10 flex flex-wrap gap-2.5">
            <Button className={buttonClassName} onClick={() => handleSignIn("github")}>
                <Image src="/icons/github.svg" alt="Github Logo" width={20} height={20} className="invert-colors mr-2.5 object-contain" />
                <span>Log in with GitHub</span>
            </Button>

            <Button className={buttonClassName} onClick={() => {handleSignIn("google")}}>
                <Image src="/icons/google.svg" alt="Google Logo" width={20} height={20} className="mr-2.5 object-contain" />
                <span>Log in with Google</span>
            </Button>
        </div>
    )
}

export default SocialAuthForm ;