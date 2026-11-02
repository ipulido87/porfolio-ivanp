"use client";

import { Button } from "@/components/ui/button";
import type { UiContent } from "@/content";

export function ErrorView({ copy, reset }: { copy: UiContent["error"]; reset: () => void }) {
  return (
    <section className="container-site flex min-h-svh flex-col items-start justify-center pt-24">
      <p className="label-mono text-cyan">{copy.eyebrow}</p>
      <h1 className="mt-5 text-[length:var(--text-display)]">{copy.title}</h1>
      <p className="mt-6 max-w-lg text-lg text-muted">{copy.description}</p>
      <Button size="lg" className="mt-9" onClick={reset}>
        {copy.action}
      </Button>
    </section>
  );
}
