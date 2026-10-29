import type { Metadata, Viewport } from "next";
import { Geist, Newsreader } from "next/font/google";
import { siteConfig } from "@/config/site";
import { DemoBar } from "@/components/layout/DemoBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "InterPodatki – księgowość i obsługa podatkowa firm (demo)",
    template: "%s | InterPodatki",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: siteConfig.name,
    title: "InterPodatki – księgowość, która nadąża za Twoim biznesem",
    description: siteConfig.description,
  },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#10243A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${newsreader.variable} ${geist.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#tresc" className="skip-link">
          Przejdź do treści
        </a>
        <DemoBar />
        <SiteHeader />
        <main id="tresc" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: `${siteConfig.name} (projekt demonstracyjny)`,
            url: siteConfig.url,
            inLanguage: "pl-PL",
          }}
        />
      </body>
    </html>
  );
}
