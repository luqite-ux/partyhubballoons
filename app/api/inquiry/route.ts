import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { buildInquiryRecord, validateInquiry, type InquiryInput } from "@/lib/supabase/inquiries"
import {
  createSupabaseCaptchaContextFromEnv,
  verifyCaptchaSubmission,
} from "@/lib/inquiry-captcha"

type InquiryRequest = InquiryInput & {
  captchaToken?: string
  captchaAnswer?: string
  captchaScope?: string
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as InquiryRequest | null
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  const errors = validateInquiry(body)
  if (Object.keys(errors).length) return NextResponse.json({ error: Object.values(errors)[0] }, { status: 400 })

  const captchaSecret = process.env.CAPTCHA_SECRET?.trim()
  if (!captchaSecret) return NextResponse.json({ error: "Verification service is unavailable." }, { status: 503 })
  let captchaResult
  try {
    const { tenantId, siteScope, store } = createSupabaseCaptchaContextFromEnv()
    captchaResult = await verifyCaptchaSubmission({
      secret: captchaSecret,
      tenantId,
      siteScope,
      store,
      scope: String(body.captchaScope || ""),
      token: String(body.captchaToken || ""),
      answer: String(body.captchaAnswer || ""),
    })
  } catch {
    return NextResponse.json({ error: "Verification service is unavailable." }, { status: 503 })
  }
  if (!captchaResult.ok) {
    return NextResponse.json({
      error: captchaResult.code === "expired"
        ? "The verification code has expired. Please enter the new code."
        : "The verification code is incorrect. Please try again.",
      captchaCode: captchaResult.code,
    }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  if (!url || !anonKey || !tenantId) return NextResponse.json({ error: "The enquiry service is temporarily unavailable." }, { status: 503 })
  const db = createClient(url, anonKey, { auth: { persistSession: false } })
  const { error } = await db.from("inquiries").insert(buildInquiryRecord(tenantId, body))
  if (error) return NextResponse.json({ error: "We could not submit your enquiry. Please try again or email us directly." }, { status: 502 })
  return NextResponse.json({ ok: true }, { status: 201 })
}
