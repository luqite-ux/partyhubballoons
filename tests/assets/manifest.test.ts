import { describe, expect, it } from "vitest";
import manifest from "../../docs/asset-manifest.json";

describe("public asset manifest", () => {
  it("keeps private identity documents out of public assets", () => {
    expect(manifest.filter((item) => item.kind === "license").every((item) => !item.public)).toBe(true);
  });

  it("publishes only reviewed assets", () => {
    expect(manifest.filter((item) => item.public).every((item) => item.reviewStatus === "approved")).toBe(true);
  });

  it("maps every public product image to a stable product slug", () => {
    const productImages = manifest.filter((item) => item.public && item.kind === "product");
    expect(productImages.length).toBe(5);
    expect(productImages.every((item) => Boolean(item.productSlug))).toBe(true);
  });
});
