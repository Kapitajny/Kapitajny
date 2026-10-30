import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { siteConfig } from "@/config/site";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "VÉRA Aesthetic Studio – aesthetic medicine and professional skin care",
    template: "%s | VÉRA Aesthetic Studio",
  },
  description: siteConfig.description,
  applicationName: siteConfig.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: siteConfig.fullName,
    title: "VÉRA Aesthetic Studio",
    description: siteConfig.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f4efe8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#content" className="sr-only z-[70] bg-burgundy px-5 py-3 text-sm text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
