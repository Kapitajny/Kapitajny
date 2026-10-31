import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { Pending } from "@/components/legal/Pending";
import { SellerBlock } from "@/components/legal/SellerBlock";

export const metadata: Metadata = { title: "Polityka prywatności", alternates: { canonical: "/polityka-prywatnosci" } };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Polityka prywatności"
      path="/polityka-prywatnosci"
      intro={<p>Informacje o przetwarzaniu danych osobowych w sklepie NOVELIA ZDROWIE zgodnie z RODO (rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679).</p>}
      sections={[
        {
          id: "administrator",
          title: "Administrator danych",
          content: (
            <>
              <p>Administratorem danych osobowych jest:</p>
              <SellerBlock />
              <p>W sprawach dotyczących danych osobowych można kontaktować się pod adresem e-mail wskazanym powyżej.</p>
            </>
          ),
        },
        {
          id: "zakres",
          title: "Jakie dane przetwarzamy",
          content: (
            <ul>
              <li>przy zamówieniu: adres e-mail, opcjonalnie imię i nazwisko, numer i treść zamówienia, data złożenia oświadczeń, historia pobrań pliku (data, skrót adresu IP),</li>
              <li>przy płatności: dane niezbędne do realizacji płatności przetwarza operator płatności (Stripe) – Sklep nie otrzymuje pełnych danych karty,</li>
              <li>przy kontakcie: imię, adres e-mail i treść wiadomości,</li>
              <li>dane techniczne: logi serwera (m.in. adres IP, data i godzina żądania) w celu zapewnienia bezpieczeństwa.</li>
            </ul>
          ),
        },
        {
          id: "cele",
          title: "Cele i podstawy prawne",
          content: (
            <table>
              <thead>
                <tr>
                  <th>Cel</th>
                  <th>Podstawa prawna</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Zawarcie i wykonanie umowy (realizacja zamówienia, dostarczenie pliku, e-maile transakcyjne)</td>
                  <td>art. 6 ust. 1 lit. b RODO</td>
                </tr>
                <tr>
                  <td>Rozpatrywanie reklamacji, obowiązki księgowe i podatkowe</td>
                  <td>art. 6 ust. 1 lit. c RODO</td>
                </tr>
                <tr>
                  <td>Ustalenie, dochodzenie i obrona roszczeń; zapewnienie bezpieczeństwa sklepu i ochrona przed nadużyciami (np. limit pobrań)</td>
                  <td>art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes)</td>
                </tr>
                <tr>
                  <td>Odpowiedź na wiadomość z formularza kontaktowego</td>
                  <td>art. 6 ust. 1 lit. f RODO</td>
                </tr>
              </tbody>
            </table>
          ),
        },
        {
          id: "odbiorcy",
          title: "Odbiorcy danych",
          content: (
            <>
              <p>Dane mogą być przekazywane podmiotom przetwarzającym je na zlecenie administratora lub działającym jako odrębni administratorzy:</p>
              <ul>
                <li>operator płatności: Stripe Payments Europe, Ltd. (Irlandia) – w zakresie obsługi płatności,</li>
                <li>dostawca hostingu: <Pending>nazwa dostawcy hostingu</Pending>,</li>
                <li>dostawca usługi wysyłki e-maili: <Pending>np. Resend lub operator serwera SMTP</Pending>,</li>
                <li>biuro rachunkowe: <Pending>jeśli dotyczy</Pending>.</li>
              </ul>
              <p>
                Niektórzy dostawcy mogą przetwarzać dane poza Europejskim Obszarem Gospodarczym – w takim przypadku na podstawie odpowiednich zabezpieczeń (np. decyzji
                Komisji Europejskiej stwierdzającej odpowiedni stopień ochrony lub standardowych klauzul umownych). <Pending>do weryfikacji dla wybranych dostawców</Pending>
              </p>
            </>
          ),
        },
        {
          id: "okres",
          title: "Okres przechowywania",
          content: (
            <ul>
              <li>dane zamówień – przez okres wymagany przepisami podatkowymi i rachunkowymi oraz do upływu terminów przedawnienia roszczeń,</li>
              <li>wiadomości z formularza kontaktowego – do czasu zakończenia korespondencji, a następnie przez okres przedawnienia ewentualnych roszczeń,</li>
              <li>logi techniczne – <Pending>okres, np. 30 dni</Pending>.</li>
            </ul>
          ),
        },
        {
          id: "prawa",
          title: "Twoje prawa",
          content: (
            <>
              <p>
                Przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu wobec
                przetwarzania opartego na prawnie uzasadnionym interesie.
              </p>
              <p>Masz prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).</p>
              <p>Podanie danych jest dobrowolne, ale niezbędne do złożenia zamówienia (adres e-mail) lub uzyskania odpowiedzi na wiadomość.</p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Pliki cookies i pamięć przeglądarki",
          content: (
            <p>
              Informacje o plikach cookies i pamięci lokalnej przeglądarki (koszyk) znajdziesz w <Link href="/polityka-cookies">Polityce plików cookies</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
