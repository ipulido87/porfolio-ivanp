import type { ServiceValue } from "@/lib/validations/lead";

export type ServiceVisual = "web" | "flow" | "tests";

export type ServiceArtLabels = { tests: readonly string[] };

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
