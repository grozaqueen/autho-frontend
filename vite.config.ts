import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  /**
   * ВАЖНО:
   * - Бэкенд использует cookie-сессию.
   * - Чтобы не упираться в CORS и SameSite, в dev мы проксируем /api на бэкенд.
   */
  const proxyTarget = env.VITE_PROXY_TARGET || "http://localhost:8080";

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: { host: true, port: 4173 },
  };
});
