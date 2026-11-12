import type { Metadata, Viewport } from "next";
import { Barlow, Big_Shoulders } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

const display = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800", "900"],
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
});

const body = Barlow({
  variable: "--font-barlow",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – wynajem skuterów wodnych w Sopocie`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: site.name,
    title: `${site.name} – poczuj wolność na wodzie`,
    description: site.description,
    images: [{ url: "/images/kilwater/hero-aerial.jpg", width: 1148, height: 860, alt: "Skuter wodny na turkusowej wodzie, widok z drona" }],
  },
  robots: site.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#151d23",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
