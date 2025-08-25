import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import devServer from "@hono/vite-dev-server"; // ← 追加
import bunAdapter from "@hono/vite-dev-server/bun"; // ← Bun 用

export default defineConfig({
  plugins: [
    react(),
    devServer({
      adapter: bunAdapter, // Bun で動かす
      entry: "server/app.ts", // Hono アプリの入口（下に定義）
    }),
  ],
  build: {
    outDir: "dist/client",
    ssrManifest: true,
    rollupOptions: { input: "index.html" },
  },
});
