import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '/api'), // usually not needed if backend path matches
      },
      "/login": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
