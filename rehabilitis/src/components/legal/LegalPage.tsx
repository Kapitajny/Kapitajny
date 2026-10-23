import Link from "next/link";
import type { ReactNode } from "react";
import { legalNav } from "@/config/site";
import { Breadcrumb } from "@/components/sections/Breadcrumb";
import { AlertIcon, ArrowLeftIcon } from "@/components/ui/Icons";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

/**
 * Wspólny układ dokumentów prawnych: spis treści, oznaczenie wersji roboczej,
 * nawigacja między dokumentami i powrót na stronę główną.
 */
export function LegalPage({ title, intro, path, sections }: { title: string; intro: ReactNode; path: string; sections: LegalSection[] }) {
  return (
    <div className="content pb-section pt-10 lg:pt-16">
      <Breadcrumb current={title} />

      <header className="mt-8 max-w-3xl">
        <h1 className="text-h2">{title}</h1>
        <div className="mt-6 text-lead leading-relaxed text-muted">{intro}</div>
      </header>

      <div
        role="note"
        className="mt-10 flex max-w-3xl gap-3 rounded-field bg-mint px-5 py-4 text-small leading-relaxed text-ink"
      >
        <AlertIcon size={18} className="mt-0.5 shrink-0 text-brand" />
        <p>
          <strong className="font-semibold">Projekt dokumentu, wersja robocza.</strong> Treść wymaga uzupełnienia danych administratora oraz weryfikacji
          przez prawnika przed publikacją strony. Nie stanowi porady prawnej. Fragmenty oznaczone „do uzupełnienia” zależą od decyzji właściciela gabinetu.
        </p>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-24">
            <nav aria-label="Spis treści">
              <h2 className="mb-3 text-small font-semibold type-plain">Spis treści</h2>
              <ol className="space-y-2 border-l border-line text-small">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px block border-l border-transparent py-1 pl-4 text-muted transition-colors hover:border-brand hover:text-brand-deep"
                    >
                      <span className="tabular-nums">{i + 1}.</span> {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>

        <article className="prose-legal min-w-0 max-w-3xl lg:col-span-8 xl:col-span-7">
          {sections.map((section, i) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2 id={section.id}>
                <span className="mr-2 tabular-nums">{i + 1}.</span>{" "}
                {section.title}
              </h2>
              {section.content}
            </section>
          ))}

          <nav aria-label="Pozostałe dokumenty" className="mt-16 border-t border-line pt-8">
            <h2 className="!mt-0 !mb-4 !text-base type-plain">Pozostałe dokumenty</h2>
            <ul className="!list-none !pl-0">
              {legalNav
                .filter((item) => item.href !== path)
                .map((item) => (
                  <li key={item.href} className="!pl-0">
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
            </ul>
            <Link href="/" className="btn btn-quiet mt-6 !no-underline">
              <ArrowLeftIcon size={18} /> Wróć na stronę główną
            </Link>
          </nav>
        </article>
      </div>
    </div>
  );
}
