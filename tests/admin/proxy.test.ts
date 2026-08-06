import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

const tenantId = "295f41a3-926d-4697-98fd-4b0d3ff7728b";

describe("PARTY HUB same-origin administration", () => {
  it("renders the branded login page without contacting the upstream admin", async () => {
    const { createAdminProxyHandler } = await import(
      "../../app/admin/[[...path]]/route"
    );
    const fetchImpl = vi.fn<typeof fetch>();
    const handler = createAdminProxyHandler({
      adminUrl: "https://admin.globle-trade.com",
      tenantId,
      fetchImpl,
    });

    const response = await handler(
      new NextRequest("https://partyhubballoons.com/admin/login"),
      { params: Promise.resolve({ path: ["login"] }) },
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("PARTY HUB website administration");
    expect(html).toContain('action="/admin/login"');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects another tenant email before contacting the upstream admin", async () => {
    const { createAdminProxyHandler } = await import(
      "../../app/admin/[[...path]]/route"
    );
    const fetchImpl = vi.fn<typeof fetch>();
    const handler = createAdminProxyHandler({
      adminUrl: "https://admin.globle-trade.com",
      tenantId,
      fetchImpl,
    });
    const form = new FormData();
    form.set("email", "admin@another-tenant.example");
    form.set("password", "not-used");

    const response = await handler(
      new NextRequest("https://partyhubballoons.com/admin/login", {
        method: "POST",
        body: form,
      }),
      { params: Promise.resolve({ path: ["login"] }) },
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/admin/login?error=");
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
