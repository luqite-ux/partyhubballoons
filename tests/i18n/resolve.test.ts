import { describe, expect, it } from "vitest";
import { resolveLocalized } from "../../lib/i18n/resolve";

describe("resolveLocalized", () => {
  it("uses the requested language first", () => {
    expect(resolveLocalized({ en: "Balloons", es: "Globos" }, "es", "en")).toBe("Globos");
  });

  it("falls back to the tenant default language", () => {
    expect(resolveLocalized({ en: "Balloons", es: "" }, "es", "en")).toBe("Balloons");
  });

  it("uses the first non-empty language as the final fallback", () => {
    expect(resolveLocalized({ de: "Ballons" }, "es", "en")).toBe("Ballons");
  });

  it("returns null when no usable translation exists", () => {
    expect(resolveLocalized({}, "en", "en")).toBeNull();
    expect(resolveLocalized(null, "en", "en")).toBeNull();
  });
});
