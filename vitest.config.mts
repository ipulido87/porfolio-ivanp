import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const root = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@tests": path.join(root, "tests"),
      "@": path.join(root, "src"),
      "server-only": path.join(root, "tests/helpers/empty-module.ts"),
    },
  },
  test: {
    include: ["tests/{unit,component,integration}/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/helpers/setup.ts"],
    environment: "node",
    restoreMocks: true,
  },
});
