import type { ComponentProps } from "react";
import type { Locale } from "@/config/i18n";
import { Button } from "@/components/ui/button";
import { getContent } from "@/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.04 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88Zm8.41-18.3A11.82 11.82 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9a11.83 11.83 0 0 0-3.49-8.4Z" />
    </svg>
  );
}

/** Contextual CTA. Renders nothing until a WhatsApp number is configured. */
export function WhatsAppButton({
  locale,
  size = "lg",
  className,
}: {
  locale: Locale;
  size?: "md" | "lg";
  className?: string;
}) {
  const { ui } = getContent(locale);
  const href = buildWhatsAppUrl(ui.cta.whatsappMessage);
  if (!href) return null;

  return (
    <Button asChild variant="secondary" size={size} className={className}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
        {ui.cta.whatsapp}
        <span className="sr-only">{ui.common.opensInNewTab}</span>
      </a>
    </Button>
  );
}

export function WhatsAppFloating({ locale }: { locale: Locale }) {
  const { ui } = getContent(locale);
  const href = buildWhatsAppUrl(ui.cta.whatsappMessage);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${ui.cta.whatsappFloating} (${ui.common.opensInNewTab})`}
      data-testid="whatsapp-floating"
      className="group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex h-14 items-center gap-0 rounded-full border border-line-strong bg-surface/95 px-4 text-text shadow-[0_12px_40px_-12px_rgb(0_0_0/0.8)] backdrop-blur transition-colors duration-300 animate-float-in hover:border-cyan/70 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-6 text-cyan" />
      <span className="max-w-0 overflow-hidden text-[0.9375rem] whitespace-nowrap transition-[max-width,margin] duration-500 ease-out-expo group-hover:ml-2.5 group-hover:max-w-44 group-focus-visible:ml-2.5 group-focus-visible:max-w-44">
        {ui.cta.whatsappFloating}
      </span>
    </a>
  );
}
