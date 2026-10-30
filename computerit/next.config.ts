import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
  // NOIR COFFEE (wersja demonstracyjna w public/demo) ma własne podstrony – czyste adresy prowadzą do plików HTML.
  async rewrites() {
    return [
      { source: "/demo/noir-coffee", destination: "/demo/noir-coffee/index.html" },
      {
        source: "/demo/noir-coffee/:page(zamowienie|kontakt|regulamin|cookies|polityka-prywatnosci|platnosci-i-zwroty)",
        destination: "/demo/noir-coffee/:page.html",
      },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
