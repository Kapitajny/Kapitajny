import type { ReactNode } from "react";

/**
 * Wyraźne oznaczenie danych, które właściciel sklepu musi uzupełnić przed startem
 * (np. nazwa firmy, NIP, adres). Nie wpisujemy w ich miejsce wymyślonych wartości.
 */
export function Pending({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  if (tone === "dark") return <span className="italic text-sage/70">[do uzupełnienia: {children}]</span>;
  return <span className="rounded-sm border border-dashed border-gold/70 bg-beige/70 px-1.5 py-0.5 text-[0.9em] text-ink">[do uzupełnienia: {children}]</span>;
}

/** Wartość z konfiguracji albo znacznik „do uzupełnienia”. */
export function Filled({ value, label, tone }: { value: string; label: string; tone?: "light" | "dark" }) {
  return value ? <>{value}</> : <Pending tone={tone}>{label}</Pending>;
}
