import { describe, expect, it } from "vitest";
import { buildMetadata, siteUrl } from "../../lib/seo/metadata";

describe("technical SEO metadata", () => {
  it("builds formal-domain canonical and social metadata", () => {
    const metadata=buildMetadata({title:"Products",description:"Explore PARTY HUB foil balloons.",path:"/en/products",image:"/media/products/agate-star-foil-balloon.png"});
    expect(metadata.alternates?.canonical).toBe(`${siteUrl}/en/products`);
    expect(metadata.openGraph?.url).toBe(`${siteUrl}/en/products`);
    expect(metadata.openGraph?.images).toEqual(expect.arrayContaining([expect.objectContaining({url:expect.stringMatching(/^https:\/\//)})]));
  });

  it("keeps English locale routes extensible with x-default", () => {
    const metadata=buildMetadata({title:"About",description:"About PARTY HUB.",path:"/en/about"});
    expect(metadata.alternates?.languages).toEqual({en:`${siteUrl}/en/about`,"x-default":`${siteUrl}/en/about`});
  });
});
