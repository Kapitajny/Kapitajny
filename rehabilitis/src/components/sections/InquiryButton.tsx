"use client";

import Link from "next/link";
import { selectService } from "@/lib/inquiry-store";

/** „Zapytaj o wizytę” – przechodzi do formularza i podstawia w nim wybraną usługę. */
export function InquiryButton({ slug, title, className = "btn btn-primary" }: { slug: string; title: string; className?: string }) {
  return (
    <Link href="/kontakt#formularz" onClick={() => selectService(slug)} className={className} aria-label={`Zapytaj o wizytę: ${title}`} data-service={slug}>
      Zapytaj o wizytę
    </Link>
  );
}
