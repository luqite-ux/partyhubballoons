import { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "hq_admin_session";
const TENANT_COOKIE = "hq_tenant_id";
const ADMIN_EMAIL = "info@partyhubballoons.com";
const LOGIN_PATH = "/admin/login";
const UPSTREAM_REQUEST_HEADERS = new Set([
  "accept",
  "accept-language",
  "content-type",
  "next-action",
  "next-router-prefetch",
  "next-router-segment-prefetch",
  "next-router-state-tree",
  "next-url",
  "rsc",
  "user-agent",
]);
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);
const BODYLESS_STATUSES = new Set([101, 204, 205, 304]);

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

type AdminProxyDependencies = {
  adminUrl: string | undefined;
  tenantId: string | undefined;
  fetchImpl: typeof fetch;
};

function normalizeAdminOrigin(value: string | undefined): URL | null {
  const candidate = value?.trim().replace(/[\r\n]/g, "").replace(/\/$/, "");
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" && url.hostname !== "localhost") return null;
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

function isSafePath(path: string[] | undefined): path is string[] {
  return (path ?? []).every(
    (segment) =>
      segment !== "." &&
      segment !== ".." &&
      !segment.includes("/") &&
      !segment.includes("\\"),
  );
}

function customerAdminPath(path: string[] | undefined) {
  if (!path?.length) return "/admin";
  return `/admin/${path.map(encodeURIComponent).join("/")}`;
}

function withTenantCookie(cookieHeader: string | null, tenantId: string) {
  const cookies: string[] = [];
  for (const part of (cookieHeader ?? "").split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (
      name === ADMIN_SESSION_COOKIE &&
      value &&
      !/[\u0000-\u0020\u007f;,]/.test(value)
    ) {
      cookies.push(`${ADMIN_SESSION_COOKIE}=${value}`);
      break;
    }
  }
  cookies.push(`${TENANT_COOKIE}=${encodeURIComponent(tenantId)}`);
  return cookies.join("; ");
}

function upstreamHeaders(
  request: NextRequest,
  adminOrigin: URL,
  tenantId: string,
) {
  const headers = new Headers();
  for (const [name, value] of request.headers) {
    if (UPSTREAM_REQUEST_HEADERS.has(name.toLowerCase())) {
      headers.set(name, value);
    }
  }
  headers.set("cookie", withTenantCookie(request.headers.get("cookie"), tenantId));
  headers.set("origin", adminOrigin.origin);
  return headers;
}

function getSetCookies(headers: Headers): string[] {
  const getSetCookie = (
    headers as Headers & { getSetCookie?: () => string[] }
  ).getSetCookie;
  const values =
    typeof getSetCookie === "function"
      ? getSetCookie.call(headers)
      : [headers.get("set-cookie")].filter((value): value is string => Boolean(value));
  return values.flatMap(splitCombinedSetCookie);
}

function splitCombinedSetCookie(value: string): string[] {
  const cookies: string[] = [];
  let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] !== ",") continue;
    const remainder = value.slice(index + 1).trimStart();
    if (!/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+=/.test(remainder)) continue;
    const cookie = value.slice(start, index).trim();
    if (cookie) cookies.push(cookie);
    start = index + 1;
  }
  const tail = value.slice(start).trim();
  if (tail) cookies.push(tail);
  return cookies;
}

function isLocalHttp(url: URL) {
  return (
    url.protocol === "http:" &&
    ["localhost", "127.0.0.1", "[::1]", "::1"].includes(url.hostname)
  );
}

function customerCookie(cookie: string, customerUrl: URL): string | null {
  const [pair, ...rawAttributes] = cookie.split(";");
  const cookiePair = pair?.trim();
  if (!cookiePair || cookiePair.indexOf("=") <= 0) return null;

  let sameSiteNone = false;
  const attributes: string[] = [];
  for (const rawAttribute of rawAttributes) {
    const attribute = rawAttribute.trim();
    if (!attribute) continue;
    const separator = attribute.indexOf("=");
    const name = (separator === -1 ? attribute : attribute.slice(0, separator))
      .trim()
      .toLowerCase();
    if (name === "domain" || name === "path" || name === "secure") continue;
    if (
      name === "samesite" &&
      attribute.slice(separator + 1).trim().toLowerCase() === "none"
    ) {
      sameSiteNone = true;
    }
    attributes.push(attribute);
  }

  const secure = !isLocalHttp(customerUrl) || sameSiteNone;
  return [
    cookiePair,
    "Path=/admin",
    ...attributes,
    ...(secure ? ["Secure"] : []),
  ].join("; ");
}

function rewriteLocation(
  location: string,
  adminOrigin: URL,
  customerOrigin: string,
  tenantId: string,
) {
  let upstream: URL;
  try {
    upstream = new URL(location, adminOrigin);
  } catch {
    return new URL(LOGIN_PATH, customerOrigin).href;
  }

  if (upstream.origin !== adminOrigin.origin) {
    return new URL(LOGIN_PATH, customerOrigin).href;
  }

  const tenantBase = `/${tenantId}`;
  let pathname: string;
  if (upstream.pathname === "/login" || upstream.pathname === "/api/auth/login") {
    pathname = LOGIN_PATH;
  } else if (
    upstream.pathname === tenantBase ||
    upstream.pathname.startsWith(`${tenantBase}/`)
  ) {
    pathname = `/admin${upstream.pathname.slice(tenantBase.length)}`;
  } else if (
    upstream.pathname === "/admin" ||
    upstream.pathname.startsWith("/admin/")
  ) {
    pathname = upstream.pathname;
  } else {
    pathname = "/admin";
  }

  const target = new URL(pathname, customerOrigin);
  target.search = upstream.search;
  target.hash = upstream.hash;
  return target.href;
}

function loginPage(request: NextRequest) {
  const hasMessage =
    request.nextUrl.searchParams.has("error") ||
    request.nextUrl.searchParams.has("reason");
  const message = hasMessage
    ? '<p role="alert" class="notice">Invalid email or password. Please try again.</p>'
    : "";

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>PARTY HUB website administration</title>
  <style>
    :root { color-scheme: light; font-family: Arial, sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #f1f5f9; color: #0f172a; }
    main { width: min(100%, 420px); padding: 32px; border: 1px solid #cbd5e1; border-radius: 16px; background: #fff; box-shadow: 0 18px 50px rgb(15 23 42 / 12%); }
    h1 { margin: 0; font-size: 26px; }
    p { color: #475569; line-height: 1.5; }
    label { display: block; margin-top: 18px; font-size: 14px; font-weight: 700; }
    input { width: 100%; margin-top: 7px; padding: 12px; border: 1px solid #64748b; border-radius: 8px; color: #0f172a; background: #fff; }
    input:focus { outline: 3px solid #bfdbfe; border-color: #1d4ed8; }
    button { width: 100%; margin-top: 22px; padding: 12px; border: 0; border-radius: 8px; background: #1e3a8a; color: #fff; font-weight: 700; cursor: pointer; }
    button:hover, button:focus-visible { background: #172554; }
    .notice { padding: 10px 12px; border: 1px solid #fca5a5; border-radius: 8px; background: #fef2f2; color: #991b1b; }
  </style>
</head>
<body>
  <main>
    <h1>Website administration</h1>
    <p>Sign in to manage PARTY HUB website content.</p>
    ${message}
    <form action="/admin/login" method="post">
      <label>Email<input name="email" type="email" autocomplete="username" required></label>
      <label>Password<input name="password" type="password" autocomplete="current-password" required></label>
      <button type="submit">Sign in</button>
    </form>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/html; charset=utf-8",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
    },
  });
}

function loginFailure(request: NextRequest) {
  const target = new URL(LOGIN_PATH, request.url);
  target.searchParams.set("error", "Invalid email or password");
  return Response.redirect(target, 303);
}

async function copyUpstreamResponse(
  upstream: Response,
  request: NextRequest,
  adminOrigin: URL,
  tenantId: string,
  setTenantCookie: boolean,
) {
  const headers = new Headers();
  for (const [name, value] of upstream.headers) {
    const lower = name.toLowerCase();
    if (
      lower !== "set-cookie" &&
      lower !== "content-length" &&
      lower !== "content-encoding" &&
      !HOP_BY_HOP_HEADERS.has(lower)
    ) {
      headers.set(name, value);
    }
  }

  const location = upstream.headers.get("location");
  if (location) {
    headers.set(
      "location",
      rewriteLocation(location, adminOrigin, request.nextUrl.origin, tenantId),
    );
  }

  const actionRedirect = upstream.headers.get("x-action-redirect");
  if (actionRedirect) {
    const separator = actionRedirect.lastIndexOf(";");
    const redirectType = separator === -1 ? "" : actionRedirect.slice(separator + 1);
    const redirectTarget =
      separator === -1 ? actionRedirect : actionRedirect.slice(0, separator);
    const rewritten = rewriteLocation(
      redirectTarget,
      adminOrigin,
      request.nextUrl.origin,
      tenantId,
    );
    headers.set(
      "x-action-redirect",
      redirectType ? `${rewritten};${redirectType}` : rewritten,
    );
    // The response body belongs to the shared admin application's router
    // tree. Returning it to the customer app causes a cross-build soft
    // navigation that can hang. An empty non-RSC body makes Next perform a
    // full document navigation to the rewritten same-origin URL instead.
    headers.set("content-type", "text/plain; charset=utf-8");
  }

  const cookies = getSetCookies(upstream.headers)
    .map((cookie) => customerCookie(cookie, request.nextUrl))
    .filter((cookie): cookie is string => cookie !== null);
  for (const cookie of cookies) headers.append("set-cookie", cookie);
  if (
    setTenantCookie &&
    cookies.some((cookie) => cookie.startsWith(`${ADMIN_SESSION_COOKIE}=`))
  ) {
    const secure = isLocalHttp(request.nextUrl) ? "" : "; Secure";
    headers.append(
      "set-cookie",
      `${TENANT_COOKIE}=${encodeURIComponent(tenantId)}; Path=/admin; Max-Age=604800; HttpOnly${secure}; SameSite=Lax`,
    );
  }

  return new Response(
    BODYLESS_STATUSES.has(upstream.status) || actionRedirect
      ? null
      : upstream.body,
    { status: upstream.status, statusText: upstream.statusText, headers },
  );
}

export function createAdminProxyHandler({
  adminUrl,
  tenantId,
  fetchImpl,
}: AdminProxyDependencies) {
  return async function handleAdminProxy(
    request: NextRequest,
    context: RouteContext,
  ) {
    const adminOrigin = normalizeAdminOrigin(adminUrl);
    const normalizedTenantId = tenantId?.trim();
    if (!adminOrigin || !normalizedTenantId) {
      return new Response("Administration is temporarily unavailable.", {
        status: 503,
        headers: { "cache-control": "no-store" },
      });
    }

    const { path } = await context.params;
    if (!isSafePath(path)) return new Response("Not found.", { status: 404 });

    const pathname = customerAdminPath(path);
    if (pathname === LOGIN_PATH && request.method === "GET") {
      return loginPage(request);
    }

    let targetPath = pathname;
    let isLoginSubmission = false;
    if (pathname === LOGIN_PATH && request.method === "POST") {
      const form = await request.clone().formData().catch(() => null);
      const email = String(form?.get("email") ?? "").trim().toLowerCase();
      if (email !== ADMIN_EMAIL) return loginFailure(request);
      targetPath = "/api/auth/login";
      isLoginSubmission = true;
    }

    const target = new URL(targetPath, adminOrigin);
    target.search = request.nextUrl.search;
    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const upstreamInit: RequestInit & { duplex?: "half" } = {
      method: request.method,
      headers: upstreamHeaders(request, adminOrigin, normalizedTenantId),
      redirect: "manual",
    };
    if (hasBody && request.body) {
      upstreamInit.body = request.body;
      upstreamInit.duplex = "half";
    }

    let upstream: Response;
    try {
      upstream = await fetchImpl(target, upstreamInit);
    } catch {
      return new Response("Administration is temporarily unavailable.", {
        status: 502,
        headers: { "cache-control": "no-store" },
      });
    }

    return copyUpstreamResponse(
      upstream,
      request,
      adminOrigin,
      normalizedTenantId,
      isLoginSubmission,
    );
  };
}

function productionHandler(request: NextRequest, context: RouteContext) {
  return createAdminProxyHandler({
    adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL,
    tenantId: process.env.NEXT_PUBLIC_TENANT_ID,
    fetchImpl: fetch,
  })(request, context);
}

export const dynamic = "force-dynamic";

export const GET = productionHandler;
export const POST = productionHandler;
export const PUT = productionHandler;
export const PATCH = productionHandler;
export const DELETE = productionHandler;
export const OPTIONS = productionHandler;
export const HEAD = productionHandler;
