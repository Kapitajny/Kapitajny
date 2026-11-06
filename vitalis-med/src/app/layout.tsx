import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import { EmergencyBar } from "@/components/layout/EmergencyBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { organizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import "./globals.css";

// Lato – krój polskiego projektanta (Łukasz Dziedzic), czytelny i spokojny, z pełnymi polskimi znakami.
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Vitalis Med – prywatne pogotowie ratunkowe i transport medyczny",
    template: "%s | Vitalis Med",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: siteConfig.name,
    title: "Vitalis Med – prywatne pogotowie ratunkowe",
    description: siteConfig.description,
    images: [{ url: "/images/flota/baner-ambulans.webp", width: 677, height: 453, alt: "Ambulans Vitalis Med" }],
  },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={lato.variable} suppressHydrationWarning>
      <head>
        {/* Animacje przy przewijaniu włączamy tylko, gdy działa JavaScript. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#tresc"
          className="sr-only z-50 bg-ink px-4 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Przejdź do treści
        </a>
        <EmergencyBar />
        <SiteHeader />
        <main id="tresc" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
