"use client";

import { useScroll, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { EASE_OUT_EXPO } from "@/components/motion/reveal";

type Step = { name: string; title: string; body: string; note: string };

/** Vertical timeline whose line fills as the visitor scrolls. Scrolling itself is untouched. */
export function ProcessTimeline({ steps }: { steps: readonly Step[] }) {
  const container = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start 72%", "end 62%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  return (
    <ol ref={container} className="relative">
      <span aria-hidden className="absolute top-2 bottom-2 left-[0.6875rem] w-px bg-line-strong" />
      <m.span
        aria-hidden
        style={{ scaleY }}
        className="absolute top-2 bottom-2 left-[0.6875rem] w-px origin-top bg-gradient-to-b from-purple to-cyan"
      />

      {steps.map((step, index) => (
        <li key={step.name} className="relative pb-14 pl-12 last:pb-0 sm:pl-16">
          <m.span
            aria-hidden
            initial={{ scale: 0.4, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -30% 0px" }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            data-reveal
            className="absolute top-1 left-0 flex size-6 items-center justify-center rounded-full border border-cyan/60 bg-ink"
          >
            <span className="size-2 rounded-full bg-cyan" />
          </m.span>

          <m.div
            data-reveal
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -18% 0px" }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          >
            <p className="label-mono">
              <span aria-hidden>0{index + 1} — </span>
              {step.name}
            </p>
            <h3 className="mt-3 text-2xl sm:text-3xl">{step.title}</h3>
            <p className="mt-3 max-w-xl text-muted">{step.body}</p>
            <p className="mt-4 text-[0.9375rem] text-cyan">{step.note}</p>
          </m.div>
        </li>
      ))}
    </ol>
  );
}
