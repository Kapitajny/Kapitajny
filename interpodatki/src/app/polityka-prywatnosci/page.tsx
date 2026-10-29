import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Polityka prywatności",
  description: "Projekt polityki prywatności serwisu demonstracyjnego InterPodatki – struktura do uzupełnienia przez prawnika.",
  path: "/polityka-prywatnosci",
});

export default function PrivacyPage() {
  return (
    <LegalPage path="/polityka-prywatnosci" title="Polityka prywatności" lede="Jak serwis demonstracyjny postępuje z danymi wpisanymi w formularzach.">
      <h2>1. Administrator danych</h2>
      <p>[do uzupełnienia: pełna nazwa, adres, dane rejestrowe i kontakt administratora]. W wersji demonstracyjnej serwis nie ma administratora prowadzącego działalność – nie wpisuj prawdziwych danych.</p>
      <h2>2. Jakie dane przetwarza wersja demonstracyjna</h2>
      <ul>
        <li>Formularz wyceny i formularz kontaktowy: imię, zamaskowany adres e-mail i krótkie podsumowanie zgłoszenia.</li>
        <li>Zamówienie testowe: imię, opcjonalna nazwa firmy, zamaskowany adres e-mail, wybrany pakiet i kwoty.</li>
        <li>Anonimowy identyfikator sesji w ciasteczku technicznym, który wiąże zgłoszenia z przeglądarką.</li>
      </ul>
      <p>Dane są przechowywane wyłącznie w pamięci serwera demonstracyjnego, wygasają po kilku godzinach lub po restarcie serwera i nie są nikomu przekazywane. Numer telefonu i pełny adres e-mail nie są zapisywane.</p>
      <h2>3. Cele i podstawy przetwarzania</h2>
      <p>[do uzupełnienia przez prawnika: cele, podstawy prawne, okresy przechowywania dla wersji produkcyjnej].</p>
      <h2>4. Odbiorcy danych</h2>
      <p>[do uzupełnienia: dostawcy hostingu, poczty, CRM, operator płatności – jeśli zostaną wdrożeni].</p>
      <h2>5. Prawa osób, których dane dotyczą</h2>
      <p>[do uzupełnienia: opis praw i sposobu ich realizacji, informacja o prawie skargi do organu nadzorczego].</p>
      <h2>6. Pliki cookies</h2>
      <p>Szczegóły w dokumencie „Pliki cookies”.</p>
    </LegalPage>
  );
}
