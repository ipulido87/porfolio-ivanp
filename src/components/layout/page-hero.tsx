import { MaskedLines } from "@/components/motion/masked-lines";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: readonly { text: string; accent?: boolean }[];
  description: string;
  /** Shorter header, for pages whose main content should be visible straight away. */
  compact?: boolean;
};

/** Shared header of the secondary pages. */
export function PageHero({ eyebrow, title, description, compact }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        compact ? "pt-28 pb-8 sm:pt-32 sm:pb-10" : "pt-40 pb-16 sm:pt-48 sm:pb-24",
      )}
    >
      <div className="bg-blueprint absolute inset-0 -z-10" aria-hidden />
      <div
        aria-hidden
        className="absolute -top-40 right-[-10%] -z-10 size-[42rem] rounded-full bg-[radial-gradient(circle,rgb(139_92_246/0.16),transparent_65%)]"
      />
      <div className="container-site">
        <p className="label-mono text-cyan">{eyebrow}</p>
        <h1 className={cn("max-w-5xl", compact ? "mt-4 text-[length:var(--text-title)]" : "mt-6 text-[length:var(--text-display)]")}>
          <MaskedLines lines={title} />
        </h1>
        <Reveal delay={0.35}>
          <p className={cn("max-w-2xl text-lg text-muted", compact ? "mt-4" : "mt-8 sm:text-xl")}>{description}</p>
        </Reveal>
      </div>
    </section>
  );
}
