import Link from "next/link";
import { Fill, LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Klauzula informacyjna RODO",
  description: "Projekt klauzuli informacyjnej z art. 13 RODO dla pacjentów i klientów usług transportu medycznego.",
  path: "/klauzula-rodo",
});

const toc = [
  { id: "administrator", label: "1. Administrator" },
  { id: "iod", label: "2. Inspektor ochrony danych" },
  { id: "cele", label: "3. Cele i podstawy przetwarzania" },
  { id: "wymog", label: "4. Obowiązek podania danych" },
  { id: "odbiorcy", label: "5. Odbiorcy" },
  { id: "okres", label: "6. Okres przechowywania" },
  { id: "prawa", label: "7. Prawa osoby" },
  { id: "profilowanie", label: "8. Zautomatyzowane decyzje" },
];

export default function GdprClausePage() {
  const { contact } = siteConfig;
  return (
    <LegalPage title="Klauzula informacyjna RODO" path="/klauzula-rodo" updated="06.11.2026" toc={toc}>
      <p>
        Zgodnie z art. 13 Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO) informujemy, jak przetwarzamy dane
        osobowe pacjentów i klientów.
      </p>

      <h2 id="administrator">1. Administrator</h2>
      <p>
        Administratorem danych jest {siteConfig.legalName}, {contact.street}, {contact.postalCode} {contact.city}, e-mail{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>, tel. <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.
      </p>

      <h2 id="iod">2. Inspektor ochrony danych</h2>
      <p>
        Z inspektorem ochrony danych można kontaktować się pod adresem <Fill>e-mail IOD</Fill> we wszystkich sprawach dotyczących przetwarzania danych.
      </p>

      <h2 id="cele">3. Cele i podstawy przetwarzania</h2>
      <ul>
        <li>
          udzielanie świadczeń zdrowotnych, w tym transportu sanitarnego i medycznego, oraz zarządzanie udzielaniem tych świadczeń – art. 6 ust. 1 lit. c i art.
          9 ust. 2 lit. h RODO;
        </li>
        <li>
          prowadzenie i przechowywanie dokumentacji medycznej – art. 6 ust. 1 lit. c i art. 9 ust. 2 lit. h RODO w zw. z ustawą o prawach pacjenta i Rzeczniku
          Praw Pacjenta;
        </li>
        <li>
          rozliczanie świadczeń finansowanych przez NFZ – art. 6 ust. 1 lit. c RODO w zw. z ustawą o świadczeniach opieki zdrowotnej finansowanych ze środków
          publicznych;
        </li>
        <li>zawarcie i wykonanie umowy o usługę komercyjną – art. 6 ust. 1 lit. b RODO;</li>
        <li>kontakt w sprawie realizacji usługi, dochodzenie i obrona roszczeń – art. 6 ust. 1 lit. f RODO;</li>
        <li>obowiązki księgowe i podatkowe – art. 6 ust. 1 lit. c RODO.</li>
      </ul>

      <h2 id="wymog">4. Obowiązek podania danych</h2>
      <p>
        Podanie danych jest wymogiem ustawowym w zakresie niezbędnym do udzielenia świadczenia zdrowotnego i prowadzenia dokumentacji medycznej, a w pozostałym
        zakresie – warunkiem zawarcia umowy lub udzielenia odpowiedzi na zapytanie.
      </p>

      <h2 id="odbiorcy">5. Odbiorcy</h2>
      <p>
        Odbiorcami danych mogą być: Narodowy Fundusz Zdrowia, placówki medyczne przejmujące pacjenta, podmioty uprawnione do dostępu do dokumentacji medycznej
        na podstawie przepisów, dostawcy usług IT i systemów dokumentacji, biuro rachunkowe oraz ubezpieczyciel OC – w zakresie niezbędnym.
      </p>

      <h2 id="okres">6. Okres przechowywania</h2>
      <p>
        Dokumentację medyczną przechowujemy przez okres wynikający z art. 29 ustawy o prawach pacjenta i Rzeczniku Praw Pacjenta. Pozostałe dane – przez okres
        realizacji umowy, przedawnienia roszczeń oraz wymagany przepisami podatkowymi. Szczegóły: <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
        .
      </p>

      <h2 id="prawa">7. Prawa osoby, której dane dotyczą</h2>
      <p>
        Przysługuje Ci prawo dostępu do danych, ich sprostowania, ograniczenia przetwarzania, a w przypadkach określonych w RODO – usunięcia, przeniesienia
        danych i sprzeciwu. Prawo do usunięcia nie dotyczy danych, które mamy obowiązek przechowywać w dokumentacji medycznej. Masz prawo wnieść skargę do
        Prezesa Urzędu Ochrony Danych Osobowych.
      </p>

      <h2 id="profilowanie">8. Zautomatyzowane podejmowanie decyzji</h2>
      <p>Dane nie są wykorzystywane do zautomatyzowanego podejmowania decyzji, w tym profilowania.</p>
    </LegalPage>
  );
}
