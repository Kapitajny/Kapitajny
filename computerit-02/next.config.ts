import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

/** Wersje demonstracyjne w public/demo/<slug>/ – każda ma własny, czysty adres /demo/<slug>. */
const staticDemos = [
  "vantor-automotive",
  "sklep-kapitajny",
  "interpodatki",
  "aureon-homes",
  "vera-aesthetic-studio",
  "piekarnia-morelowa",
  "balans",
  "volt-gsm",
  "forma-atelier",
  "neon-nami",
  "novelia-zdrowie",
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Przekierowanie (a nie przepisanie adresu), bo dema używają ścieżek względnych do swoich plików.
    return staticDemos.map((slug) => ({ source: `/demo/${slug}`, destination: `/demo/${slug}/index.html`, permanent: false }));
  },
  // NOIR COFFEE ma własne podstrony – czyste adresy prowadzą do plików HTML.
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
