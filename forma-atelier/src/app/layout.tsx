import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { site } from "@/data/site";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — architektura wnętrz, Warszawa`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "architektura wnętrz Warszawa",
    "projektowanie wnętrz",
    "architekt wnętrz",
    "projekt wnętrz domu",
    "projekt apartamentu",
    "wnętrza premium",
  ],
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} — ${site.claim}`,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Wnętrze zaprojektowane przez FORMA ATELIER" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#292720",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "InteriorDesigner",
  name: site.name,
  description: site.description,
  url: site.url,
  email: site.contact.email,
  telephone: site.contact.phone,
  slogan: site.claim,
  areaServed: ["Warszawa", "Konstancin-Jeziorna", "Józefów", "Magdalenka", "województwo mazowieckie"],
  address: {
    "@type": "PostalAddress",
    streetAddress: site.contact.street,
    addressLocality: "Warszawa",
    addressCountry: "PL",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <noscript>
          {/* bez JavaScriptu animacje wejścia się nie uruchomią — treść musi być widoczna od razu */}
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}[style*="clip-path"]{clip-path:none!important}`}</style>
        </noscript>
        <a
          href="#tresc"
          className="t-meta fixed top-3 left-3 z-[200] -translate-y-24 rounded-full bg-graphite px-5 py-3 text-paper transition-transform focus:translate-y-0"
        >
          Przejdź do treści
        </a>
        <SiteHeader />
        <main id="tresc">{children}</main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
