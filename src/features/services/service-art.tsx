import { Check, CodeXml, Layers, ShieldCheck, Sparkles, Workflow, type LucideIcon } from "lucide-react";
import type { ReactElement } from "react";
import type { ServiceArtLabels, ServiceVisual } from "./types";

export const serviceIcons: Record<ServiceVisual, LucideIcon> = {
  web: CodeXml,
  flow: Sparkles,
  tests: ShieldCheck,
};

const Bar = ({ w, tone = "bg-line-strong" }: { w: string; tone?: string }) => (
  <span className={`block h-1.5 rounded-full ${tone}`} style={{ width: w }} />
);

/** A small application window. */
function WebArt() {
  const bars = [38, 62, 46, 78, 58, 92, 70];
  return (
    <div className="flex min-h-56 flex-1 flex-col rounded-t-xl border border-b-0 border-line-strong bg-ink/70 transition-transform duration-700 ease-out-expo group-hover:-translate-y-2">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-cyan/70" />
      </div>
      <div className="grid flex-1 grid-cols-[1fr_3fr] gap-4 p-4 sm:p-6">
        <div className="space-y-3 pt-1">
          <Bar w="80%" tone="bg-purple/60" />
          <Bar w="60%" />
          <Bar w="70%" />
          <Bar w="45%" />
        </div>
        <div className="flex h-full min-h-28 items-end gap-2">
          {bars.map((height, i) => (
            <span
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-purple/30 to-cyan/70"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Steps connected by a line with a travelling signal. */
function FlowArt() {
  return (
    <div className="relative flex items-center justify-between">
      <span className="absolute inset-x-4 top-1/2 h-px overflow-hidden bg-line-strong">
        <span className="block h-full w-1/3 bg-gradient-to-r from-transparent via-cyan to-transparent motion-safe:animate-sweep" />
      </span>
      {[Workflow, Layers, Check].map((Icon, i) => (
        <span
          key={i}
          className="relative flex size-12 items-center justify-center rounded-xl border border-line-strong bg-surface text-muted transition-colors duration-500 group-hover:border-cyan/50 group-hover:text-cyan"
        >
          <Icon className="size-5" aria-hidden />
        </span>
      ))}
    </div>
  );
}

/** Terminal-style test run. Sample labels only, not reported results. */
function TestsArt({ labels }: { labels: ServiceArtLabels }) {
  return (
    <div className="rounded-xl border border-line-strong bg-ink/80 p-5 font-mono text-[0.8125rem] leading-7">
      <p className="text-muted">$ pnpm test:e2e</p>
      {labels.tests.map((line) => (
        <p key={line} className="flex items-center gap-2 text-text/90">
          <Check className="size-3.5 text-success" strokeWidth={3} aria-hidden />
          {line}
        </p>
      ))}
    </div>
  );
}

export const serviceArt: Record<ServiceVisual, (props: { labels: ServiceArtLabels }) => ReactElement> = {
  web: WebArt,
  flow: FlowArt,
  tests: TestsArt,
};
