import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("bright hero theme CSS", () => {
  it("overrides the base metrics background with a more specific light selector", () => {
    const css = readFileSync("app/hero-light.css", "utf8");
    expect(css).toContain(".metrics.metrics-light{");
  });
});
