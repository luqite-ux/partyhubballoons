import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const productImages = [
  "agate-star-foil-balloon.png",
  "happy-anniversary-letter-balloons.png",
  "birthday-girl-foil-balloon.png",
  "feliz-dia-round-foil-balloon.png",
  "gold-number-foil-balloons.png",
];

function pngColorType(path: string) {
  return readFileSync(path)[25];
}

describe("brand image assets", () => {
  it("uses the PARTY HUB app icon instead of a legacy favicon", () => {
    expect(existsSync(join(root, "app", "favicon.ico"))).toBe(false);
    expect(existsSync(join(root, "app", "icon.png"))).toBe(true);
  });

  it.each(productImages)("stores %s with an alpha channel", (filename) => {
    const path = join(root, "public", "media", "products", filename);
    expect(pngColorType(path)).toBe(6);
  });
});
