import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { hasLocale, htmlLang, localePath, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { archivo } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#030407",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s – ${site.name}` },
    description: t.meta.description,
    applicationName: site.name,
    alternates: {
      canonical: localePath(lang, "/"),
      languages: { "pl-PL": "/", "en-GB": "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: lang === "pl" ? "pl_PL" : "en_GB",
      alternateLocale: lang === "pl" ? ["en_GB"] : ["pl_PL"],
      title: t.meta.title,
      description: t.meta.description,
      url: localePath(lang, "/"),
    },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <html lang={htmlLang[lang]} className={archivo.variable}>
      <body>
        <a className="skip-link" href="#main">
          {t.skipLink}
        </a>
        <SiteProvider>
          <SiteHeader lang={lang} t={t.nav} />
          {children}
          <SiteFooter lang={lang} t={t} />
        </SiteProvider>
      </body>
    </html>
  );
}
