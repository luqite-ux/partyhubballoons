import type { Metadata } from "next";
export const siteUrl="https://partyhubballoons.com";
type Input={title:string;description:string;path:string;image?:string;type?:"website"|"article"};
export function buildMetadata({title,description,path,image="/brand/logo.png",type="website"}:Input):Metadata{const url=`${siteUrl}${path}`,imageUrl=image.startsWith("http")?image:`${siteUrl}${image}`;return {title,description,alternates:{canonical:url,languages:{en:url,"x-default":url}},openGraph:{title,description,type,url,siteName:"PARTY HUB",images:[{url:imageUrl,alt:title}]},twitter:{card:"summary_large_image",title,description,images:[imageUrl]}}}
