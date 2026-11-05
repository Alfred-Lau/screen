import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["lib/**/*.{ts,tsx}"],
      // Theme engine, docs (needs a Next.js runtime) and build-time registry
      // helpers are not unit-testable in jsdom and are excluded from the number.
      exclude: [
        "lib/**/*.d.ts",
        "lib/registry/**",
        "lib/theme/**",
        "lib/docs/**",
      ],
    },
  },
});
