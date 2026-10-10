import { NextRequest } from "next/server";
import { createAdminProxyHandler } from "../../../admin/[[...path]]/route";

function handler(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return createAdminProxyHandler({
    adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL,
    tenantId: process.env.NEXT_PUBLIC_TENANT_ID,
    fetchImpl: fetch,
    pathPrefix: "/api/admin",
  })(request, context);
}

export const dynamic = "force-dynamic";
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
export const HEAD = handler;
