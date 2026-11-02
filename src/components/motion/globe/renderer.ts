import { HORIZON_Z, normalize, perspective, rotationMatrix, sphereRadiusFor, type Mat3, type Vec3 } from "./math";
import { SILHOUETTE_FRACTION, type GlobeScene, type Polyline, type Route } from "./scene";

// Painter's-algorithm canvas renderer. Depth comes from drawing in three layers:
// back hemisphere, a translucent sphere body that dims it, then front hemisphere.
// Everything expensive (halo, body, rim, glows) is pre-rendered into sprites and
// geometry is batched by brightness, so a frame costs a handful of fill calls.

export type GlobeView = { yaw: number; pitch: number; roll: number };
/** 0: full detail. 1: lighter geometry, for small screens or slow devices. */
export type GlobeTier = 0 | 1;

export type GlobeRenderer = {
  resize: (cssSize: number, dpr: number) => void;
  draw: (view: GlobeView, timeMs: number, animated: boolean, tier: GlobeTier) => void;
};

type Pulse = { route: Route; startedAt: number; duration: number };
type Ripple = { position: Vec3; startedAt: number };

const LIGHT = normalize([-0.55, 0.62, 0.56]);

/** From shadowed purple to lit cyan. Index = brightness bucket. */
const DOT_PALETTE = [
  "rgba(108,84,214,0.34)",
  "rgba(126,96,240,0.52)",
  "rgba(139,92,246,0.78)",
  "rgba(140,128,250,0.88)",
  "rgba(92,192,245,0.94)",
  "rgba(160,238,250,1)",
];
const GRID_PALETTE = [
  "rgba(139,110,246,0.05)",
  "rgba(139,110,246,0.11)",
  "rgba(139,120,246,0.17)",
  "rgba(110,170,246,0.24)",
];
const TONES = {
  purple: { line: "rgba(167,139,250,", core: "#b49cfa", rgb: "139,92,246" },
  cyan: { line: "rgba(103,232,249,", core: "#a5f3fc", rgb: "34,211,238" },
} as const;

const PULSE_GAP_MS = [1400, 3400] as const;
const PULSE_DURATION_MS = 2600;
const RIPPLE_MS = 1500;
const MAX_PULSES = 3;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function makeSprite(size: number, paint: (ctx: CanvasRenderingContext2D, size: number) => void) {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = Math.max(1, Math.ceil(size));
  const ctx = sprite.getContext("2d");
  if (ctx) paint(ctx, sprite.width);
  return sprite;
}

function makeGlow(rgb: string) {
  return makeSprite(64, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, `rgba(${rgb},0.9)`);
    g.addColorStop(0.22, `rgba(${rgb},0.38)`);
    g.addColorStop(0.55, `rgba(${rgb},0.08)`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

export function createGlobeRenderer(canvas: HTMLCanvasElement, scene: GlobeScene): GlobeRenderer | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Reused per-frame buffers: screen x, screen y and rotated depth.
  const gridScreen = new Float32Array(scene.gridVertices.length);
  const pathScreen = new Float32Array(scene.pathVertices.length);
  const glows = { purple: makeGlow(TONES.purple.rgb), cyan: makeGlow(TONES.cyan.rgb) };

  let size = 0;
  let center = 0;
  let silhouette = 0;
  let radius = 0;
  let dpr = 1;
  let backdrop: HTMLCanvasElement | null = null;
  let body: HTMLCanvasElement | null = null;
  let rim: HTMLCanvasElement | null = null;

  const pulses: Pulse[] = [];
  const ripples: Ripple[] = [];
  let nextPulseAt = 900;

  function buildSprites() {
    backdrop = makeSprite(size, (c, s) => {
      const halo = c.createRadialGradient(s / 2, s / 2, silhouette * 0.82, s / 2, s / 2, s / 2);
      halo.addColorStop(0, "rgba(139,92,246,0.3)");
      halo.addColorStop(0.3, "rgba(104,84,226,0.13)");
      halo.addColorStop(0.65, "rgba(34,211,238,0.035)");
      halo.addColorStop(1, "rgba(34,211,238,0)");
      c.fillStyle = halo;
      c.fillRect(0, 0, s, s);
    });

    body = makeSprite(silhouette * 2, (c, s) => {
      const r = s / 2;
      const g = c.createRadialGradient(r * 0.62, r * 0.56, r * 0.05, r, r, r);
      g.addColorStop(0, "rgba(38,31,76,0.84)");
      g.addColorStop(0.5, "rgba(18,15,38,0.86)");
      g.addColorStop(1, "rgba(9,8,20,0.9)");
      c.fillStyle = g;
      c.beginPath();
      c.arc(r, r, r, 0, Math.PI * 2);
      c.fill();
    });

    rim = makeSprite(silhouette * 2, (c, s) => {
      const r = s / 2;
      c.beginPath();
      c.arc(r, r, r, 0, Math.PI * 2);
      c.clip();

      // Even violet atmosphere around the limb.
      const limb = c.createRadialGradient(r, r, r * 0.8, r, r, r);
      limb.addColorStop(0, "rgba(139,92,246,0)");
      limb.addColorStop(0.8, "rgba(139,92,246,0.1)");
      limb.addColorStop(1, "rgba(160,120,255,0.42)");
      c.fillStyle = limb;
      c.fillRect(0, 0, s, s);

      // Cyan crescent on the lit side.
      const crescent = c.createRadialGradient(r * 1.14, r * 1.16, r * 0.86, r * 1.14, r * 1.16, r * 1.18);
      crescent.addColorStop(0, "rgba(34,211,238,0)");
      crescent.addColorStop(0.72, "rgba(34,211,238,0.06)");
      crescent.addColorStop(1, "rgba(120,235,250,0.42)");
      c.fillStyle = crescent;
      c.fillRect(0, 0, s, s);
    });
  }

  function resize(cssSize: number, nextDpr: number) {
    dpr = nextDpr;
    size = Math.round(cssSize * dpr);
    if (size === 0) return;
    canvas.width = canvas.height = size;
    center = size / 2;
    silhouette = center * SILHOUETTE_FRACTION;
    radius = sphereRadiusFor(silhouette);
    buildSprites();
  }

  function projectInto(m: Mat3, src: Float32Array, out: Float32Array) {
    for (let i = 0; i < src.length; i += 3) {
      const [x, y, z] = [src[i]!, src[i + 1]!, src[i + 2]!];
      const rz = m[6] * x + m[7] * y + m[8] * z;
      const s = perspective(rz) * radius;
      out[i] = center + (m[0] * x + m[1] * y + m[2] * z) * s;
      out[i + 1] = center - (m[3] * x + m[4] * y + m[5] * z) * s;
      out[i + 2] = rz;
    }
  }

  function drawGrid(front: boolean, frontPaths: Path2D[], backPath: Path2D) {
    ctx!.lineWidth = Math.max(0.6, 0.7 * dpr);
    if (!front) {
      ctx!.strokeStyle = "rgba(150,130,250,0.2)";
      ctx!.stroke(backPath);
      return;
    }
    frontPaths.forEach((path, i) => {
      ctx!.strokeStyle = GRID_PALETTE[i]!;
      ctx!.stroke(path);
    });
  }

  function batchGrid() {
    const frontPaths = GRID_PALETTE.map(() => new Path2D());
    const backPath = new Path2D();
    const seg = scene.gridSegments;
    for (let i = 0; i < seg.length; i += 2) {
      const a = seg[i]! * 3;
      const b = seg[i + 1]! * 3;
      const z = (gridScreen[a + 2]! + gridScreen[b + 2]!) / 2;
      const target = z <= HORIZON_Z ? backPath : frontPaths[Math.min(3, Math.floor(clamp01(z) * 4))]!;
      target.moveTo(gridScreen[a]!, gridScreen[a + 1]!);
      target.lineTo(gridScreen[b]!, gridScreen[b + 1]!);
    }
    return { frontPaths, backPath };
  }

  function drawDots(m: Mat3, tier: GlobeTier) {
    const stride = tier === 0 ? 3 : 6;
    const frontBuckets = DOT_PALETTE.map(() => new Path2D());
    const back = new Path2D();
    const dots = scene.dots;
    const base = Math.max(1, silhouette / 230);

    for (let i = 0; i < dots.length; i += stride) {
      const [x, y, z] = [dots[i]!, dots[i + 1]!, dots[i + 2]!];
      const rx = m[0] * x + m[1] * y + m[2] * z;
      const ry = m[3] * x + m[4] * y + m[5] * z;
      const rz = m[6] * x + m[7] * y + m[8] * z;
      const p = perspective(rz);
      const sx = center + rx * p * radius;
      const sy = center - ry * p * radius;

      if (rz <= HORIZON_Z) {
        const d = base * 0.8;
        back.rect(sx, sy, d, d);
        continue;
      }
      const lit = rx * LIGHT[0] + ry * LIGHT[1] + rz * LIGHT[2];
      const limb = clamp01((rz - HORIZON_Z) / 0.4);
      const bucket = Math.floor(clamp01(lit * 0.72 + 0.28) * limb * 5.99);
      const d = base * p * (1 + limb * 0.45);
      frontBuckets[bucket]!.rect(sx - d / 2, sy - d / 2, d, d);
    }
    return { frontBuckets, back };
  }

  function strokePolyline(line: Polyline, front: boolean, alpha: number) {
    ctx!.beginPath();
    let pen = false;
    for (let i = 0; i < line.count; i++) {
      const o = (line.start + i) * 3;
      if (pathScreen[o + 2]! > HORIZON_Z !== front) {
        pen = false;
        continue;
      }
      if (pen) ctx!.lineTo(pathScreen[o]!, pathScreen[o + 1]!);
      else ctx!.moveTo(pathScreen[o]!, pathScreen[o + 1]!);
      pen = true;
    }
    ctx!.strokeStyle = `${TONES[line.tone].line}${alpha})`;
    ctx!.stroke();
  }

  function drawHubs(m: Mat3, front: boolean, timeMs: number, animated: boolean) {
    for (const hub of scene.hubs) {
      const [x, y, z] = hub.position;
      const rz = m[6] * x + m[7] * y + m[8] * z;
      if (rz > HORIZON_Z !== front) continue;
      const p = perspective(rz);
      const sx = center + (m[0] * x + m[1] * y + m[2] * z) * p * radius;
      const sy = center - (m[3] * x + m[4] * y + m[5] * z) * p * radius;
      const limb = front ? clamp01((rz - HORIZON_Z) / 0.28) : 0.35;
      const breathe = animated ? 0.85 + 0.15 * Math.sin(timeMs * 0.0018 + x * 9) : 1;
      const glow = silhouette * (hub.home ? 0.2 : 0.105) * p * breathe;

      ctx!.globalAlpha = limb * (hub.home ? 1 : 0.85);
      ctx!.drawImage(glows[hub.tone], sx - glow / 2, sy - glow / 2, glow, glow);

      const core = Math.max(1.1, silhouette * (hub.home ? 0.0085 : 0.0052)) * p;
      ctx!.fillStyle = hub.home ? "#ffffff" : TONES[hub.tone].core;
      ctx!.beginPath();
      ctx!.arc(sx, sy, core, 0, Math.PI * 2);
      ctx!.fill();
    }
    ctx!.globalAlpha = 1;
  }

  /** A circle lying on the sphere, so it foreshortens correctly near the limb. */
  function drawSurfaceRing(m: Mat3, position: Vec3, angularRadius: number, alpha: number, tone: "purple" | "cyan") {
    const helper: Vec3 = Math.abs(position[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
    const u = normalize([
      position[1] * helper[2] - position[2] * helper[1],
      position[2] * helper[0] - position[0] * helper[2],
      position[0] * helper[1] - position[1] * helper[0],
    ]);
    const v: Vec3 = [
      position[1] * u[2] - position[2] * u[1],
      position[2] * u[0] - position[0] * u[2],
      position[0] * u[1] - position[1] * u[0],
    ];
    ctx!.beginPath();
    for (let i = 0; i <= 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      const c = Math.cos(a) * angularRadius;
      const s = Math.sin(a) * angularRadius;
      const [x, y, z] = normalize([
        position[0] + u[0] * c + v[0] * s,
        position[1] + u[1] * c + v[1] * s,
        position[2] + u[2] * c + v[2] * s,
      ]);
      const rz = m[6] * x + m[7] * y + m[8] * z;
      if (rz <= HORIZON_Z) return;
      const p = perspective(rz) * radius;
      const sx = center + (m[0] * x + m[1] * y + m[2] * z) * p;
      const sy = center - (m[3] * x + m[4] * y + m[5] * z) * p;
      if (i === 0) ctx!.moveTo(sx, sy);
      else ctx!.lineTo(sx, sy);
    }
    ctx!.lineWidth = Math.max(0.8, 1 * dpr);
    ctx!.strokeStyle = `${TONES[tone].line}${alpha})`;
    ctx!.stroke();
  }

  function updateEffects(timeMs: number) {
    if (timeMs >= nextPulseAt && pulses.length < MAX_PULSES && scene.routes.length > 0) {
      const route = scene.routes[Math.floor(Math.random() * scene.routes.length)]!;
      pulses.push({ route, startedAt: timeMs, duration: PULSE_DURATION_MS * (0.8 + Math.random() * 0.5) });
      nextPulseAt = timeMs + PULSE_GAP_MS[0] + Math.random() * (PULSE_GAP_MS[1] - PULSE_GAP_MS[0]);
    }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const pulse = pulses[i]!;
      if (timeMs - pulse.startedAt >= pulse.duration) {
        ripples.push({ position: scene.hubs[pulse.route.to]!.position, startedAt: timeMs });
        pulses.splice(i, 1);
      }
    }
    for (let i = ripples.length - 1; i >= 0; i--) {
      if (timeMs - ripples[i]!.startedAt >= RIPPLE_MS) ripples.splice(i, 1);
    }
  }

  /** Bright head with a fading tail that travels along a lifted arc. */
  function drawPulses(timeMs: number, front: boolean) {
    const tailLength = 0.34;
    for (const pulse of pulses) {
      const { line } = pulse.route;
      const t = (timeMs - pulse.startedAt) / pulse.duration;
      const head = t * (1 + tailLength);
      const last = line.count - 1;
      const headIndex = Math.min(last, Math.floor(head * last));
      const tailIndex = Math.max(0, Math.floor((head - tailLength) * last));
      if (tailIndex >= headIndex) continue;

      for (let i = tailIndex; i < headIndex; i++) {
        const a = (line.start + i) * 3;
        const b = a + 3;
        if (pathScreen[b + 2]! > HORIZON_Z !== front) continue;
        const fade = (i - tailIndex) / (headIndex - tailIndex);
        ctx!.beginPath();
        ctx!.moveTo(pathScreen[a]!, pathScreen[a + 1]!);
        ctx!.lineTo(pathScreen[b]!, pathScreen[b + 1]!);
        ctx!.lineWidth = Math.max(1, (0.8 + fade * 1.1) * dpr);
        ctx!.strokeStyle = `${TONES[line.tone].line}${fade * 0.95})`;
        ctx!.stroke();
      }

      const o = (line.start + headIndex) * 3;
      if (head <= 1 && pathScreen[o + 2]! > HORIZON_Z === front) {
        const glow = silhouette * 0.075;
        ctx!.drawImage(glows[line.tone], pathScreen[o]! - glow / 2, pathScreen[o + 1]! - glow / 2, glow, glow);
      }
    }
  }

  function drawParticles(m: Mat3, front: boolean, timeMs: number, tier: GlobeTier) {
    const stride = tier === 0 ? 1 : 2;
    for (let i = 0; i < scene.particles.length; i += stride) {
      const q = scene.particles[i]!;
      const a = q.angle + timeMs * q.speed;
      const [c, s] = [Math.cos(a) * q.radius, Math.sin(a) * q.radius];
      const x = q.u[0] * c + q.v[0] * s;
      const y = q.u[1] * c + q.v[1] * s;
      const z = q.u[2] * c + q.v[2] * s;
      const rz = m[6] * x + m[7] * y + m[8] * z;
      if (rz > 0 !== front) continue;
      const p = perspective(rz);
      const sx = center + (m[0] * x + m[1] * y + m[2] * z) * p * radius;
      const sy = center - (m[3] * x + m[4] * y + m[5] * z) * p * radius;
      const d = q.size * silhouette * 0.0105 * p + 1.4;
      ctx!.globalAlpha = (0.32 + 0.38 * Math.sin(timeMs * 0.0012 + q.twinkle) ** 2) * (front ? 1 : 0.55);
      ctx!.drawImage(i % 3 === 0 ? glows.cyan : glows.purple, sx - d, sy - d, d * 2, d * 2);
    }
    ctx!.globalAlpha = 1;
  }

  function draw(view: GlobeView, timeMs: number, animated: boolean, tier: GlobeTier) {
    if (size === 0 || !backdrop || !body || !rim) return;
    const c = ctx!;
    const m = rotationMatrix(view.yaw, view.pitch, view.roll);

    projectInto(m, scene.gridVertices, gridScreen);
    projectInto(m, scene.pathVertices, pathScreen);
    if (animated) updateEffects(timeMs);

    const grid = batchGrid();
    const dots = drawDots(m, tier);

    c.clearRect(0, 0, size, size);
    c.drawImage(backdrop, 0, 0);

    // Layer 1: far hemisphere. The body drawn next dims all of it.
    c.lineCap = "round";
    drawParticles(m, false, timeMs, tier);
    drawGrid(false, grid.frontPaths, grid.backPath);
    c.fillStyle = "rgba(150,120,250,0.42)";
    c.fill(dots.back);
    c.lineWidth = Math.max(0.7, 0.8 * dpr);
    for (const route of scene.routes) strokePolyline(route.line, false, 0.34);
    drawPulses(timeMs, false);
    drawHubs(m, false, timeMs, animated);

    // Layer 2: the sphere body.
    c.drawImage(body, center - silhouette, center - silhouette, silhouette * 2, silhouette * 2);

    // Layer 3: near hemisphere.
    drawGrid(true, grid.frontPaths, grid.backPath);
    dots.frontBuckets.forEach((path, i) => {
      c.fillStyle = DOT_PALETTE[i]!;
      c.fill(path);
    });
    c.lineWidth = Math.max(0.7, 0.8 * dpr);
    for (const line of scene.meshLines) strokePolyline(line, true, 0.26);
    for (const route of scene.routes) strokePolyline(route.line, true, 0.24);
    drawPulses(timeMs, true);
    drawHubs(m, true, timeMs, animated);

    if (animated) {
      const home = scene.hubs[0]!;
      const phase = (timeMs % 3600) / 3600;
      drawSurfaceRing(m, home.position, 0.012 + phase * 0.13, (1 - phase) * 0.7, "cyan");
      for (const ripple of ripples) {
        const k = (timeMs - ripple.startedAt) / RIPPLE_MS;
        drawSurfaceRing(m, ripple.position, 0.01 + k * 0.09, (1 - k) * 0.8, "cyan");
      }
    }

    c.globalCompositeOperation = "lighter";
    c.drawImage(rim, center - silhouette, center - silhouette, silhouette * 2, silhouette * 2);
    c.globalCompositeOperation = "source-over";

    drawParticles(m, true, timeMs, tier);
  }

  return { resize, draw };
}
