import { handleLeadRequest } from "@/features/contact/handle-lead-request";
import { getDb } from "@/lib/db/client";
import { createResendSender } from "@/lib/email/resend-sender";
import { rateLimitFromEnv } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return handleLeadRequest(request, () => {
    const ipSecret = process.env.IP_HASH_SECRET;
    if (!ipSecret) throw Object.assign(new Error("IP_HASH_SECRET is not configured"), { code: "ip_secret_missing" });

    return {
      db: getDb(),
      sendEmail: createResendSender(),
      ipSecret,
      rateLimit: rateLimitFromEnv(process.env),
    };
  });
}
