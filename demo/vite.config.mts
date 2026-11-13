import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// The demo lives inside the library repo and imports components through the
// same "@/" alias the registry uses, so consumers see the real import paths.
export default defineConfig({
  root: dirname,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, ".."),
    },
  },
  server: {
    port: 4318,
  },
});
