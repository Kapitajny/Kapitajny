import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Mona_Sans } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { siteConfig } from "@/config/site";
import "./globals.css";

const mona = Mona_Sans({
  variable: "--font-mona",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
});

// Wyłącznie okładki typograficzne projektów w portfolio.
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

const title = "ComputerIT – projektowanie stron internetowych i sklepów online";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image", title, description: siteConfig.description },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0a2264",
  width: "device-width",
  initialScale: 1,
};

/**
 * Przed pierwszym malowaniem: klasa `js` (animacje przewijania tylko z JavaScriptem)
 * oraz krótsze wejście COMPUTERIT przy kolejnych odwiedzinach.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(localStorage.getItem('cit-intro'))d.classList.add('intro-short');localStorage.setItem('cit-intro','1')}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${mona.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="tresc" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <RevealObserver />
      </body>
    </html>
  );
}
