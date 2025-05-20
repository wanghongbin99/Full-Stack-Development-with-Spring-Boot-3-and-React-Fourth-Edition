import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '/api'), // usually not needed if backend path matches
      },
    },
  },
    resolve: {
    alias: {
      // 让所有 .css 导入都指向一个空的 mock 文件
      '\\.css$': path.resolve(__dirname, 'src/test/styleMock.ts'),
    }
  }

});
