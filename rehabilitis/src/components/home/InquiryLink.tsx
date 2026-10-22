"use client";

import { selectService } from "@/lib/inquiry-store";
import { ArrowRightIcon } from "@/components/ui/Icons";

/** „Zapytaj o wizytę” – przewija do formularza i podstawia w nim wybraną usługę. */
export function InquiryLink({ slug, title }: { slug: string; title: string }) {
  return (
    <a href="#kontakt" onClick={() => selectService(slug)} className="link-arrow">
      Zapytaj o wizytę
      <span className="sr-only">: {title}</span>
      <ArrowRightIcon size={18} />
    </a>
  );
}
