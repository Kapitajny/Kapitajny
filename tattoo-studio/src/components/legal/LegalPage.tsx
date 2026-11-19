import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { Footer } from "@/components/layout/Footer";
import { ArrowIcon } from "@/components/ui/Icons";
import { Wordmark } from "@/components/ui/Seal";

/** Wartość z konfiguracji albo wyraźnie oznaczone miejsce do uzupełnienia. */
export function Fill({ value, label }: { value?: string; label: string }) {
  return value ? <>{value}</> : <span className="todo">[{label}: do uzupełnienia]</span>;
}

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <header className="on-dark bg-sumi text-washi">
        <div className="page-x flex items-center justify-between py-5">
          <Link href="/" aria-label={`${siteConfig.name} — strona główna`} className="rounded-sm">
            <Wordmark />
          </Link>
          <Link href="/" className="flex min-h-11 items-center gap-2 font-gothic text-sm hover:text-kinari">
            <ArrowIcon direction="left" className="h-4 w-4" />
            Strona główna
          </Link>
        </div>
      </header>
      <main id="main" className="page-x py-16 sm:py-24">
        <article className="mx-auto max-w-[44rem]">
          <h1 className="display display-lg">{title}</h1>
          <p className="mt-6 border-l-2 border-sumi/30 pl-4 font-gothic text-sm leading-relaxed text-nezumi">
            Wersja robocza dokumentu. Przed publikacją strony uzupełnij dane oznaczone jako „do uzupełnienia” i przekaż treść do
            weryfikacji prawnikowi.
          </p>
          <p className="mt-3 font-gothic text-xs text-nezumi">
            Ostatnia aktualizacja: <Fill value={siteConfig.legal.documentsUpdated} label="data" />
          </p>
          <div className="legal mt-12 font-mincho text-[1.0625rem] leading-[1.9]">{children}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}
