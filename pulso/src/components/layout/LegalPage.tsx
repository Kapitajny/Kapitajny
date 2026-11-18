import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { SiteFooter } from "@/components/layout/SiteFooter";

/** Wspólny układ podstron prawnych. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <header className="border-b border-rule">
        <div className="container-plan flex h-20 items-center justify-between gap-4">
          <Link href="/" aria-label="PULSO, strona główna" className="rounded-full">
            <Logo />
          </Link>
          <Link href="/#kontakt" className="btn btn-primary btn-sm">
            Kontakt
          </Link>
        </div>
      </header>
      <main id="tresc" className="container-plan py-16 sm:py-24">
        <article className="legal mx-auto max-w-[44rem]">
          <h1 className="t-h2">{title}</h1>
          <p className="mt-3 text-sm text-ink-3">{updated}</p>
          <div className="mt-6 rounded-md border-[1.5px] border-dashed border-field px-4 py-3 text-[0.9375rem] text-ink-2" role="note">
            <strong className="font-[660] text-ink">Projekt dokumentu.</strong> Pola w nawiasach kwadratowych wymagają
            uzupełnienia, a całość weryfikacji przez prawnika przed publikacją strony i przyjmowaniem zgłoszeń.
          </div>
          <div className="mt-10">{children}</div>
        </article>
      </main>
      <SiteFooter showCta={false} home={false} />
    </>
  );
}
