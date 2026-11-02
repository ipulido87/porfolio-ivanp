import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/layout/json-ld";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { FinalCta } from "@/components/sections/final-cta";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/config/i18n";
import { getRoutes } from "@/config/site";
import { getContent } from "@/content";
import { serviceIcons } from "@/features/services/service-art";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, servicesJsonLd } from "@/lib/structured-data";

export function servicesMetadata(locale: Locale) {
  return buildMetadata({ ...getContent(locale).pages.services.seo, route: "services", locale });
}

export function ServicesPage({ locale }: { locale: Locale }) {
  const { pages, services } = getContent(locale);
  const routes = getRoutes(locale);
  const copy = pages.services;

  return (
    <>
      <JsonLd data={[...servicesJsonLd(locale), breadcrumbJsonLd(locale, copy.eyebrow, routes.services)]} />
      <PageHero eyebrow={copy.eyebrow} title={copy.headline} description={copy.description} />

      <div className="container-site pb-24">
        {services.items.map((service, index) => {
          const Icon = serviceIcons[service.visual];
          return (
            <Reveal key={service.slug}>
              <section
                id={service.slug}
                aria-labelledby={`${service.slug}-title`}
                className="grid scroll-mt-24 gap-10 border-t border-line py-14 lg:grid-cols-12 lg:py-20"
              >
                <div className="lg:col-span-6">
                  <div className="flex items-center gap-4">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-line-strong text-cyan">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="label-mono" aria-hidden>
                      0{index + 1} / 0{services.items.length}
                    </span>
                  </div>
                  <h2 id={`${service.slug}-title`} className="mt-7 text-4xl sm:text-5xl">
                    {service.title}
                  </h2>
                  <p className="mt-5 max-w-xl text-lg text-muted">{service.description}</p>
                  <Button asChild variant="secondary" className="mt-8">
                    <Link href={`${routes.contact}?servicio=${service.value}`}>
                      {copy.cta}
                      <ArrowRight aria-hidden />
                    </Link>
                  </Button>
                </div>

                <div className="lg:col-span-5 lg:col-start-8">
                  <h3 className="label-mono tracking-[0.08em]">{copy.includesLabel}</h3>
                  <ul className="mt-5 space-y-3">
                    {service.includes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check className="mt-1 size-4 shrink-0 text-cyan" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <h3 className="label-mono mt-9 tracking-[0.08em]">{copy.idealForLabel}</h3>
                  <p className="mt-3 text-muted">{service.idealFor}</p>
                </div>
              </section>
            </Reveal>
          );
        })}
      </div>

      <FinalCta locale={locale} />
    </>
  );
}
