import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { isSupportedLocale } from "@/lib/i18n/config";
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!isSupportedLocale(locale))notFound();return <><SiteHeader locale={locale}/>{children}<SiteFooter locale={locale}/></>}
