import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "./globals.css";
import { ConceptSwitch } from "@/components/ConceptSwitch";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} – burgery robione na zamówienie | Warszawa i Grodzisk Mazowiecki`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: SITE.name,
    title: `${SITE.name} – ${SITE.slogan}`,
    description: SITE.description,
    images: [{ url: "/images/c2-promo-fire.jpg", width: 600, height: 400, alt: "Zestaw Fire na musztardowym tle" }],
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = { themeColor: "#f4b400", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <a className="skip" href="#tresc">
          Przejdź do treści
        </a>
        <Header />
        <main id="tresc">{children}</main>
        <Footer />
        <ConceptSwitch />
      </body>
    </html>
  );
}
