// functions/[[path]].ts
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";

type Bindings = { ASSETS: Fetcher };

const app = new Hono<{ Bindings: Bindings }>();

// 静的資産は ASSETS に委譲
app.get("/assets/*", (c) => c.env.ASSETS.fetch(c.req.raw));
app.get("/*.*", (c) => c.env.ASSETS.fetch(c.req.raw));

// それ以外は SSR
app.get("*", async (c) => {
  const url = new URL(c.req.url);

  // index.html（テンプレ）は ASSETS から取得（pretty path で "/" を指定）
  const indexRes = await c.env.ASSETS.fetch(new Request(`${url.origin}/`));
  const template = await indexRes.text();

  // ← ここがポイント：相対 import（tsserver 2307 を回避）
  const { render } = await import("../src/entry-server");
  const { appHtml, head = "" } = await render(url.pathname);

  const html = template
    .replace("<!--app-html-->", appHtml)
    .replace("</head>", `${head}</head>`);

  return c.html(html);
});

export const onRequest = handle(app);
