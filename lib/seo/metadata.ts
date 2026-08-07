import type { Metadata } from "next";
export const siteUrl="https://partyhubballoons.com";
type Input={title:string;description:string;path:string;image?:string;type?:"website"|"article"};
export function buildMetadata({title,description,path,image="/brand/logo.png",type="website"}:Input):Metadata{const url=`${siteUrl}${path}`,imageUrl=image.startsWith("http")?image:`${siteUrl}${image}`;return {title,description,alternates:{canonical:url,languages:{en:url,"x-default":url}},openGraph:{title,description,type,url,siteName:"PARTY HUB",images:[{url:imageUrl,alt:title}]},twitter:{card:"summary_large_image",title,description,images:[imageUrl]}}}

const staticPageSeo:Record<string,{title:string;description:string;image?:string}>={
  "custom-solutions":{title:"Custom Balloon Solutions",description:"Develop custom foil balloon collections with artwork, color, language, assortment, and retail packaging options."},
  manufacturing:{title:"Balloon Manufacturing Network",description:"Explore PARTY HUB manufacturing partner resources for printing, material processing, finishing, and scalable balloon production."},
  "quality-compliance":{title:"Quality & Compliance",description:"Review PARTY HUB order-specific material checks, in-process review, final inspection, and third-party inspection coordination."},
  about:{title:"About PARTY HUB",description:"Learn about PARTY HUB, the export-facing balloon brand of Yiwu Xitong Trading Co., Ltd. in Yiwu, Zhejiang."},
  faq:{title:"Balloon Sourcing FAQ",description:"Answers about custom balloons, samples, MOQ, lead times, inspections, quotations, and international shipping preparation."},
  contact:{title:"Request a Balloon Quote",description:"Contact PARTY HUB with your balloon product, quantity, target market, artwork, packaging, and delivery requirements."},
  privacy:{title:"Privacy",description:"Learn how PARTY HUB uses information submitted through product and sourcing enquiry forms."},
  products:{title:"Foil Balloon Products",description:"Explore PARTY HUB foil balloon designs for birthdays, anniversaries, retail collections, events, and custom programs.",image:"/media/products/agate-star-foil-balloon.png"},
  news:{title:"Balloon News & Insights",description:"Read PARTY HUB perspectives on balloon products, customization, retail programs, and celebration sourcing."},
};

export function buildStaticPageMetadata(slug:string):Metadata{const page=staticPageSeo[slug];if(!page)throw new Error(`Unknown static page: ${slug}`);return buildMetadata({...page,path:`/en/${slug}`})}
