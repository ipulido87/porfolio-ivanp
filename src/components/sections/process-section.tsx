import type { Locale } from "@/config/i18n";
import { getContent } from "@/content";
import { ProcessTimeline } from "./process-timeline";
import { SectionHeading } from "./section-heading";

export function ProcessSection({ locale }: { locale: Locale }) {
  const { process } = getContent(locale).home;

  return (
    <section className="section-y bg-ink-2/50">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading eyebrow={process.eyebrow} title={process.title} description={process.description} />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ProcessTimeline steps={process.steps} />
        </div>
      </div>
    </section>
  );
}
