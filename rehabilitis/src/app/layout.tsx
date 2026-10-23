import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Literata } from "next/font/google";
import { siteConfig } from "@/config/site";
import { getImageManifest } from "@/lib/images.server";
import { DraftNotice } from "@/components/layout/DraftNotice";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBar } from "@/components/layout/TopBar";
import { ImagesProvider } from "@/components/ui/ImagesProvider";
import "./globals.css";

// Nagłówki: Literata (krój zaprojektowany do długiego czytania). Tekst: Atkinson Hyperlegible Next –
// krój zaprojektowany z myślą o osobach słabowidzących, czytelny także dla starszych pacjentów.
const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "latin-ext"],
  weight: ["500"],
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
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
  themeColor: "#23483d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${literata.variable} ${atkinson.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <ImagesProvider manifest={manifest}>
          <a href="#tresc" className="sr-only z-50 rounded-md bg-forest px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
            Przejdź do treści
          </a>
          <DraftNotice />
          <TopBar />
          <SiteHeader />
          <main id="tresc" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <MobileActionBar />
        </ImagesProvider>
      </body>
    </html>
  );
}
