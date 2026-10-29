import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { siteConfig } from "@/config/site";
import { morelowa } from "@/data/morelowa";
import "./morelowa.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const title = "Morelowa – rodzinna piekarnia i cukiernia od 1991 roku";

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
 * Osobny layout główny strony Morelowej (grupa tras) – własne fonty, kolory i arkusz stylów,
 * niezależne od kawiarni NOIR COFFEE z grupy `(noir)`.
 */
export default function MorelowaLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" className={`${cormorant.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        {/* Animacje przy przewijaniu włączamy tylko, gdy działa JavaScript. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
