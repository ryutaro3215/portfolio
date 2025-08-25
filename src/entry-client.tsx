import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root")!;
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
