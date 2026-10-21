import { hydrateRoot } from "react-dom/client";
import { ExportApp } from "./app";
import type { ExportPage } from "./shims/page-context";

const root = document.getElementById("app");
if (root) {
  const page = (root.dataset.page ?? "home") as ExportPage;
  (globalThis as { __SWOBODA_PAGE__?: ExportPage }).__SWOBODA_PAGE__ = page;
  hydrateRoot(root, <ExportApp page={page} />);
}
