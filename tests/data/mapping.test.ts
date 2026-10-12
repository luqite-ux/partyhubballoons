import { describe, expect, it } from "vitest";
import { mapArticleRow } from "../../lib/supabase/articles";
import { mapProductRow } from "../../lib/supabase/products";

describe("Supabase multilingual row mapping", () => {
  it("maps product JSONB using requested then default language", () => {
    const product = mapProductRow({ slug:"star", name_i18n:{en:"Star",es:"Estrella"}, description_i18n:{en:"English"}, image_url:"https://example.com/star.png", extra_data:{category:"Foil"} },"es","en");
    expect(product.name).toBe("Estrella");
    expect(product.description).toBe("English");
  });

  it("maps every populated backend detail field without product-specific defaults", () => {
    const product = mapProductRow({
      slug: "gjpqmnyj", name_i18n: { en: "Balloon set" },
      overview_i18n: { en: "<p>Product overview</p>" },
      features_i18n: { en: ["Five pieces"] },
      applications_i18n: { en: ["Birthday parties"] },
      advantages_i18n: { en: ["Custom artwork"] },
      model: "GJPQ+MNYJ", specs: { Material: "Foil" },
      extra_data: { gallery: ["https://example.com/second.png"] },
    }, "en");
    expect(product.overview).toBe("<p>Product overview</p>");
    expect(product.features).toEqual(["Five pieces"]);
    expect(product.applications).toEqual(["Birthday parties"]);
    expect(product.advantages).toEqual(["Custom artwork"]);
    expect(product.model).toBe("GJPQ+MNYJ");
    expect(product.specs).toEqual({ Material: "Foil" });
    expect(product.gallery).toEqual(["https://example.com/second.png"]);
  });

  it("maps published article JSONB with the same fallback", () => {
    const article = mapArticleRow({ slug:"design", title_i18n:{en:"Design"}, excerpt_i18n:{de:"Ideen"}, content_i18n:{en:"<p>Body</p>"}, featured_image:"https://example.com/article.png", published_at:"2026-08-06" },"fr","en");
    expect(article.title).toBe("Design");
    expect(article.excerpt).toBe("Ideen");
    expect(article.content).toBe("<p>Body</p>");
    expect(article.image).toBe("https://example.com/article.png");
  });
});
