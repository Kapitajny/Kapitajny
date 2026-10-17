import Link from "next/link";
import type { ReactNode } from "react";
import { legalNav } from "@/config/site";
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
    <div className="container-x pb-24 pt-10 lg:pb-32 lg:pt-14">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-roast">
        <ArrowLeftIcon size={16} /> Strona główna
      </Link>

      <header className="mt-10 max-w-3xl">
        <p className="eyebrow">Dokumenty NOIR COFFEE</p>
        <h1 className="mt-5 text-[clamp(2.3rem,1.4rem+3.2vw,4.2rem)]">{title}</h1>
        <div className="mt-6 text-lg leading-relaxed text-muted">{intro}</div>
      </header>

      <div
        role="note"
        className="mt-10 flex max-w-3xl gap-3 rounded-xl border border-dashed border-latte/70 bg-paper px-5 py-4 text-sm leading-relaxed text-espresso"
      >
        <AlertIcon size={18} className="mt-0.5 shrink-0 text-latte" />
        <p>
          <strong className="font-semibold">Projekt dokumentu – wersja robocza.</strong> Treść wymaga uzupełnienia danych sprzedawcy oraz weryfikacji przez
          prawnika przed uruchomieniem sprzedaży. Nie została zweryfikowana prawnie i nie stanowi porady prawnej. Fragmenty oznaczone „do uzupełnienia” zależą
          od decyzji właściciela.
        </p>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="lg:sticky lg:top-24">
            <nav aria-label="Spis treści">
              <h2 className="eyebrow mb-4">Spis treści</h2>
              <ol className="space-y-2 border-l border-line text-sm">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px block border-l border-transparent py-1 pl-4 text-muted transition-colors hover:border-roast hover:text-roast"
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
                <span className="mr-2 text-latte tabular-nums">{i + 1}.</span>
                {section.title}
              </h2>
              {section.content}
            </section>
          ))}

          <nav aria-label="Pozostałe dokumenty" className="mt-16 border-t border-line pt-8">
            <h2 className="!mt-0 !mb-4 !text-base font-sans font-semibold">Pozostałe dokumenty</h2>
            <ul className="!list-none !pl-0">
              {legalNav
                .filter((item) => item.href !== path)
                .map((item) => (
                  <li key={item.href} className="!pl-0">
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
            </ul>
            <Link href="/" className="btn btn-secondary mt-6 !no-underline">
              <ArrowLeftIcon size={18} /> Wróć na stronę główną
            </Link>
          </nav>
        </article>
      </div>
    </div>
  );
}
