"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function SkipLink() {
  const { t } = useI18n();
  return (
    <a href="#main" className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-full bg-washi px-5 py-3 font-gothic text-sm text-sumi focus:translate-y-0">
      {t.common.skipToContent}
    </a>
  );
}
