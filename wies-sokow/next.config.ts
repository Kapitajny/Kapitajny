import path from "node:path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/*
 * STATIC_EXPORT=1 buduje statyczną wersję strony (folder out/) do wgrania na zwykły hosting, np. GitHub Pages.
 * EXPORT_BASE_PATH to podkatalog, w którym strona będzie dostępna, np. /Kapitajny/demo/wies-sokow.
 */
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = staticExport ? (process.env.EXPORT_BASE_PATH ?? "").replace(/\/$/, "") : "";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    // Hosting statyczny nie ma serwera optymalizacji zdjęć – pliki są przygotowane wcześniej (max 2000 px).
    unoptimized: staticExport,
  },
  ...(staticExport
    ? { output: "export" as const, trailingSlash: true, basePath }
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
  turbopack: {
    // Aplikacja leży w podkatalogu repozytorium i ma własny package-lock.json.
    root: path.join(__dirname),
  },
};

export default nextConfig;
