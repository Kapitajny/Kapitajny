import Link from "next/link";
import type { ReactNode } from "react";
import { Info } from "@/components/ui/Icons";

interface LegalPageProps {
  title: string;
  updated: string;
  children: ReactNode;
}

/** Układ dokumentów prawnych. Treści są wersjami roboczymi i wymagają weryfikacji przed publikacją. */
export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <article className="container-x section-y">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="link text-sm font-semibold">
          ← Wróć na stronę główną
        </Link>
        <h1 className="h2 mt-8 text-wine">{title}</h1>
        <p className="mt-4 text-sm">Wersja robocza z dnia {updated}</p>
        <div className="mt-8 flex gap-3 rounded-[1.5rem] bg-blush p-5">
          <Info size={20} className="mt-0.5 shrink-0 text-wine" />
          <p>
            <strong>Dokument przykładowy.</strong> Treść opisuje działanie tej strony demonstracyjnej i nie jest gotowa do publikacji. Przed
            uruchomieniem prawdziwego serwisu należy uzupełnić dane administratora i zweryfikować dokument z prawnikiem.
          </p>
        </div>
        <div className="legal-content mt-12 space-y-10">{children}</div>
      </div>
    </article>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="h3">{title}</h2>
      {children}
    </section>
  );
}
