import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/standard.css";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver } from "@/components/Reveal";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} – burgery smażone na zamówienie | Warszawa i Grodzisk Mazowiecki`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["burgery Warszawa", "burger Grodzisk Mazowiecki", "burgerownia", "smash burger", "burgery na wynos", "Marszałkowska"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: SITE.name,
    title: `${SITE.name} – ${SITE.slogan}`,
    description: SITE.description,
    images: [{ url: "/images/og-baner.jpg", width: 1584, height: 396, alt: "Zestaw Fire w BUŁA burger house – 44,99 zł od poniedziałku do czwartku" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <a className="skip-link" href="#tresc">
          Przejdź do treści
        </a>
        <Header />
        <main id="tresc">{children}</main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
