import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Fill, LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: `Jak studio ${siteConfig.name} przetwarza dane osobowe przekazane przez formularz konsultacji.`,
  alternates: { canonical: "/polityka-prywatnosci" },
};

export default function PrivacyPage() {
  const { legal, contact } = siteConfig;
  return (
    <LegalPage title="Polityka prywatności">
      <h2>1. Administrator danych</h2>
      <p>
        Administratorem Twoich danych osobowych jest <Fill value={legal.companyName} label="nazwa firmy" />,{" "}
        <Fill value={legal.companyAddress} label="adres siedziby" />, NIP: <Fill value={legal.nip} label="NIP" />, REGON:{" "}
        <Fill value={legal.regon} label="REGON" />. Kontakt w sprawach danych osobowych: <Fill value={contact.email} label="adres e-mail" />.
      </p>

      <h2>2. Jakie dane przetwarzamy</h2>
      <p>Przez formularz „Book your tattoo” przekazujesz nam:</p>
      <ul>
        <li>dane kontaktowe: imię i nazwisko, adres e-mail, opcjonalnie numer telefonu,</li>
        <li>opis pomysłu na tatuaż, jego znaczenia i preferencji (styl, miejsce na ciele, rozmiar, budżet, preferowany termin),</li>
        <li>dołączone zdjęcia i szkice inspiracji.</li>
      </ul>
      <p>
        Prosimy, aby nie umieszczać w formularzu informacji o zdrowiu ani innych szczególnie wrażliwych danych, jeśli nie są
        niezbędne. Jeżeli przesyłasz zdjęcia ciała lub innych osób, upewnij się, że masz do tego prawo. Zdjęcia są przed wysłaniem
        zmniejszane w przeglądarce, a metadane (w tym lokalizacja GPS) są usuwane.
      </p>

      <h2>3. Cele i podstawy prawne</h2>
      <ul>
        <li>
          odpowiedź na zapytanie i przygotowanie konsultacji, czyli działania na Twoje żądanie przed zawarciem umowy — art. 6 ust. 1
          lit. b RODO,
        </li>
        <li>
          ochrona formularza przed nadużyciami i spamem (np. ograniczenie liczby zgłoszeń z jednego adresu IP) — prawnie uzasadniony
          interes administratora, art. 6 ust. 1 lit. f RODO,
        </li>
        <li>ewentualne ustalenie, dochodzenie lub obrona roszczeń — art. 6 ust. 1 lit. f RODO.</li>
      </ul>
      <p>Nie wykorzystujemy danych z formularza do marketingu i nie zbieramy w nim zgód marketingowych.</p>

      <h2>4. Odbiorcy danych</h2>
      <p>
        Dane mogą być powierzane podmiotom, które świadczą dla nas usługi techniczne:{" "}
        <Fill label="dostawca hostingu strony, dostawca poczty e-mail, ewentualnie system obsługi zgłoszeń i Cloudflare Turnstile (ochrona przed spamem)" />
        . Podmioty te przetwarzają dane wyłącznie na nasze polecenie.{" "}
        <Fill label="informacja, czy dane są przekazywane poza Europejski Obszar Gospodarczy, i na jakiej podstawie" />
      </p>

      <h2>5. Okres przechowywania</h2>
      <p>
        <Fill label="jak długo studio przechowuje zgłoszenia i załączniki, jeśli nie dojdzie do wizyty, oraz po jej realizacji" />
      </p>

      <h2>6. Twoje prawa</h2>
      <p>Masz prawo do:</p>
      <ul>
        <li>dostępu do swoich danych i otrzymania ich kopii,</li>
        <li>sprostowania danych,</li>
        <li>usunięcia danych,</li>
        <li>ograniczenia przetwarzania,</li>
        <li>przenoszenia danych,</li>
        <li>sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,</li>
        <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).</li>
      </ul>
      <p>
        Podanie danych jest dobrowolne, ale bez imienia i nazwiska, adresu e-mail oraz opisu pomysłu nie będziemy mogli odpowiedzieć
        na zapytanie.
      </p>

      <h2>7. Pliki cookies i pamięć przeglądarki</h2>
      <p>
        Strona nie używa plików cookies analitycznych ani marketingowych. Formularz zapisuje wpisane odpowiedzi w pamięci sesji
        przeglądarki (sessionStorage), aby nie zniknęły przy odświeżeniu strony. Dane te pozostają na Twoim urządzeniu i są usuwane
        po wysłaniu formularza lub zamknięciu karty. <Fill label="aktualizacja tej części, jeśli studio doda analitykę lub inne narzędzia" />
      </p>

      <h2>8. Kontakt</h2>
      <p>
        W sprawach dotyczących danych osobowych napisz na <Fill value={contact.email} label="adres e-mail" />. Zasady korzystania ze
        strony opisuje <Link href="/regulamin">Regulamin</Link>.
      </p>
    </LegalPage>
  );
}
