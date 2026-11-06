import Link from "next/link";
import { Fill, LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Polityka prywatności",
  description: "Projekt polityki prywatności: administrator danych, cele i podstawy przetwarzania, okresy przechowywania, odbiorcy danych i prawa osób.",
  path: "/polityka-prywatnosci",
});

const toc = [
  { id: "administrator", label: "1. Administrator danych" },
  { id: "zakres", label: "2. Jakie dane przetwarzamy" },
  { id: "cele", label: "3. Cele i podstawy prawne" },
  { id: "formularz", label: "4. Formularz kontaktowy" },
  { id: "okres", label: "5. Okres przechowywania" },
  { id: "odbiorcy", label: "6. Odbiorcy danych" },
  { id: "prawa", label: "7. Twoje prawa" },
  { id: "bezpieczenstwo", label: "8. Bezpieczeństwo" },
  { id: "zmiany", label: "9. Zmiany polityki" },
];

export default function PrivacyPage() {
  const { contact } = siteConfig;
  return (
    <LegalPage title="Polityka prywatności" path="/polityka-prywatnosci" updated="06.11.2026" toc={toc}>
      <h2 id="administrator">1. Administrator danych</h2>
      <p>
        Administratorem danych osobowych jest {siteConfig.legalName}, {contact.street}, {contact.postalCode} {contact.city}, NIP <Fill>NIP</Fill> (dalej:
        „Administrator”). Kontakt: <a href={`mailto:${contact.email}`}>{contact.email}</a>, tel. <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.
      </p>
      <p>
        Inspektor ochrony danych: <Fill>imię i nazwisko lub nazwa / adres e-mail IOD – jeżeli został wyznaczony</Fill>. Podmiot leczniczy przetwarzający
        dane o zdrowiu na dużą skalę jest co do zasady zobowiązany do wyznaczenia IOD <Fill>do weryfikacji</Fill>.
      </p>

      <h2 id="zakres">2. Jakie dane przetwarzamy</h2>
      <ul>
        <li>dane kontaktowe: imię i nazwisko, numer telefonu, adres e-mail;</li>
        <li>dane dotyczące usługi: rodzaj usługi, miejsce odbioru i miejsce docelowe, preferowany termin, dodatkowe informacje;</li>
        <li>
          przy realizacji świadczeń – dane Pacjenta, w tym dane dotyczące zdrowia, w zakresie wymaganym przepisami o dokumentacji medycznej (szczegóły w{" "}
          <Link href="/klauzula-rodo">Klauzuli informacyjnej RODO</Link>);
        </li>
        <li>dane techniczne związane z korzystaniem ze strony (np. adres IP w logach serwera).</li>
      </ul>
      <p>
        <strong>W formularzu kontaktowym nie prosimy o diagnozę ani szczegóły leczenia.</strong> Prosimy o niewpisywanie takich informacji – o stanie
        Pacjenta porozmawiamy telefonicznie w niezbędnym zakresie.
      </p>

      <h2 id="cele">3. Cele i podstawy prawne przetwarzania</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Cel</th>
            <th scope="col">Podstawa prawna</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Odpowiedź na zapytanie i przygotowanie oferty</td>
            <td>art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy) lub lit. f RODO (prawnie uzasadniony interes)</td>
          </tr>
          <tr>
            <td>Realizacja umowy o usługę transportu lub zabezpieczenia medycznego</td>
            <td>art. 6 ust. 1 lit. b RODO</td>
          </tr>
          <tr>
            <td>Udzielanie świadczeń zdrowotnych i prowadzenie dokumentacji medycznej</td>
            <td>art. 6 ust. 1 lit. c oraz art. 9 ust. 2 lit. h RODO w zw. z przepisami o działalności leczniczej i prawach pacjenta</td>
          </tr>
          <tr>
            <td>Rozliczenia, księgowość i obowiązki podatkowe</td>
            <td>art. 6 ust. 1 lit. c RODO</td>
          </tr>
          <tr>
            <td>Dochodzenie lub obrona przed roszczeniami, bezpieczeństwo strony</td>
            <td>art. 6 ust. 1 lit. f RODO</td>
          </tr>
        </tbody>
      </table>

      <h2 id="formularz">4. Formularz kontaktowy</h2>
      <p>
        Dane z formularza wykorzystujemy wyłącznie do udzielenia odpowiedzi i ewentualnego przygotowania Zlecenia. Podanie danych jest dobrowolne, ale
        niezbędne do udzielenia odpowiedzi. Wiadomości z formularza są przekazywane do skrzynki Administratora za pośrednictwem{" "}
        <Fill>nazwa dostawcy poczty / systemu zgłoszeń</Fill>.
      </p>

      <h2 id="okres">5. Okres przechowywania danych</h2>
      <ul>
        <li>zapytania, które nie zakończyły się Zleceniem – do <Fill>12 miesięcy</Fill> od ostatniego kontaktu;</li>
        <li>dane związane z umową – przez okres przedawnienia roszczeń;</li>
        <li>dokumentacja rozliczeniowa – przez okres wymagany przepisami podatkowymi;</li>
        <li>dokumentacja medyczna – przez okres określony w ustawie o prawach pacjenta i Rzeczniku Praw Pacjenta (co do zasady 20 lat).</li>
      </ul>

      <h2 id="odbiorcy">6. Odbiorcy danych</h2>
      <p>
        Dane mogą być przekazywane podmiotom przetwarzającym je na zlecenie Administratora (dostawcy usług IT, hostingu i poczty, biuro rachunkowe), a
        także podmiotom uprawnionym na podstawie przepisów prawa (np. NFZ, placówki przejmujące Pacjenta, organy publiczne). Dane nie są przekazywane poza
        Europejski Obszar Gospodarczy, chyba że <Fill>opisać ewentualne przekazanie i zabezpieczenia</Fill>.
      </p>

      <h2 id="prawa">7. Twoje prawa</h2>
      <p>Przysługuje Ci prawo do:</p>
      <ul>
        <li>dostępu do danych i otrzymania ich kopii,</li>
        <li>sprostowania danych,</li>
        <li>usunięcia danych lub ograniczenia przetwarzania – w przypadkach przewidzianych w RODO,</li>
        <li>przenoszenia danych,</li>
        <li>wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,</li>
        <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).</li>
      </ul>

      <h2 id="bezpieczenstwo">8. Bezpieczeństwo</h2>
      <p>
        Stosujemy środki techniczne i organizacyjne odpowiednie do ryzyka, w tym szyfrowane połączenie (HTTPS), ograniczenie dostępu do danych do osób
        upoważnionych i zabezpieczenia przed nadmierną liczbą zgłoszeń z formularza.
      </p>

      <h2 id="zmiany">9. Zmiany polityki</h2>
      <p>
        Polityka może być aktualizowana. Informacje o plikach cookies znajdziesz w <Link href="/polityka-cookies">Polityce cookies</Link>.
      </p>
    </LegalPage>
  );
}
