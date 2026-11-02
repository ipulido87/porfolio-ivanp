import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { ImageReveal, Reveal } from "@/components/motion/reveal";
import type { Locale } from "@/config/i18n";
import { getContent } from "@/content";
import { cn } from "@/lib/utils";
import { ProjectArt } from "./project-art";
import type { Project } from "./types";

export function ProjectKindBadge({ kind, locale }: { kind: Project["kind"]; locale: Locale }) {
  const { kindLabels } = getContent(locale).projects;
  return (
    <span
      data-testid="project-kind"
      className={cn(
        "label-mono inline-flex items-center gap-2 rounded-full border bg-ink/85 px-3 py-1.5 backdrop-blur",
        kind === "concept" ? "border-purple-soft/50 text-purple-soft" : "border-cyan/50 text-cyan",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          kind === "concept" ? "border border-purple-soft bg-transparent" : "bg-cyan",
        )}
      />
      {kindLabels[kind]}
    </span>
  );
}

export function ProjectCard({ project, locale, delay = 0 }: { project: Project; locale: Locale; delay?: number }) {
  const { projects, ui } = getContent(locale);
  const { labels } = projects;

  return (
    <Reveal delay={delay}>
      <article id={project.slug} className="group scroll-mt-28">
        <div className="corner-ticks relative border border-line">
          <ImageReveal className="relative aspect-[5/3] overflow-hidden">
            <div className="size-full transition-transform duration-1000 ease-out-expo group-hover:scale-[1.03]">
              {project.image ? (
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <ProjectArt visual={project.visual} />
              )}
            </div>
          </ImageReveal>
          <div className="absolute top-4 left-4">
            <ProjectKindBadge kind={project.kind} locale={locale} />
          </div>
          {project.image ? null : (
            <p className="label-mono absolute right-4 bottom-3 text-[0.6875rem]">{labels.placeholder}</p>
          )}
        </div>

        <div className="mt-6">
          <p className="label-mono">{project.category}</p>
          <h3 className="mt-3 text-2xl sm:text-3xl">{project.name}</h3>
          <p className="mt-3 max-w-xl text-muted">{project.summary}</p>

          <h4 className="sr-only">{labels.scope}</h4>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.scope.map((item) => (
              <li key={item} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
                {item}
              </li>
            ))}
          </ul>

          {project.stack.length > 0 ? (
            <p className="label-mono mt-4 normal-case">
              <span className="sr-only">{labels.stack}: </span>
              {project.stack.join(" · ")}
            </p>
          ) : null}

          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-1.5 font-medium transition-colors hover:text-cyan"
            >
              {labels.visit} {new URL(project.url).hostname.replace(/^www\./, "")}
              <span className="sr-only"> ({ui.common.opensInNewTab})</span>
              <ArrowUpRight
                className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </a>
          ) : null}
        </div>
      </article>
    </Reveal>
  );
}
