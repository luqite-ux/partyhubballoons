import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
const sans=Manrope({variable:"--font-sans",subsets:["latin"]});
const display=Playfair_Display({variable:"--font-display",subsets:["latin"]});
export const metadata:Metadata={title:{default:"PARTY HUB | Premium Balloons",template:"%s | PARTY HUB"},description:"Premium foil balloons and OEM/ODM production support for global party buyers.",metadataBase:new URL("https://partyhubballoons.com")};
export default function RootLayout({children}:LayoutProps<"/">){return <html lang="en" className={`${sans.variable} ${display.variable}`}><body><OrganizationJsonLd/>{children}</body></html>}
