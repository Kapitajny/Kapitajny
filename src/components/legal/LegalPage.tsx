import type { ReactNode } from "react";

/** Szablon dokumentów prawnych. Treści są projektami do weryfikacji przez prawnika. */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="on-light bg-white pb-24 pt-28 md:pt-36">
      <div className="wrap">
        <h1 className="display-lg max-w-[16ch]">{title}</h1>
        <span className="wake mt-6 rotate-[-3deg] w-[min(36rem,90%)]" aria-hidden="true" />
        <p className="mt-8 max-w-2xl border-l-4 border-turq py-1 pl-4 text-muted">
          Projekt dokumentu dla wersji demonstracyjnej strony. Przed uruchomieniem wypożyczalni wymaga uzupełnienia danych firmy i weryfikacji przez prawnika.
        </p>
        <div className="legal mt-10 max-w-[68ch] text-[1.05rem] leading-relaxed [&_h2]:mt-10 [&_h2]:font-sans [&_h2]:text-xl [&_h2]:font-bold [&_h2]:normal-case [&_h2]:tracking-normal [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Todo({ children }: { children: ReactNode }) {
  return <span className="border border-dashed border-warn/60 bg-sand px-1.5 py-0.5 text-[0.92em]">[do uzupełnienia: {children}]</span>;
}
