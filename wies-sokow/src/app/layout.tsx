import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/data/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Wieś Soków – soki tłoczone z jabłek i gruszek prosto od producenta",
    template: "%s | Wieś Soków",
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: site.name,
    title: "Wieś Soków – soki tłoczone z jabłek i gruszek",
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: site.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f3ebdd",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <a href="#tresc" className="skip-link">
          Przejdź do treści
        </a>
        <SiteHeader />
        <main id="tresc">{children}</main>
        <SiteFooter />
        <CartDrawer />
      </body>
    </html>
  );
}
