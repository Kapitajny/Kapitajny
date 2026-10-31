import Link from "next/link";
import type { ReactNode } from "react";
import { legalNav } from "@/config/site";
import { AlertIcon, ArrowLeftIcon } from "@/components/ui/Icons";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

/** Wspólny układ dokumentów: spis treści, oznaczenie wersji roboczej, nawigacja między dokumentami. */
export function LegalPage({ title, intro, path, sections, updated = "do uzupełnienia" }: { title: string; intro: ReactNode; path: string; sections: LegalSection[]; updated?: string }) {
  return (
    <div className="container-x pb-24 pt-8 lg:pb-32 lg:pt-12">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-forest">
        <ArrowLeftIcon size={16} /> Strona główna
      </Link>

      <header className="mt-8 max-w-3xl">
        <p className="eyebrow">Dokumenty NOVELIA ZDROWIE</p>
        <h1 className="mt-5 text-[clamp(2.2rem,1.4rem+3vw,3.8rem)]">{title}</h1>
        <div className="mt-6 text-lg leading-relaxed text-muted">{intro}</div>
        <p className="mt-4 text-sm text-muted">Data obowiązywania: {updated}</p>
      </header>

      <div role="note" className="mt-10 flex max-w-3xl gap-3 border border-dashed border-gold bg-cream px-5 py-4 text-sm leading-relaxed">
        <AlertIcon size={18} className="mt-0.5 shrink-0 text-gold" />
        <p>
          <strong className="font-semibold">Projekt dokumentu – wersja robocza.</strong> Treść wymaga uzupełnienia danych sprzedawcy oraz weryfikacji przez prawnika przed rozpoczęciem
          sprzedaży. Nie stanowi porady prawnej. Fragmenty oznaczone „do uzupełnienia” zależą od decyzji właściciela sklepu.
        </p>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-4 xl:col-span-3">
          <nav aria-label="Spis treści" className="lg:sticky lg:top-24">
            <h2 className="eyebrow mb-4">Spis treści</h2>
            <ol className="space-y-1 border-l border-line text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-muted transition-colors hover:border-forest hover:text-forest">
                    <span className="tabular-nums">§ {i + 1}.</span> {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <article className="prose-legal min-w-0 max-w-3xl lg:col-span-8 xl:col-span-7">
          {sections.map((s, i) => (
            <section key={s.id} aria-labelledby={s.id}>
              <h2 id={s.id} className="scroll-mt-24">
                <span className="mr-2 text-gold tabular-nums">§ {i + 1}.</span>
                {s.title}
              </h2>
              {s.content}
            </section>
          ))}
          <nav aria-label="Pozostałe dokumenty" className="mt-16 border-t border-line pt-8">
            <h2 className="!mt-0 !mb-4 !font-sans !text-base !font-medium">Pozostałe dokumenty</h2>
            <ul className="!list-none !pl-0">
              {legalNav
                .filter((item) => item.href !== path)
                .map((item) => (
                  <li key={item.href} className="!pl-0">
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
