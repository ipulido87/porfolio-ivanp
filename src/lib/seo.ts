import type { Metadata } from "next";
import { defaultLocale, locales, ogLocale, otherLocale, type Locale } from "@/config/i18n";
import { getRoutes, siteConfig, type RouteKey } from "@/config/site";

type PageSeo = { title: string; description: string; route: RouteKey; locale: Locale };

export function absoluteUrl(path: string) {
  return path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
}

/** hreflang map for one page: every language plus the x-default fallback. */
export function languageAlternates(route: RouteKey) {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, absoluteUrl(getRoutes(locale)[route])])),
    "x-default": absoluteUrl(getRoutes(defaultLocale)[route]),
  };
}

export function buildMetadata({ title, description, route, locale }: PageSeo): Metadata {
  const url = absoluteUrl(getRoutes(locale)[route]);
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(route) },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: ogLocale[locale],
      alternateLocale: ogLocale[otherLocale(locale)],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Serializes JSON-LD for inline use, neutralising `</script>` breakouts. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
