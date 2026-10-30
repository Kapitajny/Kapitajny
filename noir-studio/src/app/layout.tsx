import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { navigation, siteConfig } from "@/config/site";
import { resolveImage } from "@/lib/images.server";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const hero = resolveImage("heroDusk");

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "NOIR STUDIO – Photography studio in Warsaw",
    template: "%s | NOIR STUDIO",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: siteConfig.name,
    title: "NOIR STUDIO – Moments become timeless",
    description: siteConfig.description,
    ...(hero.src ? { images: [{ url: hero.src, alt: hero.alt }] } : {}),
  },
  twitter: { card: "summary_large_image" },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#171717",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const menuImages = Object.fromEntries(navigation.map((item) => [item.image, resolveImage(item.image)]));

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Animacje odsłaniania zdjęć włączamy tylko, gdy działa JavaScript. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader menuImages={menuImages} email={siteConfig.email} />
        {children}
      </body>
    </html>
  );
}
