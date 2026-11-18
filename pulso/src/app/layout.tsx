import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/config/site";
import "./globals.css";

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
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
    },
  ],
});

const archivoExt = localFont({
  src: "./archivo-latin-ext.woff2",
  variable: "--font-archivo-ext",
  weight: "100 900",
  display: "swap",
  declarations: [
    { prop: "font-stretch", value: "62% 125%" },
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
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
  robots: { index: true, follow: true },
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
