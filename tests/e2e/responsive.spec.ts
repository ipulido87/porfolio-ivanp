import { expect, test } from "@playwright/test";

const PATHS = ["/", "/servicios", "/proyectos", "/sobre-mi", "/contacto", "/privacidad"];
const WIDTHS = [
  { name: "small phone", width: 320, height: 640 },
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "small laptop", width: 1024, height: 700 },
];

for (const viewport of WIDTHS) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const path of PATHS) {
      test(`${path} has no horizontal scroll`, async ({ page }) => {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("replaces the desktop navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("navigation", { name: "Navegación principal" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Abrir menú" })).toBeVisible();
  });

  test("navigates and closes itself", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Abrir menú" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog.getByRole("link", { name: /Proyectos/ }).click();

    await expect(page).toHaveURL(/\/proyectos$/);
    await expect(dialog).toBeHidden();
  });

  test("traps focus and closes with Escape", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Abrir menú" });

    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("gives interactive targets at least 44px", async ({ page }) => {
    await page.goto("/");

    for (const target of [
      page.getByRole("button", { name: "Abrir menú" }),
      page.getByRole("main").getByRole("link", { name: "Cuéntame tu proyecto" }).first(),
    ]) {
      const box = await target.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
});
