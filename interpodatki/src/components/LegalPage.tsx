import type { ReactNode } from "react";
import { Notice } from "@/components/ui/Notice";
import { PageIntro } from "@/components/ui/PageIntro";

export function LegalPage({
  path,
  title,
  lede,
  children,
}: {
  path: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageIntro crumbs={[{ href: path, label: title }]} title={title} lede={lede} />
      <div className="shell py-12 sm:py-16">
        <Notice tone="warning" title="Projekt dokumentu – wymaga weryfikacji prawnej" className="mb-10 max-w-3xl">
          To struktura dokumentu przygotowana dla wersji demonstracyjnej. Nie jest gotowa do użycia produkcyjnego. Przed
          publikacją treść musi przygotować lub zweryfikować prawnik, a pola oznaczone [do uzupełnienia] – uzupełnić
          zgodnie ze stanem faktycznym.
        </Notice>
        <div className="prose-body text-ink">{children}</div>
      </div>
    </>
  );
}
