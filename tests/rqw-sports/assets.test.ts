import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { rqwSportsProducts } from "../../content/rqw-sports";

const publicRoot = join(process.cwd(), "public");

function readPngDimensions(path: string) {
  const bytes = readFileSync(path);
  expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

describe("RQW sports normalized assets", () => {
  it("generates one uniform 1200 by 900 PNG for every product", () => {
    for (const product of rqwSportsProducts) {
      const dimensions = readPngDimensions(
        join(publicRoot, product.image.replace(/^\//, "")),
      );
      expect(dimensions).toEqual({ width: 1200, height: 900 });
    }
  });

  it("records subject placement and fixed RQW placement for every asset", () => {
    const audit = JSON.parse(
      readFileSync(join(publicRoot, "rqw-sports", "asset-audit.json"), "utf8"),
    ) as Array<{
      source: string;
      output: string;
      detectedBounds: number[];
      placedBounds: number[];
      brandBox: number[];
      canvas: number[];
    }>;

    expect(audit).toHaveLength(rqwSportsProducts.length);
    expect(new Set(audit.map((item) => item.source)).size).toBe(audit.length);
    for (const item of audit) {
      expect(item.canvas).toEqual([1200, 900]);
      expect(item.detectedBounds).toHaveLength(4);
      expect(item.placedBounds).toHaveLength(4);
      expect(item.brandBox).toEqual([48, 34, 226, 107]);
      expect(item.placedBounds[0]).toBeGreaterThanOrEqual(48);
      expect(item.placedBounds[1]).toBeGreaterThanOrEqual(128);
      expect(item.placedBounds[2]).toBeLessThanOrEqual(1152);
      expect(item.placedBounds[3]).toBeLessThanOrEqual(852);
    }
  });
});
