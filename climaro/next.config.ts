import path from "node:path";
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

// STATIC_EXPORT=1 buduje statyczną wersję (katalog out/) – np. do podglądu jako artefakt.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  poweredByHeader: false,
  experimental: {
    // Arkusze są małe – osadzamy je w HTML. Usuwa to blokujące renderowanie żądanie CSS
    // oraz ostrzeżenia przeglądarki o wstępnie ładowanych, nieużytych arkuszach innych podstron.
    inlineCss: true,
  },
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
    // Eksport statyczny nie ma serwera optymalizacji obrazów.
    unoptimized: isStaticExport,
  },
  // Projekt leży w podkatalogu repozytorium z własnym package-lock.json.
  turbopack: {
    root: path.join(__dirname),
  },
  // Nagłówki bezpieczeństwa ustawia serwer Next.js; w eksporcie statycznym robi to hosting.
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
