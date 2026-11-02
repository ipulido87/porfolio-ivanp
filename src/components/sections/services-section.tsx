import type { Locale } from "@/config/i18n";
import { getContent } from "@/content";
import { ServicesBento } from "@/features/services/services-bento";
import { SectionHeading } from "./section-heading";

export function ServicesSection({ locale }: { locale: Locale }) {
  const { home, services } = getContent(locale);
  const { servicesIntro } = home;

  return (
    <section id={servicesIntro.anchor} className="section-y scroll-mt-16 bg-ink-2/50">
      <div className="container-site">
        <SectionHeading
          eyebrow={servicesIntro.eyebrow}
          title={servicesIntro.title}
          description={servicesIntro.description}
          className="mb-14"
        />
        <ServicesBento items={services.items} art={services.art} cardCta={servicesIntro.cardCta} locale={locale} />
      </div>
    </section>
  );
}
