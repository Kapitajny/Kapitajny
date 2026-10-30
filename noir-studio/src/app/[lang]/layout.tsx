import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import { navigation, siteConfig } from "@/config/site";
import { homePath, isLocale, LOCALES } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { resolveImage } from "@/lib/images.server";
import { SiteHeader } from "@/components/SiteHeader";
import "../globals.css";

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

/** Obie wersje językowe są generowane statycznie; inne segmenty dają 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const hero = resolveImage("heroDusk", dict);

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: dict.meta.title, template: "%s | NOIR STUDIO" },
    description: dict.meta.description,
    applicationName: siteConfig.name,
    alternates: {
      canonical: homePath(lang),
      languages: { pl: homePath("pl"), en: homePath("en"), "x-default": homePath("pl") },
    },
    openGraph: {
      type: "website",
      locale: dict.meta.ogLocale,
      alternateLocale: LOCALES.filter((other) => other !== lang).map((other) => getDictionary(other).meta.ogLocale),
      siteName: siteConfig.name,
      title: dict.meta.ogTitle,
      description: dict.meta.description,
      url: homePath(lang),
      ...(hero.src ? { images: [{ url: hero.src, alt: hero.alt }] } : {}),
    },
    twitter: { card: "summary_large_image" },
    robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#171717",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const menuImages = Object.fromEntries(navigation.map((item) => [item.image, resolveImage(item.image, dict)]));

  return (
    <html lang={lang} className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Animacje odsłaniania zdjęć włączamy tylko, gdy działa JavaScript. Wejście z #sekcją (np. po zmianie
            języka) przewija od razu, bez płynnej animacji przez całą stronę. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.classList.add('js');if(location.hash){d.classList.add('instant-scroll');addEventListener('load',function(){setTimeout(function(){d.classList.remove('instant-scroll')},100)})}",
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {dict.common.skipToContent}
        </a>
        <SiteHeader
          menuImages={menuImages}
          email={siteConfig.email}
          locale={lang}
          t={{
            common: {
              backToTop: dict.common.backToTop,
              city: dict.common.city,
              country: dict.common.country,
              visitsByAppointment: dict.common.visitsByAppointment,
            },
            nav: dict.nav,
            language: dict.language,
          }}
        />
        {children}
      </body>
    </html>
  );
}
