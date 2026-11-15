import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/data/site";
import "./globals.css";

// Jedna rodzina w kilku szerokościach: Archivo Expanded w nagłówkach, Archivo w tekście.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "CLIMARO – klimatyzacja, pompy ciepła i rekuperacja | Mazowsze",
    template: "%s | CLIMARO",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: site.name,
    title: "CLIMARO – klimatyzacja, pompy ciepła i rekuperacja",
    description: site.description,
    images: [{ url: "/images/hero-dom-pompa-ciepla.jpg", width: 2400, height: 1600, alt: "Pompa ciepła przy nowoczesnym domu" }],
  },
  robots: site.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#080909",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HVACBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  foundingDate: String(site.foundedYear),
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: "mazowieckie",
    addressCountry: "PL",
  },
  areaServed: { "@type": "AdministrativeArea", name: "Województwo mazowieckie" },
  logo: `${site.url}/brand/climaro-logo-light.svg`,
  image: `${site.url}/images/hero-dom-pompa-ciepla.jpg`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={archivo.variable}>
      <body>
        <a href="#tresc" className="skip-link">
          Przejdź do treści
        </a>
        <SiteHeader />
        <main id="tresc" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
