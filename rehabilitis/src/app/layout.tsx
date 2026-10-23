import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { siteConfig } from "@/config/site";
import { getImageManifest } from "@/lib/images.server";
import { DraftNotice } from "@/components/layout/DraftNotice";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ImagesProvider } from "@/components/ui/ImagesProvider";
import "./globals.css";

// Jedna rodzina: Instrument Sans ze zmienną szerokością – zwężona w nagłówkach, normalna w tekście.
// Spokojne, precyzyjne kształty liter, klasyczne cyfry (cennik) i pełne polskie znaki.
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
});

const manifest = getImageManifest();
const cityPart = siteConfig.city ? ` ${siteConfig.city}` : "";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Fizjoterapia i rehabilitacja${cityPart} – ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: siteConfig.name,
    url: "/",
    title: `${siteConfig.name} – gabinet fizjoterapii i rehabilitacji${cityPart}`,
    description: siteConfig.description,
  },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#eef4f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={instrument.variable} suppressHydrationWarning>
      <body className="min-h-dvh">
        <ImagesProvider manifest={manifest}>
          <a href="#tresc" className="sr-only z-50 rounded-pill bg-brand text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:px-5 focus:py-3">
            Przejdź do treści
          </a>
          {/* Na dużych ekranach: stały panel nawigacji po lewej i treść po prawej (pasek wersji roboczej nad treścią). */}
          <div className="lg:grid lg:grid-cols-[var(--spacing-rail)_minmax(0,1fr)]">
            <SiteHeader />
            <div className="flex min-h-dvh min-w-0 flex-col">
              <DraftNotice />
              <main id="tresc" tabIndex={-1} className="flex-1 outline-none">
                {children}
              </main>
              <SiteFooter />
            </div>
          </div>
          <MobileActionBar />
        </ImagesProvider>
      </body>
    </html>
  );
}
