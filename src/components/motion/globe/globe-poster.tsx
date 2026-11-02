import { useId } from "react";
import { cn } from "@/lib/utils";
import { HORIZON_Z, perspective, rotate, rotationMatrix, sphereRadiusFor, type Vec3 } from "./math";
import { buildScene, INITIAL_VIEW, SILHOUETTE_FRACTION } from "./scene";

const VIEWBOX = 1000;
const CENTER = VIEWBOX / 2;
const SILHOUETTE = CENTER * SILHOUETTE_FRACTION;
const RADIUS = sphereRadiusFor(SILHOUETTE);

/**
 * Static SVG of the globe, computed on the server from the same scene as the
 * canvas. It is the first paint, the no-JS version and the decorative globe in
 * the closing CTA. Rendered as a Server Component, so it ships no JavaScript.
 */
function buildPosterPaths() {
  const scene = buildScene();
  const m = rotationMatrix(INITIAL_VIEW.yaw, INITIAL_VIEW.pitch, INITIAL_VIEW.roll);

  const project = (v: Vec3) => {
    const [x, y, z] = rotate(m, v);
    const p = perspective(z) * RADIUS;
    return { x: Math.round(CENTER + x * p), y: Math.round(CENTER - y * p), z };
  };

  // One sample in four is enough at this size, and keeps the inline SVG small.
  let gridFront = "";
  let gridBack = "";
  for (const line of scene.gridLines) {
    let wasFront: boolean | null = null;
    let previous = "";
    for (let i = 0; i <= line.count; i += 4) {
      const o = (line.start + Math.min(i, line.count - 1)) * 3;
      const p = project([scene.gridVertices[o]!, scene.gridVertices[o + 1]!, scene.gridVertices[o + 2]!]);
      const point = `${p.x} ${p.y}`;
      const front = p.z > HORIZON_Z;
      const segment = front === wasFront ? `L${point}` : `M${previous || point}L${point}`;
      if (front) gridFront += segment;
      else gridBack += segment;
      wasFront = front;
      previous = point;
    }
  }

  // A sample of the front hemisphere: enough texture at a fraction of the bytes.
  let dotsLit = "";
  let dotsShade = "";
  for (let i = 0; i < scene.dots.length; i += 6) {
    const p = project([scene.dots[i]!, scene.dots[i + 1]!, scene.dots[i + 2]!]);
    if (p.z <= HORIZON_Z) continue;
    const d = `M${p.x} ${p.y}h0`;
    if (p.x < CENTER && p.y < CENTER + 80) dotsLit += d;
    else dotsShade += d;
  }

  const arcs = scene.routes.map(({ line }) => {
    let d = "";
    let pen = false;
    for (let i = 0; i < line.count; i += 2) {
      const o = (line.start + i) * 3;
      const p = project([scene.pathVertices[o]!, scene.pathVertices[o + 1]!, scene.pathVertices[o + 2]!]);
      if (p.z <= HORIZON_Z) {
        pen = false;
        continue;
      }
      d += `${pen ? "L" : "M"}${p.x} ${p.y}`;
      pen = true;
    }
    return { d, tone: line.tone };
  });

  const hubs = scene.hubs
    .map((hub) => ({ ...project(hub.position), tone: hub.tone, home: hub.home }))
    .filter((hub) => hub.z > HORIZON_Z + 0.04);

  return { gridFront, gridBack, dotsLit, dotsShade, arcs, hubs };
}

export function GlobePoster({ className }: { className?: string }) {
  const id = useId();
  const { gridFront, gridBack, dotsLit, dotsShade, arcs, hubs } = buildPosterPaths();

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      aria-hidden="true"
      focusable="false"
      className={cn("block size-full", className)}
      fill="none"
    >
      <defs>
        <radialGradient id={`${id}halo`} cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.26" />
          <stop offset="82%" stopColor="#6854e2" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}body`} cx="31%" cy="28%" r="74%">
          <stop offset="0%" stopColor="#261f4c" />
          <stop offset="50%" stopColor="#120f26" />
          <stop offset="100%" stopColor="#090814" />
        </radialGradient>
        <linearGradient id={`${id}rim`} x1="0.1" y1="0.05" x2="0.8" y2="0.95">
          <stop offset="0%" stopColor="#78ebfa" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#a078ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      <circle cx={CENTER} cy={CENTER} r={CENTER} fill={`url(#${id}halo)`} />
      <path d={gridBack} stroke="#9682fa" strokeOpacity="0.1" />
      <circle cx={CENTER} cy={CENTER} r={SILHOUETTE} fill={`url(#${id}body)`} fillOpacity="0.88" />
      <path d={gridFront} stroke="#8b78f6" strokeOpacity="0.16" />
      <path d={dotsShade} stroke="#8b6cf6" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
      <path d={dotsLit} stroke="#7fd4f8" strokeOpacity="0.9" strokeWidth="3" strokeLinecap="round" />
      {arcs.map((arc, i) => (
        <path
          key={i}
          d={arc.d}
          stroke={arc.tone === "cyan" ? "#67e8f9" : "#a78bfa"}
          strokeOpacity="0.32"
          strokeWidth="1.25"
        />
      ))}
      {hubs.map((hub, i) => (
        <g key={i} fill={hub.home ? "#ffffff" : hub.tone === "cyan" ? "#a5f3fc" : "#b49cfa"}>
          <circle cx={hub.x} cy={hub.y} r={hub.home ? 15 : 9} opacity="0.16" />
          <circle cx={hub.x} cy={hub.y} r={hub.home ? 4.5 : 3} />
        </g>
      ))}
      <circle cx={CENTER} cy={CENTER} r={SILHOUETTE - 1} stroke={`url(#${id}rim)`} strokeWidth="2" />
    </svg>
  );
}
