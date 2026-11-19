"use client";

import { LOCALES } from "./config";
import { useI18n } from "./I18nProvider";

/**
 * Przełącznik języka PL / EN. Widoczny skrót + pełna nazwa dla czytników ekranu
 * (nazwa dostępna zawiera widoczny tekst). Każdy przycisk ma atrybut `lang` swojego języka.
 */
export function LanguageSwitcher({ tone = "dark", size = "md", className = "" }: { tone?: "dark" | "light"; size?: "sm" | "md"; className?: string }) {
  const { lang, t, setLang } = useI18n();
  const dark = tone === "dark";
  return (
    <div
      role="group"
      aria-label={t.common.language.label}
      className={`relative inline-flex items-center rounded-full border p-0.5 ${dark ? "border-washi/20" : "border-sumi/20"} ${className}`}
    >
      {LOCALES.map((locale) => {
        const active = locale === lang;
        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            aria-pressed={active}
            onClick={() => setLang(locale)}
            className={`relative min-w-11 rounded-full font-gothic font-medium tracking-[0.12em] transition-colors duration-300 ${
              size === "sm" ? "h-9 px-2.5 text-2xs" : "h-11 px-3.5 text-xs"
            } ${
              active
                ? dark
                  ? "bg-washi text-sumi"
                  : "bg-sumi text-washi"
                : dark
                  ? "text-washi/70 hover:text-washi"
                  : "text-sumi/70 hover:text-sumi"
            }`}
          >
            {locale.toUpperCase()}
            <span className="sr-only"> ({t.common.language.names[locale]})</span>
          </button>
        );
      })}
    </div>
  );
}
