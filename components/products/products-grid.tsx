import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductFallback } from "@/content/products";
export function ProductsGrid({locale,products}:{locale:string;products:ProductFallback[]}){return <div className="listing-grid">{products.map(p=><Link key={p.slug} href={`/${locale}/products/${p.slug}`} aria-label={p.name} className="listing-card"><div><Image src={p.image} alt={p.name} fill sizes="(max-width:700px) 90vw, 30vw"/></div><span>{p.category}</span><h2>{p.name}</h2><p>{p.description}</p><b>View details <ArrowUpRight size={16}/></b></Link>)}</div>}
