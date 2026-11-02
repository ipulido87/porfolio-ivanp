import { expect, test, type Page } from "@playwright/test";

const globe = (page: Page) => page.getByTestId("hero-globe");

/** Compares two frames so the test proves pixels move, not just that a canvas exists. */
async function changedPixelRatio(page: Page, waitMs: number) {
  // Downscaled first: a full-size frame is millions of values to serialize.
  const capture = () =>
    page.evaluate(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="hero-globe"] canvas')!;
      const small = document.createElement("canvas");
      small.width = small.height = 240;
      const ctx = small.getContext("2d")!;
      ctx.drawImage(canvas, 0, 0, 240, 240);
      return Array.from(ctx.getImageData(0, 0, 240, 240).data);
    });
  const first = await capture();
  await page.waitForTimeout(waitMs);
  const second = await capture();

  let changed = 0;
  for (let i = 0; i < first.length; i += 4) {
    if (Math.abs(first[i]! - second[i]!) > 8) changed += 1;
  }
  return changed / (first.length / 4);
}

test("shows a static poster in the server HTML, before any JavaScript runs", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toMatch(/data-testid="hero-globe"[\s\S]*?<svg/);
});

test("has an accessible name and describes its content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("img", { name: /Globo digital/ })).toBeVisible();
});

test("takes over from the poster and rotates", async ({ page }) => {
  await page.goto("/");
  await expect(globe(page)).toHaveAttribute("data-ready", "true");

  expect(await changedPixelRatio(page, 700)).toBeGreaterThan(0.002);
});

test("sits to the right of the headline on desktop", async ({ page }) => {
  await page.goto("/");

  const heading = await page.getByRole("heading", { level: 1 }).boundingBox();
  const box = await globe(page).boundingBox();
  expect(box!.x + box!.width / 2).toBeGreaterThan(heading!.x + heading!.width / 2);
});

test("stops rendering when it leaves the viewport", async ({ page }) => {
  await page.goto("/");
  await expect(globe(page)).toHaveAttribute("data-ready", "true");

  await page.evaluate(() => window.scrollTo({ top: 3000, behavior: "instant" }));
  await page.waitForTimeout(300);

  expect(await changedPixelRatio(page, 500)).toBe(0);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("draws one still frame and never animates", async ({ page }) => {
    await page.goto("/");
    await expect(globe(page)).toHaveAttribute("data-ready", "true");
    await page.waitForTimeout(900);

    expect(await changedPixelRatio(page, 700)).toBe(0);
  });

  test("keeps all the page content visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explorar servicios" })).toBeVisible();
  });
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("rotates, on the lighter rendering tier", async ({ page }) => {
    await page.goto("/");
    await expect(globe(page)).toHaveAttribute("data-ready", "true");
    await globe(page).scrollIntoViewIfNeeded();

    expect(await changedPixelRatio(page, 900)).toBeGreaterThan(0.002);
  });

  test("stays inside the viewport", async ({ page }) => {
    await page.goto("/");
    await expect(globe(page)).toHaveAttribute("data-ready", "true");

    const box = await globe(page).boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("keeps the content readable and the globe visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Software que funciona.")).toBeVisible();
    await expect(globe(page).locator("svg")).toBeVisible();
    await expect(page.getByText("La tecnología debería resolver problemas, no crearlos.")).toBeVisible();
  });
});
