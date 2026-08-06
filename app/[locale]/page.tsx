import { notFound } from "next/navigation";
import { HomePage } from "@/components/home/home-page";
import { isSupportedLocale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo/metadata";
export function generateMetadata(){return buildMetadata({title:"Premium Balloons & Custom Production",description:"Distinctive foil balloons and OEM/ODM production support for global party brands and distributors.",path:"/en",image:"/media/products/agate-star-foil-balloon.png"})}
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isSupportedLocale(locale))notFound();return <HomePage locale={locale}/>}
