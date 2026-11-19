"use client";

import { siteConfig } from "@/config/site";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import { LocalizedLink } from "@/i18n/LocalizedLink";
import { useI18n } from "@/i18n/I18nProvider";
import { ArrowIcon } from "@/components/ui/Icons";
import { Wordmark } from "@/components/ui/Seal";

/** Nagłówek podstron (formularz, dokumenty): znak marki, przełącznik języka, powrót do studia. */
export function SubpageHeader() {
  const { t } = useI18n();
  return (
    <header className="on-dark bg-sumi text-washi">
      <div className="page-x flex items-center justify-between gap-4 py-4">
        <LocalizedLink route="home" aria-label={t.common.homeLink(siteConfig.name)} className="rounded-sm">
          <Wordmark />
        </LocalizedLink>
        <div className="flex items-center gap-2 sm:gap-6">
          <LocalizedLink route="home" className="hidden min-h-11 items-center gap-2 font-gothic text-sm hover:text-kin sm:flex">
            <ArrowIcon direction="left" className="h-4 w-4" />
            {t.common.backToStudio}
          </LocalizedLink>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
