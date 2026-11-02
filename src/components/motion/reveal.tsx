"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const IN_VIEW = { once: true, margin: "0px 0px -12% 0px" } as const;

type RevealProps = { children: ReactNode; className?: string; delay?: number; y?: number };

/** Fades content up the first time it enters the viewport. */
export function Reveal({ children, className, delay = 0, y = 26 }: RevealProps) {
  return (
    <m.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={IN_VIEW}
      transition={{ duration: 0.85, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </m.div>
  );
}

/** Reveals children one after another. Pair with `StaggerItem`. */
export function Stagger({ children, className, gap = 0.09 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={IN_VIEW}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      data-reveal
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
      }}
    >
      {children}
    </m.div>
  );
}

/** Wipes an image in from the bottom. */
export function ImageReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <m.div
      data-reveal
      className={className}
      initial={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }}
      whileInView={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)" }}
      viewport={IN_VIEW}
      transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
    >
      {children}
    </m.div>
  );
}
