import Link from "next/link";
import type { ReactNode } from "react";
import { AlertIcon } from "./Icons";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <section className="page-hero on-dark" aria-labelledby="legal-title">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Okruszki">
            <ol>
              <li>
                <Link href="/">Strona główna</Link>
              </li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <h1 id="legal-title" className="display h2">
            {title}
          </h1>
          <p className="muted" style={{ marginTop: "1rem" }}>
            Wersja demonstracyjna z dnia {updated}
          </p>
        </div>
      </section>
      <section className="section page-light">
        <div className="container legal">
          <nav className="legal__toc" aria-label="Spis treści">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.title}
              </a>
            ))}
          </nav>
          <div className="legal__body">
            <p className="legal-warning" role="note">
              <AlertIcon />
              <span>
                Dokument przykładowy. BUŁA burger house to marka fikcyjna, a poniższe zapisy, dane firmy i adresy są demonstracyjne. Przed uruchomieniem
                prawdziwej działalności dokument musi zostać uzupełniony i zweryfikowany przez prawnika.
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
