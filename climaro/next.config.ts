import path from "node:path";
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Arkusze są małe – osadzamy je w HTML. Usuwa to blokujące renderowanie żądanie CSS
    // oraz ostrzeżenia przeglądarki o wstępnie ładowanych, nieużytych arkuszach innych podstron.
    inlineCss: true,
  },
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
  // Projekt leży w podkatalogu repozytorium z własnym package-lock.json.
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
