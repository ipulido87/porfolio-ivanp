import { randomUUID } from "node:crypto";
import { createClient } from "@libsql/client";
import { expect, test } from "@playwright/test";
import { E2E_DB_FILE } from "../../playwright.config";

const PAGES = [
  { es: "/", en: "/en", heading: /Ideas that become/ },
  { es: "/servicios", en: "/en/services", heading: /Everything it takes/ },
  { es: "/proyectos", en: "/en/projects", heading: /What I build/ },
  { es: "/sobre-mi", en: "/en/about", heading: /AI software engineering/ },
  { es: "/contacto", en: "/en/contact", heading: /Tell me about/ },
  { es: "/privacidad", en: "/en/privacy", heading: /Privacy policy/ },
  { es: "/cookies", en: "/en/cookies", heading: /Cookie policy/ },
  { es: "/aviso-legal", en: "/en/legal-notice", heading: /Legal notice/ },
];

for (const { es, en, heading } of PAGES) {
  test(`${en} is in English and linked to its Spanish version`, async ({ page }) => {
    await page.goto(en);

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${en}$`));
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
      "href",
      new RegExp(`${es === "/" ? "localhost:3200" : es}$`),
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", new RegExp(`${en}$`));
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toBeAttached();
  });

  test(`the language switch keeps the visitor on ${es}`, async ({ page }) => {
    await page.goto(es);
    await page.getByTestId("language-switch").click();
    await expect(page).toHaveURL(new RegExp(`${en}$`));

    await page.getByTestId("language-switch").click();
    await expect(page).toHaveURL(new RegExp(`${es === "/" ? "localhost:3200/?" : es}$`));
  });
}

test("English pages contain no leftover Spanish navigation", async ({ page }) => {
  await page.goto("/en");

  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/en/services");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/en/privacy");
  await expect(page.getByRole("main")).not.toContainText("Cuéntame");
});

test("the English hero anchors to the services section", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("link", { name: "Explore services" }).click();

  await expect(page).toHaveURL(/#services$/);
  await expect(page.locator("#services")).toBeInViewport();
});

test("the English WhatsApp link has an English message", async ({ page }) => {
  await page.goto("/en");
  const href = await page.getByTestId("whatsapp-floating").getAttribute("href");

  expect(new URL(href!).searchParams.get("text")).toBe(
    "Hi, I saw your website and I'd like to talk about a technology project.",
  );
});

test("English project links go to the English version of the site", async ({ page }) => {
  await page.goto("/en/projects");

  await expect(page.locator("#mallorca-beach-and-beyond").getByRole("link", { name: /Visit/ })).toHaveAttribute(
    "href",
    "https://www.mallorcabeachandbeyond.com/en",
  );
  await expect(page.locator("#parchebici").getByTestId("project-kind")).toHaveText("Personal project");
});

test("unknown English routes show an English 404", async ({ page }) => {
  const response = await page.goto("/en/does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page doesn't exist.");
});

test("the sitemap lists both languages with alternates", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();

  for (const { es, en } of PAGES) {
    if (es !== "/") expect(sitemap).toContain(`${es}<`);
    expect(sitemap).toContain(`${en}<`);
  }
  expect(sitemap).toContain('hreflang="en"');
});

test("the English form validates, submits and records the language", async ({ page }) => {
  const email = `en-${randomUUID()}@example.com`;
  await page.goto("/en/contact");

  await page.getByRole("button", { name: "I need help building it" }).click();
  await expect(page.getByTestId("contact-progress")).toHaveText("Step 2 of 3");

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText(/Tell me a little more/)).toBeVisible();

  await page.getByLabel(/^Your project/).fill(`I need a booking platform for my business. Ref ${randomUUID()}`);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Enter your name.")).toBeVisible();

  await page.getByLabel(/^Name/).fill("Jane Smith");
  await page.getByLabel(/^Email/).fill(email);
  await page.getByRole("checkbox").click();
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByRole("heading", { name: "Message received. Thank you." })).toBeFocused();

  const client = createClient({ url: `file:./${E2E_DB_FILE}` });
  const { rows } = await client.execute({ sql: "SELECT locale, stage FROM leads WHERE email = ?", args: [email] });
  client.close();
  expect(rows[0]).toMatchObject({ locale: "en", stage: "build" });
});

test("the English legal pages say the Spanish text prevails", async ({ page }) => {
  await page.goto("/en/privacy");
  await expect(page.getByRole("main")).toContainText("the Spanish version prevails");
});
