import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Początek podstrony: ścieżka nawigacyjna, H1 i krótkie wprowadzenie.
 * `aside` pozwala każdej podstronie dodać po prawej własną treść (np. skrót kontaktu).
 */
export function PageIntro({ title, lead, aside }: { title: string; lead: ReactNode; aside?: ReactNode }) {
  return (
    <div className="border-b border-line">
      <div className="page grid gap-8 pb-12 pt-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:pb-16 lg:pt-10">
        <div>
          <nav aria-label="Ścieżka nawigacji" className="text-small text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="underline underline-offset-4 hover:text-brand">
                  Strona główna
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">
                {title}
              </li>
            </ol>
          </nav>
          <h1 className="mt-6 text-h1">{title}</h1>
          <div className="mt-5 max-w-prose text-lead text-ink">{lead}</div>
        </div>
        {aside && <div className="lg:pb-2">{aside}</div>}
      </div>
    </div>
  );
}
