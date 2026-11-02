import { Reveal } from "@/components/motion/reveal";
import { Accordion } from "@/components/ui/accordion";
import type { Locale } from "@/config/i18n";
import { getContent } from "@/content";
import { SectionHeading } from "./section-heading";

export function FaqSection({ locale }: { locale: Locale }) {
  const { home, faq } = getContent(locale);

  return (
    <section className="section-y bg-ink-2/50">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={home.faq.eyebrow} title={home.faq.title} />
        </div>
        <Reveal delay={0.1} className="lg:col-span-7">
          <Accordion items={faq.items} />
        </Reveal>
      </div>
    </section>
  );
}
