import type { Metadata, Viewport } from "next";
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const shippori = Shippori_Mincho({
  variable: "--font-shippori",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  weight: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Japanese Tattoo Art | Studio tatuażu Warszawa`,
    template: `%s | ${siteConfig.name} — Japanese Tattoo Art, Warszawa`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["studio tatuażu Warszawa", "tatuaż japoński", "irezumi", "japanese tattoo Warsaw", "tatuator Warszawa", "fine line", "black and grey"],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Japanese Tattoo Art, Warsaw`,
    description: siteConfig.description,
  },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1a1612",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${shippori.variable} ${zenKaku.variable}`} suppressHydrationWarning>
      <head>
        {/* Animacje przy przewijaniu włączamy tylko, gdy działa JavaScript. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-[2px] bg-washi px-4 py-3 font-gothic text-sm text-sumi focus:translate-y-0"
        >
          Przejdź do treści
        </a>
        {children}
      </body>
    </html>
  );
}
