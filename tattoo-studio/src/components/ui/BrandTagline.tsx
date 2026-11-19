"use client";

import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";

/** Hasło marki. Domyślnie wspólne (angielskie) dla obu języków — oznaczone `lang`, aby czytniki ekranu czytały je poprawnie. */
export function BrandTagline({ className = "" }: { className?: string }) {
  const { lang } = useI18n();
  const localized = siteConfig.taglineByLocale[lang];
  return (
    <span lang={localized ? lang : "en"} className={className}>
      {localized || siteConfig.tagline}
    </span>
  );
}
