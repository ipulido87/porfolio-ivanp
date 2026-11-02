import { JsonLd } from "@/components/layout/json-ld";
import { AboutSection } from "@/components/sections/about-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Problems } from "@/components/sections/problems";
import { ProcessSection } from "@/components/sections/process-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ServicesSection } from "@/components/sections/services-section";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getContent } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/structured-data";

export function homeMetadata(locale: Locale) {
  const { seo } = getContent(locale).home;
  return {
    ...buildMetadata({ ...seo, route: "home", locale }),
    title: { absolute: `${siteConfig.name} | ${seo.title}` },
  };
}

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <JsonLd data={faqJsonLd(locale)} />
      <Hero locale={locale} />
      <Problems locale={locale} />
      <ServicesSection locale={locale} />
      <ProjectsSection locale={locale} />
      <ProcessSection locale={locale} />
      <AboutSection locale={locale} />
      <FaqSection locale={locale} />
      <FinalCta locale={locale} />
    </>
  );
}
