import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Projekt leży w podkatalogu repozytorium z innym package-lock.json – wskazujemy katalog wprost.
  outputFileTracingRoot: __dirname,
  turbopack: { root: __dirname },
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Jedna strona 404 dla adresów spoza wersji językowych (layout główny leży w app/[lang]).
    globalNotFound: true,
  },
  // Polski (domyślny) mieszka pod „/”, angielski pod „/en”. Strony są generowane jako /pl i /en.
  async redirects() {
    return [{ source: "/pl", destination: "/", permanent: true }];
  },
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/pl" }], afterFiles: [], fallback: [] };
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
