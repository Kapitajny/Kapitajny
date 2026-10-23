import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { DISPATCH_TIME, RETURN_DAYS } from "@/data/shipping";
import { LegalPage, Pending } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Regulamin sklepu", alternates: { canonical: "/regulamin" } };

export default function TermsPage() {
  const { seller, contact } = siteConfig;
  return (
    <LegalPage
      title="Regulamin sklepu"
      path="/regulamin"
      intro={`Zasady zakupów w sklepie internetowym ${siteConfig.name}: składanie zamówień, płatność, dostawa, zwroty i reklamacje.`}
      sections={[
        {
          id: "sprzedawca",
          title: "Sprzedawca",
          content: (
            <ul>
              <li>Firma: {seller.company ?? <Pending>nazwa firmy</Pending>}</li>
              <li>Adres: {seller.address ?? <Pending>adres siedziby</Pending>}</li>
              <li>NIP: {seller.nip ?? <Pending>NIP</Pending>}</li>
              <li>E-mail: {contact.email ?? <Pending>adres e-mail</Pending>}</li>
              <li>Telefon: {contact.phone ?? <Pending>telefon</Pending>}</li>
            </ul>
          ),
        },
        {
          id: "postanowienia",
          title: "Postanowienia ogólne",
          content: (
            <>
              <p>Sklep sprzedaje odzież (bluzy i spodnie) za pośrednictwem strony internetowej. Do korzystania ze sklepu potrzebna jest przeglądarka internetowa i adres e-mail.</p>
              <p>Ceny podane są w złotych polskich i zawierają podatek VAT. Koszt dostawy jest podawany przed złożeniem zamówienia.</p>
            </>
          ),
        },
        {
          id: "konto",
          title: "Konto klienta",
          content: (
            <p>
              Założenie konta jest dobrowolne i bezpłatne. Konto pozwala przeglądać historię zamówień złożonych po zalogowaniu. Konto można usunąć, wysyłając prośbę przez{" "}
              <Link href="/kontakt">formularz kontaktowy</Link>.
            </p>
          ),
        },
        {
          id: "zamowienia",
          title: "Składanie zamówień",
          content: (
            <ol>
              <li>Wybierz produkt, kolor i rozmiar, a następnie dodaj go do koszyka.</li>
              <li>W formularzu zamówienia podaj dane kontaktowe, adres i sposób dostawy, a następnie zaakceptuj regulamin.</li>
              <li>Kliknięcie przycisku „Zamawiam i płacę” oznacza złożenie zamówienia z obowiązkiem zapłaty i przekierowuje do płatności.</li>
              <li>Umowa zostaje zawarta z chwilą potwierdzenia płatności. Dostępność produktów sprawdzamy w momencie składania zamówienia.</li>
            </ol>
          ),
        },
        {
          id: "platnosc",
          title: "Płatność",
          content: (
            <p>
              Płatności online obsługuje Stripe Payments Europe Ltd. Na płatność masz 30 minut od złożenia zamówienia; po tym czasie nieopłacone zamówienie jest anulowane, a
              zarezerwowane produkty wracają do sprzedaży.
            </p>
          ),
        },
        {
          id: "dostawa",
          title: "Dostawa",
          content: (
            <p>
              Dostarczamy na terenie Polski. Wysyłka następuje {DISPATCH_TIME} od zaksięgowania płatności. Metody i koszty dostawy opisuje strona{" "}
              <Link href="/dostawa-i-zwroty">Dostawa i zwroty</Link>.
            </p>
          ),
        },
        {
          id: "odstapienie",
          title: "Prawo odstąpienia od umowy",
          content: (
            <>
              <p>
                Konsument (oraz przedsiębiorca na prawach konsumenta) może odstąpić od umowy bez podania przyczyny w terminie {RETURN_DAYS} dni od otrzymania produktu,
                składając oświadczenie, np. przez <Link href="/kontakt">formularz kontaktowy</Link>.
              </p>
              <p>
                Sprzedawca zwraca wszystkie płatności, w tym koszt najtańszej oferowanej dostawy, w ciągu 14 dni od otrzymania oświadczenia. Bezpośredni koszt odesłania
                produktu ponosi kupujący. Kupujący odpowiada za zmniejszenie wartości produktu wynikające z korzystania z niego w sposób wykraczający poza konieczny do
                stwierdzenia jego charakteru, cech i funkcjonowania.
              </p>
            </>
          ),
        },
        {
          id: "reklamacje",
          title: "Reklamacje",
          content: (
            <p>
              Sprzedawca odpowiada za zgodność produktu z umową. Reklamację można złożyć przez <Link href="/kontakt">formularz kontaktowy</Link> lub e-mailem, opisując
              niezgodność i podając numer zamówienia. Sprzedawca odpowiada na reklamację w ciągu 14 dni. Konsument może skorzystać z pozasądowych sposobów rozpatrywania
              sporów, m.in. pomocy rzecznika konsumentów.
            </p>
          ),
        },
        {
          id: "dane",
          title: "Dane osobowe",
          content: (
            <p>
              Zasady przetwarzania danych opisuje <Link href="/polityka-prywatnosci">polityka prywatności</Link>.
            </p>
          ),
        },
        {
          id: "koncowe",
          title: "Postanowienia końcowe",
          content: (
            <p>
              Regulamin obowiązuje od <Pending>data wejścia w życie</Pending>. Zmiany regulaminu nie dotyczą zamówień złożonych przed ich wejściem w życie. W sprawach
              nieuregulowanych stosuje się przepisy prawa polskiego, w szczególności Kodeksu cywilnego i ustawy o prawach konsumenta.
            </p>
          ),
        },
      ]}
    />
  );
}
