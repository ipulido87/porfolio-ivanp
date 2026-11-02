import { z } from "zod";
import { locales } from "@/config/i18n";

export const SERVICE_VALUES = ["web", "ai", "qa", "other"] as const;
export const BUDGET_VALUES = ["under-3k", "3k-10k", "10k-25k", "over-25k", "unknown"] as const;

export const STAGE_VALUES = ["idea", "stuck", "build", "support", "other"] as const;

export type StageValue = (typeof STAGE_VALUES)[number];
export type ServiceValue = (typeof SERVICE_VALUES)[number];
export type BudgetValue = (typeof BUDGET_VALUES)[number];

export type ValidationMessages = Record<
  | "stage"
  | "nameMin"
  | "nameMax"
  | "nameFormat"
  | "emailRequired"
  | "emailFormat"
  | "companyMax"
  | "service"
  | "budget"
  | "messageMin"
  | "messageMax"
  | "consent",
  string
>;

// Letters of any script plus the punctuation real names use. Rejecting line
// breaks and control characters also prevents email header injection.
const NAME_PATTERN = /^[\p{L}\p{M}\p{Zs}'’.\-]+$/u;

const emptyToUndefined = (value: string | undefined) => (value === "" ? undefined : value);

/** Shared by the form (client) and the API route (server), in the visitor's language. */
export function createLeadSchema(m: ValidationMessages) {
  return z.object({
    stage: z.enum(STAGE_VALUES, { error: m.stage }),
    name: z.string().trim().min(2, m.nameMin).max(120, m.nameMax).regex(NAME_PATTERN, m.nameFormat),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, m.emailRequired)
      .max(254, m.emailFormat)
      .pipe(z.email(m.emailFormat)),
    company: z.string().trim().max(120, m.companyMax).optional().transform(emptyToUndefined),
    service: z.enum(SERVICE_VALUES, { error: m.service }),
    budget: z.enum(BUDGET_VALUES, { error: m.budget }).optional(),
    message: z.string().trim().min(20, m.messageMin).max(5000, m.messageMax),
    consent: z.literal(true, { error: m.consent }),
  });
}

type LeadSchema = ReturnType<typeof createLeadSchema>;
export type LeadFormInput = z.input<LeadSchema>;
export type LeadData = z.output<LeadSchema>;

/** The envelope only the server cares about. */
export const createLeadRequestSchema = (messages: ValidationMessages) =>
  createLeadSchema(messages).extend({
    // Generated once per form instance, so double clicks and retries are idempotent.
    submissionId: z.uuid(),
    // Honeypot: hidden from people, tempting for bots.
    website: z.string().max(500).optional(),
    locale: z.enum(locales).optional(),
  });
