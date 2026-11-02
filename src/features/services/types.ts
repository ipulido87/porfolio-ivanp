import type { ServiceValue } from "@/lib/validations/lead";

export type ServiceVisual = "web" | "stack" | "flow" | "tests" | "compass" | "history";

export type ServiceArtLabels = { layers: readonly string[]; tests: readonly string[] };

export type Service = {
  /** Used as the anchor on /servicios. */
  slug: string;
  /** Option preselected in the contact form. */
  value: ServiceValue;
  title: string;
  summary: string;
  description: string;
  /** Selects both the icon and the card artwork. */
  visual: ServiceVisual;
  includes: readonly string[];
  idealFor: string;
};
