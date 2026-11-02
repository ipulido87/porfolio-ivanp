import { expect, test } from "@playwright/test";
import { goToDetailsStep, goToProjectStep } from "./helpers";

test("the skip link is the first stop and jumps to the content", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await expect(page.getByRole("main")).toBeFocused();
});

test("the main navigation can be reached and used with the keyboard", async ({ page }) => {
  await page.goto("/");

  // Skip link, logo, then the first navigation entry.
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("navigation", { name: "Navegación principal" }).getByRole("link", { name: "Servicios" })).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/servicios$/);
});

test("focus is always visible", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  const outline = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineStyle);
  expect(outline).toBe("solid");
});

test("FAQ items open with the keyboard, and closed answers leave the tab order", async ({ page }) => {
  await page.goto("/");
  const question = page.getByRole("button", { name: "¿Cuánto cuesta un proyecto?" });
  const answer = page.getByText("Depende del alcance");

  await expect(answer).toBeHidden();
  await question.focus();
  await page.keyboard.press("Enter");

  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(answer).toBeVisible();

  await page.keyboard.press("Space");
  await expect(answer).toBeHidden();
});

test("the service options work as a radio group", async ({ page }) => {
  await page.goto("/contacto");
  await goToProjectStep(page);

  await page.getByRole("radio", { name: "Desarrollo web a medida" }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("radio", { name: "Desarrollo web a medida" })).toBeChecked();

  // Radix moves focus in a timeout and selects only if the arrow is still down,
  // so the key stays held until selection is observed. A fixed delay is racy
  // on a loaded machine, where browsers run queued input before timers.
  await page.keyboard.down("ArrowRight");
  await expect(page.getByRole("radio", { name: "Desarrollo full stack" })).toBeFocused();
  await expect(page.getByRole("radio", { name: "Desarrollo full stack" })).toBeChecked();
  await page.keyboard.up("ArrowRight");
});

test("the consent checkbox toggles with Space", async ({ page }) => {
  await page.goto("/contacto");
  await goToDetailsStep(page);
  const consent = page.getByRole("checkbox");

  await consent.focus();
  await page.keyboard.press("Space");
  await expect(consent).toBeChecked();
});

test("the form can be completed with the keyboard alone, and focus follows each step", async ({ page }) => {
  await page.goto("/contacto");

  await page.getByRole("button", { name: "Necesito ayuda para construirlo" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Cuéntame qué está pasando" })).toBeFocused();

  await page.getByLabel(/^Tu proyecto/).focus();
  await page.keyboard.type("Necesito una aplicación de reservas para mi negocio.");
  await page.getByRole("button", { name: "Continuar" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "¿Cómo te respondo?" })).toBeFocused();
});

test("the honeypot is skipped when tabbing through the form", async ({ page }) => {
  await page.goto("/contacto");
  await goToDetailsStep(page);
  await page.getByRole("link", { name: "política de privacidad" }).focus();

  await page.keyboard.press("Tab");

  await expect(page.getByRole("button", { name: "Atrás" })).toBeFocused();
});
