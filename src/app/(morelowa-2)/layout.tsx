import type { Metadata, Viewport } from "next";
import { Jost, Libre_Bodoni } from "next/font/google";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { morelowa } from "@/data/morelowa";
import "./morelowa-2.css";

const bodoni = Libre_Bodoni({
  variable: "--font-bodoni",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const title = "Morelowa – piekarnia i cukiernia rodzinna od 1991 roku | Koncepcja 2";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title,
  description: morelowa.description,
  applicationName: morelowa.fullName,
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: morelowa.fullName,
    title,
    description: morelowa.description,
  },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f8f4ec",
  width: "device-width",
  initialScale: 1,
};

/**
 * Layout główny koncepcji 2 strony Morelowej (grupa tras) – własne fonty i arkusz stylów,
 * niezależne od koncepcji 1 w `(morelowa)` i kawiarni NOIR COFFEE w `(noir)`.
 */
export default function MorelowaConcept2Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" className={`${bodoni.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        {/* Animacje przy przewijaniu włączamy tylko, gdy działa JavaScript. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
