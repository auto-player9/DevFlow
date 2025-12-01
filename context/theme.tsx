"use client";

import {ThemeProviderProps} from "next-themes";
import {ThemeProvider as NextThemesProvider} from "next-themes";

function  themeProvider({children, ...props}: ThemeProviderProps) {
    return (
        <NextThemesProvider {...props}></NextThemesProvider>
    )
}

export default themeProvider;