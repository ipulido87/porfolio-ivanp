// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { locales } from "@/config/i18n";
import { getContent } from "@/content";
import { ProjectCard } from "@/features/projects/project-card";
import { SERVICE_VALUES } from "@/lib/validations/lead";

const { contact, projects, services } = getContent();

describe("project cards", () => {
  it("labels each project as personal or concept", () => {
    for (const project of projects.items) {
      const { unmount } = render(<ProjectCard project={project} locale="es" />);
      expect(screen.getByTestId("project-kind")).toHaveTextContent(projects.kindLabels[project.kind]);
      unmount();
    }
  });

  it("flags placeholder art as illustrative", () => {
    render(<ProjectCard project={projects.items.find((project) => !project.image)!} locale="es" />);
    expect(screen.getByText(projects.labels.placeholder)).toBeInTheDocument();
  });

  it("gives every real project a screenshot and a safe external link", () => {
    for (const project of projects.items.filter((item) => item.kind !== "concept")) {
      const { unmount } = render(<ProjectCard project={project} locale="es" />);
      const link = screen.getByRole("link", { name: /Visitar/ });

      expect(link).toHaveAttribute("href", project.url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
      expect(screen.getByRole("img", { name: project.image!.alt })).toBeInTheDocument();
      expect(screen.queryByText(projects.labels.placeholder)).not.toBeInTheDocument();
      unmount();
    }
  });

  it("does not link concepts, which are not live products", () => {
    for (const project of projects.items.filter((item) => item.kind === "concept")) {
      expect(project.url).toBeUndefined();
    }
  });

  it("does not call Mallorca Beach & Beyond a personal project, in any language", () => {
    for (const locale of locales) {
      const project = getContent(locale).projects.items.find((item) => item.slug === "mallorca-beach-and-beyond");
      expect(project?.kind).toBe("live");
    }
  });

  it("includes the requested examples", () => {
    expect(projects.items.map((project) => project.slug)).toEqual(
      expect.arrayContaining(["parchebici", "rodamallorca", "gestion-de-reservas", "automatizacion-de-pruebas"]),
    );
  });
});

// Types catch a missing key; this also catches lists of different lengths.
function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shapeOf);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, shapeOf(item)]),
    );
  }
  return typeof value;
}

describe("translations", () => {
  it("gives English exactly the same structure as Spanish", () => {
    // Legal documents differ by design: the English ones add a "Spanish prevails" section.
    const comparable = (locale: (typeof locales)[number]) => {
      const { legalNotice: _a, privacyPolicy: _b, cookiesPolicy: _c, ...rest } = getContent(locale);
      return shapeOf(rest);
    };
    expect(comparable("en")).toEqual(comparable("es"));
  });

  it("keeps the same projects in the same order, with the same honesty labels", () => {
    const pick = (locale: (typeof locales)[number]) =>
      getContent(locale).projects.items.map(({ kind, image, url }) => ({ kind, src: image?.src, host: url && new URL(url).host }));
    expect(pick("en")).toEqual(pick("es"));
  });

  it("keeps service values and form options aligned", () => {
    const values = (locale: (typeof locales)[number]) => {
      const { form } = getContent(locale).contact;
      return [form.stageOptions, form.serviceOptions, form.budgetOptions].map((options) => options.map((option) => option.value));
    };
    expect(values("en")).toEqual(values("es"));
  });
});

describe("content integrity", () => {
  it("offers every service value in the form", () => {
    expect(contact.form.serviceOptions.map((option) => option.value).sort()).toEqual([...SERVICE_VALUES].sort());
  });

  it("links each service to a valid form option", () => {
    for (const service of services.items) expect(SERVICE_VALUES).toContain(service.value);
  });
});
