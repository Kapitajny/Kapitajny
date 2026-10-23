import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { formatAddress, siteConfig } from "@/config/site";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { Pending } from "@/components/ui/Pending";

export const metadata: Metadata = pageMetadata({
  title: "Polityka prywatności",
  description: `Informacje o przetwarzaniu danych osobowych przez gabinet ${siteConfig.name}, w tym danych z formularza kontaktowego.`,
  path: "/polityka-prywatnosci",
});

export default function PrivacyPolicyPage() {
  const { legalName, nip } = siteConfig.company;
  const address = formatAddress();
  const { email, phone } = siteConfig.contact;

  const sections: LegalSection[] = [
    {
      id: "administrator",
      title: "Administrator danych",
      content: (
        <>
          <p>
            Administratorem danych osobowych jest {legalName ?? <Pending>pełna nazwa podmiotu prowadzącego gabinet</Pending>}, {address ?? <Pending>adres</Pending>}
            , NIP: {nip ?? <Pending>NIP</Pending>}.
          </p>
          <p>
            Kontakt w sprawach danych osobowych: {email ?? <Pending>adres e-mail</Pending>}, tel. {phone ?? <Pending>telefon</Pending>}. Jeśli administrator
            wyznaczył inspektora ochrony danych: <Pending>dane kontaktowe IOD lub usunięcie tego zdania</Pending>.
          </p>
        </>
      ),
    },
    {
      id: "formularz",
      title: "Formularz kontaktowy",
      content: (
        <>
          <p>Za pomocą formularza zbieramy wyłącznie dane potrzebne do odpowiedzi na zgłoszenie i ustalenia terminu wizyty:</p>
          <ul>
            <li>imię,</li>
            <li>numer telefonu albo adres e-mail – w zależności od wybranego sposobu kontaktu,</li>
            <li>preferowany termin i pora dnia, wybrana usługa (opcjonalnie),</li>
            <li>treść wiadomości (opcjonalnie).</li>
          </ul>
          <p>
            Formularz nie służy do przekazywania informacji o stanie zdrowia – prosimy ich w nim nie podawać. Jeśli mimo to takie informacje zostaną
            przekazane, wykorzystamy je wyłącznie w celu odpowiedzi na zgłoszenie.
          </p>
          <p>
            Podstawa prawna: art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy na żądanie osoby, której dane dotyczą) oraz art. 6 ust. 1 lit. f
            RODO (prawnie uzasadniony interes administratora polegający na odpowiadaniu na zapytania). Podanie danych jest dobrowolne, ale bez nich nie
            będziemy mogli się z Tobą skontaktować.
          </p>
        </>
      ),
    },
    {
      id: "odbiorcy",
      title: "Odbiorcy danych",
      content: (
        <>
          <p>Dane mogą być przekazywane podmiotom, które wspierają nas technicznie, wyłącznie w niezbędnym zakresie i na podstawie umów powierzenia:</p>
          <ul>
            <li>
              dostawcy hostingu strony: <Pending>nazwa dostawcy</Pending>,
            </li>
            <li>
              dostawcy poczty e-mail lub narzędzia przekazującego zgłoszenia: <Pending>np. Resend, Make, system rezerwacji</Pending>,
            </li>
            <li>
              dostawcy systemu rezerwacji online, jeśli z niego korzystasz: <Pending>nazwa dostawcy lub usunięcie punktu</Pending>.
            </li>
          </ul>
          <p>
            Przekazanie danych poza Europejski Obszar Gospodarczy: <Pending>informacja zależna od wybranych dostawców i stosowanych zabezpieczeń</Pending>.
          </p>
        </>
      ),
    },
    {
      id: "okres",
      title: "Okres przechowywania",
      content: (
        <p>
          Dane z formularza przechowujemy przez czas potrzebny do obsługi zgłoszenia, a następnie przez <Pending>okres, np. 12 miesięcy</Pending> na wypadek
          ponownego kontaktu. Dokumentacja medyczna prowadzona w związku z wizytami w gabinecie jest przechowywana zgodnie z przepisami o prawach pacjenta –
          informacje na ten temat przekazujemy w gabinecie.
        </p>
      ),
    },
    {
      id: "prawa",
      title: "Twoje prawa",
      content: (
        <>
          <p>Masz prawo do:</p>
          <ul>
            <li>dostępu do swoich danych i otrzymania ich kopii,</li>
            <li>sprostowania danych,</li>
            <li>usunięcia danych lub ograniczenia przetwarzania,</li>
            <li>wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,</li>
            <li>przenoszenia danych,</li>
            <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).</li>
          </ul>
          <p>Dane nie są wykorzystywane do zautomatyzowanego podejmowania decyzji ani profilowania.</p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Pliki cookies",
      content: (
        <p>
          Zasady dotyczące plików cookies i pamięci przeglądarki opisujemy w dokumencie <Link href="/cookies">Pliki cookies</Link>.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Polityka prywatności"
      path="/polityka-prywatnosci"
      intro={<p>Wyjaśniamy, jakie dane zbieramy za pośrednictwem strony, w jakim celu i jakie prawa Ci przysługują.</p>}
      sections={sections}
    />
  );
}
