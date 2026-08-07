import { describe, expect, it } from "vitest";
import { formatMetric, parseMetric } from "../../lib/motion/metric";

describe("animated metric formatting", () => {
  it.each([
    ["40,000 m²", { target: 40000, prefix: "", suffix: " m²", grouped: true }],
    ["10", { target: 10, prefix: "", suffix: "", grouped: false }],
    ["80", { target: 80, prefix: "", suffix: "", grouped: false }],
    ["5 million", { target: 5, prefix: "", suffix: " million", grouped: false }],
  ])("parses %s without losing its unit", (value, expected) => {
    expect(parseMetric(value)).toEqual(expected);
  });

  it("keeps thousands separators while counting", () => {
    expect(formatMetric(parseMetric("40,000 m²"), 12345)).toBe("12,345 m²");
  });
});
