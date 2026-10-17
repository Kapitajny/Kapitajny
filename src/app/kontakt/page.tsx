import type { Metadata } from "next";
import Link from "next/link";
import { LOCATIONS, formatHours } from "@/data/locations";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { Pending } from "@/components/legal/Pending";

export const metadata: Metadata = {
  title: "Kontakt i dane sprzedawcy",
  description: "Dane sprzedawcy NOIR COFFEE, kontakt w sprawie zamówień i reklamacji oraz lokale w Gdańsku.",
};

const SELLER_FIELDS = [
  "Pełna nazwa firmy",
  "Forma prawna",
  "Adres siedziby",
  "NIP",
  "REGON",
  "Rejestr (CEIDG albo KRS z numerem i sądem rejestrowym)",
  "Kapitał zakładowy (jeśli dotyczy spółki)",
  "Adres do korespondencji i reklamacji",
];

const sections: LegalSection[] = [
  {
    id: "sprzedawca",
    title: "Dane sprzedawcy",
    content: (
      <>
        <p>Sprzedawcą napojów zamawianych przez stronę NOIR COFFEE jest:</p>
        <div className="overflow-x-auto">
          <table>
            <tbody>
              {SELLER_FIELDS.map((field) => (
                <tr key={field}>
                  <th scope="row">{field}</th>
                  <td>
                    <Pending>{field.toLowerCase()}</Pending>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: "kontakt",
    title: "Kontakt",
    content: (
      <>
        <ul>
          <li>
            Zamówienia, płatności i reklamacje: <Pending>adres e-mail</Pending>
          </li>
          <li>
            Telefon: <Pending>numer telefonu i godziny dostępności; koszt połączenia zgodnie z taryfą operatora</Pending>
          </li>
          <li>
            Sprawy dotyczące danych osobowych: <Pending>adres e-mail</Pending>
          </li>
          <li>
            Współpraca: <Pending>adres e-mail</Pending>
          </li>
        </ul>
        <p>
          Odpowiadamy na wiadomości w ciągu <Pending>czas odpowiedzi</Pending>. Na reklamacje odpowiadamy w terminie 14 dni – szczegóły w{" "}
          <Link href="/regulamin#reklamacje">Regulaminie</Link>.
        </p>
      </>
    ),
  },
  {
    id: "lokale",
    title: "Lokale",
    content: (
      <>
        <p>
          Poniższe adresy i godziny otwarcia są <strong>danymi demonstracyjnymi</strong> i nie opisują zweryfikowanych lokalizacji działających kawiarni.
          Wymagają zastąpienia prawdziwymi danymi przed uruchomieniem sprzedaży.
        </p>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th scope="col">Lokal</th>
                <th scope="col">Adres (demonstracyjny)</th>
                <th scope="col">Godziny (przykładowe)</th>
              </tr>
            </thead>
            <tbody>
              {LOCATIONS.map((l) => (
                <tr key={l.id}>
                  <td>{l.name}</td>
                  <td>
                    {l.street}, {l.city}
                  </td>
                  <td>
                    pon.–pt. {formatHours(l.hours.weekdays)}
                    <br />
                    sob.–niedz. {formatHours(l.hours.weekend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
];

export default function ContactPage() {
  return (
    <LegalPage
      title="Kontakt i dane sprzedawcy"
      path="/kontakt"
      intro={<p>Dane sprzedawcy wymagane przy sprzedaży online oraz sposoby kontaktu w sprawie zamówień, płatności i reklamacji.</p>}
      sections={sections}
    />
  );
}
