import type { ReactNode } from "react";

/** Nagłówek podstrony: duży tytuł po lewej, krótki wstęp przesunięty w prawo. */
export function PageIntro({ title, children, aside }: { title: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="shell grid grid-cols-12 gap-x-6 gap-y-10 pt-[calc(var(--header-h)+5rem)] pb-16 md:pt-[calc(var(--header-h)+8rem)] md:pb-24">
      {/* nagłówek podstrony bez animacji wejścia: tu zwykle leży element LCP, a przejście strony i tak go wprowadza */}
      <h1 className="t-display col-span-12 lg:col-span-7">{title}</h1>
      {(children || aside) && (
        <div className="col-span-12 self-end md:col-span-8 lg:col-span-4 lg:col-start-9">
          {children && <div className="t-body text-[1.0625rem]">{children}</div>}
          {aside}
        </div>
      )}
    </header>
  );
}
