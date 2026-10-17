import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { Pending } from "@/components/legal/Pending";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Jakie dane przetwarza NOIR COFFEE przy zamówieniach online, w jakim celu, jak długo i jakie prawa Ci przysługują.",
};

const sections: LegalSection[] = [
  {
    id: "administrator",
    title: "Administrator danych",
    content: (
      <>
        <p>
          Administratorem Twoich danych osobowych jest <Pending>pełna nazwa firmy</Pending>, <Pending>adres siedziby</Pending>, NIP: <Pending>NIP</Pending>{" "}
          (dalej: „Administrator” lub „my”).
        </p>
        <p>
          W sprawach dotyczących danych osobowych możesz skontaktować się z nami pod adresem e-mail: <Pending>adres e-mail do spraw danych osobowych</Pending>.
          Inspektor ochrony danych: <Pending>dane IOD, jeśli został wyznaczony – w przeciwnym razie usuń to zdanie</Pending>.
        </p>
      </>
    ),
  },
  {
    id: "zakres-i-cele",
    title: "Jakie dane przetwarzamy, w jakim celu i jak długo",
    content: (
      <>
        <p>Przetwarzamy wyłącznie dane potrzebne do realizacji opisanych poniżej celów.</p>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th scope="col">Sytuacja</th>
                <th scope="col">Dane</th>
                <th scope="col">Cel i podstawa prawna</th>
                <th scope="col">Okres przechowywania</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Zamówienie online</td>
                <td>imię, adres e-mail, zamówione napoje i opcje, wybrany lokal, dzień i godzina odbioru, kwota, numer i status zamówienia</td>
                <td>zawarcie i wykonanie umowy (art. 6 ust. 1 lit. b RODO)</td>
                <td>
                  przez czas realizacji zamówienia, następnie do upływu okresu przedawnienia roszczeń <Pending>okres do weryfikacji</Pending>
                </td>
              </tr>
              <tr>
                <td>Rozliczenia</td>
                <td>dane zamówienia i transakcji niezbędne w dokumentacji księgowej</td>
                <td>obowiązki podatkowe i rachunkowe (art. 6 ust. 1 lit. c RODO)</td>
                <td>
                  przez okres wymagany przepisami podatkowymi i o rachunkowości (co do zasady 5 lat od końca roku kalendarzowego){" "}
                  <Pending>do potwierdzenia z księgowością</Pending>
                </td>
              </tr>
              <tr>
                <td>Płatność</td>
                <td>
                  identyfikator sesji i transakcji, kwota, status płatności; dane płatnicze (np. numer karty) przetwarza wyłącznie operator płatności – nie mamy
                  do nich dostępu
                </td>
                <td>
                  wykonanie umowy (art. 6 ust. 1 lit. b RODO) oraz nasz prawnie uzasadniony interes w wyjaśnianiu spraw dotyczących płatności (art. 6 ust. 1
                  lit. f RODO)
                </td>
                <td>jak dla zamówienia</td>
              </tr>
              <tr>
                <td>Reklamacje i kontakt</td>
                <td>dane podane w zgłoszeniu i korespondencji</td>
                <td>rozpatrzenie reklamacji (art. 6 ust. 1 lit. c RODO), odpowiedź na wiadomość i obrona przed roszczeniami (art. 6 ust. 1 lit. f RODO)</td>
                <td>przez czas rozpatrywania sprawy, a następnie do upływu okresu przedawnienia roszczeń</td>
              </tr>
              <tr>
                <td>Newsletter (jeśli zostanie uruchomiony)</td>
                <td>adres e-mail, data i treść zgody</td>
                <td>wysyłka newslettera na podstawie zgody (art. 6 ust. 1 lit. a RODO); dowód udzielenia zgody (art. 6 ust. 1 lit. f RODO)</td>
                <td>do wycofania zgody; dowód zgody – do upływu okresu przedawnienia roszczeń</td>
              </tr>
              <tr>
                <td>Bezpieczeństwo Strony</td>
                <td>adres IP, data i godzina żądania, informacje o przeglądarce zapisywane w logach serwera</td>
                <td>zapewnienie bezpieczeństwa i ciągłości działania Strony (art. 6 ust. 1 lit. f RODO)</td>
                <td>
                  <Pending>okres przechowywania logów u dostawcy hostingu</Pending>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Newsletter:</strong> do czasu podłączenia systemu mailingowego formularz newslettera nie zapisuje adresów e-mail i informuje o tym po
          wysłaniu.
        </p>
        <p>
          <strong>Pamięć przeglądarki:</strong> zawartość koszyka i wybrany lokal są zapisywane wyłącznie na Twoim urządzeniu i trafiają do nas dopiero w chwili
          składania zamówienia. Szczegóły w <Link href="/cookies">Polityce plików cookies</Link>.
        </p>
      </>
    ),
  },
  {
    id: "dobrowolnosc",
    title: "Dobrowolność podania danych",
    content: (
      <p>
        Podanie imienia i adresu e-mail jest dobrowolne, ale niezbędne do złożenia zamówienia online – bez nich nie możemy przyjąć zamówienia ani skontaktować
        się w jego sprawie. Podanie adresu e-mail do newslettera jest w pełni dobrowolne.
      </p>
    ),
  },
  {
    id: "odbiorcy",
    title: "Odbiorcy danych",
    content: (
      <>
        <p>Twoje dane mogą być przekazywane wyłącznie podmiotom, które pomagają nam prowadzić sprzedaż, w niezbędnym zakresie:</p>
        <ul>
          <li>
            <strong>Stripe Payments Europe, Limited</strong> (Irlandia) – operator płatności online; w zakresie obsługi płatności i przeciwdziałania oszustwom
            Stripe działa również jako odrębny administrator, zgodnie z własną polityką prywatności,
          </li>
          <li>
            dostawca hostingu i infrastruktury serwerowej: <Pending>nazwa dostawcy</Pending>,
          </li>
          <li>
            dostawca poczty e-mail: <Pending>nazwa dostawcy</Pending>,
          </li>
          <li>
            dostawca systemu newslettera (jeśli zostanie uruchomiony): <Pending>nazwa dostawcy</Pending>,
          </li>
          <li>
            biuro rachunkowe: <Pending>nazwa, jeśli dotyczy</Pending>,
          </li>
          <li>
            <strong>Google Ireland Limited</strong> – wyłącznie po kliknięciu „Wczytaj mapę” w sekcji „Nasze lokale” (Google otrzymuje wtedy m.in. Twój adres IP
            i może zapisywać pliki cookie zgodnie z własną polityką prywatności),
          </li>
          <li>organy publiczne – gdy obowiązek przekazania danych wynika z przepisów prawa.</li>
        </ul>
      </>
    ),
  },
  {
    id: "transfer",
    title: "Przekazywanie danych poza Europejski Obszar Gospodarczy",
    content: (
      <p>
        Stripe i Google mogą przetwarzać dane również w Stanach Zjednoczonych. Podstawą takiego przekazania jest decyzja Komisji Europejskiej stwierdzająca
        odpowiedni stopień ochrony (EU-US Data Privacy Framework) w odniesieniu do certyfikowanych podmiotów lub standardowe klauzule umowne zatwierdzone przez
        Komisję Europejską. <Pending>potwierdzić w umowach z dostawcami</Pending>
      </p>
    ),
  },
  {
    id: "prawa",
    title: "Twoje prawa",
    content: (
      <>
        <p>W związku z przetwarzaniem danych masz prawo do:</p>
        <ul>
          <li>dostępu do swoich danych i otrzymania ich kopii (art. 15 RODO),</li>
          <li>sprostowania danych (art. 16 RODO),</li>
          <li>usunięcia danych (art. 17 RODO),</li>
          <li>ograniczenia przetwarzania (art. 18 RODO),</li>
          <li>przenoszenia danych przetwarzanych na podstawie umowy lub zgody (art. 20 RODO),</li>
          <li>wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie (art. 21 RODO),</li>
          <li>wycofania zgody w dowolnym momencie – bez wpływu na zgodność z prawem przetwarzania przed jej wycofaniem (art. 7 ust. 3 RODO),</li>
          <li>
            wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa), jeśli uważasz, że przetwarzamy Twoje dane niezgodnie z
            prawem.
          </li>
        </ul>
        <p>Aby skorzystać z praw, napisz do nas na adres podany w punkcie 1.</p>
      </>
    ),
  },
  {
    id: "zautomatyzowane-decyzje",
    title: "Zautomatyzowane podejmowanie decyzji",
    content: (
      <p>
        Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu, w tym profilowaniu. Operator płatności może stosować
        zautomatyzowane mechanizmy zapobiegania oszustwom płatniczym zgodnie z własną polityką prywatności.
      </p>
    ),
  },
  {
    id: "bezpieczenstwo",
    title: "Bezpieczeństwo",
    content: (
      <p>
        Strona korzysta z szyfrowanego połączenia (HTTPS). Klucze dostępu do systemu płatności są przechowywane wyłącznie po stronie serwera, a dostęp do danych
        zamówień mają tylko upoważnione osoby. <Pending>opis środków organizacyjnych właściwych dla firmy</Pending>
      </p>
    ),
  },
  {
    id: "zmiany",
    title: "Zmiany polityki prywatności",
    content: (
      <p>
        O istotnych zmianach poinformujemy na Stronie. Wersja obowiązująca od: <Pending>data</Pending>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Polityka prywatności"
      path="/polityka-prywatnosci"
      intro={
        <p>
          Wyjaśniamy, jakie dane przetwarzamy przy zamówieniach online i kontakcie z nami, w jakim celu, jak długo je przechowujemy i jakie prawa Ci
          przysługują.
        </p>
      }
      sections={sections}
    />
  );
}
