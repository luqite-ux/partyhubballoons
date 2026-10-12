import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import type { ProductDetailData } from "@/lib/supabase/products";

export function ProductDetail({ locale, product }: { locale: string; product: ProductDetailData }) {
  const safeOverview = product.overview ? sanitizeHtml(product.overview, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, img: ["src", "alt", "width", "height"] },
    allowedSchemes: ["https"],
  }) : "";
  const gallery = [product.image, ...(product.gallery ?? [])].filter((url, index, all) => url && all.indexOf(url) === index);
  const specs = Object.entries(product.specs ?? {}).filter(([key, value]) => key.trim() && value?.trim());
  const lists = [
    { title: "Features", items: product.features ?? [] },
    { title: "Applications", items: product.applications ?? [] },
    { title: "Advantages", items: product.advantages ?? [] },
    { title: "Customization", items: product.customization ?? [] },
  ].filter(group => group.items.length > 0);

  return <main>
    <section className="detail-hero gradient"><div className="container detail-grid">
      <div className="detail-image"><Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width:800px) 92vw, 48vw" priority /></div>
      <div className="detail-summary">
        <span className="eyebrow">{product.category}</span>
        <h1>{product.name}</h1>
        {product.description && <p>{product.description}</p>}
        {product.model && <p className="detail-model">Model: {product.model}</p>}
        <Link className="button" href={`/${locale}/contact?product=${product.slug}`}>Request a Quote <ArrowRight size={17} /></Link>
      </div>
    </div></section>
    {gallery.length > 1 && <section className="section light"><div className="container"><h2>Product Gallery</h2><div className="detail-gallery">{gallery.map((url, index) => <div className="detail-gallery-image" key={url}><Image src={url} alt={`${product.name} view ${index + 1}`} fill unoptimized sizes="(max-width:640px) 90vw, 30vw" /></div>)}</div></div></section>}
    {safeOverview && <section className="section light"><div className="container detail-content"><h2>Product Overview</h2><div className="detail-overview" dangerouslySetInnerHTML={{ __html: safeOverview }} /></div></section>}
    {specs.length > 0 && <section className="section light"><div className="container detail-content"><h2>Specifications</h2><dl className="detail-specs">{specs.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></div></section>}
    {lists.length > 0 && <section className="section light"><div className="container detail-columns">{lists.map(group => <article key={group.title}><span className="eyebrow">{group.title}</span><ul>{group.items.map((item, index) => <li key={`${index}-${item}`}><CheckCircle2 aria-hidden="true" />{item}</li>)}</ul></article>)}</div></section>}
    {product.videoUrl && <section className="section light"><div className="container detail-content"><h2>Product Video</h2><video controls preload="metadata" src={product.videoUrl} /></div></section>}
  </main>;
}
