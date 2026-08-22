export type InquiryInput = {
  name: string
  email: string
  phone?: string
  company: string
  country: string
  product?: string
  quantity?: string
  customization?: string
  message: string
}

export type InquiryCaptchaValues = {
  captchaToken: string
  captchaAnswer: string
  captchaScope: string
}

export function validateInquiry(input: Pick<InquiryInput, "name" | "email" | "company" | "country" | "message">) {
  const errors: Record<string, string> = {}
  if (!input.name.trim()) errors.name = "Please enter your name."
  if (!/^\S+@\S+\.\S+$/.test(input.email)) errors.email = "Please enter a valid email."
  if (!input.company.trim()) errors.company = "Please enter your company."
  if (!input.country.trim()) errors.country = "Please enter your country or region."
  if (!input.message.trim()) errors.message = "Please describe your request."
  return errors
}

export function buildInquiryRecord(tenant: string, input: InquiryInput) {
  const details = [
    `Country / Region: ${input.country}`,
    input.product && `Interested Product: ${input.product}`,
    input.quantity && `Estimated Quantity: ${input.quantity}`,
    input.customization && `Customization: ${input.customization}`,
    `Message: ${input.message}`,
  ].filter(Boolean).join("\n")
  return {
    tenant_id: tenant,
    name: input.name,
    email: input.email,
    phone: input.phone ?? "",
    company: input.company,
    subject: input.product?.trim() || "General enquiry",
    message: details,
    status: "unread",
  }
}

export async function submitInquiry(input: InquiryInput, captcha: InquiryCaptchaValues) {
  const response = await fetch("/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, ...captcha }),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || "We could not submit your enquiry. Please try again or email us directly.")
}
