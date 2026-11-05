import type { Metadata, Viewport } from "next";
import "@fontsource-variable/schibsted-grotesk/wght.css";
import "@fontsource-variable/newsreader/opsz.css";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver } from "@/components/Reveal";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} – dobry burger bez kompromisów | Warszawa i Grodzisk Mazowiecki`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: SITE.name,
    title: `${SITE.name} – ${SITE.slogan}`,
    description: SITE.description,
    images: [{ url: "/images/signature.jpg", width: 1680, height: 944, alt: "Podwójny cheeseburger na jasnym stole" }],
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = { themeColor: "#eeebe5", width: "device-width", initialScale: 1 };

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
