import { expect, type Page } from "@playwright/test";

const MESSAGE = "Quiero automatizar la facturación de mi empresa con una integración a medida.";

export async function goToProjectStep(page: Page) {
  await page.getByRole("button", { name: "Necesito ayuda para construirlo" }).click();
  await expect(page.getByTestId("contact-progress")).toHaveText("Paso 2 de 3");
}

export async function goToDetailsStep(page: Page, message = MESSAGE) {
  await goToProjectStep(page);
  await page.getByLabel(/^Tu proyecto/).fill(message);
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByTestId("contact-progress")).toHaveText("Paso 3 de 3");
}
