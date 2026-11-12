import type { Metadata } from "next";
import { LegalPage, Todo } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Polityka prywatności" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Polityka prywatności">
      <h2>Administrator danych</h2>
      <p>
        Administratorem danych osobowych jest <Todo>nazwa firmy, adres, NIP, e-mail kontaktowy</Todo>.
      </p>
      <h2>Jakie dane i po co</h2>
      <ul>
        <li>Rezerwacja: imię i nazwisko, e-mail, telefon, uwagi – w celu realizacji umowy wynajmu (art. 6 ust. 1 lit. b RODO).</li>
        <li>Formularz kontaktowy: imię, e-mail, treść wiadomości – w celu odpowiedzi, na podstawie zgody (art. 6 ust. 1 lit. a RODO).</li>
        <li>Rozliczenia: dane wymagane przepisami podatkowymi (art. 6 ust. 1 lit. c RODO).</li>
      </ul>
      <h2>Jak długo</h2>
      <p>
        Dane rezerwacji przechowujemy przez czas potrzebny do realizacji umowy i dochodzenia roszczeń: <Todo>okres przechowywania</Todo>.
      </p>
      <h2>Odbiorcy</h2>
      <p>
        Dane mogą otrzymać podmioty, które obsługują dla nas hosting i komunikację: <Todo>lista dostawców</Todo>. Mapa Google wczytuje się dopiero po Twojej zgodzie.
      </p>
      <h2>Twoje prawa</h2>
      <p>
        Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przeniesienia, sprzeciwu oraz cofnięcia zgody. Możesz złożyć skargę do
        Prezesa UODO.
      </p>
    </LegalPage>
  );
}
