import type { Metadata, Viewport } from "next";
import { Alegreya, Alegreya_Sans } from "next/font/google";
import { siteConfig } from "@/config/site";
import { company } from "@/content/company";
import { DemoBadge } from "@/components/layout/DemoBadge";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { resolveMedia } from "@/components/ui/Photo";
import "./globals.css";

const alegreya = Alegreya({
  variable: "--font-alegreya",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
});

const alegreyaSans = Alegreya_Sans({
  variable: "--font-alegreya-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const heroImage = resolveMedia("hero");

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Zakład Mięsny Wierzejki – mięso, wędliny i garmażerka od 1991 roku",
    template: "%s | Zakład Mięsny Wierzejki",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: siteConfig.name,
    title: "Zakład Mięsny Wierzejki",
    description: siteConfig.description,
    ...(heroImage ? { images: [{ url: heroImage }] } : {}),
  },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

/** Dane organizacji – wyłącznie informacje widoczne na stronie i potwierdzone w KRS. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  legalName: company.legalName,
  foundingDate: String(company.foundedYear),
  email: company.email,
  telephone: company.phone,
  faxNumber: company.fax,
  taxID: company.registry.nip,
  url: siteConfig.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.street,
    postalCode: company.address.postalCode,
    addressLocality: company.address.city,
    addressRegion: company.address.region,
    addressCountry: company.address.country,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${alegreya.variable} ${alegreyaSans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="tresc" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {siteConfig.demoMode && <DemoBadge agency={siteConfig.agency.name} />}
        <JsonLd data={organizationJsonLd} />
      </body>
    </html>
  );
}
