import { JsonLd } from "@/components/layout/json-ld";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { FinalCta } from "@/components/sections/final-cta";
import type { Locale } from "@/config/i18n";
import { getRoutes } from "@/config/site";
import { getContent } from "@/content";
import { ProjectCard, ProjectKindBadge } from "@/features/projects/project-card";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export function projectsMetadata(locale: Locale) {
  return buildMetadata({ ...getContent(locale).pages.projects.seo, route: "projects", locale });
}

export function ProjectsPage({ locale }: { locale: Locale }) {
  const { pages, projects } = getContent(locale);
  const copy = pages.projects;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, copy.eyebrow, getRoutes(locale).projects)} />
      <PageHero eyebrow={copy.eyebrow} title={copy.headline} description={copy.description} />

      <div className="container-site pb-24">
        <Reveal>
          <section aria-label={copy.legendTitle} className="mb-16 grid gap-6 border-y border-line py-6 md:grid-cols-3">
            {(["personal", "live", "concept"] as const).map((kind) => (
              <div key={kind} className="flex flex-col items-start gap-3">
                <ProjectKindBadge kind={kind} locale={locale} />
                <p className="text-[0.9375rem] text-muted">{copy.legend[kind]}</p>
              </div>
            ))}
          </section>
        </Reveal>

        <div className="grid gap-x-10 gap-y-20 lg:grid-cols-2">
          {projects.items.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
      </div>

      <FinalCta locale={locale} />
    </>
  );
}
