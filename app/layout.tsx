import type {Metadata} from "next";
import "./globals.css";
import localFont from "next/font/local";
import {ThemeProvider} from "next-themes";
import {Toaster} from "@/components/ui/sonner";
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth"
import React from "react";
import {ClerkProvider} from "@clerk/nextjs";

const Inter = localFont({
    src: "./fonts/InterVF.ttf",
    variable: "--font-inter",
    weight: "100 200 300 400 500 600 700 800 900"
})

const SpaceGrotesk = localFont({
    src: "./fonts/SpaceGroteskVF.ttf",
    variable: "--font-space-grotesk",
    weight: "100 200 300 400 500 600 700"
})

export const metadata: Metadata = {
    title: "DevFlow",
    description:
        "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
    icons: {
        icon: "/images/site-logo.svg",
    },
};


export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await auth();

    return (
        <html lang="en" suppressHydrationWarning={true}>
        <ClerkProvider>
            <SessionProvider session={session}>
                <body
                    className={`${Inter.className} ${SpaceGrotesk.variable} antialiased`}
                >
                <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem={true}
                               disableTransitionOnChange={true}>
                    {children}
                </ThemeProvider>
                <Toaster/>
                </body>
            </SessionProvider>
        </ClerkProvider>
        </html>
    );
}

