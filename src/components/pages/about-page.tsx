import { JsonLd } from "@/components/layout/json-ld";
import { LinkedInLink } from "@/components/layout/linkedin-link";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { FinalCta } from "@/components/sections/final-cta";
import { SectionHeading } from "@/components/sections/section-heading";
import type { Locale } from "@/config/i18n";
import { getRoutes } from "@/config/site";
import { getContent } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export function aboutMetadata(locale: Locale) {
  return buildMetadata({ ...getContent(locale).pages.about.seo, route: "about", locale });
}

export function AboutPage({ locale }: { locale: Locale }) {
  const { about } = getContent(locale);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, about.eyebrow, getRoutes(locale).about)} />
      <PageHero eyebrow={about.eyebrow} title={about.headline} description={about.intro} />

      <section className="pb-24">
        <div className="container-site grid gap-10 border-t border-line pt-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <h2 className="text-4xl sm:text-5xl">{about.story.title}</h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            {about.story.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-5 text-lg text-muted">
                {paragraph}
              </p>
            ))}
            <LinkedInLink
              locale={locale}
              className="inline-flex min-h-11 items-center gap-2 font-medium transition-colors hover:text-cyan"
            />
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-ink-2/50">
        <div className="container-site">
          <SectionHeading
            eyebrow={about.aiWorkflow.eyebrow}
            title={about.aiWorkflow.title}
            description={about.aiWorkflow.description}
            className="mb-14"
          />
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {about.aiWorkflow.items.map((item) => (
              <StaggerItem key={item.title} className="flex">
                <article className="corner-ticks card-surface w-full p-7 sm:p-9">
                  <h3 className="text-2xl">{item.title}</h3>
                  <p className="mt-3 text-muted">{item.body}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-y">
        <div className="container-site">
          <SectionHeading eyebrow={about.advantages.eyebrow} title={about.advantages.title} className="mb-14" />
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {about.advantages.items.map((item, index) => (
              <StaggerItem key={item.title} className="flex">
                <article className="corner-ticks card-surface w-full p-7 sm:p-9">
                  <p className="label-mono" aria-hidden>
                    0{index + 1}
                  </p>
                  <h3 className="mt-5 text-2xl">{item.title}</h3>
                  <p className="mt-3 text-muted">{item.body}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-y bg-ink-2/50">
        <div className="container-site">
          <SectionHeading eyebrow={about.stack.eyebrow} title={about.stack.title} className="mb-12" />
          <dl className="border-t border-line">
            {about.stack.groups.map((group) => (
              <Reveal key={group.label}>
                <div className="grid gap-3 border-b border-line py-7 md:grid-cols-12">
                  <dt className="label-mono self-center md:col-span-4">{group.label}</dt>
                  <dd className="flex flex-wrap gap-x-6 gap-y-1 font-display text-xl sm:text-2xl md:col-span-8">
                    {group.items.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <FinalCta locale={locale} />
    </>
  );
}
