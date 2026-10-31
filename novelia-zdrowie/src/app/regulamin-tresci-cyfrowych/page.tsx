import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { Pending } from "@/components/legal/Pending";
import { DIGITAL_CONSENT_TEXT } from "@/lib/validation";

export const metadata: Metadata = { title: "Regulamin sprzedaży treści cyfrowych", alternates: { canonical: "/regulamin-tresci-cyfrowych" } };

export default function DigitalTermsPage() {
  return (
    <LegalPage
      title="Regulamin sprzedaży treści cyfrowych"
      path="/regulamin-tresci-cyfrowych"
      intro={<p>Szczegółowe zasady dotyczące publikacji cyfrowych (e-booków PDF): licencja, dostarczenie, zgodność z umową i prawo odstąpienia.</p>}
      sections={[
        {
          id: "zakres",
          title: "Zakres",
          content: (
            <p>
              Niniejszy regulamin uzupełnia <Link href="/regulamin">Regulamin sklepu</Link> i dotyczy umów o dostarczanie treści cyfrowych – publikacji w formacie PDF
              oferowanych przez NOVELIA ZDROWIE. Pojęcia pisane wielką literą mają znaczenie nadane im w Regulaminie sklepu.
            </p>
          ),
        },
        {
          id: "charakter",
          title: "Charakter publikacji",
          content: (
            <>
              <p>
                Publikacje mają charakter edukacyjny i informacyjny. Nie stanowią porady medycznej ani dietetycznej i nie zastępują indywidualnej konsultacji z lekarzem
                lub dietetykiem. Wartości odżywcze podane w przepisach są orientacyjne.
              </p>
              <p>Opis każdej Publikacji (zawartość, format, objętość) znajduje się na jej karcie produktu w Sklepie.</p>
            </>
          ),
        },
        {
          id: "licencja",
          title: "Licencja",
          content: (
            <>
              <p>
                Z chwilą dostarczenia Publikacji Klient uzyskuje niewyłączną, nieprzenoszalną licencję na korzystanie z niej na własny użytek osobisty, bez ograniczeń
                czasowych i terytorialnych, w tym na:
              </p>
              <ul>
                <li>zapisywanie pliku na swoich urządzeniach i odczytywanie go,</li>
                <li>wydruk całości lub fragmentów na potrzeby własne.</li>
              </ul>
              <p>Bez zgody Sprzedawcy zabronione jest w szczególności: udostępnianie pliku osobom trzecim, publiczne rozpowszechnianie, odsprzedaż, kopiowanie treści do innych publikacji oraz usuwanie oznaczeń autorskich.</p>
              <p>Majątkowe prawa autorskie do Publikacji przysługują <Pending>podmiot uprawniony – sprzedawca lub autor</Pending>.</p>
            </>
          ),
        },
        {
          id: "dostarczenie",
          title: "Sposób dostarczenia",
          content: (
            <>
              <p>
                Publikacja jest dostarczana poprzez udostępnienie bezpiecznego linku do pobrania: na stronie potwierdzenia Zamówienia oraz w wiadomości e-mail wysłanej
                na adres podany w Zamówieniu, niezwłocznie po potwierdzeniu płatności.
              </p>
              <p>
                Link jest ważny przez ograniczony czas (domyślnie 72 godziny) i pozwala na ograniczoną liczbę pobrań (domyślnie 10). Klient może bezpłatnie uzyskać nowe
                linki za pośrednictwem strony <Link href="/pobieranie">Ponowne pobranie pliku</Link>.
              </p>
            </>
          ),
        },
        {
          id: "zgoda",
          title: "Zgoda na dostarczenie i utrata prawa odstąpienia",
          content: (
            <>
              <p>Przed złożeniem Zamówienia Klient będący Konsumentem lub Przedsiębiorcą na prawach konsumenta składa oświadczenie o treści:</p>
              <p>
                <em>„{DIGITAL_CONSENT_TEXT}”</em>
              </p>
              <p>
                Wraz z rozpoczęciem świadczenia (udostępnieniem pliku do pobrania) prawo odstąpienia od umowy wygasa zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach
                konsumenta. Potwierdzenie złożonego oświadczenia Klient otrzymuje w wiadomości e-mail (na trwałym nośniku).
              </p>
            </>
          ),
        },
        {
          id: "zgodnosc",
          title: "Zgodność treści cyfrowej z umową",
          content: (
            <>
              <p>
                Sprzedawca odpowiada za zgodność Publikacji z umową na zasadach określonych w rozdziale 5b ustawy o prawach konsumenta (w odniesieniu do Konsumentów i
                Przedsiębiorców na prawach konsumenta). Publikacja jest zgodna z umową m.in. wtedy, gdy odpowiada opisowi, jest kompletna i da się ją otworzyć przy
                spełnieniu wymagań technicznych.
              </p>
              <p>
                W razie braku zgodności z umową Klient może żądać doprowadzenia Publikacji do zgodności (np. ponownego dostarczenia poprawnego pliku), a w przypadkach
                określonych w ustawie – złożyć oświadczenie o obniżeniu ceny albo odstąpieniu od umowy. Tryb reklamacji opisuje strona{" "}
                <Link href="/reklamacje-i-zwroty">Prawa konsumenta i reklamacje</Link>.
              </p>
            </>
          ),
        },
        {
          id: "aktualizacje",
          title: "Aktualizacje publikacji",
          content: <p>Sprzedawca może udostępniać zaktualizowane wydania Publikacji. Zasady udostępniania aktualizacji klientom: <Pending>np. bezpłatnie przez okres 12 miesięcy od zakupu</Pending>.</p>,
        },
      ]}
    />
  );
}
