import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { siteConfig } from "@/config/site";
import { getImageManifest } from "@/lib/images.server";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { ProductCustomizer } from "@/components/cart/ProductCustomizer";
import { Toasts } from "@/components/cart/Toasts";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ImagesProvider } from "@/components/ui/ImagesProvider";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const manifest = getImageManifest();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "NOIR COFFEE – kawiarnia w Gdańsku | Zamów kawę online",
    template: "%s | NOIR COFFEE",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: siteConfig.name,
    title: "NOIR COFFEE – kawiarnia w Gdańsku",
    description: siteConfig.description,
    ...(manifest.hero.src ? { images: [{ url: manifest.hero.src, alt: manifest.hero.alt }] } : {}),
  },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f5efe6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${fraunces.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Animacje przy przewijaniu włączamy tylko, gdy działa JavaScript. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <ImagesProvider manifest={manifest}>
          <CartProvider>
            <SiteHeader />
            <main id="tresc" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <CartDrawer />
            <ProductCustomizer />
            <Toasts />
          </CartProvider>
        </ImagesProvider>
      </body>
    </html>
  );
}
