"use client"

import { useState, type FormEvent } from "react"
import { Send } from "lucide-react"
import { InquiryCaptchaField } from "@/components/inquiry-captcha-field"
import { submitInquiry, validateInquiry, type InquiryInput } from "@/lib/supabase/inquiries"

const empty: InquiryInput = { name: "", email: "", phone: "", company: "", country: "", product: "", quantity: "", customization: "", message: "" }

export function InquiryForm() {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [error, setError] = useState("")
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0)
  const change = (name: keyof InquiryInput, value: string) => setForm((current) => ({ ...current, [name]: value }))

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = validateInquiry(form)
    setErrors(next)
    if (Object.keys(next).length) return
    const submitted = new window.FormData(event.currentTarget)
    setStatus("sending")
    setError("")
    try {
      await submitInquiry(form, {
        captchaToken: String(submitted.get("captchaToken") || ""),
        captchaAnswer: String(submitted.get("captchaAnswer") || ""),
        captchaScope: String(submitted.get("captchaScope") || ""),
      })
      setForm(empty)
      setStatus("success")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to submit your enquiry.")
      setStatus("error")
    } finally {
      setCaptchaRefreshKey((value) => value + 1)
    }
  }

  return (
    <form className="inquiry-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        {[["name", "Name *"], ["email", "Email *"], ["phone", "Phone / WhatsApp"], ["company", "Company *"], ["country", "Country / Region *"], ["product", "Interested Product"], ["quantity", "Estimated Quantity"], ["customization", "Customization Requirements"]].map(([name, label]) => (
          <label key={name}>{label}<input name={name} value={form[name as keyof InquiryInput] ?? ""} onChange={(event) => change(name as keyof InquiryInput, event.target.value)} aria-invalid={Boolean(errors[name])} />{errors[name] && <small>{errors[name]}</small>}</label>
        ))}
      </div>
      <label>Message *<textarea name="message" rows={6} value={form.message} onChange={(event) => change("message", event.target.value)} aria-invalid={Boolean(errors.message)} />{errors.message && <small>{errors.message}</small>}</label>
      <InquiryCaptchaField refreshKey={captchaRefreshKey} />
      <button className="button" disabled={status === "sending"} type="submit">{status === "sending" ? "Submitting…" : "Submit Enquiry"}<Send size={17} /></button>
      {status === "success" && <p className="form-success" role="status">Thank you. Your enquiry has been submitted successfully.</p>}
      {status === "error" && <p className="form-error" role="alert">{error}</p>}
    </form>
  )
}
