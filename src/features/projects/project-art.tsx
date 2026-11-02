import type { ProjectVisual } from "./types";

// Original placeholder artwork. Set `image` on a project to replace it with a
// real screenshot. Abstract on purpose: it must never pass for a real product.

const LINE = "rgb(245 245 247 / 0.14)";
const SOFT = "rgb(245 245 247 / 0.08)";

function Marketplace() {
  const cards = [0, 1, 2, 3, 4, 5];
  return (
    <>
      <rect x="260" y="30" width="300" height="30" rx="15" fill={SOFT} />
      <circle cx="282" cy="45" r="6" stroke="#22d3ee" strokeWidth="1.5" />
      {cards.map((i) => {
        const x = 40 + (i % 3) * 180;
        const y = 86 + Math.floor(i / 3) * 124;
        return (
          <g key={i}>
            <rect x={x} y={y} width="160" height="108" rx="8" fill={SOFT} stroke={LINE} />
            <circle cx={x + 52} cy={y + 58} r="17" stroke="#b49cfa" strokeWidth="1.5" />
            <circle cx={x + 108} cy={y + 58} r="17" stroke="#b49cfa" strokeWidth="1.5" />
            <path
              d={`M${x + 52} ${y + 58}l22-28h18l16 28M${x + 74} ${y + 30}l14 28h-36`}
              stroke="#22d3ee"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </>
  );
}

function Routes() {
  return (
    <>
      {[60, 100, 140, 180, 220, 260].map((r) => (
        <ellipse key={r} cx="330" cy="180" rx={r * 1.25} ry={r * 0.72} stroke={LINE} />
      ))}
      <path
        d="M70 300c70-10 90-90 170-96s90 64 170 34 70-130 130-156"
        stroke="url(#project-route)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="70" cy="300" r="7" fill="#8b5cf6" />
      <circle cx="540" cy="82" r="7" fill="#22d3ee" />
      <circle cx="540" cy="82" r="16" stroke="#22d3ee" strokeOpacity="0.4" />
      <defs>
        <linearGradient id="project-route" x1="70" y1="300" x2="540" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </>
  );
}

function Calendar() {
  const busy = new Set([3, 9, 10, 16, 22, 23, 29]);
  const today = 17;
  return (
    <>
      <rect x="360" y="36" width="200" height="14" rx="7" fill={LINE} />
      {Array.from({ length: 35 }, (_, i) => {
        const x = 40 + (i % 7) * 75;
        const y = 70 + Math.floor(i / 7) * 54;
        const fill = i === today ? "#22d3ee" : busy.has(i) ? "rgb(139 92 246 / 0.42)" : SOFT;
        return <rect key={i} x={x} y={y} width="68" height="46" rx="6" fill={fill} />;
      })}
    </>
  );
}

function Pipeline() {
  const stages = ["#8b5cf6", "#8b5cf6", "#a78bfa", "#67e8f9", "#22d3ee"];
  return (
    <>
      <path d="M92 180h416" stroke={LINE} strokeWidth="2" />
      {stages.map((color, i) => {
        const x = 92 + i * 104;
        return (
          <g key={i}>
            <circle cx={x} cy="180" r="27" fill="#12121c" stroke={color} strokeWidth="1.5" />
            <path d={`M${x - 9} 180l6 7 13-15`} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x={x - 32} y="238" width="64" height="8" rx="4" fill={LINE} />
            <rect x={x - 22} y="256" width="44" height="8" rx="4" fill={SOFT} />
          </g>
        );
      })}
      <rect x="360" y="62" width="180" height="12" rx="6" fill={LINE} />
      <rect x="420" y="86" width="120" height="12" rx="6" fill={SOFT} />
    </>
  );
}

const ART: Record<ProjectVisual, () => React.ReactElement> = {
  marketplace: Marketplace,
  routes: Routes,
  calendar: Calendar,
  pipeline: Pipeline,
};

export function ProjectArt({ visual }: { visual: ProjectVisual }) {
  const Art = ART[visual];
  return (
    <svg viewBox="0 0 600 360" fill="none" className="size-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="600" height="360" fill="#12121c" />
      <Art />
    </svg>
  );
}
