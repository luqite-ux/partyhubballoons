import { notFound } from "next/navigation";
import { HomePage } from "@/components/home/home-page";
import { isSupportedLocale } from "@/lib/i18n/config";
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isSupportedLocale(locale))notFound();return <HomePage locale={locale}/>}
