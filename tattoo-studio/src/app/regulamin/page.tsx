import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Fill, LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Regulamin",
  description: `Zasady korzystania ze strony i formularza konsultacji studia ${siteConfig.name}.`,
  alternates: { canonical: "/regulamin" },
};

export default function TermsPage() {
  const { legal, contact } = siteConfig;
  return (
    <LegalPage title="Regulamin">
      <h2>1. Postanowienia ogólne</h2>
      <p>
        Regulamin określa zasady korzystania ze strony internetowej studia {siteConfig.name} oraz z formularza konsultacji „Book
        your tattoo”. Usługodawcą jest <Fill value={legal.companyName} label="nazwa firmy" />,{" "}
        <Fill value={legal.companyAddress} label="adres" />, NIP: <Fill value={legal.nip} label="NIP" />. Kontakt:{" "}
        <Fill value={contact.email} label="adres e-mail" />, <Fill value={contact.phone} label="telefon" />.
      </p>

      <h2>2. Wymagania techniczne</h2>
      <p>
        Do korzystania ze strony potrzebne jest urządzenie z dostępem do internetu i aktualną przeglądarką z włączoną obsługą
        JavaScript.
      </p>

      <h2>3. Formularz konsultacji</h2>
      <ol>
        <li>Formularz służy do przekazania studiu informacji o pomyśle na tatuaż w celu przygotowania konsultacji.</li>
        <li>
          Wysłanie formularza nie jest rezerwacją terminu ani zawarciem umowy. Termin i warunki wykonania tatuażu ustalane są
          indywidualnie ze studiem.
        </li>
        <li>Podany w formularzu budżet i preferowany termin mają charakter orientacyjny.</li>
        <li>Użytkownik odpowiada za prawdziwość podanych danych i za prawa do przesyłanych zdjęć.</li>
        <li>Zabronione jest przesyłanie treści bezprawnych, obraźliwych lub naruszających prawa osób trzecich.</li>
      </ol>

      <h2>4. Kalkulator ceny</h2>
      <p>
        Kalkulator w sekcji Pricing pokazuje szacunkowy przedział ceny. Nie stanowi oferty w rozumieniu Kodeksu cywilnego.
        Ostateczną cenę ustala tatuator po indywidualnej wycenie projektu.
      </p>

      <h2>5. Zasady współpracy</h2>
      <p>
        <Fill label="zasady studia: zadatki, odwoływanie i przekładanie wizyt, poprawki, wiek klientów, prawa autorskie do projektów" />
      </p>

      <h2>6. Reklamacje dotyczące strony</h2>
      <p>
        Uwagi i reklamacje dotyczące działania strony można zgłaszać na adres <Fill value={contact.email} label="adres e-mail" />.
        Odpowiadamy w terminie <Fill label="termin odpowiedzi, np. 14 dni" />.
      </p>

      <h2>7. Dane osobowe</h2>
      <p>
        Zasady przetwarzania danych osobowych opisuje <Link href="/polityka-prywatnosci">Polityka prywatności</Link>.
      </p>

      <h2>8. Postanowienia końcowe</h2>
      <p>
        <Fill label="zasady zmiany regulaminu i data wejścia w życie" />
      </p>
    </LegalPage>
  );
}
