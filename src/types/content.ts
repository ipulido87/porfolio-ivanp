export type NavLink = { href: string; label: string };

export type LegalSection = {
  heading: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

export type LegalDocument = {
  title: string;
  description: string;
  intro: string;
  sections: readonly LegalSection[];
};
