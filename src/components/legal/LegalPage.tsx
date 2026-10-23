import Link from "next/link";
import type { ReactNode } from "react";
import { legalNav } from "@/config/site";
import { AlertIcon } from "@/components/ui/Icons";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

/** Brakujące dane właściciela – oznaczone wprost zamiast wymyślonych wartości. */
export function Pending({ children }: { children: ReactNode }) {
  return <span className="pending">[do uzupełnienia: {children}]</span>;
}

/** Wspólny układ dokumentów: spis treści, oznaczenie wersji roboczej, nawigacja między dokumentami. */
export function LegalPage({ title, intro, path, sections, draft = true }: { title: string; intro: ReactNode; path: string; sections: LegalSection[]; draft?: boolean }) {
  return (
    <div className="wrap pb-24 pt-10 lg:pb-32">
      <header className="max-w-3xl">
        <h1 className="display text-[clamp(2.6rem,1rem+5vw,5.5rem)]">{title}</h1>
        <div className="mt-6 text-lg leading-relaxed text-muted">{intro}</div>
      </header>

      {draft && (
        <div role="note" className="mt-10 flex max-w-3xl gap-3 border border-dashed border-[#6b6b6b] px-5 py-4 text-sm leading-relaxed">
          <AlertIcon size={18} className="mt-0.5 shrink-0" />
          <p>
            <strong className="font-semibold">Projekt dokumentu – wersja robocza.</strong> Wymaga uzupełnienia danych sprzedawcy i weryfikacji przez prawnika przed
            uruchomieniem sprzedaży. Nie stanowi porady prawnej.
          </p>
        </div>
      )}

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-3">
          <nav aria-label="Spis treści" className="lg:sticky lg:top-28">
            <h2 className="mb-4 text-sm font-bold">Spis treści</h2>
            <ol className="space-y-2 border-l border-line text-sm">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-muted hover:border-paper hover:text-paper">
                    {i + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="prose-doc min-w-0 lg:col-span-8">
          {sections.map((section, i) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2 id={section.id}>
                {i + 1}. {section.title}
              </h2>
              {section.content}
            </section>
          ))}

          <nav aria-label="Pozostałe dokumenty" className="mt-16 border-t border-line pt-8">
            <h2 className="!mt-0">Pozostałe dokumenty</h2>
            <ul>
              {legalNav
                .filter((item) => item.href !== path)
                .map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
            </ul>
          </nav>
        </article>
      </div>
    </div>
  );
}
