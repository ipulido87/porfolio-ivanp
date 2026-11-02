"use client";

import { useEffect, useRef } from "react";
import { createGlobeRenderer, type GlobeTier } from "./renderer";
import { buildScene, INITIAL_VIEW, REVOLUTION_MS } from "./scene";

const MAX_DPR = 2;
const POINTER_YAW = 0.11;
const POINTER_PITCH = 0.07;
/** Frames slower than this, sustained, drop the globe to the lighter tier. */
const SLOW_FRAME_MS = 26;
const SAMPLE_FRAMES = 45;
const LIGHT_TIER_FRAME_MS = 1000 / 31;

export function GlobeCanvas({ onReady }: { onReady: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createGlobeRenderer(canvas, buildScene());
    // No 2D context: the static poster simply stays in place.
    if (!renderer) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let tier: GlobeTier = window.innerWidth < 768 ? 1 : 0;
    let raf = 0;
    let running = false;
    let onScreen = true;
    let announced = false;

    // Spin is accumulated rather than derived from the clock, so it resumes
    // from the same angle after the tab or the hero has been out of view.
    let spin = 0;
    let lastFrame = 0;
    let clock = 0;
    let slowFrames = 0;
    let sampled = 0;

    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };

    const measure = () => {
      const cssSize = canvas.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, tier === 0 ? MAX_DPR : 1.5);
      renderer.resize(cssSize, dpr);
    };

    const render = (animated: boolean) => {
      renderer.draw(
        {
          yaw: INITIAL_VIEW.yaw + spin + eased.x * POINTER_YAW,
          pitch: INITIAL_VIEW.pitch + eased.y * POINTER_PITCH,
          roll: INITIAL_VIEW.roll,
        },
        clock,
        animated,
        tier,
      );
      if (!announced) {
        announced = true;
        onReady();
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      // The first frame only sets the clock: with no previous frame there is no
      // elapsed time, and the lighter tier's frame cap would skip frames forever.
      if (lastFrame === 0) {
        lastFrame = now;
        return;
      }
      const elapsed = now - lastFrame;
      if (tier === 1 && elapsed < LIGHT_TIER_FRAME_MS) return;
      lastFrame = now;
      // A long gap means the tab stalled, not that the globe should jump.
      const dt = Math.min(elapsed, 100);

      if (tier === 0) {
        sampled += 1;
        if (elapsed > SLOW_FRAME_MS) slowFrames += 1;
        if (sampled === SAMPLE_FRAMES) {
          if (slowFrames > SAMPLE_FRAMES * 0.6) {
            tier = 1;
            measure();
          }
          sampled = 0;
          slowFrames = 0;
        }
      }

      spin += (dt / REVOLUTION_MS) * Math.PI * 2;
      clock += dt;
      const ease = 1 - Math.pow(0.0025, dt / 1000);
      eased.x += (pointer.x - eased.x) * ease;
      eased.y += (pointer.y - eased.y) * ease;
      render(true);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastFrame = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const sync = () => {
      const shouldRun = onScreen && !document.hidden && !reducedMotion.matches;
      if (shouldRun) start();
      else stop();
      if (reducedMotion.matches) {
        spin = 0;
        pointer.x = pointer.y = eased.x = eased.y = 0;
        render(false);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const resizeObserver = new ResizeObserver(() => {
      measure();
      render(!reducedMotion.matches);
    });
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry?.isIntersecting ?? true;
        sync();
      },
      { rootMargin: "80px" },
    );

    measure();
    render(false);
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    if (finePointer.matches && !reducedMotion.matches) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [onReady]);

  return <canvas ref={canvasRef} className="absolute inset-0 size-full" />;
}
