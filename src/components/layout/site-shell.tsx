import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/motion/motion-provider";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getContent } from "@/content";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { JsonLd } from "./json-ld";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { WhatsAppFloating } from "./whatsapp";
import "@/styles/globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });

export function rootMetadata(locale: Locale): Metadata {
  const { seo } = getContent(locale).home;
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: `${siteConfig.name} | ${seo.title}`, template: `%s | ${siteConfig.name}` },
    description: seo.description,
    applicationName: siteConfig.name,
    formatDetection: { telephone: false },
  };
}

export const siteViewport: Viewport = { themeColor: "#09090F", colorScheme: "dark" };

/** Document shell shared by the root layout of each language. */
export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const { ui } = getContent(locale);

  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>
        {/* Motion hides content until hydration: without JS it must stay visible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="fixed top-3 left-3 z-50 -translate-y-20 rounded-lg bg-text px-4 py-2.5 font-medium text-ink transition-transform focus:translate-y-0"
        >
          {ui.common.skipToContent}
        </a>
        <JsonLd data={[organizationJsonLd(locale), websiteJsonLd(locale)]} />
        <MotionProvider>
          <SiteHeader ui={ui} locale={locale} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
        </MotionProvider>
        <SiteFooter locale={locale} />
        <WhatsAppFloating locale={locale} />
      </body>
    </html>
  );
}
