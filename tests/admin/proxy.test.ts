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

  it("forwards image uploads to the matching shared admin API with the tenant session", async () => {
    const { createAdminProxyHandler } = await import(
      "../../app/admin/[[...path]]/route"
    );
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ url: "https://example.r2.dev/image.jpg" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const handler = createAdminProxyHandler({
      adminUrl: "https://admin.globle-trade.com",
      tenantId,
      fetchImpl,
      pathPrefix: "/api/admin",
    });
    const form = new FormData();
    form.set("file", new File(["image"], "image.jpg", { type: "image/jpeg" }));
    form.set("purpose", "product-cover");
    form.set("tenantId", tenantId);

    const response = await handler(
      new NextRequest("https://partyhubballoons.com/api/admin/uploads/editor-image", {
        method: "POST",
        headers: { cookie: "hq_admin_session=test-session" },
        body: form,
      }),
      { params: Promise.resolve({ path: ["uploads", "editor-image"] }) },
    );

    expect(response.status).toBe(200);
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [target, init] = fetchImpl.mock.calls[0];
    expect(String(target)).toBe(
      "https://admin.globle-trade.com/api/admin/uploads/editor-image",
    );
    expect(new Headers(init?.headers).get("cookie")).toContain(
      "hq_admin_session=test-session",
    );
    expect(new Headers(init?.headers).get("cookie")).toContain(
      `hq_tenant_id=${tenantId}`,
    );
    expect(await response.json()).toEqual({ url: "https://example.r2.dev/image.jpg" });
  });

  it("issues a session cookie usable by both admin pages and upload requests", async () => {
    const { createAdminProxyHandler } = await import(
      "../../app/admin/[[...path]]/route"
    );
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(null, {
        status: 303,
        headers: {
          location: "/admin",
          "set-cookie": "hq_admin_session=test-session; Path=/; HttpOnly; SameSite=Lax",
        },
      }),
    );
    const handler = createAdminProxyHandler({
      adminUrl: "https://admin.globle-trade.com",
      tenantId,
      fetchImpl,
    });
    const form = new FormData();
    form.set("email", "info@partyhubballoons.com");
    form.set("password", "test-only");

    const response = await handler(
      new NextRequest("https://partyhubballoons.com/admin/login", {
        method: "POST",
        body: form,
      }),
      { params: Promise.resolve({ path: ["login"] }) },
    );
    const cookies = response.headers.getSetCookie();

    expect(response.status).toBe(303);
    expect(cookies).toContainEqual(expect.stringMatching(/^hq_admin_session=test-session; Path=\//));
    expect(cookies).toContainEqual(expect.stringMatching(/^hq_tenant_id=.+; Path=\//));
    expect(cookies).toContainEqual(expect.stringMatching(/^hq_admin_session=; Path=\/admin; Max-Age=0/));
  });
});
