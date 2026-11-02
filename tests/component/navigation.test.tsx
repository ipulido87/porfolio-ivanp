// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";
import { Accordion } from "@/components/ui/accordion";
import { ui } from "@/content/es/ui";

const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

describe("SiteHeader", () => {
  beforeEach(() => {
    pathname.current = "/";
  });

  it("lists every main link", () => {
    render(<SiteHeader ui={ui} locale="es" />);
    const nav = screen.getByRole("navigation", { name: ui.nav.label });

    for (const link of ui.nav.links) {
      expect(within(nav).getByRole("link", { name: link.label })).toHaveAttribute("href", link.href);
    }
  });

  it("marks the current page, including nested routes", () => {
    pathname.current = "/servicios/algo";
    render(<SiteHeader ui={ui} locale="es" />);
    const nav = screen.getByRole("navigation", { name: ui.nav.label });

    expect(within(nav).getByRole("link", { name: "Servicios" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Contacto" })).not.toHaveAttribute("aria-current");
  });

  it("links to the same page in the other language", () => {
    pathname.current = "/servicios";
    render(<SiteHeader ui={ui} locale="es" />);
    const link = screen.getByRole("link", { name: ui.nav.switchLanguage.label });

    expect(link).toHaveAttribute("href", "/en/services");
    expect(link).toHaveAttribute("hreflang", "en");
  });

  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    render(<SiteHeader ui={ui} locale="es" />);

    await user.click(screen.getByRole("button", { name: ui.nav.open }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("link", { name: /Proyectos/ })).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: ui.nav.close }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the mobile menu with Escape and restores focus", async () => {
    const user = userEvent.setup();
    render(<SiteHeader ui={ui} locale="es" />);
    const trigger = screen.getByRole("button", { name: ui.nav.open });

    await user.click(trigger);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes the mobile menu after choosing a link", async () => {
    const user = userEvent.setup();
    render(<SiteHeader ui={ui} locale="es" />);

    await user.click(screen.getByRole("button", { name: ui.nav.open }));
    const dialog = await screen.findByRole("dialog");
    const link = within(dialog).getByRole("link", { name: /Proyectos/ });
    link.addEventListener("click", (event) => event.preventDefault());
    await user.click(link);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Accordion", () => {
  const items = [
    { question: "¿Primera?", answer: "Respuesta uno" },
    { question: "¿Segunda?", answer: "Respuesta dos" },
  ];

  it("keeps answers in the DOM for crawlers while collapsed", () => {
    render(<Accordion items={items} />);
    expect(screen.getByText("Respuesta uno")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "¿Primera?" })).toHaveAttribute("aria-expanded", "false");
  });

  it("shows one answer at a time and works with the keyboard", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const first = screen.getByRole("button", { name: "¿Primera?" });
    const second = screen.getByRole("button", { name: "¿Segunda?" });

    first.focus();
    await user.keyboard("{Enter}");
    expect(first).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{ArrowDown}");
    expect(second).toHaveFocus();
    await user.keyboard(" ");

    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-expanded", "false");
  });
});
