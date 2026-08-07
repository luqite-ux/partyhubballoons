import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("theme contrast", () => {
  it("uses the high-contrast accent for footer eyebrow text", () => {
    const css = readFileSync("app/globals.css", "utf8");
    expect(css).toContain(".site-footer .eyebrow{color:var(--gold)}");
  });
});
