import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Regulamin (demo)",
  description: "Demonstracyjny regulamin serwisu InterPodatki – struktura dokumentu do opracowania przez prawnika.",
  path: "/regulamin",
});

export default function TermsPage() {
  return (
    <LegalPage path="/regulamin" title="Regulamin serwisu (demo)" lede="Zasady korzystania z serwisu demonstracyjnego oraz struktura przyszłego regulaminu.">
      <h2>1. Charakter serwisu</h2>
      <p>Serwis InterPodatki jest projektem demonstracyjnym. Nie świadczy usług księgowych, kadrowych ani doradztwa podatkowego, nie zawiera umów i nie przyjmuje płatności.</p>
      <h2>2. Kalkulator i ceny</h2>
      <p>Wyniki kalkulatora i ceny pakietów są przykładowe. Nie stanowią oferty w rozumieniu przepisów prawa cywilnego.</p>
      <h2>3. Zamówienia i płatności demonstracyjne</h2>
      <p>Zamówienie testowe i płatność są symulowane. Serwis nie łączy się z operatorem płatności, nie przetwarza danych kart płatniczych i nie pobiera środków. Potwierdzenie zamówienia nie jest potwierdzeniem płatności ani zawarcia umowy.</p>
      <h2>4. Zasady korzystania</h2>
      <p>Nie wpisuj prawdziwych danych osobowych, danych firmy ani danych płatniczych.</p>
      <h2>5. Struktura regulaminu produkcyjnego</h2>
      <ul>
        <li>Definicje i dane usługodawcy [do uzupełnienia]</li>
        <li>Rodzaje i zakres usług świadczonych drogą elektroniczną [do uzupełnienia]</li>
        <li>Zawarcie umowy, abonament, opłaty i płatności [do uzupełnienia]</li>
        <li>Okres wypowiedzenia i zmiana pakietu [do uzupełnienia]</li>
        <li>Reklamacje [do uzupełnienia]</li>
        <li>Ochrona danych osobowych i powierzenie przetwarzania [do uzupełnienia]</li>
        <li>Postanowienia końcowe [do uzupełnienia]</li>
      </ul>
    </LegalPage>
  );
}
