import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/config/site";
import "./globals.css";

/*
 * Archivo (variable: wght 100–900, wdth 62–125), przycięte narzędziem pyftsubset z @fontsource-variable/archivo:
 *  - archivo-latin.woff2: U+0020-007E, U+00A0-00FF, U+2010-2027, U+2030-203A, U+20AC, U+2122, U+2212
 *  - archivo-pl.woff2:    polskie litery ą ć ę ł ń ś ź ż (wielkie i małe)
 * Gdy treść zacznie używać innych znaków, wygeneruj podzbiory ponownie (lub wróć do plików z @fontsource).
 */

const archivoLatin = localFont({
  src: "./archivo-latin.woff2",
  variable: "--font-archivo-latin",
  weight: "100 900",
  display: "swap",
  declarations: [
    { prop: "font-stretch", value: "62% 125%" },
    {
      prop: "unicode-range",
      value:
        "U+0020-007E,U+00A0-00FF,U+2010-2027,U+2030-203A,U+20AC,U+2122,U+2212",
    },
  ],
});

const archivoExt = localFont({
  src: "./archivo-pl.woff2",
  variable: "--font-archivo-ext",
  weight: "100 900",
  display: "swap",
  declarations: [
    { prop: "font-stretch", value: "62% 125%" },
    {
      prop: "unicode-range",
      value:
        "U+0104-0107,U+0118-0119,U+0141-0144,U+015A-015B,U+0179-017C",
    },
  ],
});

const title = `${site.name} – agencja reklamy online: Meta, Google, YouTube, TikTok`;

export const metadata: Metadata = {
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.fullName,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.fullName,
    title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  // Indeksowanie dopiero po ustawieniu prawdziwego adresu strony (site.url) — do tego czasu szkice nie trafiają do wyszukiwarek.
  robots: site.url ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f6f2",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${archivoLatin.variable} ${archivoExt.variable}`}>
      <body>
        <a
          href="#tresc"
          className="sr-only z-[60] rounded-full bg-ink px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Przejdź do treści
        </a>
        {children}
      </body>
    </html>
  );
}
