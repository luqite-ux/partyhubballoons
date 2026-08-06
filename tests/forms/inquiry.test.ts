import { describe, expect, it } from "vitest";
import { validateInquiry } from "../../lib/supabase/inquiries";

describe("inquiry validation", () => {
  it("requires name, valid email, company, country, and message", () => {
    expect(validateInquiry({name:"",email:"bad",company:"",country:"",message:""})).toEqual(expect.objectContaining({name:expect.any(String),email:expect.any(String),company:expect.any(String),country:expect.any(String),message:expect.any(String)}));
  });

  it("accepts a complete B2B enquiry", () => {
    expect(validateInquiry({name:"Alex",email:"alex@example.com",company:"Party Co",country:"Spain",message:"Need 10,000 custom balloons"})).toEqual({});
  });
});
