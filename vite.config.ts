import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

/**
 * O app fala com o backend por `/api/*`, que o Vite encaminha em
 * desenvolvimento. Assim não há URL absoluta no código nem CORS no caminho —
 * em produção basta apontar esse prefixo para o serviço real.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.DIANA_API_URL ?? "http://localhost:8080",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
});
