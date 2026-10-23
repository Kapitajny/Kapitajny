import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { formatAddress, siteConfig } from "@/config/site";
import { PRICES_ARE_EXAMPLES } from "@/data/pricing";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { Pending } from "@/components/ui/Pending";

export const metadata: Metadata = pageMetadata({
  title: "Regulamin strony",
  description: `Zasady korzystania ze strony gabinetu ${siteConfig.name}, w tym z formularza prośby o kontakt, oraz informacje o umawianiu wizyt i reklamacjach.`,
  path: "/regulamin",
});

/**
 * Regulamin świadczenia usług drogą elektroniczną (strona, formularz kontaktowy).
 * Zasady, o których decyduje gabinet (odwoływanie wizyt, płatności, termin reklamacji), są oznaczone „do uzupełnienia”.
 */
export default function TermsPage() {
  const { legalName, nip } = siteConfig.company;
  const address = formatAddress();
  const { email, phone } = siteConfig.contact;

  const sections: LegalSection[] = [
    {
      id: "postanowienia-ogolne",
      title: "Postanowienia ogólne",
      content: (
        <>
          <p>
            Regulamin określa zasady korzystania ze strony internetowej gabinetu {siteConfig.name} (dalej: „Strona”), w tym z formularza prośby o kontakt.
            Regulamin jest regulaminem, o którym mowa w art. 8 ustawy z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną.
          </p>
          <p>
            Usługodawcą jest {legalName ?? <Pending>pełna nazwa podmiotu prowadzącego gabinet</Pending>}, {address ?? <Pending>adres</Pending>}, NIP:{" "}
            {nip ?? <Pending>NIP</Pending>}, e-mail: {email ?? <Pending>adres e-mail</Pending>}, tel. {phone ?? <Pending>telefon</Pending>}.
          </p>
          <p>Korzystanie ze Strony jest bezpłatne. Regulamin jest dostępny na Stronie w sposób umożliwiający jego zapisanie i wydrukowanie.</p>
        </>
      ),
    },
    {
      id: "uslugi",
      title: "Usługi świadczone na Stronie",
      content: (
        <>
          <p>Za pośrednictwem Strony usługodawca udostępnia:</p>
          <ul>
            <li>przeglądanie informacji o gabinecie, usługach, cenach i przebiegu wizyt,</li>
            <li>formularz prośby o kontakt – w celu ustalenia terminu wizyty lub odpowiedzi na pytanie,</li>
            {siteConfig.bookingUrl && (
              <li>link do zewnętrznego systemu rezerwacji online, który działa na zasadach określonych przez jego dostawcę,</li>
            )}
            <li>mapę dojazdu dostarczaną przez Google, wczytywaną dopiero po kliknięciu „Wczytaj mapę”.</li>
          </ul>
          <p>
            Umowa o korzystanie z formularza zostaje zawarta z chwilą jego wysłania i wygasa po obsłudze zgłoszenia. Przeglądanie Strony nie wymaga
            rejestracji ani zawierania odrębnej umowy.
          </p>
        </>
      ),
    },
    {
      id: "wymagania",
      title: "Wymagania techniczne",
      content: (
        <p>
          Do korzystania ze Strony potrzebne jest urządzenie z dostępem do internetu i aktualna przeglądarka internetowa z włączoną obsługą JavaScript. Aby
          otrzymać odpowiedź na zgłoszenie, potrzebny jest numer telefonu albo adres e-mail.
        </p>
      ),
    },
    {
      id: "formularz",
      title: "Formularz prośby o kontakt",
      content: (
        <>
          <p>
            Wysłanie formularza nie jest rezerwacją wizyty. Po otrzymaniu zgłoszenia gabinet kontaktuje się wybraną drogą, aby ustalić termin. Wizyta jest
            umówiona dopiero po potwierdzeniu terminu przez gabinet.
          </p>
          <p>
            W formularzu nie podawaj informacji o stanie zdrowia – porozmawiamy o nich na wizycie. Zabronione jest przesyłanie treści o charakterze
            bezprawnym oraz podawanie danych innych osób bez ich zgody.
          </p>
          <p>
            Zasady przetwarzania danych z formularza opisuje <Link href="/polityka-prywatnosci">polityka prywatności</Link>.
          </p>
        </>
      ),
    },
    {
      id: "informacje",
      title: "Charakter informacji na Stronie",
      content: (
        <>
          <p>
            Treści na Stronie mają charakter informacyjny. Nie są poradą medyczną i nie zastępują konsultacji z lekarzem ani oceny fizjoterapeutycznej. O
            tym, czy i jaka terapia jest wskazana, fizjoterapeuta decyduje po ocenie na wizycie.
          </p>
          <p>Przy nagłym, silnym bólu po urazie, gorączce albo utracie czucia lub siły skontaktuj się z lekarzem, a w stanie zagrożenia życia zadzwoń pod 112.</p>
          <p>
            Ceny na Stronie nie stanowią oferty w rozumieniu art. 66 Kodeksu cywilnego, lecz zaproszenie do zawarcia umowy (art. 71 Kodeksu cywilnego).
            {PRICES_ARE_EXAMPLES && " Obecnie są to ceny przykładowe – aktualne ceny gabinet poda przed publikacją Strony."}
          </p>
        </>
      ),
    },
    {
      id: "wizyty",
      title: "Umawianie, odwoływanie i płatność za wizyty",
      content: (
        <>
          <p>
            Termin wizyty ustalamy telefonicznie, e-mailem albo przez formularz{siteConfig.bookingUrl ? " lub system rezerwacji online" : ""}. Na wizytę
            prywatną nie jest potrzebne skierowanie.
          </p>
          <ul>
            <li>
              Odwołanie lub przełożenie wizyty: <Pending>np. najpóźniej 24 godziny przed wizytą, ewentualne opłaty</Pending>.
            </li>
            <li>
              Spóźnienie pacjenta: <Pending>np. wizyta kończy się o zaplanowanej godzinie</Pending>.
            </li>
            <li>
              Formy płatności: <Pending>np. gotówka, karta płatnicza, BLIK</Pending>.
            </li>
            <li>
              Pakiety wizyt: <Pending>termin ważności, zasady zwrotu niewykorzystanych wizyt lub usunięcie punktu</Pending>.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "reklamacje",
      title: "Reklamacje",
      content: (
        <>
          <p>
            Reklamacje dotyczące działania Strony i formularza można składać e-mailem na adres {email ?? <Pending>adres e-mail</Pending>} lub pisemnie na adres{" "}
            {address ?? <Pending>adres</Pending>}. Reklamacja powinna zawierać dane do kontaktu i opis problemu.
          </p>
          <p>
            Reklamację rozpatrujemy w terminie <Pending>np. 14 dni</Pending> od jej otrzymania i odpowiadamy w taki sam sposób, w jaki została złożona,
            chyba że wskażesz inny.
          </p>
          <p>
            Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji, np. pomocy miejskiego lub powiatowego rzecznika konsumentów.
            Informacje są dostępne na stronie Urzędu Ochrony Konkurencji i Konsumentów.
          </p>
        </>
      ),
    },
    {
      id: "postanowienia-koncowe",
      title: "Postanowienia końcowe",
      content: (
        <>
          <p>
            Usługodawca może zmienić regulamin z ważnych przyczyn, np. zmiany przepisów lub zakresu usług na Stronie. Zmiana obowiązuje od dnia publikacji
            nowej wersji na Stronie i nie dotyczy zgłoszeń wysłanych wcześniej.
          </p>
          <p>
            Regulamin nie wyłącza ani nie ogranicza praw konsumenta wynikających z przepisów prawa. W sprawach nieuregulowanych stosuje się przepisy prawa
            polskiego.
          </p>
          <p>
            Regulamin obowiązuje od <Pending>data wejścia w życie</Pending>.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalPage
      title="Regulamin strony"
      path="/regulamin"
      intro={<p>Zasady korzystania ze strony i formularza prośby o kontakt oraz informacje o umawianiu wizyt i reklamacjach.</p>}
      sections={sections}
    />
  );
}
