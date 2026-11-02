import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/config/i18n";
import { getRoutes } from "@/config/site";
import { getContent } from "@/content";

export function AboutSection({ locale }: { locale: Locale }) {
  const { home, about } = getContent(locale);
  const routes = getRoutes(locale);
  const copy = home.about;

  return (
    <section className="section-y">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="label-mono text-cyan">{copy.eyebrow}</p>
          <h2 className="mt-5 text-[length:var(--text-title)]">{copy.title}</h2>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5 lg:pt-10">
          {copy.body.map((paragraph) => (
            <p key={paragraph} className="mb-4 text-muted">
              {paragraph}
            </p>
          ))}
          <Button asChild variant="secondary" className="mt-4">
            <Link href={routes.about}>
              {copy.action}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={0.1} className="border-t border-line pt-10 lg:col-span-12">
          <h3 className="label-mono tracking-[0.08em]">{about.stack.title}</h3>
          <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2 font-display text-xl text-muted sm:text-2xl">
            {about.stack.groups
              .flatMap((group) => group.items)
              .map((tool) => (
                <li key={tool} className="transition-colors duration-300 hover:text-text">
                  {tool}
                </li>
              ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
