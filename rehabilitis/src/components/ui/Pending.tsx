import type { ReactNode } from "react";

/**
 * Oznaczenie danych, które właściciel musi uzupełnić przed publikacją
 * (np. telefon, cena, kwalifikacje). Nie wpisujemy w ich miejsce wymyślonych wartości.
 */
export function Pending({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-control bg-brand-soft px-1.5 py-0.5 text-muted">
      {children}: <span className="italic">do uzupełnienia</span>
    </span>
  );
}

/** Brakująca wartość w tabeli (np. cena): kreska dla oka, pełna informacja dla czytnika ekranu. */
export function PendingValue() {
  return (
    <>
      <span aria-hidden="true" className="text-muted">
        —
      </span>
      <span className="sr-only">do uzupełnienia</span>
    </>
  );
}

/** Tekst z danych (np. FAQ), w którym fragmenty w [[podwójnych nawiasach]] oznaczają brakujące informacje. */
export function TextWithPending({ text }: { text: string }) {
  const parts = text.split(/\[\[(.+?)\]\]/);
  return <>{parts.map((part, i) => (i % 2 === 1 ? <Pending key={i}>{part}</Pending> : part))}</>;
}
