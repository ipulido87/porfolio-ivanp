import { locales, type Locale } from "@/config/i18n";
import { getRoutes, siteConfig } from "@/config/site";
import { getContent } from "@/content";
import { absoluteUrl } from "./seo";

const ORGANIZATION_ID = `${siteConfig.url}/#organization`;

export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: getContent(locale).home.seo.description,
    areaServed: siteConfig.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
    address: {
      "@type": "PostalAddress",
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.country,
    },
    knowsLanguage: locales,
    sameAs: [siteConfig.linkedinUrl],
    ...(siteConfig.contactEmail ? { email: siteConfig.contactEmail } : {}),
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl(getRoutes(locale).home),
    inLanguage: locale,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function servicesJsonLd(locale: Locale) {
  return getContent(locale).services.items.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: absoluteUrl(`${getRoutes(locale).services}#${service.slug}`),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: siteConfig.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
  }));
}

export function faqJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getContent(locale).faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(locale: Locale, name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: getContent(locale).ui.common.home,
        item: absoluteUrl(getRoutes(locale).home),
      },
      { "@type": "ListItem", position: 2, name, item: absoluteUrl(path) },
    ],
  };
}
