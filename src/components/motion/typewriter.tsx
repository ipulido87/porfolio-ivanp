"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const CHARS_PER_MS = 0.095;

/** How long a text takes to type, to chain several pieces one after another. */
export const typingDuration = (text: string) => Math.ceil(text.length / CHARS_PER_MS);

type TypewriterProps = { text: string; delay?: number; instant?: boolean };

/**
 * Types text out character by character. The full text stays in the DOM, so
 * assistive technology reads it once and its space is reserved from the first
 * frame: nothing below moves while typing.
 */
export function Typewriter({ text, delay = 0, instant = false }: TypewriterProps) {
  const reducedMotion = useReducedMotion();
  const skip = instant || reducedMotion === true;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (skip) return;
    const startedAt = performance.now() + delay;
    let frame = 0;

    const tick = () => {
      const next = Math.max(0, Math.floor((performance.now() - startedAt) * CHARS_PER_MS));
      setCount(Math.min(next, text.length));
      if (next < text.length) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, delay, skip]);

  if (skip || count >= text.length) return text;

  return (
    <span className="relative block">
      <span className="text-transparent">{text}</span>
      <span aria-hidden="true" data-testid="typewriter-output" className="absolute inset-0">
        {text.slice(0, count)}
        <span className="ml-0.5 inline-block h-[0.9em] w-px translate-y-[0.1em] bg-cyan" />
      </span>
    </span>
  );
}
