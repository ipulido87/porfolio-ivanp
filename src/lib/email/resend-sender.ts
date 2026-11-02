import "server-only";

import { Resend } from "resend";
import type { LeadEmailSender } from "@/features/contact/submit-lead";
import { buildLeadEmail } from "./lead-notification";

const SEND_TIMEOUT_MS = 8000;

export const createResendSender = (): LeadEmailSender => async (lead, leadId, locale) => {
  const { RESEND_API_KEY, LEAD_EMAIL_FROM, LEAD_EMAIL_TO } = process.env;
  if (!RESEND_API_KEY || !LEAD_EMAIL_FROM || !LEAD_EMAIL_TO) {
    throw Object.assign(new Error("Email is not configured"), { code: "email_not_configured" });
  }

  const resend = new Resend(RESEND_API_KEY);
  const email = buildLeadEmail(lead, leadId, locale);

  // The visitor is waiting on this request: never let a slow provider hold it.
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(Object.assign(new Error("Email timed out"), { code: "email_timeout" })),
      SEND_TIMEOUT_MS,
    );
  });

  try {
    const { error } = await Promise.race([
      resend.emails.send({ from: LEAD_EMAIL_FROM, to: LEAD_EMAIL_TO, replyTo: lead.email, ...email }),
      timeout,
    ]);
    if (error) throw Object.assign(new Error("Resend rejected the email"), { code: error.name });
  } finally {
    clearTimeout(timer);
  }
};
