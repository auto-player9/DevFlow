import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const Inter = localFont({
    src : "./fonts/interVF.ttf",
    variable : "--font-inter",
    weight: "100 200 300 400 500 600 700 800 900"
})

const SpaceGrotesk  = localFont({
    src : "./fonts/SpaceGroteskVF.ttf",
    variable : "--font-space-grotesk",
    weight: "100 200 300 400 500 600 700"
})


export const metadata: Metadata = {
  title: "DevFlow",
  description: "hello",
    icons:{
      icon: "../public/images/site-logo.svg",
    }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${Inter.className} ${SpaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
