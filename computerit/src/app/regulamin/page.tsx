import type { Metadata } from "next";
import Link from "next/link";
import { Fill, LegalDocument, Section } from "@/components/legal/LegalDocument";
import { siteConfig } from "@/config/site";
import { formatPrice, promo, services } from "@/data/offer";

export const metadata: Metadata = {
  title: "Regulamin",
  description: "Zasady korzystania ze strony ComputerIT, składania zapytań i realizacji stron internetowych oraz sklepów online.",
  alternates: { canonical: "/regulamin" },
};

export default function TermsPage() {
  const email = siteConfig.contact.email;

  return (
    <LegalDocument
      title="Regulamin"
      draftNote={
        <>
          Projekt dokumentu. Fragmenty oznaczone jako <Fill>do uzupełnienia</Fill> wymagają wpisania danych usługodawcy i decyzji dotyczących współpracy przed
          publikacją strony. Zalecamy konsultację treści z prawnikiem.
        </>
      }
    >
      <Section title="§ 1. Postanowienia ogólne">
        <p>
          Regulamin określa zasady korzystania ze strony {siteConfig.name}, wysyłania zapytań przez formularz kontaktowy oraz zasady, na jakich przygotowywane
          są oferty na projektowanie i tworzenie stron internetowych i sklepów online.
        </p>
        <p>
          Usługodawcą jest <Fill>do uzupełnienia: imię i nazwisko lub nazwa firmy, adres, NIP</Fill>, prowadzący działalność pod marką {siteConfig.name}.
        </p>
        <p>
          Kontakt z usługodawcą:{" "}
          {email ? (
            <a href={`mailto:${email}`} className="underline underline-offset-2">
              {email}
            </a>
          ) : (
            <Fill>do uzupełnienia: adres e-mail</Fill>
          )}{" "}
          lub przez{" "}
          <Link href="/#kontakt" className="underline underline-offset-2">
            formularz kontaktowy
          </Link>
          .
        </p>
      </Section>

      <Section title="§ 2. Definicje">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-ink">Usługodawca</strong> – podmiot wskazany w § 1.
          </li>
          <li>
            <strong className="font-semibold text-ink">Klient</strong> – osoba fizyczna, osoba prawna lub jednostka organizacyjna, która korzysta ze strony lub
            wysyła zapytanie.
          </li>
          <li>
            <strong className="font-semibold text-ink">Konsument</strong> – Klient będący konsumentem w rozumieniu art. 22¹ Kodeksu cywilnego, a także
            przedsiębiorca na prawach konsumenta w zakresie przewidzianym przepisami.
          </li>
          <li>
            <strong className="font-semibold text-ink">Usługa</strong> – zaprojektowanie i wykonanie strony internetowej lub sklepu internetowego na podstawie
            umowy zawartej z Klientem.
          </li>
        </ul>
      </Section>

      <Section title="§ 3. Korzystanie ze strony">
        <p>
          Do korzystania ze strony wystarczy aktualna przeglądarka internetowa z włączoną obsługą JavaScriptu. Korzystanie ze strony i wysłanie zapytania są
          bezpłatne.
        </p>
        <p>Zabronione jest przesyłanie przez formularz treści o charakterze bezprawnym, obraźliwym lub reklamowym (spam).</p>
      </Section>

      <Section title="§ 4. Zapytania i zawarcie umowy">
        <p>
          Wysłanie zapytania przez formularz kontaktowy nie jest zawarciem umowy i nie zobowiązuje Klienta do skorzystania z Usługi. Na podstawie zapytania
          Usługodawca przygotowuje propozycję zakresu prac, terminu i wyceny.
        </p>
        <p>
          Umowa o wykonanie Usługi zawierana jest indywidualnie, po uzgodnieniu zakresu, ceny i harmonogramu, w formie{" "}
          <Fill>do uzupełnienia: np. pisemnej lub dokumentowej (e-mail)</Fill>. Szczegółowe warunki realizacji, w tym liczba poprawek, terminy płatności i
          przeniesienie praw autorskich, określa umowa.
        </p>
      </Section>

      <Section title="§ 5. Ceny i pakiet promocyjny">
        <p>Ceny podane na stronie są cenami minimalnymi:</p>
        <ul className="list-disc space-y-2 pl-5">
          {services.map((service, i) => (
            <li key={service.id}>
              {service.name.toLowerCase()} – od {formatPrice(service.price)} zł netto{i === services.length - 1 ? "." : ","}
            </li>
          ))}
        </ul>
        <p>
          Ostateczna cena zależy od zakresu projektu i jest ustalana indywidualnie przed rozpoczęciem prac. Informacje o cenach na stronie nie stanowią oferty w
          rozumieniu art. 66 Kodeksu cywilnego.
        </p>
        <p>
          Pakiet promocyjny – realizacja strony internetowej za {formatPrice(promo.price)} zł – jest dostępny wyłącznie dla pierwszych pięciu Klientów, którzy
          zawrą umowę na jego warunkach. Pakiet nie obejmuje sklepu internetowego, a szczegółowy zakres realizacji ustalany jest indywidualnie.{" "}
          <Fill>Do uzupełnienia: czy cena promocyjna jest kwotą netto czy brutto.</Fill>
        </p>
      </Section>

      <Section title="§ 6. Realizacja Usługi">
        <p>
          Usługa realizowana jest etapami opisanymi w umowie – zwykle od ustalenia zakresu, przez projekt graficzny i jego akceptację, po wykonanie i wdrożenie
          strony. Klient przekazuje materiały potrzebne do realizacji (np. teksty, zdjęcia, logo) i odpowiada za to, że ma do nich prawa.
        </p>
        <p>Usługodawca nie zapewnia funkcji, które nie zostały uzgodnione w umowie. Dodatkowe prace wyceniane są osobno, po akceptacji Klienta.</p>
      </Section>

      <Section title="§ 7. Portfolio">
        <p>
          Projekty pokazane w portfolio są koncepcjami demonstracyjnymi przygotowanymi dla fikcyjnych marek. Nie są realizacjami dla klientów, a zawarte w nich
          adresy, ceny, oferty i dane kontaktowe są przykładowe. Wersje demonstracyjne stron i sklepów nie przyjmują zamówień ani płatności.
        </p>
      </Section>

      <Section title="§ 8. Prawa autorskie">
        <p>
          Treści, grafiki i układ strony {siteConfig.name} są chronione prawem autorskim. Ich kopiowanie i wykorzystywanie bez zgody Usługodawcy jest
          zabronione.
        </p>
        <p>Zasady przeniesienia autorskich praw majątkowych do wykonanej strony lub sklepu oraz moment ich przejścia na Klienta określa umowa.</p>
      </Section>

      <Section title="§ 9. Reklamacje">
        <p>
          Reklamacje dotyczące działania strony lub realizacji Usługi można zgłaszać na adres e-mail wskazany w § 1. Zgłoszenie powinno zawierać opis problemu i
          dane kontaktowe.
        </p>
        <p>
          Usługodawca odpowiada na reklamację w terminie <Fill>do uzupełnienia: np. 14 dni</Fill> od jej otrzymania.
        </p>
      </Section>

      <Section title="§ 10. Konsumenci">
        <p>
          Konsumentom przysługują uprawnienia wynikające z bezwzględnie obowiązujących przepisów, w szczególności ustawy o prawach konsumenta, w tym – w
          przypadkach w niej określonych – prawo odstąpienia od umowy zawartej na odległość w terminie 14 dni. Postanowienia regulaminu nie ograniczają tych
          uprawnień.
        </p>
      </Section>

      <Section title="§ 11. Dane osobowe">
        <p>
          Zasady przetwarzania danych osobowych przekazanych przez formularz opisuje{" "}
          <Link href="/polityka-prywatnosci" className="underline underline-offset-2">
            polityka prywatności
          </Link>
          .
        </p>
      </Section>

      <Section title="§ 12. Postanowienia końcowe">
        <p>
          W sprawach nieuregulowanych regulaminem zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu cywilnego i ustawy o świadczeniu usług
          drogą elektroniczną.
        </p>
        <p>
          Regulamin obowiązuje od <Fill>do uzupełnienia: data</Fill>. Zmiany regulaminu nie wpływają na umowy zawarte przed ich wprowadzeniem.
        </p>
      </Section>
    </LegalDocument>
  );
}
