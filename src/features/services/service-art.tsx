import { Check, CodeXml, Compass, History, Layers, ShieldCheck, Workflow, type LucideIcon } from "lucide-react";
import type { ReactElement } from "react";
import type { ServiceArtLabels, ServiceVisual } from "./types";

export const serviceIcons: Record<ServiceVisual, LucideIcon> = {
  web: CodeXml,
  stack: Layers,
  flow: Workflow,
  tests: ShieldCheck,
  compass: Compass,
  history: History,
};

const Bar = ({ w, tone = "bg-line-strong" }: { w: string; tone?: string }) => (
  <span className={`block h-1.5 rounded-full ${tone}`} style={{ width: w }} />
);

/** A small application window. */
function WebArt() {
  const bars = [38, 62, 46, 78, 58, 92, 70];
  return (
    <div className="rounded-t-xl border border-b-0 border-line-strong bg-ink/70 transition-transform duration-700 ease-out-expo group-hover:-translate-y-2">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-cyan/70" />
      </div>
      <div className="grid grid-cols-[1fr_3fr] gap-4 p-4">
        <div className="space-y-3 pt-1">
          <Bar w="80%" tone="bg-purple/60" />
          <Bar w="60%" />
          <Bar w="70%" />
          <Bar w="45%" />
        </div>
        <div className="flex h-28 items-end gap-2">
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

/** Interface, API and data stacked as one system. */
function StackArt({ labels }: { labels: ServiceArtLabels }) {
  const tones = ["border-cyan/50 text-cyan", "border-purple-soft/50 text-purple-soft", "border-line-strong text-muted"];
  return (
    <div className="space-y-2 font-mono text-xs">
      {labels.layers.map((label, i) => (
        <div
          key={label}
          className={`rounded-lg border bg-ink/60 px-4 py-3 transition-transform duration-500 ease-out-expo group-hover:translate-x-[var(--shift)] ${tones[i]}`}
          style={{ marginLeft: `${i * 14}px`, "--shift": `${(2 - i) * 6}px` } as React.CSSProperties}
        >
          {label}
        </div>
      ))}
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

/** Concentric rings with a needle. */
function CompassArt() {
  return (
    <svg viewBox="0 0 160 110" fill="none" className="h-28 w-auto" aria-hidden="true">
      <circle cx="80" cy="80" r="74" stroke="rgb(245 245 247 / 0.14)" />
      <circle cx="80" cy="80" r="50" stroke="rgb(245 245 247 / 0.14)" />
      <circle cx="80" cy="80" r="26" stroke="rgb(139 92 246 / 0.6)" />
      <path
        d="M80 80 118 26"
        stroke="#22d3ee"
        strokeWidth="1.5"
        className="origin-[80px_80px] transition-transform duration-700 ease-out-expo group-hover:rotate-[-24deg]"
      />
      <circle cx="80" cy="80" r="3" fill="#22d3ee" />
    </svg>
  );
}

/** Version history as a branching commit line. */
function HistoryArt() {
  return (
    <svg viewBox="0 0 280 72" fill="none" className="h-auto w-full" aria-hidden="true">
      <path d="M0 50h280" stroke="rgb(245 245 247 / 0.2)" />
      <path d="M70 50c26 0 26-30 52-30h46c26 0 26 30 52 30" stroke="#8b5cf6" strokeWidth="1.5" />
      {[28, 70, 220, 254].map((x) => (
        <circle key={x} cx={x} cy="50" r="4.5" fill="#12121c" stroke="rgb(245 245 247 / 0.5)" />
      ))}
      <circle cx="122" cy="20" r="4.5" fill="#12121c" stroke="#b49cfa" />
      <circle cx="168" cy="20" r="4.5" fill="#12121c" stroke="#b49cfa" />
      <circle cx="254" cy="50" r="4.5" fill="#22d3ee" />
    </svg>
  );
}

export const serviceArt: Record<ServiceVisual, (props: { labels: ServiceArtLabels }) => ReactElement> = {
  web: WebArt,
  stack: StackArt,
  flow: FlowArt,
  tests: TestsArt,
  compass: CompassArt,
  history: HistoryArt,
};
