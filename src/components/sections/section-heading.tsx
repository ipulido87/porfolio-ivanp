import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-4xl", className)}>
      <p className="label-mono text-cyan">{eyebrow}</p>
      <h2 className="mt-5 text-[length:var(--text-title)]">{title}</h2>
      {description ? <p className="mt-6 max-w-2xl text-lg text-muted">{description}</p> : null}
    </Reveal>
  );
}
