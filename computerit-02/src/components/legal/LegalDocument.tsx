import Link from "next/link";
import type { ReactNode } from "react";

/** Miejsce do uzupełnienia – wyraźnie oznaczone, żeby nie wyglądało na gotową treść. */
export function Fill({ children }: { children: ReactNode }) {
  return <mark className="fill">[{children}]</mark>;
}

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-[calc(var(--header-h)+1.5rem)] border-t border-line pt-8">
      <h2 id={`${id}-h`}>{title}</h2>
      <div className="mt-4 space-y-4 text-ink/85">{children}</div>
    </section>
  );
}

export function LegalDocument({
  title,
  lead,
  toc,
  children,
}: {
  title: string;
  lead: ReactNode;
  toc: { id: string; title: string }[];
  children: ReactNode;
}) {
  return (
    <div className="container-x pt-[clamp(3rem,7vw,5rem)] pb-[clamp(4.5rem,10vw,8rem)]">
      <nav aria-label="Okruszki" className="text-[0.9rem] text-steel">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="link">
              Strona główna
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>
      <h1 className="h2 mt-8 max-w-3xl">{title}</h1>
      <p className="lead mt-5 max-w-3xl">{lead}</p>
      <div role="note" className="mt-8 flex max-w-3xl gap-4 rounded-xl border border-gold-deep/40 bg-[#f8f1e1] p-5 text-[0.95rem]">
        <span className="mt-1.5 size-2 shrink-0 rounded-[1px] bg-gold-deep" aria-hidden="true" />
        <p>
          <strong className="font-semibold">Projekt dokumentu – wymaga weryfikacji prawnej.</strong> Treść jest wzorem przygotowanym na potrzeby strony.
          Fragmenty oznaczone jako <Fill>do uzupełnienia</Fill> wymagają wpisania danych i decyzji ComputerIT. Przed publikacją dokument powinien
          sprawdzić prawnik.
        </p>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <nav aria-labelledby="spis" className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <h2 id="spis" className="eyebrow">
            Spis treści
          </h2>
          <ol className="mt-4 space-y-1 text-[0.925rem]">
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="inline-flex min-h-9 items-center text-steel transition-colors hover:text-ink">
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="legal max-w-3xl space-y-10 text-[1.025rem]">{children}</div>
      </div>
    </div>
  );
}
