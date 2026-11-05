import Link from "next/link";
import type { ReactNode } from "react";
import { Warn } from "./Icons";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <section className="page-head stone" aria-labelledby="doc-title">
        <div className="wrap">
          <nav className="crumbs" aria-label="Okruszki">
            <ol>
              <li>
                <Link href="/">Strona główna</Link>
              </li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <h1 id="doc-title" className="display h2" style={{ marginTop: "1rem" }}>
            {title}
          </h1>
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            Wersja demonstracyjna z dnia {updated}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="wrap doc">
          <nav className="doc__toc" aria-label="Spis treści">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.title}
              </a>
            ))}
          </nav>
          <div className="doc__body">
            <p className="doc__warn" role="note">
              <Warn />
              <span>
                Dokument przykładowy. BUŁA burger house to marka fikcyjna, a zapisy, dane firmy i adresy są demonstracyjne. Przed uruchomieniem prawdziwej
                działalności dokument musi zostać uzupełniony i zweryfikowany przez prawnika.
              </span>
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
