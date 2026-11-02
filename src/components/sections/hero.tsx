import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GlobePoster } from "@/components/motion/globe/globe-poster";
import { GlobeVisual } from "@/components/motion/globe/globe-visual";
import { MaskedLines } from "@/components/motion/masked-lines";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/config/i18n";
import { getRoutes, siteConfig } from "@/config/site";
import { getContent } from "@/content";

export function Hero({ locale }: { locale: Locale }) {
  const { home, ui } = getContent(locale);
  const routes = getRoutes(locale);
  const { hero } = home;

  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden pt-24 lg:pt-20">
      <div className="bg-blueprint absolute inset-0 -z-20" aria-hidden />

      <div className="container-site grid flex-1 items-center gap-2 lg:grid-cols-12 lg:gap-0">
        <div className="relative z-10 lg:col-span-8">
          <Reveal y={12}>
            <p className="label-mono text-[0.6875rem] text-cyan sm:text-xs">{hero.eyebrow}</p>
          </Reveal>

          <h1 className="mt-5 text-[length:var(--text-hero)] leading-[1.03] sm:mt-6 xl:whitespace-nowrap">
            <MaskedLines lines={hero.headline} delay={0.15} />
          </h1>

          <Reveal delay={0.55}>
            <p className="mt-6 max-w-xl text-[1.0625rem] text-muted sm:mt-8 sm:text-xl">{hero.subtitle}</p>
            <div className="mt-7 flex flex-col gap-3 xs:flex-row xs:flex-wrap sm:mt-10">
              <Button asChild size="lg">
                <Link href={routes.contact}>
                  {ui.cta.primary}
                  <ArrowRight
                    aria-hidden
                    className="transition-transform duration-300 ease-out-expo group-hover/button:translate-x-1"
                  />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={`#${home.servicesIntro.anchor}`}>
                  {ui.cta.secondary}
                  <ArrowDown aria-hidden />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* On wide screens the globe is larger than its column, so its halo can bleed past it. */}
        <div className="relative mx-auto w-full max-w-[34rem] lg:col-span-4 lg:mx-0 lg:h-full lg:max-w-none">
          <div className="relative lg:absolute lg:top-1/2 lg:left-1/2 lg:w-[min(44rem,calc(100svh-8rem),52vw)] lg:-translate-x-1/2 lg:-translate-y-1/2">
            <GlobeVisual poster={<GlobePoster />} label={hero.globeLabel} />
            <p className="label-mono absolute bottom-[6%] left-1/2 hidden -translate-x-1/2 whitespace-nowrap lg:block">
              <span aria-hidden className="mr-2 inline-block size-1.5 rounded-full bg-cyan" />
              {siteConfig.location.label} · {siteConfig.location.coords}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-line bg-ink/40">
        <dl className="container-site grid sm:grid-cols-3">
          {hero.specs.map((spec, index) => (
            <div key={spec.label} className={index > 0 ? "border-t border-line py-4 sm:border-t-0 sm:border-l sm:py-5 sm:pl-6" : "py-4 sm:py-5"}>
              <dt className="label-mono">{spec.label}</dt>
              <dd className="mt-1 text-[0.9375rem]">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
