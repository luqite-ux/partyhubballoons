import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/product-detail";
import { products } from "@/content/products";
export const revalidate=60;export const dynamicParams=true;
export default async function ProductPage({params}:{params:Promise<{locale:string;slug:string}>}){const {locale,slug}=await params;const product=products.find(x=>x.slug===slug);if(!product)notFound();return <ProductDetail locale={locale} product={product}/>}
