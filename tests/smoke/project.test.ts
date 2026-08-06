import { describe, expect, it } from "vitest";
import packageJson from "../../package.json";

describe("project baseline", () => {
  it("uses Next.js 16 or newer", () => {
    expect(Number(packageJson.dependencies.next.split(".")[0])).toBeGreaterThanOrEqual(16);
  });

  it("provides test and typecheck gates", () => {
    expect(packageJson.scripts.test).toBe("vitest run");
    expect(packageJson.scripts.typecheck).toBe("tsc --noEmit");
  });
});
