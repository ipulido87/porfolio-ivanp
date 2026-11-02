import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { WhatsAppButton } from "@/components/layout/whatsapp";
import { GlobePoster } from "@/components/motion/globe/globe-poster";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/config/i18n";
import { getRoutes } from "@/config/site";
import { getContent } from "@/content";

/** Closes the page on the signature element: the globe rising like a horizon. */
export function FinalCta({ locale }: { locale: Locale }) {
  const { home, ui } = getContent(locale);
  const routes = getRoutes(locale);
  const { finalCta } = home;

  return (
    <section className="relative isolate overflow-hidden pt-28 pb-[min(52vw,26rem)] text-center sm:pt-40">
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -z-10 w-[min(170vw,72rem)] -translate-x-1/2 translate-y-[58%] [mask-image:linear-gradient(to_bottom,black_30%,transparent_62%)]"
      >
        <GlobePoster />
      </div>

      <Reveal className="container-site">
        <p className="label-mono text-cyan">{finalCta.eyebrow}</p>
        <h2 className="mx-auto mt-6 max-w-4xl text-[length:var(--text-display)]">{finalCta.title}</h2>
        <p className="mx-auto mt-7 max-w-xl text-lg text-muted">{finalCta.description}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full xs:w-auto">
            <Link href={routes.contact}>
              {ui.cta.primary}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <WhatsAppButton locale={locale} className="w-full xs:w-auto" />
        </div>
      </Reveal>
    </section>
  );
}
