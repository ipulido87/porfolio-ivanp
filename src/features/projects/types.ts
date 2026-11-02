/**
 * `personal`: something real that I built or am building.
 * `live`: a real site in production, without claiming who it was built for.
 * `concept`: an illustrative example of the kind of work I can deliver.
 * Never mark a project as `personal` unless it exists.
 */
export type ProjectKind = "personal" | "live" | "concept";

export type ProjectVisual = "marketplace" | "routes" | "calendar" | "pipeline";

export type Project = {
  slug: string;
  name: string;
  kind: ProjectKind;
  category: string;
  summary: string;
  /** What the project covers. Describe scope only: no invented results. */
  scope: readonly string[];
  /** Leave empty until the real stack is confirmed. */
  stack: readonly string[];
  /** Placeholder artwork, shown while `image` is not set. */
  visual: ProjectVisual;
  /** Real screenshot in /public. Replaces the placeholder. */
  image?: { src: string; alt: string };
  /** Public URL, only when the project is live. */
  url?: string;
};
