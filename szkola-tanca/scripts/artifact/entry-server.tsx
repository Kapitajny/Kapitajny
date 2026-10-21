import { renderToString } from "react-dom/server";
import { ExportApp } from "./app";
import type { ExportPage } from "./shims/page-context";

export function render(page: ExportPage): string {
  (globalThis as { __SWOBODA_PAGE__?: ExportPage }).__SWOBODA_PAGE__ = page;
  return renderToString(<ExportApp page={page} />);
}
