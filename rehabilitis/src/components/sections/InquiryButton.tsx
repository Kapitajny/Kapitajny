"use client";

import Link from "next/link";
import { selectService } from "@/lib/inquiry-store";

/** „Zapytaj o wizytę” – przechodzi do formularza i podstawia w nim wybraną usługę. */
export function InquiryButton({ slug, title, className = "btn btn-primary" }: { slug: string; title: string; className?: string }) {
  return (
    <Link href="/kontakt#formularz" onClick={() => selectService(slug)} className={className}>
      Zapytaj o wizytę<span className="sr-only">: {title}</span>
    </Link>
  );
}
