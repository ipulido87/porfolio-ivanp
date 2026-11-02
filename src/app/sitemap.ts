import type { MetadataRoute } from "next";
import { locales } from "@/config/i18n";
import { getRoutes, routeKeys, type RouteKey } from "@/config/site";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

const PRIORITIES: Record<RouteKey, number> = {
  home: 1,
  services: 0.9,
  projects: 0.8,
  about: 0.7,
  contact: 0.8,
  privacy: 0.2,
  cookies: 0.2,
  legal: 0.2,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routeKeys.map((key) => ({
      url: absoluteUrl(getRoutes(locale)[key]),
      priority: PRIORITIES[key],
      alternates: { languages: languageAlternates(key) },
    })),
  );
}
