import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/config/i18n";
import { getRoutes } from "@/config/site";
import { getContent } from "@/content";
import { ProjectCard } from "@/features/projects/project-card";
import { SectionHeading } from "./section-heading";

export function ProjectsSection({ locale }: { locale: Locale }) {
  const { home, projects } = getContent(locale);
  const routes = getRoutes(locale);
  const { projectsIntro } = home;

  return (
    <section className="section-y">
      <div className="container-site">
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={projectsIntro.eyebrow}
            title={projectsIntro.title}
            description={projectsIntro.description}
          />
          <Button asChild variant="secondary" className="w-fit shrink-0">
            <Link href={routes.projects}>
              {projectsIntro.action}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>

        {/* The second column starts lower so the grid reads as editorial, not tabular. */}
        <div className="grid gap-x-10 gap-y-16 lg:grid-cols-2">
          {projects.items.slice(0, 4).map((project, index) => (
            <div key={project.slug} className={index % 2 === 1 ? "lg:mt-24" : undefined}>
              <ProjectCard project={project} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
