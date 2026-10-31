import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/Reveal";

/** Nagłówek podstrony: duży tytuł po lewej, krótki wstęp przesunięty w prawo. */
export function PageIntro({ title, children, aside }: { title: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="shell grid grid-cols-12 gap-x-6 gap-y-10 pt-[calc(var(--header-h)+5rem)] pb-16 md:pt-[calc(var(--header-h)+8rem)] md:pb-24">
      <Reveal className="col-span-12 lg:col-span-7">
        <h1 className="t-display">{title}</h1>
      </Reveal>
      {(children || aside) && (
        <Reveal delay={0.12} className="col-span-12 self-end md:col-span-8 lg:col-span-4 lg:col-start-9">
          {children && <div className="t-body text-[1.0625rem]">{children}</div>}
          {aside}
        </Reveal>
      )}
    </header>
  );
}
