import { expect, test } from "@playwright/test";
import { goToProjectStep } from "./helpers";

const PAGES = [
  { path: "/", heading: /Ideas que se convierten/ },
  { path: "/servicios", heading: /Todo lo que hace falta/ },
  { path: "/proyectos", heading: /Lo que construyo/ },
  { path: "/sobre-mi", heading: /Ingeniería de software/ },
  { path: "/contacto", heading: /Cuéntame/ },
  { path: "/privacidad", heading: /Política de privacidad/ },
  { path: "/cookies", heading: /Política de cookies/ },
  { path: "/aviso-legal", heading: /Aviso legal/ },
];

test.describe("pages", () => {
  for (const { path, heading } of PAGES) {
    test(`${path} renders one h1, landmarks and a canonical URL`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));

      await page.goto(path);

      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeAttached();
      await expect(page.locator("html")).toHaveAttribute("lang", "es");
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /localhost:3200/);
      expect(errors).toEqual([]);
    });
  }
});

test("the header navigates between sections", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Navegación principal" });

  await nav.getByRole("link", { name: "Servicios" }).click();
  await expect(page).toHaveURL(/\/servicios$/);
  await expect(nav.getByRole("link", { name: "Servicios" })).toHaveAttribute("aria-current", "page");

  await nav.getByRole("link", { name: "Proyectos" }).click();
  await expect(page).toHaveURL(/\/proyectos$/);

  await nav.getByRole("link", { name: "Sobre mí" }).click();
  await expect(page).toHaveURL(/\/sobre-mi$/);

  await nav.getByRole("link", { name: "Contacto" }).click();
  await expect(page).toHaveURL(/\/contacto$/);
});

test("the hero CTAs lead to the contact page and the services section", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Explorar servicios" }).click();
  await expect(page).toHaveURL(/#servicios$/);
  await expect(page.locator("#servicios")).toBeInViewport();

  await page.goto("/");
  await page.getByRole("main").getByRole("link", { name: "Cuéntame tu proyecto" }).first().click();
  await expect(page).toHaveURL(/\/contacto$/);
});

test("a service CTA preselects that service in the form", async ({ page }) => {
  await page.goto("/servicios");
  await page.locator("#calidad-para-software-con-ia").getByRole("link", { name: "Hablemos de este servicio" }).click();

  await expect(page).toHaveURL(/servicio=qa/);
  await goToProjectStep(page);
  await expect(page.getByRole("radio", { name: "Calidad y pruebas" })).toBeChecked();
});

test("LinkedIn is reachable from the footer, about and contact pages", async ({ page }) => {
  const href = "https://www.linkedin.com/in/ivan-pulido-764011236/";

  await page.goto("/");
  const footerLink = page.getByRole("contentinfo").getByRole("link", { name: /LinkedIn/ });
  await expect(footerLink).toHaveAttribute("href", href);
  await expect(footerLink).toHaveAttribute("rel", /noopener/);

  for (const path of ["/sobre-mi", "/contacto", "/en/about", "/en/contact"]) {
    await page.goto(path);
    await expect(page.getByRole("main").getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", href);
  }

  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(blocks.join("")).toContain(href);
});

test("the footer exposes the legal pages", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");

  await expect(footer.getByRole("link", { name: "Aviso legal" })).toHaveAttribute("href", "/aviso-legal");
  await expect(footer.getByRole("link", { name: "Privacidad" })).toHaveAttribute("href", "/privacidad");
  await expect(footer.getByRole("link", { name: "Cookies" })).toHaveAttribute("href", "/cookies");
});

test("projects are labelled as personal or concept", async ({ page }) => {
  await page.goto("/proyectos");

  await expect(page.locator("#parchebici").getByTestId("project-kind")).toHaveText("Proyecto personal");
  await expect(page.locator("#gestion-de-reservas").getByTestId("project-kind")).toHaveText("Concepto");
  await expect(page.locator("#mallorca-beach-and-beyond").getByTestId("project-kind")).toHaveText("Proyecto en producción");
});

test("real projects link to the live sites and show loaded screenshots", async ({ page }) => {
  await page.goto("/proyectos");

  const expected = {
    parchebici: "https://www.parchebici.com.co",
    rodamallorca: "https://www.rodamallorca.es",
    "mallorca-beach-and-beyond": "https://www.mallorcabeachandbeyond.com/es",
  };

  for (const [slug, href] of Object.entries(expected)) {
    const card = page.locator(`#${slug}`);
    await card.scrollIntoViewIfNeeded();
    await expect(card.getByRole("link", { name: /Visitar/ })).toHaveAttribute("href", href);
    await expect
      .poll(() => card.getByRole("img").evaluate((image: HTMLImageElement) => image.naturalWidth))
      .toBeGreaterThan(0);
  }
});

test("the homepage shows the real projects first", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#parchebici")).toBeAttached();
  await expect(page.locator("#mallorca-beach-and-beyond")).toBeAttached();
  await expect(page.locator("#gestion-de-reservas")).toHaveCount(0);
});

test("unknown routes show a Spanish 404 with the right status", async ({ page }) => {
  const response = await page.goto("/no-existe");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Esta página no existe.");
});

test.describe("seo", () => {
  test("publishes metadata and structured data", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Pulido Labs/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Mallorca/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.flatMap((block) => [JSON.parse(block)].flat()).map((item) => item["@type"]);
    expect(types).toEqual(expect.arrayContaining(["ProfessionalService", "WebSite", "FAQPage"]));
  });

  test("serves robots.txt and a complete sitemap", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /api/");
    expect(robots).toMatch(/Sitemap: .*sitemap\.xml/);

    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const { path } of PAGES) {
      if (path !== "/") expect(sitemap).toContain(path);
    }
  });

  test("keeps FAQ answers in the server-rendered HTML", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toContain("Depende del alcance");
  });

  test("sends security headers", async ({ request }) => {
    const headers = (await request.get("/")).headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});
