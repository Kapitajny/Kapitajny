"use client";

import { LocalizedLink } from "@/i18n/LocalizedLink";
import { useI18n } from "@/i18n/I18nProvider";
import { Pattern } from "@/components/ui/Pattern";

export function NotFoundView() {
  const { t } = useI18n();
  return (
    <main id="main" className="on-dark page-x relative flex min-h-svh flex-col items-start justify-center overflow-hidden bg-sumi text-washi">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 text-washi/[0.1] [mask-image:linear-gradient(to_top,black,transparent)]">
        <Pattern kind="seigaiha" bg="var(--color-sumi)" />
      </div>
      <p className="font-mincho text-[clamp(5rem,16vw,12rem)] leading-none" aria-hidden="true">
        迷
      </p>
      <h1 className="display display-lg mt-6">{t.notFound.title}</h1>
      <p className="lead mt-5 text-washi/80">{t.notFound.text}</p>
      <LocalizedLink route="home" className="btn btn-paper relative mt-10">
        {t.notFound.back}
      </LocalizedLink>
    </main>
  );
}
