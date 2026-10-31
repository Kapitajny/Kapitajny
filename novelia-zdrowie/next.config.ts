import type { NextConfig } from "next";
import path from "node:path";

// Sklep jest osobną aplikacją w podkatalogu repozytorium – wskazujemy jej katalog główny.
const appRoot = path.resolve(__dirname);

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: appRoot,
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
  // Pliki e-booków są czytane z dysku w trakcie działania (katalog private/) – dołącz je do śledzenia plików.
  outputFileTracingIncludes: {
    "/api/pobierz/[token]": ["./private/ebooks/**/*"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }, { key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
  turbopack: {
    root: appRoot,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
