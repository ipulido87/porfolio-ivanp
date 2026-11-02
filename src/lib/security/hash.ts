import { createHash, createHmac } from "node:crypto";

/** IPs are personal data: only a keyed hash is ever stored. */
export function hashIp(ip: string, secret: string) {
  return createHmac("sha256", secret).update(ip).digest("hex").slice(0, 32);
}

/** Same person, same text: identifies a resend regardless of case or spacing. */
export function leadFingerprint(email: string, message: string) {
  const normalized = `${email.trim().toLowerCase()}\n${message.trim().toLowerCase().replace(/\s+/g, " ")}`;
  return createHash("sha256").update(normalized).digest("hex");
}

/** First hop of the proxy chain, as set by the hosting platform. */
export function getClientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}
