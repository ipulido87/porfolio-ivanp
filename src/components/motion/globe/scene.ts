import { createRng, dot, latLonToVec, normalize, slerp, type Vec3 } from "./math";

// Geometry for the globe, defined once on the unit sphere. Everything is
// deterministic, so the server poster and the live canvas draw the same world.

export const GLOBE_SEED = 20261102;
/** One revolution around the vertical axis. */
export const REVOLUTION_MS = 40_000;
/** Resting orientation: Mallorca's latitude rolled towards the camera. */
export const INITIAL_VIEW = { yaw: -0.42, pitch: 0.42, roll: -0.2 };
/** Silhouette radius as a fraction of half the canvas: room for halo and particles. */
export const SILHOUETTE_FRACTION = 0.74;

const HOME = latLonToVec(39.57, 2.65);

export type Polyline = { start: number; count: number; tone: "purple" | "cyan" };
export type Hub = { position: Vec3; tone: "purple" | "cyan"; home: boolean };
export type Route = { from: number; to: number; line: Polyline };
export type Particle = {
  radius: number;
  u: Vec3;
  v: Vec3;
  angle: number;
  speed: number;
  twinkle: number;
  size: number;
};

export type GlobeScene = {
  /** Abstract "land": a dot matrix, xyz triplets. */
  dots: Float32Array;
  /** Latitude/longitude wireframe: vertices plus [a, b] index pairs. */
  gridVertices: Float32Array;
  gridSegments: Uint16Array;
  /** The same wireframe as vertex runs, for the coarser static poster. */
  gridLines: { start: number; count: number }[];
  hubs: Hub[];
  /** Surface mesh and lifted arcs share one vertex buffer. */
  pathVertices: Float32Array;
  meshLines: Polyline[];
  routes: Route[];
  particles: Particle[];
};

/** Smooth pseudo-noise on the sphere: overlapping waves form continent-like blobs. */
function createLandField(rng: () => number) {
  const waves = Array.from({ length: 9 }, () => {
    const direction = normalize([rng() - 0.5, rng() - 0.5, rng() - 0.5]);
    const frequency = 1.6 + rng() * 3.4;
    return {
      k: [direction[0] * frequency, direction[1] * frequency, direction[2] * frequency] as Vec3,
      phase: rng() * Math.PI * 2,
      weight: 1 / frequency,
    };
  });
  return (p: Vec3) => waves.reduce((sum, w) => sum + w.weight * Math.sin(dot(w.k, p) + w.phase), 0);
}

function buildDots(isLand: (p: Vec3) => boolean, samples: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const out: number[] = [];
  for (let i = 0; i < samples; i++) {
    const y = 1 - ((i + 0.5) / samples) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const p: Vec3 = [Math.cos(theta) * ring, y, Math.sin(theta) * ring];
    if (isLand(p)) out.push(...p);
  }
  return new Float32Array(out);
}

function buildGrid() {
  const vertices: number[] = [];
  const segments: number[] = [];
  const lines: { start: number; count: number }[] = [];
  const addRing = (count: number, at: (t: number) => Vec3, closed: boolean) => {
    const first = vertices.length / 3;
    lines.push({ start: first, count });
    for (let i = 0; i < count; i++) {
      vertices.push(...at(i / (closed ? count : count - 1)));
      if (i > 0) segments.push(first + i - 1, first + i);
    }
    if (closed) segments.push(first + count - 1, first);
  };

  for (let lat = -60; lat <= 60; lat += 20) {
    addRing(72, (t) => latLonToVec(lat, t * 360), true);
  }
  for (let lon = 0; lon < 360; lon += 20) {
    addRing(37, (t) => latLonToVec(-84 + t * 168, lon), false);
  }
  return { vertices: new Float32Array(vertices), segments: new Uint16Array(segments), lines };
}

function pickHubs(isLand: (p: Vec3) => boolean, rng: () => number, count: number): Hub[] {
  const hubs: Hub[] = [{ position: HOME, tone: "cyan", home: true }];
  const minSpacing = Math.cos(0.3);
  for (let attempt = 0; attempt < 4000 && hubs.length < count; attempt++) {
    const p = normalize([rng() - 0.5, rng() - 0.5, rng() - 0.5]);
    if (Math.abs(p[1]) > 0.86 || !isLand(p)) continue;
    if (hubs.some((h) => dot(h.position, p) > minSpacing)) continue;
    hubs.push({ position: p, tone: rng() > 0.62 ? "cyan" : "purple", home: false });
  }
  return hubs;
}

function buildPaths(hubs: Hub[], rng: () => number) {
  const vertices: number[] = [];

  const addPath = (a: Vec3, b: Vec3, samples: number, lift: number, tone: Polyline["tone"]): Polyline => {
    const start = vertices.length / 3;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const p = slerp(a, b, t);
      const height = 1 + lift * Math.sin(t * Math.PI);
      vertices.push(p[0] * height, p[1] * height, p[2] * height);
    }
    return { start, count: samples + 1, tone };
  };

  // Mesh: each hub links to its two nearest neighbours, hugging the surface.
  const seen = new Set<string>();
  const meshLines: Polyline[] = [];
  hubs.forEach((hub, i) => {
    hubs
      .map((other, j) => ({ j, closeness: dot(hub.position, other.position) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => b.closeness - a.closeness)
      .slice(0, 2)
      .forEach(({ j }) => {
        const key = [Math.min(i, j), Math.max(i, j)].join("-");
        if (seen.has(key)) return;
        seen.add(key);
        meshLines.push(addPath(hub.position, hubs[j]!.position, 10, 0.012, "purple"));
      });
  });

  // Routes: lifted arcs. The home node gets a few guaranteed connections.
  const routes: Route[] = [];
  const addRoute = (from: number, to: number) => {
    const a = hubs[from]!.position;
    const b = hubs[to]!.position;
    const angle = Math.acos(Math.min(1, Math.max(-1, dot(a, b))));
    // Very long hops would lift into big loops that read as noise around the sphere.
    if (angle < 0.35 || angle > 1.5) return;
    const tone = rng() > 0.45 ? "cyan" : "purple";
    routes.push({ from, to, line: addPath(a, b, 32, 0.05 + angle * 0.1, tone) });
  };
  for (let i = 1; i < hubs.length; i += 3) addRoute(0, i);
  for (let i = 0; i < 26; i++) {
    const from = Math.floor(rng() * hubs.length);
    const to = Math.floor(rng() * hubs.length);
    if (from !== to) addRoute(from, to);
  }

  return { vertices: new Float32Array(vertices), meshLines, routes };
}

function buildParticles(rng: () => number, count: number): Particle[] {
  return Array.from({ length: count }, () => {
    const tilt = (rng() - 0.5) * 0.9;
    const u: Vec3 = [1, 0, 0];
    const v = normalize([0, Math.sin(tilt), Math.cos(tilt)]);
    return {
      radius: 1.1 + rng() * 0.28,
      u,
      v,
      angle: rng() * Math.PI * 2,
      speed: (0.00002 + rng() * 0.00005) * (rng() > 0.5 ? 1 : -1),
      twinkle: rng() * Math.PI * 2,
      size: 0.6 + rng() * rng() * 1.5,
    };
  });
}

export function buildScene(): GlobeScene {
  const rng = createRng(GLOBE_SEED);
  const field = createLandField(rng);
  // A high threshold over a dense lattice gives distinct clusters, not a uniform
  // dot ball. Mallorca always sits on "land" so the home node has a landmass.
  const homeReach = Math.cos(0.2);
  const isLand = (p: Vec3) => field(p) > 0.16 || dot(p, HOME) > homeReach;

  const dots = buildDots(isLand, 7000);
  const grid = buildGrid();
  const hubs = pickHubs(isLand, rng, 30);
  const paths = buildPaths(hubs, rng);

  return {
    dots,
    gridVertices: grid.vertices,
    gridSegments: grid.segments,
    gridLines: grid.lines,
    hubs,
    pathVertices: paths.vertices,
    meshLines: paths.meshLines,
    routes: paths.routes,
    particles: buildParticles(rng, 64),
  };
}
