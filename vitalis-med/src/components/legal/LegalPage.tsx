import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icons";
import { legalNav } from "@/config/site";

/** Układ dokumentu prawnego: nagłówek, ostrzeżenie o wersji roboczej, spis treści i treść. */
export function LegalPage({
  title,
  path,
  updated,
  toc,
  children,
}: {
  title: string;
  path: string;
  updated: string;
  toc: { id: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-line bg-mist">
        <div className="container-x py-14 lg:py-20">
          <nav aria-label="Okruszki" className="text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-ink">
                  Strona główna
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">
                {title}
              </li>
            </ol>
          </nav>
          <h1 className="mt-10 max-w-4xl text-[clamp(2.1rem,1.5rem+2.4vw,3.4rem)]">{title}</h1>
          <p className="mt-5 text-sm text-muted">Wersja robocza z dnia {updated}</p>
          <div className="mt-8 flex max-w-3xl gap-3 rounded-[4px] border border-line-strong bg-white p-5 text-[0.97rem] text-ink">
            <Icon name="alert" size={22} className="mt-0.5 shrink-0 text-red" />
            <p>
              <strong className="font-semibold">Projekt dokumentu – wymaga weryfikacji prawnej przed publikacją.</strong> Treść jest przykładowa, a pola w
              nawiasach kwadratowych należy uzupełnić prawdziwymi danymi. Dokument nie stanowi porady prawnej.
            </p>
          </div>
        </div>
      </section>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
        <aside className="min-w-0 lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <nav aria-labelledby="toc-title">
              <h2 id="toc-title" className="text-sm font-semibold text-muted">
                Spis treści
              </h2>
              <ol className="mt-4 space-y-2 border-l border-line text-[0.97rem]">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-body hover:border-red hover:text-ink">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <nav aria-labelledby="docs-title" className="mt-10 hidden lg:block">
              <h2 id="docs-title" className="text-sm font-semibold text-muted">
                Inne dokumenty
              </h2>
              <ul className="mt-4 space-y-2 text-[0.97rem]">
                {legalNav
                  .filter((d) => d.href !== path)
                  .map((d) => (
                    <li key={d.href}>
                      <Link href={d.href} className="link-quiet text-body hover:text-ink">
                        {d.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>
        </aside>
        <article className="prose-legal min-w-0 max-w-3xl lg:col-span-8">{children}</article>
      </div>
    </>
  );
}

/** Wyróżnienie pola do uzupełnienia w dokumentach. */
export function Fill({ children }: { children: ReactNode }) {
  return <mark className="rounded-[2px] bg-fog px-1 text-ink">[{children}]</mark>;
}
