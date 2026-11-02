import type { Locale } from "./i18n";

// Single source of truth for the brand. Renaming the business only takes
// changing `name` and `monogram` here (plus LEAD_EMAIL_FROM in the env).
export const siteConfig = {
  name: "Pulido Labs",
  monogram: "PL",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  // International format, digits only. The env variable overrides it.
  whatsappPhone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "34634260374",
  location: { label: "Mallorca", region: "Illes Balears", country: "ES", coords: "39.57° N · 2.65° E" },
  areaServed: ["Mallorca", "España"],
} as const;

export const localizedRoutes = {
  es: {
    home: "/",
    services: "/servicios",
    projects: "/proyectos",
    about: "/sobre-mi",
    contact: "/contacto",
    privacy: "/privacidad",
    cookies: "/cookies",
    legal: "/aviso-legal",
  },
  en: {
    home: "/en",
    services: "/en/services",
    projects: "/en/projects",
    about: "/en/about",
    contact: "/en/contact",
    privacy: "/en/privacy",
    cookies: "/en/cookies",
    legal: "/en/legal-notice",
  },
} as const;

export type RouteKey = keyof typeof localizedRoutes.es;

export const routeKeys = Object.keys(localizedRoutes.es) as RouteKey[];

export const getRoutes = (locale: Locale): Record<RouteKey, string> => localizedRoutes[locale];

/** The same page in another language, or that language's home if there is no match. */
export function switchLocalePath(pathname: string, from: Locale, to: Locale) {
  const key = routeKeys.find((candidate) => localizedRoutes[from][candidate] === pathname);
  return localizedRoutes[to][key ?? "home"];
}
