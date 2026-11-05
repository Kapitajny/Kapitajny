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
      <section className="page-top frame" aria-labelledby="doc-title">
        <nav className="crumbs" aria-label="Okruszki">
          <Link href="/">Strona główna</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <h1 id="doc-title" className="mega page-title">
          {title}
        </h1>
        <p className="label grey" style={{ marginTop: "1.25rem" }}>
          Wersja demonstracyjna z dnia {updated}
        </p>
      </section>
      <section className="section frame">
        <div className="grid doc">
          <nav className="doc__toc" aria-label="Spis treści">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.title}
              </a>
            ))}
          </nav>
          <div className="doc__body">
            <p className="doc__warn" role="note">
              Dokument przykładowy. BUŁA burger house to marka fikcyjna, a zapisy, dane firmy i adresy są demonstracyjne. Przed uruchomieniem prawdziwej
              działalności dokument musi zostać uzupełniony i zweryfikowany przez prawnika.
            </p>
            {sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
                <h2 id={`${s.id}-h`}>{s.title}</h2>
                {s.body}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
