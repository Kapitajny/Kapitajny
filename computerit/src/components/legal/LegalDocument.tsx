import Link from "next/link";
import type { ReactNode } from "react";

/** Wspólny układ dokumentów prawnych (regulamin, polityka prywatności). */

export function Fill({ children }: { children: ReactNode }) {
  return <mark className="bg-sun/35 px-1 text-ink">{children}</mark>;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-ink/12 pt-8">
      <h2 className="wide text-[1.375rem]">{title}</h2>
      <div className="mt-4 space-y-4 text-ink/85">{children}</div>
    </section>
  );
}

export function LegalDocument({ title, draftNote, children }: { title: string; draftNote: ReactNode; children: ReactNode }) {
  return (
    <div className="container-x pt-[calc(var(--header-h)+clamp(2.5rem,6vw,4.5rem))] pb-[clamp(5rem,10vw,8rem)]">
      <div className="max-w-[46rem]">
        <Link href="/" className="link-underline text-[0.9375rem] text-slate hover:text-ink">
          Wróć na stronę główną
        </Link>
        <h1 className="wide mt-8 text-[clamp(2.25rem,5vw,3.75rem)]">{title}</h1>
        <p className="mt-6 border-l-2 border-sun bg-white px-5 py-4 text-[0.9375rem] text-slate">{draftNote}</p>
        <div className="mt-12 space-y-10 text-[1.0625rem]">{children}</div>
      </div>
    </div>
  );
}
