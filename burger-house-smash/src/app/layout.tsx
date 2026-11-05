import type { Metadata, Viewport } from "next";
import "@fontsource-variable/unbounded/wght.css";
import "@fontsource-variable/onest/wght.css";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver } from "@/components/Reveal";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `BUŁA smash burger – ${SITE.slogan} | Warszawa i Grodzisk Mazowiecki`, template: `%s | BUŁA smash burger` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: SITE.name,
    title: `BUŁA smash burger – ${SITE.slogan}`,
    description: SITE.description,
    images: [
      {
        url: "/images/og-baner.jpg",
        width: 1200,
        height: 630,
        alt: "Podwójny smash cheeseburger na musztardowym tle i hasło „Chrupie na brzegach. Cieknie w środku.”",
      },
    ],
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = { themeColor: "#fcc103", width: "device-width", initialScale: 1 };

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
        <RevealObserver />
      </body>
    </html>
  );
}
