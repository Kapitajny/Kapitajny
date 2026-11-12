import type { Metadata } from "next";
import { LegalDraft } from "@/components/legal/LegalDraft";

export const metadata: Metadata = {
  title: "Regulamin sklepu",
  alternates: { canonical: "/regulamin" },
  robots: { index: false, follow: true },
};

const outline = [
  { title: "Postanowienia ogólne", scope: "Kto prowadzi sklep, pełne dane sprzedawcy, definicje pojęć używanych w regulaminie." },
  { title: "Składanie zamówień", scope: "Jak przebiega zamówienie, kiedy dochodzi do zawarcia umowy i jak sklep je potwierdza." },
  { title: "Ceny i płatności", scope: "Sposób podawania cen, dostępne metody płatności i terminy zapłaty." },
  { title: "Dostawa", scope: "Obszar i sposoby dostawy, koszty, czas realizacji oraz odbiór przesyłki." },
  { title: "Prawo odstąpienia od umowy", scope: "Termin i sposób odstąpienia, zwrot towaru i płatności, wyjątki przewidziane przepisami." },
  { title: "Reklamacje", scope: "Odpowiedzialność sprzedawcy za zgodność towaru z umową, sposób zgłaszania i terminy rozpatrzenia." },
  { title: "Pozasądowe rozwiązywanie sporów", scope: "Informacja o dostępnych sposobach polubownego rozwiązywania sporów konsumenckich." },
  { title: "Postanowienia końcowe", scope: "Zmiany regulaminu, prawo właściwe i data wejścia w życie." },
];

export default function TermsPage() {
  return <LegalDraft title="Regulamin sklepu" href="/regulamin" outline={outline} />;
}
