import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;
export const E2E_DB_FILE = path.join("test-results", "e2e.db").replaceAll("\\", "/");

// A production build with a real API and database. Resend is deliberately left
// unconfigured, which exercises the "email fails, lead is kept" path end to end.
const serverEnv = {
  NEXT_DIST_DIR: ".next-e2e",
  NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
  NEXT_PUBLIC_WHATSAPP_PHONE: "34600000000",
  NEXT_PUBLIC_CONTACT_EMAIL: "hola@example.com",
  ALLOW_LOCAL_DB: "1",
  TURSO_DATABASE_URL: `file:./${E2E_DB_FILE}`,
  IP_HASH_SECRET: "e2e-only-secret",
  RATE_LIMIT_MAX: "1000",
  RESEND_API_KEY: "",
};

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "es-ES",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } }],
  webServer: {
    command: `pnpm exec next build && node tests/e2e/prepare-db.mjs && pnpm exec next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    env: serverEnv,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
  },
});
