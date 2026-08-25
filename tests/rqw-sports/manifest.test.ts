import { describe, expect, it } from "vitest";

import {
  RQW_SPORTS_PRODUCT_COUNT,
  rqwSportsProducts,
} from "../../content/rqw-sports";

describe("RQW sports product manifest", () => {
  it("tracks every supplied product with unique stable paths", () => {
    expect(RQW_SPORTS_PRODUCT_COUNT).toBe(53);
    expect(rqwSportsProducts).toHaveLength(RQW_SPORTS_PRODUCT_COUNT);

    const slugs = rqwSportsProducts.map((product) => product.slug);
    const imagePaths = rqwSportsProducts.map((product) => product.image);
    expect(new Set(slugs).size).toBe(RQW_SPORTS_PRODUCT_COUNT);
    expect(new Set(imagePaths).size).toBe(RQW_SPORTS_PRODUCT_COUNT);
  });

  it("retains source-name traceability and usable English labels", () => {
    for (const product of rqwSportsProducts) {
      expect(product.sourceFile).toMatch(/\.(?:png|jpg)$/i);
      expect(product.sourceFile).toMatch(/[\u3400-\u9fff]/);
      expect(product.name.trim().length).toBeGreaterThan(0);
      expect(product.image).toBe(`/rqw-sports/products/${product.slug}.png`);
    }
  });
});
