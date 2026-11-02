import { ArrowRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import type { Locale } from "@/config/i18n";
import { getContent } from "@/content";
import { SectionHeading } from "./section-heading";

/** An editorial ledger rather than a card grid: each row reads problem → answer. */
export function Problems({ locale }: { locale: Locale }) {
  const { problems } = getContent(locale).home;

  return (
    <section className="section-y">
      <div className="container-site">
        <SectionHeading eyebrow={problems.eyebrow} title={problems.title} description={problems.description} />

        <div className="mt-16 hidden grid-cols-12 gap-8 pb-4 lg:grid" aria-hidden>
          <p className="label-mono col-span-6">{problems.columns.problem}</p>
          <p className="label-mono col-span-6">{problems.columns.solution}</p>
        </div>

        <Stagger className="mt-12 border-t border-line lg:mt-0">
          {problems.items.map((item) => (
            <StaggerItem key={item.solution}>
              <div className="group relative grid gap-5 border-b border-line py-9 lg:grid-cols-12 lg:gap-8">
                <span
                  aria-hidden
                  className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-purple to-cyan transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                />
                <div className="lg:col-span-6">
                  <h3 className="text-2xl sm:text-3xl">{item.problem}</h3>
                  <p className="mt-3 max-w-lg text-muted">{item.detail}</p>
                </div>
                <div className="flex gap-4 lg:col-span-6">
                  <ArrowRight
                    aria-hidden
                    className="mt-1 size-5 shrink-0 text-cyan transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5"
                  />
                  <div>
                    <p className="font-display text-xl">{item.solution}</p>
                    <p className="mt-2 max-w-md text-muted">{item.answer}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
