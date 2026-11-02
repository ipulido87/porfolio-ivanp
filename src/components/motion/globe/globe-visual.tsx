"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const GlobeCanvas = dynamic(() => import("./globe-canvas").then((m) => m.GlobeCanvas), {
  ssr: false,
});

/**
 * Shows the server-rendered poster immediately (good for LCP and for no-JS
 * visitors) and crossfades to the canvas once its first frame is painted.
 */
export function GlobeVisual({ poster, label, className }: { poster: ReactNode; label: string; className?: string }) {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <div
      role="img"
      aria-label={label}
      data-testid="hero-globe"
      data-ready={ready}
      className={cn("relative aspect-square w-full", className)}
    >
      <div className={cn("absolute inset-0 transition-opacity duration-700", ready && "opacity-0")}>{poster}</div>
      <div className={cn("absolute inset-0 opacity-0 transition-opacity duration-700", ready && "opacity-100")}>
        <GlobeCanvas onReady={onReady} />
      </div>
    </div>
  );
}
