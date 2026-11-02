import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import type { Locale } from "@/config/i18n";
import { getRoutes } from "@/config/site";
import { cn } from "@/lib/utils";
import { serviceArt, serviceIcons } from "./service-art";
import type { Service, ServiceArtLabels } from "./types";

// Grid placement per position. Artwork sits at the bottom of tall cards and to
// the side of wide ones, so no two neighbours share the same composition.
const LAYOUT = [
  { cell: "lg:col-span-7 lg:row-span-2", art: "-mx-2 -mb-8 flex flex-1 flex-col pt-10 sm:mx-0 sm:-mb-10" },
  { cell: "lg:col-span-5", art: "mt-auto pt-8" },
  { cell: "lg:col-span-5", art: "mt-auto pt-8" },
] as const;

type ServicesBentoProps = { items: readonly Service[]; art: ServiceArtLabels; cardCta: string; locale: Locale };

export function ServicesBento({ items, art, cardCta, locale }: ServicesBentoProps) {
  const routes = getRoutes(locale);

  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12" gap={0.07}>
      {items.map((service, index) => {
        const Icon = serviceIcons[service.visual];
        const Art = serviceArt[service.visual];
        const layout = LAYOUT[index % LAYOUT.length]!;

        return (
          <StaggerItem key={service.slug} className={cn("flex", layout.cell)}>
            <article className="corner-ticks card-surface group relative flex w-full flex-col overflow-hidden p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-11 items-center justify-center rounded-xl border border-line-strong bg-ink/50 text-cyan">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="label-mono" aria-hidden>
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-6 text-2xl sm:text-[1.75rem]">{service.title}</h3>
              <p className="mt-3 max-w-md text-muted">{service.summary}</p>
              <Link
                href={`${routes.services}#${service.slug}`}
                aria-label={`${cardCta}: ${service.title}`}
                className="mt-5 inline-flex min-h-8 w-fit items-center gap-1.5 text-[0.9375rem] font-medium text-text after:absolute after:inset-0 hover:text-cyan"
              >
                {cardCta}
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
              <div className={layout.art} aria-hidden>
                <Art labels={art} />
              </div>
            </article>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
