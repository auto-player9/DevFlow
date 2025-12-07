import Navbar from "@/components/navigation/navbar";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import Sidebar from "@/components/navigation/Sidebar"
import React from "react";


export default function RootLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <Sidebar/>
            <main className="w-full">
                <Navbar/>
                {children}
            </main>
        </SidebarProvider>
    );
}

