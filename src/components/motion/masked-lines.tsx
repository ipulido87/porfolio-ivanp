"use client";

import * as m from "motion/react-m";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "./reveal";

type Line = { text: string; accent?: boolean };

/**
 * Staggered heading reveal: each line rises from behind a mask on page load.
 * The full text is in the server HTML, so it remains the LCP element.
 */
export function MaskedLines({ lines, delay = 0.1 }: { lines: readonly Line[]; delay?: number }) {
  return (
    <>
      {lines.map((line, index) => (
        <span key={line.text} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
          <m.span
            data-reveal
            className={cn("block", line.accent && "text-gradient")}
            initial={{ y: "108%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.05, delay: delay + index * 0.12, ease: EASE_OUT_EXPO }}
          >
            {line.text}
          </m.span>
        </span>
      ))}
    </>
  );
}
