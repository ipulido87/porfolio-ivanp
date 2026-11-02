// Spanish lives at the root and English under /en. To add a language: create
// src/content/<locale>, register it here, in src/content/index.ts and in
// `localizedRoutes`, then add a route group in src/app.
export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";
export const ogLocale: Record<Locale, string> = { es: "es_ES", en: "en_GB" };
export const otherLocale = (locale: Locale): Locale => (locale === "es" ? "en" : "es");
