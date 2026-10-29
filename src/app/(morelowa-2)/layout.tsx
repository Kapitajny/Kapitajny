import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Hanken_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { morelowa } from "@/data/morelowa";
import "./morelowa-2.css";

const display = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const body = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const title = "Morelowa – rodzinna piekarnia i cukiernia od 1991 roku | Koncepcja 2";

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
  themeColor: "#231912",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Layout główny koncepcji 2 strony Morelowej (grupa tras) – ciemny, nastrojowy kierunek
 * z własnymi fontami i arkuszem stylów, niezależny od koncepcji 1 w `(morelowa)`.
 */
export default function MorelowaConcept2Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Animacje przy przewijaniu włączamy tylko, gdy działa JavaScript. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
