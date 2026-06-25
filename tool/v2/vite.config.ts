import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Build-time configuration. Runtime configuration (canonical URL, etc.)
// is injected into index.html via nginx's `envsubst` at container start.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
