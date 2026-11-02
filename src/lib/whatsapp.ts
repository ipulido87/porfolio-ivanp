import { siteConfig } from "@/config/site";

/** Builds a wa.me link, or null when no valid number is configured. */
export function buildWhatsAppUrl(
  message: string,
  phone: string = siteConfig.whatsappPhone,
): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
