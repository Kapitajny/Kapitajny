import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { LOCATIONS } from "@/data/locations";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Regulamin",
  description: "Demonstracyjny regulamin składania zamówień w BUŁA burger house. Dokument przykładowy wymagający weryfikacji prawnej.",
  alternates: { canonical: "/regulamin" },
};

const sections: LegalSection[] = [
  {
    id: "postanowienia-ogolne",
    title: "§1. Postanowienia ogólne",
    body: (
      <ol>
        <li>Regulamin określa zasady składania zamówień na produkty gastronomiczne w lokalach {SITE.name} oraz telefonicznie.</li>
        <li>Usługodawcą jest [nazwa firmy], [adres siedziby], NIP [numer], REGON [numer] – dane do uzupełnienia przed rozpoczęciem działalności.</li>
        <li>
          Lokale:{" "}
          {LOCATIONS.map((l, i) => (
            <span key={l.slug}>
              {i > 0 && " oraz "}
              {l.city}, {l.street}
            </span>
          ))}
          .
        </li>
        <li>Kontakt z usługodawcą: telefonicznie pod numerem {SITE.phone.display} lub przez formularz kontaktowy na stronie.</li>
      </ol>
    ),
  },
  {
    id: "definicje",
    title: "§2. Definicje",
    body: (
      <ul>
        <li>
          <strong>Klient</strong> – osoba fizyczna, prawna lub jednostka organizacyjna składająca zamówienie.
        </li>
        <li>
          <strong>Zamówienie</strong> – oświadczenie woli Klienta dotyczące zakupu produktów z aktualnego menu.
        </li>
        <li>
          <strong>Odbiór</strong> – wydanie zamówienia w wybranym lokalu na miejscu lub na wynos.
        </li>
      </ul>
    ),
  },
  {
    id: "zamowienia",
    title: "§3. Składanie zamówień",
    body: (
      <ol>
        <li>Zamówienia przyjmujemy w godzinach otwarcia lokali, osobiście przy ladzie lub telefonicznie pod numerem {SITE.phone.display}.</li>
        <li>Przy zamówieniu telefonicznym Klient podaje imię, numer telefonu, wybrany lokal odbioru oraz listę produktów.</li>
        <li>Zamówienie uważa się za przyjęte z chwilą potwierdzenia przez obsługę szacowanego czasu odbioru.</li>
        <li>Strona internetowa ma charakter informacyjny i nie umożliwia składania zamówień ani płatności online.</li>
      </ol>
    ),
  },
  {
    id: "ceny",
    title: "§4. Ceny i płatności",
    body: (
      <ol>
        <li>Ceny podane w menu są cenami brutto w złotych polskich i zawierają podatek VAT.</li>
        <li>Płatności przyjmujemy przy odbiorze: gotówką, kartą płatniczą lub BLIK.</li>
        <li>Promocje obowiązują w terminach wskazanych w ich opisie i nie łączą się, chyba że opis stanowi inaczej.</li>
      </ol>
    ),
  },
  {
    id: "odbior",
    title: "§5. Realizacja i odbiór",
    body: (
      <ol>
        <li>Szacowany czas przygotowania zamówienia wynosi około 15 minut i może się wydłużyć w godzinach największego ruchu.</li>
        <li>Zamówienie nieodebrane w ciągu 30 minut od podanego czasu może zostać anulowane.</li>
        <li>Produkty przygotowujemy na bieżąco i są przeznaczone do spożycia bezpośrednio po odbiorze.</li>
      </ol>
    ),
  },
  {
    id: "alergeny",
    title: "§6. Alergeny",
    body: (
      <p>
        Informację o alergenach obecnych w poszczególnych produktach przekazuje obsługa lokalu. W kuchni przetwarzamy m.in. gluten, mleko, jaja, gorczycę i
        sezam, dlatego nie możemy wykluczyć śladowych ilości tych składników w każdym produkcie.
      </p>
    ),
  },
  {
    id: "reklamacje",
    title: "§7. Reklamacje",
    body: (
      <ol>
        <li>Reklamacje dotyczące zamówienia można zgłaszać w lokalu w dniu odbioru, telefonicznie lub przez formularz kontaktowy.</li>
        <li>Odpowiadamy na reklamację w terminie do 14 dni od jej otrzymania.</li>
        <li>
          Klient będący konsumentem może skorzystać z pozasądowych sposobów rozpatrywania reklamacji, w tym z pomocy miejskiego lub powiatowego rzecznika
          konsumentów.
        </li>
      </ol>
    ),
  },
  {
    id: "dane",
    title: "§8. Dane osobowe",
    body: (
      <p>
        Zasady przetwarzania danych osobowych opisuje <Link href="/polityka-prywatnosci">polityka prywatności</Link>.
      </p>
    ),
  },
  {
    id: "postanowienia-koncowe",
    title: "§9. Postanowienia końcowe",
    body: (
      <ol>
        <li>Regulamin jest dostępny na stronie internetowej oraz w obu lokalach.</li>
        <li>W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu cywilnego.</li>
        <li>Usługodawca może zmienić regulamin z ważnych przyczyn; zmiany nie dotyczą zamówień przyjętych przed ich wejściem w życie.</li>
      </ol>
    ),
  },
];

export default function TermsPage() {
  return <LegalPage title="Regulamin" updated="5 listopada 2026" sections={sections} />;
}
