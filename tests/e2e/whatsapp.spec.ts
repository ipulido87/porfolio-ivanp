import { expect, test } from "@playwright/test";

const MESSAGE = "Hola, he visto tu web y me gustaría hablar sobre un proyecto tecnológico.";

function expectWhatsAppHref(href: string | null) {
  const url = new URL(href ?? "");
  expect(url.origin + url.pathname).toBe("https://wa.me/34600000000");
  expect(url.searchParams.get("text")).toBe(MESSAGE);
}

for (const path of ["/", "/servicios", "/contacto"]) {
  test(`${path} offers the floating WhatsApp action`, async ({ page }) => {
    await page.goto(path);
    const link = page.getByTestId("whatsapp-floating");

    await expect(link).toBeVisible();
    expectWhatsAppHref(await link.getAttribute("href"));
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toHaveAccessibleName(/WhatsApp/);
  });
}

test("the closing CTA and the contact page offer WhatsApp in context", async ({ page }) => {
  await page.goto("/");
  expectWhatsAppHref(await page.getByRole("main").getByRole("link", { name: /Escríbeme por WhatsApp/ }).getAttribute("href"));

  await page.goto("/contacto");
  expectWhatsAppHref(await page.getByRole("main").getByRole("link", { name: /Escríbeme por WhatsApp/ }).getAttribute("href"));
});
