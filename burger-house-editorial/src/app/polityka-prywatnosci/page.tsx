import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Demonstracyjna polityka prywatności BUŁA burger house. Dokument przykładowy wymagający weryfikacji prawnej.",
  alternates: { canonical: "/polityka-prywatnosci" },
};

const sections: LegalSection[] = [
  {
    id: "administrator",
    title: "1. Administrator danych",
    body: (
      <p>
        Administratorem danych osobowych jest [nazwa firmy], [adres siedziby], NIP [numer] – dane do uzupełnienia. Kontakt w sprawach danych osobowych:
        telefonicznie {SITE.phone.display} lub przez formularz kontaktowy.
      </p>
    ),
  },
  {
    id: "zakres",
    title: "2. Jakie dane zbieramy",
    body: (
      <ul>
        <li>Formularz kontaktowy: imię, adres e-mail, opcjonalnie numer telefonu oraz treść wiadomości.</li>
        <li>Zamówienia telefoniczne: imię i numer telefonu potrzebne do realizacji zamówienia.</li>
        <li>Dane techniczne: adres IP i informacje o przeglądarce zapisywane w logach serwera.</li>
      </ul>
    ),
  },
  {
    id: "cele",
    title: "3. Cele i podstawy przetwarzania",
    body: (
      <ul>
        <li>Odpowiedź na wiadomość – na podstawie zgody (art. 6 ust. 1 lit. a RODO).</li>
        <li>Realizacja zamówienia – w celu wykonania umowy (art. 6 ust. 1 lit. b RODO).</li>
        <li>Bezpieczeństwo strony i obsługa reklamacji – prawnie uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO).</li>
      </ul>
    ),
  },
  {
    id: "okres",
    title: "4. Okres przechowywania",
    body: (
      <p>
        Dane z formularza przechowujemy do czasu udzielenia odpowiedzi i zamknięcia sprawy, nie dłużej niż 12 miesięcy. Dane związane z zamówieniem – przez
        okres wymagany przepisami podatkowymi i na potrzeby ewentualnych reklamacji.
      </p>
    ),
  },
  {
    id: "odbiorcy",
    title: "5. Odbiorcy danych",
    body: <p>Dane mogą być przekazywane dostawcom hostingu, poczty elektronicznej i systemów kasowych – wyłącznie w zakresie niezbędnym do świadczenia usług.</p>,
  },
  {
    id: "prawa",
    title: "6. Twoje prawa",
    body: (
      <ul>
        <li>Dostęp do danych, ich sprostowanie, usunięcie lub ograniczenie przetwarzania.</li>
        <li>Przenoszenie danych oraz sprzeciw wobec przetwarzania.</li>
        <li>Wycofanie zgody w dowolnym momencie, bez wpływu na wcześniejsze przetwarzanie.</li>
        <li>Skarga do Prezesa Urzędu Ochrony Danych Osobowych.</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "7. Pliki cookie i usługi zewnętrzne",
    body: (
      <p>
        Strona nie używa plików cookie analitycznych ani reklamowych. Mapy Google na podstronach lokali wczytujemy dopiero po kliknięciu „Pokaż mapę” – od
        tego momentu Google może zapisywać własne pliki cookie zgodnie ze swoją polityką prywatności.
      </p>
    ),
  },
  {
    id: "formularz",
    title: "8. Formularz demonstracyjny",
    body: <p>W obecnej wersji strony formularz kontaktowy działa demonstracyjnie: dane nie są wysyłane ani zapisywane na serwerze.</p>,
  },
];

export default function PrivacyPage() {
  return <LegalPage title="Polityka prywatności" updated="5 listopada 2026" sections={sections} />;
}
