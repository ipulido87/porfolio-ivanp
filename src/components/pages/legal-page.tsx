import { LegalDocument } from "@/components/sections/legal-document";
import type { Locale } from "@/config/i18n";
import type { RouteKey } from "@/config/site";
import { getContent } from "@/content";
import { buildMetadata } from "@/lib/seo";

type LegalKey = "privacyPolicy" | "cookiesPolicy" | "legalNotice";

const ROUTE: Record<LegalKey, RouteKey> = {
  privacyPolicy: "privacy",
  cookiesPolicy: "cookies",
  legalNotice: "legal",
};

export function legalMetadata(locale: Locale, document: LegalKey) {
  const { title, description } = getContent(locale)[document];
  return buildMetadata({ title, description, route: ROUTE[document], locale });
}

export function LegalPage({ locale, document }: { locale: Locale; document: LegalKey }) {
  return <LegalDocument document={getContent(locale)[document]} />;
}
