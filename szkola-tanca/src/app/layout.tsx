import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PHOTOS } from "@/config/photos";
import { siteConfig } from "@/config/site";
import "./globals.css";

/** Jedna rodzina w dwóch rolach: zwężone nagłówki (oś wdth) i tekst w optycznym rozmiarze dla małych stopni. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Swoboda – studio tańca dla dorosłych | Lekcja próbna",
    template: "%s | Swoboda – studio tańca",
  },
  description: siteConfig.description,
  applicationName: siteConfig.fullName,
  keywords: ["szkoła tańca", "studio tańca", "taniec dla dorosłych", "taniec współczesny", "hip-hop", "balet dla dorosłych", "high heels", "lekcja próbna"],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: siteConfig.fullName,
    title: "Swoboda – studio tańca dla dorosłych",
    description: siteConfig.description,
    images: [{ url: PHOTOS.classJoy.src.src, width: PHOTOS.classJoy.src.width, height: PHOTOS.classJoy.src.height, alt: PHOTOS.classJoy.alt }],
  },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f2ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={bricolage.variable}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="tresc" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
