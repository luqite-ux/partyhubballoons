import { describe, expect, it } from "vitest";
import { company } from "../../content/company";
import { faq } from "../../content/faq";
import { products } from "../../content/products";

const prohibited = /\b(?:warrant(?:y|ies)|guarantee(?:d)?)\b|质保|保修|质量保证/iu;

describe("reviewed public content", () => {
  it("contains no prohibited service promise", () => {
    expect(JSON.stringify({ company, faq, products })).not.toMatch(prohibited);
  });

  it("defines the confirmed company identity and capacity", () => {
    expect(company.legalName).toBe("Yiwu Xitong Trading Co., Ltd.");
    expect(company.email).toBe("info@partyhubballoons.com");
    expect(company.metrics).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: "40,000 m²" }),
      expect.objectContaining({ value: "80" }),
      expect.objectContaining({ value: "5 million" }),
    ]));
  });

  it("maps all five supplied product groups", () => {
    expect(products).toHaveLength(5);
    for (const product of products) {
      expect(product.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(product.name).not.toBe("");
      expect(product.description).not.toBe("");
      expect(product.image).toMatch(/^\/media\/products\//);
      expect(product.category).not.toBe("");
    }
  });

  it("publishes only answered, usable FAQ entries", () => {
    expect(faq.length).toBeGreaterThanOrEqual(12);
    expect(faq.every((item) => item.question && item.answer)).toBe(true);
  });
});
