import type { NextConfig } from "next";

/**
 * Strona jest eksportowana statycznie (folder `out/`).
 * PAGES_BASE_PATH pozwala opublikować ją w podkatalogu, np. "/demo/pulso" na GitHub Pages.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  poweredByHeader: false,
  images: { unoptimized: true },
  // Projekt leży w podkatalogu repozytorium z innym package-lock.json: wskazujemy właściwy katalog główny.
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
