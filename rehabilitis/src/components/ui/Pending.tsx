import type { ReactNode } from "react";

/**
 * Wyraźne oznaczenie danych, które właściciel musi uzupełnić przed publikacją
 * (np. telefon, cena, kwalifikacje). Nie wpisujemy w ich miejsce wymyślonych wartości.
 */
export function Pending({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  if (tone === "dark") {
    return <span className="italic text-paper/60">do uzupełnienia: {children}</span>;
  }
  return (
    <span className="rounded-sm border border-dashed border-moss/50 bg-sand/80 px-1.5 py-0.5 text-[0.88em] text-graphite">
      [do uzupełnienia: {children}]
    </span>
  );
}

/** Krótka wartość do uzupełnienia w tabelach i listach, np. „Cena do uzupełnienia”. */
export function PendingValue({ label }: { label: string }) {
  return <span className="whitespace-nowrap border-b border-dashed border-moss/60 text-[0.9rem] italic text-muted">{label} do uzupełnienia</span>;
}

/** Tekst z danych (np. FAQ), w którym fragmenty w [[podwójnych nawiasach]] oznaczają brakujące informacje. */
export function TextWithPending({ text }: { text: string }) {
  const parts = text.split(/\[\[(.+?)\]\]/);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <Pending key={i}>{part}</Pending> : part))}
    </>
  );
}
