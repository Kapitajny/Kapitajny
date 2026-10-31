import type { Metadata, Viewport } from "next";
import { Jost, Playfair_Display } from "next/font/google";
import { siteConfig } from "@/config/site";
import { mainProduct, products } from "@/data/products";
import { isProductAvailable } from "@/lib/server/files";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Zdrowiej każdego dnia – e-book z przepisami | NOVELIA ZDROWIE",
    template: "%s | NOVELIA ZDROWIE",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["zdrowe odżywianie", "e-book z przepisami", "zdrowe przepisy", "plan posiłków", "zbilansowane posiłki", "NOVELIA ZDROWIE"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: siteConfig.name,
    title: "Zdrowiej każdego dnia – e-book NOVELIA ZDROWIE",
    description: siteConfig.description,
    images: [{ url: mainProduct.cover.src, width: mainProduct.cover.width, height: mainProduct.cover.height, alt: mainProduct.cover.alt }],
  },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Dostępność publikacji = obecność pliku PDF w katalogu prywatnym (sprawdzane przy budowaniu strony).
  const available = Object.fromEntries(products.map((p) => [p.slug, isProductAvailable(p)]));
  return (
    <html lang="pl" className={`${playfair.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <CartProvider available={available}>
          <SiteHeader />
          <main id="tresc" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
