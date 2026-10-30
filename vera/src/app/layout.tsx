import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Instrument_Sans } from "next/font/google";
import { site } from "@/config/site";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "VÉRA Aesthetic Studio – Your beauty. Your identity.", template: "%s – VÉRA Aesthetic Studio" },
  description: site.description,
  applicationName: site.fullName,
  openGraph: { type: "website", locale: "en_GB", siteName: site.fullName },
  twitter: { card: "summary_large_image" },
  robots: site.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f4efe8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bodoni.variable} ${instrument.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a id="skip-link" href="#content" className="sr-only z-[60] bg-burgundy px-5 py-3 text-sm text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
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
