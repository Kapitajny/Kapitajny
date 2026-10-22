import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import { siteConfig } from "@/config/site";
import { getImageManifest } from "@/lib/images.server";
import { DraftNotice } from "@/components/layout/DraftNotice";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ImagesProvider } from "@/components/ui/ImagesProvider";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const manifest = getImageManifest();
const cityPart = siteConfig.city ? ` ${siteConfig.city}` : "";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} – gabinet rehabilitacji i fizjoterapii${cityPart}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: siteConfig.name,
    url: "/",
    title: `${siteConfig.name} – rehabilitacja i fizjoterapia${cityPart}`,
    description: siteConfig.description,
  },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#faf9f6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${newsreader.variable} ${hanken.variable}`} suppressHydrationWarning>
      <head>
        {/* Animacje przy przewijaniu włączamy tylko, gdy działa JavaScript. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <ImagesProvider manifest={manifest}>
          <DraftNotice />
          <SiteHeader />
          <main id="tresc" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <MobileActionBar />
        </ImagesProvider>
      </body>
    </html>
  );
}
