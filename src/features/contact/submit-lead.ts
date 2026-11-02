import { randomUUID } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { defaultLocale, locales, type Locale } from "@/config/i18n";
import { getContent } from "@/content";
import { leads } from "@/lib/db/schema";
import type * as schema from "@/lib/db/schema";
import { leadFingerprint } from "@/lib/security/hash";
import { errorCode, safeLog } from "@/lib/security/safe-log";
import { createLeadRequestSchema, type LeadData } from "@/lib/validations/lead";

const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

export type LeadEmailSender = (lead: LeadData, leadId: string, locale: Locale) => Promise<void>;

export type SubmitLeadDeps = {
  db: LibSQLDatabase<typeof schema>;
  sendEmail: LeadEmailSender;
  now?: () => Date;
};

export type SubmitLeadResult =
  | { status: "created"; leadId: string; emailDelivered: boolean }
  | { status: "duplicate" }
  | { status: "spam" }
  | { status: "invalid"; fieldErrors: Record<string, string> };

function toFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const field = String(issue.path[0] ?? "form");
    errors[field] ??= issue.message;
  }
  return errors;
}

/**
 * Lead pipeline: validate, deduplicate, persist, then notify. The write comes
 * first and the email is best effort, so a provider outage can delay the
 * notification but can never lose a lead.
 */
export async function submitLead(
  input: unknown,
  { ipHash }: { ipHash: string | null },
  { db, sendEmail, now = () => new Date() }: SubmitLeadDeps,
): Promise<SubmitLeadResult> {
  // Honeypot goes first. Bots get a normal-looking answer and learn nothing.
  const { website: honeypot, locale: rawLocale } = (input ?? {}) as { website?: unknown; locale?: unknown };
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    safeLog("info", "lead.spam_blocked");
    return { status: "spam" };
  }

  // Field errors go back in the language of the form that sent them.
  const locale = locales.find((candidate) => candidate === rawLocale) ?? defaultLocale;
  const parsed = createLeadRequestSchema(getContent(locale).contact.validation).safeParse(input);
  if (!parsed.success) {
    return { status: "invalid", fieldErrors: toFieldErrors(parsed.error.issues) };
  }
  const { submissionId, website: _honeypot, locale: _locale, ...lead } = parsed.data;

  const createdAt = now();
  const fingerprint = leadFingerprint(lead.email, lead.message);

  const [recent] = await db
    .select({ id: leads.id })
    .from(leads)
    .where(and(eq(leads.fingerprint, fingerprint), gt(leads.createdAt, new Date(createdAt.getTime() - DUPLICATE_WINDOW_MS))))
    .limit(1);
  if (recent) return { status: "duplicate" };

  const leadId = randomUUID();
  // The unique index closes the race between concurrent double submits.
  const inserted = await db
    .insert(leads)
    .values({
      id: leadId,
      submissionId,
      fingerprint,
      name: lead.name,
      email: lead.email,
      company: lead.company ?? null,
      stage: lead.stage,
      service: lead.service,
      budget: lead.budget ?? null,
      locale,
      message: lead.message,
      consentAt: createdAt,
      ipHash,
      createdAt,
    })
    .onConflictDoNothing({ target: leads.submissionId })
    .returning({ id: leads.id });
  if (inserted.length === 0) return { status: "duplicate" };

  try {
    await sendEmail(lead, leadId, locale);
    await db.update(leads).set({ emailStatus: "sent" }).where(eq(leads.id, leadId));
    safeLog("info", "lead.created", { leadId, email_delivered: true });
    return { status: "created", leadId, emailDelivered: true };
  } catch (error) {
    const code = errorCode(error);
    safeLog("error", "lead.email_failed", { leadId, code });
    // The lead is already safe. A failure here must not surface to the visitor.
    await db
      .update(leads)
      .set({ emailStatus: "failed", emailError: code })
      .where(eq(leads.id, leadId))
      .catch((updateError: unknown) => {
        safeLog("error", "lead.email_status_update_failed", { leadId, code: errorCode(updateError) });
      });
    return { status: "created", leadId, emailDelivered: false };
  }
}
