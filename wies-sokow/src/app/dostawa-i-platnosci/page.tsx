import type { Metadata } from "next";
import { LegalDraft } from "@/components/legal/LegalDraft";

export const metadata: Metadata = {
  title: "Regulamin dostawy i płatności",
  alternates: { canonical: "/dostawa-i-platnosci" },
  robots: { index: false, follow: true },
};

const outline = [
  { title: "Sposoby dostawy", scope: "Dostępne formy dostawy i odbioru. W wersji demonstracyjnej: kurier oraz odbiór osobisty." },
  { title: "Koszty dostawy", scope: "Cennik dostawy i próg darmowej wysyłki. W wersji demonstracyjnej: kurier 15 zł, bezpłatnie od 150 zł." },
  { title: "Czas realizacji", scope: "Termin przygotowania i nadania zamówienia oraz przewidywany czas doręczenia." },
  { title: "Metody płatności", scope: "Obsługiwane formy płatności. Wersja demonstracyjna pokazuje przelew tradycyjny i płatność przy odbiorze, bez płatności online." },
  { title: "Odbiór i uszkodzenia w transporcie", scope: "Jak sprawdzić przesyłkę przy odbiorze i co zrobić, gdy opakowanie jest uszkodzone." },
  { title: "Zwroty płatności", scope: "W jaki sposób i w jakim terminie sklep zwraca płatności." },
];

export default function DeliveryPage() {
  return <LegalDraft title="Regulamin dostawy i płatności" href="/dostawa-i-platnosci" outline={outline} />;
}
