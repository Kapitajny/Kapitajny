import Link from "next/link";
import type { ReactNode } from "react";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <section className="sub-hero" aria-labelledby="doc-title">
        <div className="wrap">
          <nav className="crumbs" aria-label="Okruszki">
            <Link href="/">Strona główna</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>
          <h1 id="doc-title" className="sub-hero__title">
            {title}
          </h1>
          <p className="sub-hero__meta">Wersja demonstracyjna z dnia {updated}</p>
        </div>
      </section>
      <section className="doc wrap">
        <nav className="doc__toc" aria-label="Spis treści">
          <p className="doc__toc-h">Spis treści</p>
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="doc__body">
          <p className="doc__warn" role="note">
            Dokument przykładowy. BUŁA to marka fikcyjna, a zapisy, dane firmy i adresy są demonstracyjne. Przed uruchomieniem prawdziwej działalności dokument
            musi zostać uzupełniony i zweryfikowany przez prawnika.
          </p>
          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`}>{s.title}</h2>
              {s.body}
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
