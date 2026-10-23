import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { LegalPage, Pending } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Polityka prywatności", alternates: { canonical: "/polityka-prywatnosci" } };

export default function PrivacyPage() {
  const { seller, contact } = siteConfig;
  return (
    <LegalPage
      title="Polityka prywatności"
      path="/polityka-prywatnosci"
      intro="Jakie dane zbieramy, po co, komu je przekazujemy i jakie masz prawa."
      sections={[
        {
          id: "administrator",
          title: "Administrator danych",
          content: (
            <p>
              Administratorem danych jest {seller.company ?? <Pending>nazwa firmy</Pending>}, {seller.address ?? <Pending>adres</Pending>}. Kontakt w sprawie danych:{" "}
              {contact.email ?? <Pending>adres e-mail</Pending>}.
            </p>
          ),
        },
        {
          id: "cele",
          title: "Cele i podstawy przetwarzania",
          content: (
            <ul>
              <li>Realizacja zamówienia i dostawa – imię, nazwisko, e-mail, telefon, adres (art. 6 ust. 1 lit. b RODO).</li>
              <li>Rozliczenia i obowiązki podatkowe (art. 6 ust. 1 lit. c RODO).</li>
              <li>Prowadzenie konta – imię, e-mail i zabezpieczone hasło (art. 6 ust. 1 lit. b RODO).</li>
              <li>Newsletter – wyłącznie adres e-mail, na podstawie zgody, którą można wycofać w każdej chwili (art. 6 ust. 1 lit. a RODO).</li>
              <li>Odpowiedź na wiadomość z formularza kontaktowego oraz obsługa reklamacji (art. 6 ust. 1 lit. f RODO).</li>
            </ul>
          ),
        },
        {
          id: "odbiorcy",
          title: "Odbiorcy danych",
          content: (
            <ul>
              <li>Stripe – operator płatności (dane potrzebne do płatności).</li>
              <li>Przewoźnik – dane potrzebne do doręczenia paczki.</li>
              <li>Dostawca hostingu i, jeśli zostaną uruchomione, dostawcy usług newslettera i obsługi wiadomości e-mail: <Pending>nazwy dostawców</Pending>.</li>
            </ul>
          ),
        },
        {
          id: "okres",
          title: "Okres przechowywania",
          content: (
            <p>
              Dane zamówień przechowujemy przez okres wymagany przepisami podatkowymi i przedawnienia roszczeń. Dane konta – do jego usunięcia. Adres w newsletterze – do
              wycofania zgody.
            </p>
          ),
        },
        {
          id: "prawa",
          title: "Twoje prawa",
          content: (
            <p>
              Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, sprzeciwu oraz wycofania zgody. Możesz też złożyć skargę
              do Prezesa Urzędu Ochrony Danych Osobowych. Napisz do nas przez <Link href="/kontakt">formularz kontaktowy</Link>.
            </p>
          ),
        },
        {
          id: "cookies",
          title: "Pliki cookies i pamięć przeglądarki",
          content: (
            <>
              <p>Sklep nie używa narzędzi analitycznych ani reklamowych. Korzystamy wyłącznie z mechanizmów niezbędnych do działania:</p>
              <ul>
                <li>ciasteczko sesji (kp_session) – tylko po zalogowaniu, ważne do 30 dni;</li>
                <li>pamięć przeglądarki (localStorage) – zawartość koszyka i lista ulubionych, zapisywane wyłącznie na Twoim urządzeniu.</li>
              </ul>
              <p>Na stronie płatności obowiązują zasady Stripe.</p>
            </>
          ),
        },
      ]}
    />
  );
}
