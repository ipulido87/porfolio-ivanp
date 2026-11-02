import { describe, expect, it } from "vitest";
import { contact } from "@/content/es/contact";
import { contact as contactEn } from "@/content/en/contact";
import { createLeadRequestSchema, createLeadSchema } from "@/lib/validations/lead";
import { validLead, validRequest } from "@tests/helpers/fixtures";

const leadSchema = createLeadSchema(contact.validation);
const leadRequestSchema = createLeadRequestSchema(contact.validation);

const errorFor = (input: unknown, field: string) => {
  const result = leadSchema.safeParse(input);
  return result.success ? undefined : result.error.issues.find((issue) => issue.path[0] === field)?.message;
};

describe("leadSchema", () => {
  it("accepts a complete lead", () => {
    expect(leadSchema.safeParse(validLead).success).toBe(true);
  });

  it("accepts a lead without the optional fields", () => {
    const { company: _company, budget: _budget, ...required } = validLead;
    expect(leadSchema.safeParse(required).success).toBe(true);
  });

  it("trims text and normalizes the email", () => {
    const data = leadSchema.parse({ ...validLead, name: "  Ana  ", email: "  ANA@Empresa.ES " });
    expect(data.name).toBe("Ana");
    expect(data.email).toBe("ana@empresa.es");
  });

  it("turns an empty company into undefined", () => {
    expect(leadSchema.parse({ ...validLead, company: "   " }).company).toBeUndefined();
  });

  it.each(["O'Connor", "María José", "Jean-Luc", "Müller Ñáñez"])("accepts the name %s", (name) => {
    expect(leadSchema.safeParse({ ...validLead, name }).success).toBe(true);
  });

  it.each(["Ana\r\nBcc: x@y.z", "<script>", "a"])("rejects the name %j", (name) => {
    expect(leadSchema.safeParse({ ...validLead, name }).success).toBe(false);
  });

  it.each(["no-es-un-correo", "a@", "@b.com", "a b@c.com"])("rejects the email %s", (email) => {
    expect(errorFor({ ...validLead, email }, "email")).toBe(contact.validation.emailFormat);
  });

  it("explains in Spanish when the message is too short", () => {
    expect(errorFor({ ...validLead, message: "Hola" }, "message")).toBe(contact.validation.messageMin);
  });

  it("rejects messages over 5000 characters", () => {
    expect(errorFor({ ...validLead, message: "x".repeat(5001) }, "message")).toBe(contact.validation.messageMax);
  });

  it("requires a starting point", () => {
    expect(errorFor({ ...validLead, stage: undefined }, "stage")).toBe(contact.validation.stage);
  });

  it("speaks the language it was created with", () => {
    const result = createLeadSchema(contactEn.validation).safeParse({ ...validLead, message: "Hi" });
    expect(result.error?.issues[0]?.message).toBe(contactEn.validation.messageMin);
  });

  it("rejects an unknown service", () => {
    expect(errorFor({ ...validLead, service: "hacking" }, "service")).toBe(contact.validation.service);
  });

  it.each([false, undefined, "true"])("requires explicit consent (%j)", (consent) => {
    expect(errorFor({ ...validLead, consent }, "consent")).toBe(contact.validation.consent);
  });
});

describe("leadRequestSchema", () => {
  it("requires a UUID submission id", () => {
    expect(leadRequestSchema.safeParse(validRequest()).success).toBe(true);
    expect(leadRequestSchema.safeParse(validRequest({ submissionId: "123" })).success).toBe(false);
  });
});
