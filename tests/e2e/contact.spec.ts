import { randomUUID } from "node:crypto";
import { createClient } from "@libsql/client";
import { expect, test, type Page } from "@playwright/test";
import { E2E_DB_FILE } from "../../playwright.config";
import { goToDetailsStep, goToProjectStep } from "./helpers";

async function fillForm(page: Page, email: string) {
  await goToProjectStep(page);
  await page.getByLabel(/^Tu proyecto/).fill(`Quiero automatizar la facturación de mi empresa. Ref ${randomUUID()}`);
  await page.getByRole("radio", { name: "Automatización con IA" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel(/^Nombre/).fill("Ana García");
  await page.getByLabel(/^Correo electrónico/).fill(email);
  await page.getByLabel(/^Empresa/).fill("Empresa Ejemplo");
  await page.getByRole("radio", { name: "3.000 € – 10.000 €" }).click();
  await page.getByRole("checkbox").click();
}

const submit = (page: Page) => page.getByRole("button", { name: "Enviar mensaje" }).click();

async function findLead(email: string) {
  const client = createClient({ url: `file:./${E2E_DB_FILE}` });
  const { rows } = await client.execute({ sql: "SELECT * FROM leads WHERE email = ?", args: [email] });
  client.close();
  return rows;
}

test.beforeEach(async ({ page }) => {
  await page.goto("/contacto");
  await expect(page.getByRole("form", { name: "Formulario de contacto" })).toBeVisible();
});

test("starts by asking where the visitor is, without asking for personal data", async ({ page }) => {
  await expect(page.getByTestId("contact-progress")).toHaveText("Paso 1 de 3");
  await expect(page.getByRole("heading", { name: "¿En qué punto estás?" })).toBeVisible();
  await expect(page.getByLabel(/^Correo electrónico/)).toHaveCount(0);
});

test("will not advance without describing the project", async ({ page }) => {
  await goToProjectStep(page);
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page.getByText(/Cuéntame algo más sobre el proyecto/)).toBeVisible();
  await expect(page.getByTestId("contact-progress")).toHaveText("Paso 2 de 3");
  await expect(page.getByLabel(/^Tu proyecto/)).toBeFocused();
  await expect(page.getByLabel(/^Tu proyecto/)).toHaveAttribute("aria-invalid", "true");
});

test("one click on Continue is enough after correcting an error", async ({ page }) => {
  await goToProjectStep(page);
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText(/Cuéntame algo más sobre el proyecto/)).toBeVisible();

  await page.getByLabel(/^Tu proyecto/).fill("Ahora sí describo el proyecto con suficiente detalle.");
  await expect(page.getByText(/Cuéntame algo más sobre el proyecto/)).toBeHidden();
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page.getByTestId("contact-progress")).toHaveText("Paso 3 de 3");
});

test("shows Spanish validation errors on the last step and focuses the first invalid field", async ({ page }) => {
  await goToDetailsStep(page);
  await submit(page);

  await expect(page.getByText("Escribe tu nombre.")).toBeVisible();
  await expect(page.getByText("Debes aceptar la política de privacidad para continuar.")).toBeVisible();
  await expect(page.getByLabel(/^Nombre/)).toBeFocused();
});

test("validates the email format", async ({ page }) => {
  await goToDetailsStep(page);
  await page.getByLabel(/^Correo electrónico/).fill("no-es-un-correo");
  await page.getByLabel(/^Correo electrónico/).blur();

  await expect(page.getByText(/Escribe un correo electrónico válido/)).toBeVisible();
});

test("keeps every answer when moving back and forward", async ({ page }) => {
  await goToDetailsStep(page, "Mi proyecto de prueba tiene suficiente longitud.");
  await page.getByLabel(/^Nombre/).fill("Ana García");

  await page.getByRole("button", { name: "Atrás" }).click();
  await expect(page.getByLabel(/^Tu proyecto/)).toHaveValue("Mi proyecto de prueba tiene suficiente longitud.");

  await page.getByRole("button", { name: "Atrás" }).click();
  await expect(page.getByRole("button", { name: "Necesito ayuda para construirlo" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Necesito ayuda para construirlo" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByLabel(/^Nombre/)).toHaveValue("Ana García");
});

test("stores the lead even though email delivery is unavailable", async ({ page }) => {
  const email = `lead-${randomUUID()}@example.com`;
  await fillForm(page, email);
  await submit(page);

  await expect(page.getByTestId("contact-success")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mensaje recibido. Gracias." })).toBeFocused();

  const rows = await findLead(email);
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({
    name: "Ana García",
    company: "Empresa Ejemplo",
    stage: "build",
    service: "ai",
    budget: "3k-10k",
    locale: "es",
    email_status: "failed",
    email_error: "email_not_configured",
  });
});

test("does not store a second copy of an identical message", async ({ request }) => {
  const email = `dup-${randomUUID()}@example.com`;
  const body = {
    stage: "build",
    name: "Ana García",
    email,
    service: "qa",
    message: "Necesito automatizar las pruebas de mi aplicación web.",
    consent: true,
    website: "",
  };

  const first = await request.post("/api/contact", { data: { ...body, submissionId: randomUUID() } });
  const second = await request.post("/api/contact", { data: { ...body, submissionId: randomUUID() } });

  expect(first.status()).toBe(201);
  expect(second.status()).toBe(200);
  expect(await findLead(email)).toHaveLength(1);
});

test("discards honeypot submissions without telling the bot", async ({ page }) => {
  const email = `bot-${randomUUID()}@example.com`;
  await fillForm(page, email);
  await page.locator("#website").evaluate((node: HTMLInputElement) => {
    node.value = "https://spam.example";
  });
  await submit(page);

  await expect(page.getByTestId("contact-success")).toBeVisible();
  expect(await findLead(email)).toHaveLength(0);
});

test("recovers from a server error without losing what was typed", async ({ page }) => {
  let attempts = 0;
  await page.route("/api/contact", async (route) => {
    attempts += 1;
    if (attempts === 1) {
      await route.fulfill({ status: 503, json: { ok: false, error: "server" } });
    } else {
      await route.fulfill({ status: 201, json: { ok: true } });
    }
  });

  await fillForm(page, "ana@example.com");
  await submit(page);

  await expect(page.getByTestId("contact-error")).toContainText("No he podido guardar tu mensaje");
  await expect(page.getByLabel(/^Nombre/)).toHaveValue("Ana García");

  await submit(page);
  await expect(page.getByTestId("contact-success")).toBeVisible();
});

test("returns to the right step when the server rejects a field", async ({ page }) => {
  await page.route("/api/contact", (route) =>
    route.fulfill({
      status: 400,
      json: { ok: false, error: "invalid", fieldErrors: { message: "El servidor ha rechazado este texto." } },
    }),
  );

  await fillForm(page, "ana@example.com");
  await submit(page);

  await expect(page.getByTestId("contact-progress")).toHaveText("Paso 2 de 3");
  await expect(page.getByText("El servidor ha rechazado este texto.")).toBeVisible();
});

test("explains rate limiting", async ({ page }) => {
  await page.route("/api/contact", (route) =>
    route.fulfill({ status: 429, json: { ok: false, error: "rate_limited", retryAfterSeconds: 60 } }),
  );

  await fillForm(page, "ana@example.com");
  await submit(page);

  await expect(page.getByTestId("contact-error")).toContainText("Espera unos minutos");
});

test("handles a lost connection", async ({ page }) => {
  await page.route("/api/contact", (route) => route.abort("failed"));

  await fillForm(page, "ana@example.com");
  await submit(page);

  await expect(page.getByTestId("contact-error")).toContainText("No hay conexión");
});

test("disables the button while sending", async ({ page }) => {
  await page.route("/api/contact", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    await route.fulfill({ status: 201, json: { ok: true } });
  });

  await fillForm(page, "ana@example.com");
  await submit(page);

  await expect(page.getByRole("button", { name: "Enviando…" })).toBeDisabled();
  await expect(page.getByTestId("contact-success")).toBeVisible();
});
