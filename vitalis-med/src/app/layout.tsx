import type { Metadata, Viewport } from "next";
import { Albert_Sans } from "next/font/google";
import { a11yBootScript } from "@/lib/a11y";
import { EmergencyBar } from "@/components/layout/EmergencyBar";
import { FloatingCall } from "@/components/layout/FloatingCall";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { organizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import "./globals.css";

// Albert Sans – nowoczesny, europejski krój o wysokiej czytelności, z polskimi znakami.
const albert = Albert_Sans({
  variable: "--font-albert",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
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
    images: [{ url: "/images/flota/zdjecie-fiat.webp", width: 1800, height: 1204, alt: "Ambulans Vitalis Med" }],
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
    <html lang="pl" className={albert.variable} suppressHydrationWarning>
      <head>
        {/* Animacje przy przewijaniu włączamy tylko, gdy działa JavaScript. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');" + a11yBootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#tresc"
          className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Przejdź do treści
        </a>
        <EmergencyBar />
        <SiteHeader />
        <main id="tresc" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <FloatingCall />
      </body>
    </html>
  );
}
