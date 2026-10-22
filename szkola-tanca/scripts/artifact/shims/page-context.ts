/** Strona renderowana w eksporcie statycznym (ustawiana przed renderem po stronie serwera i klienta). */
export type ExportPage = "home" | "privacy" | "terms";

export const PAGE_PATHS: Record<ExportPage, { route: string; file: string }> = {
  home: { route: "/", file: "index.html" },
  privacy: { route: "/polityka-prywatnosci", file: "polityka-prywatnosci.html" },
  terms: { route: "/regulamin", file: "regulamin.html" },
};

export function currentPage(): ExportPage {
  return ((globalThis as { __SWOBODA_PAGE__?: ExportPage }).__SWOBODA_PAGE__ ?? "home") as ExportPage;
}

/** Zamienia ścieżki aplikacji („/#grafik”, „/regulamin”) na względne adresy plików eksportu. */
export function exportHref(href: string): string {
  if (!href.startsWith("/")) return href;
  const [path, hash] = href.split("#");
  const target = (Object.values(PAGE_PATHS).find((page) => page.route === path) ?? PAGE_PATHS.home).file;
  if (hash !== undefined && target === PAGE_PATHS[currentPage()].file) return `#${hash}`;
  return hash !== undefined ? `${target}#${hash}` : target;
}
