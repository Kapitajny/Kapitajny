import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { Pending } from "@/components/ui/Pending";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Regulamin serwisu",
  description: "Regulamin korzystania z serwisu Rygiel i formularza kontaktowego jako usługi świadczonej drogą elektroniczną.",
  path: "/regulamin",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Regulamin serwisu"
      path="/regulamin"
      updated="2026-10-22"
      lede="Serwis ma charakter informacyjny. Regulamin obejmuje dwie usługi świadczone drogą elektroniczną: dostęp do treści serwisu i formularz kontaktowy. Nie dotyczy usług IT – te reguluje odrębna umowa."
    >
      <section aria-labelledby="postanowienia">
        <h2 id="postanowienia">1. Postanowienia ogólne</h2>
        <p>
          Regulamin określa zasady korzystania z&nbsp;serwisu dostępnego pod adresem <Pending>adres serwisu</Pending>, zgodnie z&nbsp;ustawą z&nbsp;dnia 18 lipca 2002 r. o
          świadczeniu usług drogą elektroniczną.
        </p>
        <p>
          Usługodawcą jest <Pending>pełna nazwa firmy, adres siedziby, NIP, dane rejestrowe</Pending>, adres e-mail: <Pending>adres kontaktowy</Pending>.
        </p>
      </section>

      <section aria-labelledby="uslugi">
        <h2 id="uslugi">2. Rodzaje i&nbsp;zakres usług</h2>
        <ul>
          <li>Udostępnianie treści serwisu, w&nbsp;tym artykułów bazy wiedzy – bezpłatnie i&nbsp;bez rejestracji.</li>
          <li>Formularz kontaktowy umożliwiający wysłanie zapytania – bezpłatnie, przy każdym wysłaniu formularza.</li>
        </ul>
        <p>Umowa o&nbsp;świadczenie usługi formularza zostaje zawarta z&nbsp;chwilą wysłania formularza i&nbsp;rozwiązuje się po jego wysłaniu.</p>
      </section>

      <section aria-labelledby="wymagania">
        <h2 id="wymagania">3. Wymagania techniczne</h2>
        <p>
          Do korzystania z&nbsp;serwisu potrzebne jest urządzenie z&nbsp;dostępem do internetu i&nbsp;aktualną przeglądarką internetową z&nbsp;włączoną obsługą JavaScriptu (wymaganą
          przez formularz kontaktowy).
        </p>
      </section>

      <section aria-labelledby="zasady">
        <h2 id="zasady">4. Zasady korzystania</h2>
        <p>Zabronione jest przesyłanie przez formularz treści o&nbsp;charakterze bezprawnym, w&nbsp;tym złośliwego oprogramowania, spamu oraz danych osób trzecich bez podstawy prawnej.</p>
        <p>
          Artykuły w&nbsp;bazie wiedzy mają charakter edukacyjny i&nbsp;nie stanowią porady dotyczącej konkretnego środowiska. Zmiany w&nbsp;systemach wprowadzaj z&nbsp;rozwagą
          i&nbsp;z&nbsp;kopią zapasową.
        </p>
      </section>

      <section aria-labelledby="reklamacje">
        <h2 id="reklamacje">5. Reklamacje</h2>
        <p>
          Reklamacje dotyczące działania serwisu można zgłaszać na adres <Pending>adres e-mail do reklamacji</Pending>. Odpowiadamy w terminie{" "}
          <Pending>termin, np. 14 dni</Pending> od otrzymania zgłoszenia.
        </p>
      </section>

      <section aria-labelledby="dane">
        <h2 id="dane">6. Dane osobowe</h2>
        <p>
          Zasady przetwarzania danych osobowych opisuje <Link href="/polityka-prywatnosci">polityka prywatności</Link>.
        </p>
      </section>

      <section aria-labelledby="koncowe">
        <h2 id="koncowe">7. Postanowienia końcowe</h2>
        <p>
          O zmianach regulaminu informujemy w serwisie. W sprawach nieuregulowanych stosuje się przepisy prawa polskiego. Regulamin obowiązuje od{" "}
          <Pending>data wejścia w&nbsp;życie</Pending>.
        </p>
      </section>
    </LegalPage>
  );
}
