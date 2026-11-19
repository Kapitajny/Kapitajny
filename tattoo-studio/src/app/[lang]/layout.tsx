import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { LOCALES, isLocale } from "@/i18n/config";
import { I18nProvider } from "@/i18n/I18nProvider";
import { SkipLink } from "@/components/layout/SkipLink";
import { shippori, zenKaku } from "../fonts/fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#14110e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} className={`${shippori.variable} ${zenKaku.variable}`} suppressHydrationWarning>
      <head>
        {/* Animacje przy przewijaniu włączamy tylko, gdy działa JavaScript. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh">
        <I18nProvider initialLang={lang}>
          <SkipLink />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
