import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// The demo lives inside the library repo and imports components through the
// same "@/" alias the registry uses, so consumers see the real import paths.
export default defineConfig({
  root: __dirname,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, ".."),
    },
  },
  server: {
    port: 4318,
  },
});
