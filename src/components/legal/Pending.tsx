import type { ReactNode } from "react";

/**
 * Wyraźne oznaczenie danych, które właściciel musi uzupełnić przed startem
 * (np. nazwa firmy, NIP, adres). Nie wpisujemy w ich miejsce wymyślonych wartości.
 */
export function Pending({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  if (tone === "dark") {
    return <span className="italic text-oat/55">do uzupełnienia</span>;
  }
  return (
    <span className="rounded-sm border border-dashed border-latte/60 bg-sand/70 px-1.5 py-0.5 text-[0.9em] text-espresso">[do uzupełnienia: {children}]</span>
  );
}
