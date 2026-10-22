import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// Projekt leży w podkatalogu repozytorium z własnym package-lock.json – wskazujemy go jako katalog główny.
const projectRoot = dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV === "development";

// Strony są generowane statycznie, więc nie używamy nonce (wymagałby renderowania każdej strony na żądanie).
// Next.js wstrzykuje skrypty inline z danymi RSC, dlatego script-src zawiera 'unsafe-inline' – zgodnie z dokumentacją
// Next.js dla CSP bez nonce. Serwis nie ładuje żadnych skryptów ani zasobów z zewnętrznych domen.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // Formularz kontaktowy to kilka pól tekstowych – nie potrzebujemy domyślnego limitu 1 MB.
      bodySizeLimit: "64kb",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
