import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import * as fs from "node:fs/promises"; // ← 修正: promises（複数）
import * as path from "node:path"; // ← @types/node で型が入る

const app = new Hono();

// 静的配信（本番のみ有効にする例）
if (import.meta.env.PROD) {
  app.use("/assets/*", serveStatic({ root: "./dist/client" }));
  app.use("/*.*", serveStatic({ root: "./dist/client" }));
}

// 単一ページ SSR
app.get("*", async (c) => {
  const url = c.req.url;

  if (import.meta.env.DEV) {
    // Dev: Vite プラグインが /src 参照や HMR を面倒みる
    const template = await fs.readFile(path.resolve("index.html"), "utf-8");
    // entry-server を直 import（プラグインが解決してくれる）
    const { render } = await import("/src/entry-server.tsx");
    const { appHtml, head = "" } = await render(url);
    const html = template
      .replace("<!--app-html-->", appHtml)
      .replace("</head>", `${head}</head>`);
    return c.html(html);
  } else {
    // Prod: dist のテンプレートとサーババンドルを使用
    const template = await fs.readFile(
      path.resolve("dist/client/index.html"),
      "utf-8",
    );
    const { render } = await import(
      path.resolve("dist/server/entry-server.js")
    );
    const { appHtml, head = "" } = await render(url);
    const html = template
      .replace("<!--app-html-->", appHtml)
      .replace("</head>", `${head}</head>`);
    return c.html(html);
  }
});

export default {
  port: Number(process.env.PORT || 5173),
  fetch: app.fetch,
};
