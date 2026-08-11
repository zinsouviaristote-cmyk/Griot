import { defineConfig } from "vitest/config";
import path from "node:path";

// Tests purement logiques (moteur de paroles) — pas de rendu React, donc pas
// besoin de jsdom : plus rapide, et hors de portée d'un bug d'environnement DOM.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
