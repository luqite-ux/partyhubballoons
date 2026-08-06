import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/product-detail";
import { getProductBySlug } from "@/lib/supabase/products";
import { buildMetadata } from "@/lib/seo/metadata";
export const revalidate=60;export const dynamicParams=true;
export async function generateMetadata({params}:{params:Promise<{locale:string;slug:string}>}){const {locale,slug}=await params;const product=await getProductBySlug(slug,locale);return product?buildMetadata({title:product.name,description:product.description,path:`/${locale}/products/${slug}`,image:product.image}):{title:"Product Not Found"}}
export default async function ProductPage({params}:{params:Promise<{locale:string;slug:string}>}){const {locale,slug}=await params;const product=await getProductBySlug(slug,locale);if(!product)notFound();return <ProductDetail locale={locale} product={product}/>}
