import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { siteConfig } from "@/config/site";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ShopProvider } from "@/components/shop/ShopProvider";
import { Toasts } from "@/components/shop/Toasts";
import "./globals.css";

/** Jedna rodzina kroju: oś szerokości (wdth) daje rozszerzone nagłówki i zwykły tekst. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} – bluzy i spodnie streetwear`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: siteConfig.name,
    title: `${siteConfig.name} – bluzy i spodnie streetwear`,
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image" },
  robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={archivo.variable}>
      <body className="flex min-h-dvh flex-col">
        <ShopProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main id="tresc" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CartDrawer />
          <Toasts />
        </ShopProvider>
      </body>
    </html>
  );
}
