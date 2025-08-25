import { renderToString } from "react-dom/server";
import App from "./App";

export async function render(/* url: string */) {
  const appHtml = renderToString(<App />);
  return { appHtml, head: "" };
}
