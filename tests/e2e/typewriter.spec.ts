import { expect, test, type Page } from "@playwright/test";

const output = (page: Page) => page.getByTestId("typewriter-output").first();

/** Samples the visible text on every animation frame until typing has finished. */
const sampleTyping = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<{ samples: string[]; heights: number[] }>((resolve) => {
        const samples: string[] = [];
        const heights: number[] = [];
        const form = document.querySelector("form")!;
        const started = performance.now();
        const tick = () => {
          const typed = document.querySelector('[data-testid="typewriter-output"]');
          if (typed) samples.push(typed.textContent ?? "");
          heights.push(Math.round(form.getBoundingClientRect().height));
          if (performance.now() - started < 1800) requestAnimationFrame(tick);
          else resolve({ samples, heights });
        };
        tick();
      }),
  );

test("types each step character by character, without moving the layout", async ({ page }) => {
  await page.goto("/contacto");
  await expect(page.getByRole("button", { name: "Necesito ayuda para construirlo" })).toBeVisible();
  await page.waitForTimeout(1800);

  await page.getByRole("button", { name: "Necesito ayuda para construirlo" }).click();
  const { samples, heights } = await sampleTyping(page);

  const distinct = [...new Set(samples)];
  expect(distinct.length).toBeGreaterThan(5);
  expect(distinct.some((text) => text.length > 0 && text.length < 10)).toBe(true);
  expect(new Set(heights).size).toBe(1);
  await expect(page.getByRole("heading", { name: "Cuéntame qué está pasando" })).toHaveText("Cuéntame qué está pasando");
});

test("options can be used before the typing has finished", async ({ page }) => {
  await page.goto("/contacto");

  await page.getByRole("button", { name: "Otra cosa" }).click({ force: true });

  await expect(page.getByTestId("contact-progress")).toHaveText("Paso 2 de 3");
});

test("going back shows the step at once, without retyping", async ({ page }) => {
  await page.goto("/contacto");
  await page.getByRole("button", { name: "Necesito ayuda para construirlo" }).click();
  await expect(page.getByTestId("contact-progress")).toHaveText("Paso 2 de 3");

  await page.getByRole("button", { name: "Atrás" }).click();

  await expect(page.getByRole("heading", { name: "¿En qué punto estás?" })).toBeVisible();
  await expect(page.getByTestId("typewriter-output")).toHaveCount(0);
});

test("announces the full text from the first frame", async ({ page }) => {
  await page.goto("/contacto");
  await page.getByRole("button", { name: "Necesito ayuda para construirlo" }).click();

  await expect(output(page)).toBeAttached();
  await expect(page.getByRole("heading", { name: "Cuéntame qué está pasando" })).toBeFocused();
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("never types", async ({ page }) => {
    await page.goto("/contacto");
    await page.waitForTimeout(400);

    await page.getByRole("button", { name: "Necesito ayuda para construirlo" }).click();

    const { samples } = await sampleTyping(page);
    expect(samples).toEqual([]);
    await expect(page.getByRole("heading", { name: "Cuéntame qué está pasando" })).toBeVisible();
  });
});
