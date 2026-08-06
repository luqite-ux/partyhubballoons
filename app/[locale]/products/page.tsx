import { ProductsGrid } from "@/components/products/products-grid";
import { products } from "@/content/products";
export const revalidate=60;
export default async function ProductsPage({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <main><section className="page-hero dark"><div className="container"><span className="eyebrow">Product collection</span><h1>Foil balloons designed to stand out.</h1><p>Explore supplied designs and use them as a starting point for custom colors, artwork, language variants, assortments, and retail packaging.</p></div></section><section className="section light"><div className="container"><ProductsGrid locale={locale} products={products}/></div></section></main>}
