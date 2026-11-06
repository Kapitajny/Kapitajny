import Link from "next/link";
import { Fill, LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Informacja o prawach pacjenta",
  description: "Prawa pacjenta wynikające z ustawy o prawach pacjenta i Rzeczniku Praw Pacjenta oraz sposób składania skarg i wniosków.",
  path: "/prawa-pacjenta",
});

const toc = [
  { id: "podstawa", label: "1. Podstawa prawna" },
  { id: "prawa", label: "2. Prawa pacjenta" },
  { id: "dokumentacja", label: "3. Dostęp do dokumentacji" },
  { id: "skargi", label: "4. Skargi i wnioski" },
  { id: "rpp", label: "5. Rzecznik Praw Pacjenta" },
];

const rights = [
  ["Prawo do świadczeń zdrowotnych", "odpowiadających wymaganiom aktualnej wiedzy medycznej, udzielanych z należytą starannością."],
  ["Prawo do informacji", "o stanie zdrowia i udzielanych świadczeniach – w sposób przystępny."],
  ["Prawo do wyrażenia zgody", "na udzielenie świadczenia zdrowotnego albo odmowy takiej zgody."],
  ["Prawo do tajemnicy", "informacji związanych z pacjentem, uzyskanych w związku z udzielaniem świadczeń."],
  ["Prawo do poszanowania intymności i godności", "w szczególności w czasie udzielania świadczeń i transportu."],
  ["Prawo do dokumentacji medycznej", "dostępu do niej i uzyskania jej kopii, wyciągu lub odpisu."],
  ["Prawo do zgłoszenia sprzeciwu", "wobec opinii albo orzeczenia lekarza – na zasadach określonych w ustawie."],
  ["Prawo do zgłaszania zdarzeń niepożądanych", "produktów leczniczych do Prezesa Urzędu Rejestracji Produktów Leczniczych."],
];

export default function PatientRightsPage() {
  const { contact } = siteConfig;
  return (
    <LegalPage title="Informacja o prawach pacjenta" path="/prawa-pacjenta" updated="06.11.2026" toc={toc}>
      <h2 id="podstawa">1. Podstawa prawna</h2>
      <p>
        Prawa pacjenta określa przede wszystkim ustawa z dnia 6 listopada 2008 r. o prawach pacjenta i Rzeczniku Praw Pacjenta. Każdy podmiot udzielający
        świadczeń zdrowotnych ma obowiązek udostępnić pacjentom informację o ich prawach.
      </p>

      <h2 id="prawa">2. Prawa pacjenta</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Prawo</th>
            <th scope="col">Zakres</th>
          </tr>
        </thead>
        <tbody>
          {rights.map(([k, v]) => (
            <tr key={k}>
              <th scope="row">{k}</th>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="dokumentacja">3. Dostęp do dokumentacji medycznej</h2>
      <p>
        Wniosek o udostępnienie dokumentacji medycznej z transportu można złożyć e-mailem na adres <a href={`mailto:${contact.email}`}>{contact.email}</a> lub
        pisemnie na adres siedziby. Pierwsza kopia dokumentacji udostępniana jest bezpłatnie. Za kolejne kopie może być pobierana opłata w wysokości określonej
        w ustawie <Fill>wskazać aktualne stawki</Fill>.
      </p>

      <h2 id="skargi">4. Skargi i wnioski</h2>
      <p>
        Uwagi, skargi i wnioski dotyczące naszych usług przyjmujemy pod adresem <a href={`mailto:${contact.email}`}>{contact.email}</a>, telefonicznie pod
        numerem <a href={contact.phoneHref}>{contact.phoneDisplay}</a> lub pisemnie: {contact.street}, {contact.postalCode} {contact.city}. Osoba
        odpowiedzialna: <Fill>stanowisko / dział jakości</Fill>. Zasady reklamacji usług komercyjnych opisuje <Link href="/regulamin">Regulamin</Link>.
      </p>
      <p>
        W sprawach świadczeń finansowanych ze środków publicznych można zwrócić się również do właściwego Oddziału Wojewódzkiego Narodowego Funduszu Zdrowia.
      </p>

      <h2 id="rpp">5. Rzecznik Praw Pacjenta</h2>
      <p>
        Pacjent może zwrócić się do Rzecznika Praw Pacjenta: Biuro Rzecznika Praw Pacjenta, ul. Młynarska 46, 01-171 Warszawa, bezpłatna infolinia Telefonicznej
        Informacji Pacjenta: <a href="tel:800190590">800 190 590</a>, strona:{" "}
        <a href="https://www.gov.pl/web/rpp" target="_blank" rel="noopener noreferrer">
          gov.pl/web/rpp
        </a>
        . <Fill>zweryfikować aktualność danych przed publikacją</Fill>
      </p>
    </LegalPage>
  );
}
