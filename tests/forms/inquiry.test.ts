import { describe, expect, it } from "vitest";
import { buildInquiryRecord, validateInquiry } from "../../lib/supabase/inquiries";

describe("inquiry validation", () => {
  it("requires name, valid email, company, country, and message", () => {
    expect(validateInquiry({name:"",email:"bad",company:"",country:"",message:""})).toEqual(expect.objectContaining({name:expect.any(String),email:expect.any(String),company:expect.any(String),country:expect.any(String),message:expect.any(String)}));
  });

  it("accepts a complete B2B enquiry", () => {
    expect(validateInquiry({name:"Alex",email:"alex@example.com",company:"Party Co",country:"Spain",message:"Need 10,000 custom balloons"})).toEqual({});
  });

  it("stores the interested product as the enquiry subject", () => {
    const record = buildInquiryRecord("tenant-1", {
      name: "Alex",
      email: "alex@example.com",
      phone: "+34 600 000 000",
      company: "Party Co",
      country: "Spain",
      product: "Agate Star Foil Balloon",
      quantity: "10,000 pieces",
      customization: "Retail pack",
      message: "Please quote.",
    });

    expect(record.subject).toBe("Agate Star Foil Balloon");
    expect(record.tenant_id).toBe("tenant-1");
  });
});
