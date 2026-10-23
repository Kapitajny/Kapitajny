import type { Metadata, Viewport } from "next";
import { Albert_Sans } from "next/font/google";
import { siteConfig } from "@/config/site";
import { getImageManifest } from "@/lib/images.server";
import { DraftNotice } from "@/components/layout/DraftNotice";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBar } from "@/components/layout/TopBar";
import { ImagesProvider } from "@/components/ui/ImagesProvider";
import "./globals.css";

// Jedna rodzina dla całej strony: Albert Sans – otwarte, czytelne kształty liter, ciepły
// skandynawski charakter, klasyczne cyfry (ważne w cenniku) i pełne polskie znaki.
const albert = Albert_Sans({
  variable: "--font-albert",
  subsets: ["latin", "latin-ext"],
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
  themeColor: "#0e3b2c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={albert.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <ImagesProvider manifest={manifest}>
          <a href="#tresc" className="sr-only z-50 rounded-control bg-brand text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:px-4 focus:py-2">
            Przejdź do treści
          </a>
          <DraftNotice />
          <TopBar />
          <SiteHeader />
          <main id="tresc" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
          <MobileActionBar />
        </ImagesProvider>
      </body>
    </html>
  );
}
