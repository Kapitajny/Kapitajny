import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES, ROUTES } from "./src/i18n/config";

// Projekt leży w podkatalogu repozytorium — wskazujemy katalog główny aplikacji jawnie.
const projectRoot = fileURLToPath(new URL(".", import.meta.url));

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const routes = Object.values(ROUTES);
/** Wewnętrzna ścieżka strony w danym języku, np. /pl/booking (folder app/[lang]/booking). */
const internal = (locale: string, segment: string) => `/${locale}${segment ? `/${segment}` : ""}`;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: projectRoot,
  experimental: {
    globalNotFound: true,
  },
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  /** Polski (domyślny) nie ma prefiksu: /rezerwacja → app/[lang=pl]/booking. */
  async rewrites() {
    return {
      beforeFiles: routes.map((route) => ({ source: route.paths[DEFAULT_LOCALE], destination: internal(DEFAULT_LOCALE, route.segment) })),
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    return [
      // Adresy wewnętrzne (/pl, /pl/booking) → publiczne adresy polskie bez prefiksu.
      ...routes.map((route) => ({ source: internal(DEFAULT_LOCALE, route.segment), destination: route.paths[DEFAULT_LOCALE], permanent: true })),
      // Zapamiętany wybór języka: powracający użytkownik, który wybrał inny język, trafia do jego wersji.
      ...LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).flatMap((locale) =>
        routes.map((route) => ({
          source: route.paths[DEFAULT_LOCALE],
          has: [{ type: "cookie" as const, key: LOCALE_COOKIE, value: locale }],
          destination: route.paths[locale],
          permanent: false,
        })),
      ),
    ];
  },
  turbopack: {
    root: projectRoot,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
