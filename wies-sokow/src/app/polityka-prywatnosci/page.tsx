import type { Metadata } from "next";
import { LegalDraft } from "@/components/legal/LegalDraft";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  alternates: { canonical: "/polityka-prywatnosci" },
  robots: { index: false, follow: true },
};

const outline = [
  { title: "Administrator danych", scope: "Kto odpowiada za dane osobowe i jak się z nim skontaktować w sprawach prywatności." },
  { title: "Zakres i cele przetwarzania", scope: "Jakie dane zbiera sklep (zamówienia, formularz kontaktowy) i po co je przetwarza." },
  { title: "Podstawy prawne", scope: "Na jakiej podstawie przetwarzane są dane w każdym z celów." },
  { title: "Odbiorcy danych", scope: "Komu dane mogą być przekazywane, np. firmie kurierskiej, operatorowi płatności, dostawcy hostingu." },
  { title: "Okres przechowywania", scope: "Jak długo przechowywane są dane w zależności od celu." },
  { title: "Prawa osób, których dane dotyczą", scope: "Dostęp, sprostowanie, usunięcie, ograniczenie, sprzeciw, przenoszenie danych i skarga do organu nadzorczego." },
  { title: "Pliki cookies i dane w przeglądarce", scope: "Jakie pliki i dane lokalne wykorzystuje strona. Wersja demonstracyjna zapisuje koszyk wyłącznie w pamięci przeglądarki użytkownika." },
  { title: "Zmiany polityki", scope: "Jak sklep informuje o zmianach i od kiedy obowiązuje aktualna wersja." },
];

export default function PrivacyPage() {
  return <LegalDraft title="Polityka prywatności" href="/polityka-prywatnosci" outline={outline} />;
}
