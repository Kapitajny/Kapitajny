import type { Metadata } from "next";
import Link from "next/link";
import { Fill, LegalDocument, Section } from "@/components/legal/LegalDocument";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Projekt polityki prywatności ComputerIT: jakie dane zbiera formularz kontaktowy, w jakim celu i jakie prawa Ci przysługują.",
  alternates: { canonical: "/polityka-prywatnosci" },
};

const toc = [
  { id: "administrator", title: "1. Administrator danych" },
  { id: "dane", title: "2. Jakie dane przetwarzamy" },
  { id: "cele", title: "3. Cele i podstawy prawne" },
  { id: "odbiorcy", title: "4. Odbiorcy danych" },
  { id: "okres", title: "5. Okres przechowywania" },
  { id: "prawa", title: "6. Twoje prawa" },
  { id: "cookies", title: "7. Pliki cookies i pamięć przeglądarki" },
  { id: "zmiany", title: "8. Zmiany polityki" },
];

export default function PrivacyPage() {
  const email = siteConfig.contact.email;
  return (
    <LegalDocument
      title="Polityka prywatności"
      lead="Jak ComputerIT przetwarza dane osobowe przekazane przez stronę, w szczególności przez formularz kontaktowy."
      toc={toc}
    >
      <Section id="administrator" title="1. Administrator danych">
        <p>
          Administratorem danych osobowych jest <Fill>do uzupełnienia: imię i nazwisko lub nazwa firmy, adres siedziby, NIP</Fill>, prowadzący działalność
          pod marką {siteConfig.name}.
        </p>
        <p>
          Kontakt w sprawach danych osobowych:{" "}
          {email ? (
            <a href={`mailto:${email}`} className="link">
              {email}
            </a>
          ) : (
            <Fill>do uzupełnienia: adres e-mail</Fill>
          )}
          .
        </p>
      </Section>

      <Section id="dane" title="2. Jakie dane przetwarzamy">
        <p>Przez formularz kontaktowy zbieramy:</p>
        <ul>
          <li>imię i nazwisko oraz adres e-mail (wymagane),</li>
          <li>nazwę firmy i numer telefonu (opcjonalnie),</li>
          <li>rodzaj usługi, przybliżony budżet (opcjonalnie) i opis projektu.</li>
        </ul>
        <p>Formularz nie wymaga zgody marketingowej i nie służy do wysyłki newslettera.</p>
      </Section>

      <Section id="cele" title="3. Cele i podstawy prawne">
        <ul>
          <li>
            odpowiedź na zapytanie i przygotowanie oferty – działania na Twoje żądanie przed zawarciem umowy (art. 6 ust. 1 lit. b RODO) lub nasz prawnie
            uzasadniony interes w prowadzeniu korespondencji (art. 6 ust. 1 lit. f RODO),
          </li>
          <li>realizacja zawartej umowy (art. 6 ust. 1 lit. b RODO),</li>
          <li>obowiązki podatkowe i rachunkowe (art. 6 ust. 1 lit. c RODO),</li>
          <li>ustalenie, dochodzenie lub obrona roszczeń (art. 6 ust. 1 lit. f RODO).</li>
        </ul>
        <p>Podanie danych jest dobrowolne, ale bez danych oznaczonych jako wymagane nie możemy odpowiedzieć na zapytanie.</p>
      </Section>

      <Section id="odbiorcy" title="4. Odbiorcy danych">
        <p>Dane mogą być powierzane podmiotom, które pomagają nam prowadzić działalność:</p>
        <ul>
          <li>
            dostawca hostingu strony: <Fill>do uzupełnienia</Fill>,
          </li>
          <li>
            dostawca poczty e-mail, przez którą trafiają wiadomości z formularza: <Fill>do uzupełnienia</Fill>,
          </li>
          <li>
            narzędzie, do którego formularz przekazuje zapytania (webhook / CRM), jeżeli jest używane: <Fill>do uzupełnienia</Fill>,
          </li>
          <li>
            biuro rachunkowe: <Fill>do uzupełnienia, jeśli dotyczy</Fill>.
          </li>
        </ul>
        <p>
          Przekazywanie danych poza Europejski Obszar Gospodarczy: <Fill>do uzupełnienia i weryfikacji u dostawców</Fill>.
        </p>
      </Section>

      <Section id="okres" title="5. Okres przechowywania">
        <ul>
          <li>
            zapytania, które nie zakończyły się umową – <Fill>do uzupełnienia: np. 12 miesięcy od ostatniego kontaktu</Fill>,
          </li>
          <li>dane związane z umową – przez czas jej realizacji i do upływu okresu przedawnienia roszczeń,</li>
          <li>dokumenty rozliczeniowe – przez okres wymagany przepisami podatkowymi.</li>
        </ul>
      </Section>

      <Section id="prawa" title="6. Twoje prawa">
        <p>Masz prawo do dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz do wniesienia sprzeciwu.</p>
        <p>Masz także prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).</p>
      </Section>

      <Section id="cookies" title="7. Pliki cookies i pamięć przeglądarki">
        <p>
          Strona {siteConfig.name} nie korzysta z analitycznych ani marketingowych plików cookies. Kroje pisma są serwowane z naszego serwera, bez
          połączeń z zewnętrznymi dostawcami.
        </p>
        <p>
          Wersje demonstracyjne w{" "}
          <Link href="/realizacje" className="link">
            realizacjach
          </Link>{" "}
          zapisują koszyk i przykładowe zamówienia wyłącznie w pamięci Twojej przeglądarki (localStorage). Te dane nie są wysyłane na serwer, nie widzą
          ich inni użytkownicy i możesz je usunąć, czyszcząc dane strony w przeglądarce.
        </p>
        <p>
          Serwer może zapisywać dane techniczne (np. adres IP, czas wizyty) w dziennikach systemowych w celu zapewnienia bezpieczeństwa:{" "}
          <Fill>do weryfikacji u dostawcy hostingu</Fill>.
        </p>
      </Section>

      <Section id="zmiany" title="8. Zmiany polityki">
        <p>
          Polityka może być aktualizowana, np. po zmianie dostawców lub przepisów. Data ostatniej aktualizacji: <Fill>do uzupełnienia</Fill>.
        </p>
      </Section>
    </LegalDocument>
  );
}
