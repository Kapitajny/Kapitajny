import type { Metadata } from "next";
import Link from "next/link";
import { Fill, LegalDocument, Section } from "@/components/legal/LegalDocument";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Regulamin płatności",
  description: "Projekt regulaminu płatności ComputerIT. Płatności przyjmujemy wyłącznie przelewem bankowym.",
  alternates: { canonical: "/regulamin-platnosci" },
};

const toc = [
  { id: "ogolne", title: "§ 1. Postanowienia ogólne" },
  { id: "forma", title: "§ 2. Forma płatności" },
  { id: "rachunek", title: "§ 3. Dane do przelewu" },
  { id: "ceny", title: "§ 4. Ceny" },
  { id: "rozliczenie", title: "§ 5. Sposób rozliczenia" },
  { id: "termin", title: "§ 6. Termin płatności" },
  { id: "potwierdzenie", title: "§ 7. Potwierdzenie płatności" },
  { id: "rozpoczecie", title: "§ 8. Rozpoczęcie realizacji" },
  { id: "opoznienia", title: "§ 9. Opóźnienia w płatności" },
  { id: "zwroty", title: "§ 10. Zwroty" },
  { id: "dokumenty", title: "§ 11. Dokumentowanie transakcji" },
  { id: "koncowe", title: "§ 12. Postanowienia końcowe" },
];

export default function PaymentTermsPage() {
  const email = siteConfig.contact.email;
  return (
    <LegalDocument
      title="Regulamin płatności"
      lead="Zasady rozliczeń za usługi ComputerIT. Płatności przyjmujemy wyłącznie przelewem bankowym."
      toc={toc}
    >
      <Section id="ogolne" title="§ 1. Postanowienia ogólne">
        <ol>
          <li>
            Regulamin określa zasady płatności za usługi świadczone przez{" "}
            <Fill>do uzupełnienia: imię i nazwisko lub nazwa firmy, adres siedziby, NIP</Fill> pod marką {siteConfig.name} („Wykonawca”).
          </li>
          <li>
            Regulamin uzupełnia{" "}
            <Link href="/regulamin-uslug" className="link">
              Regulamin usług
            </Link>
            . Szczegółowe warunki płatności dla konkretnego projektu określa umowa lub zaakceptowana oferta.
          </li>
        </ol>
      </Section>

      <Section id="forma" title="§ 2. Forma płatności">
        <ol>
          <li>
            <strong>Wykonawca przyjmuje płatności wyłącznie przelewem bankowym</strong> na rachunek wskazany w § 3.
          </li>
          <li>
            Wykonawca nie przyjmuje płatności gotówką, kartą płatniczą, BLIK-iem ani za pośrednictwem operatorów płatności internetowych (np. PayU,
            Przelewy24, Stripe, PayPal).
          </li>
          <li>Wykonawca nigdy nie prosi o podanie danych karty płatniczej ani haseł do bankowości elektronicznej.</li>
        </ol>
      </Section>

      <Section id="rachunek" title="§ 3. Dane do przelewu">
        <dl className="grid gap-x-6 gap-y-3 rounded-xl border border-line bg-white p-5 sm:grid-cols-[12rem_1fr]">
          <dt className="text-steel">Odbiorca</dt>
          <dd>
            <Fill>do uzupełnienia: nazwa odbiorcy</Fill>
          </dd>
          <dt className="text-steel">Numer rachunku</dt>
          <dd>
            <Fill>do uzupełnienia: numer rachunku bankowego</Fill>
          </dd>
          <dt className="text-steel">Bank</dt>
          <dd>
            <Fill>do uzupełnienia: nazwa banku</Fill>
          </dd>
          <dt className="text-steel">Tytuł przelewu</dt>
          <dd>numer dokumentu rozliczeniowego lub numer oferty</dd>
        </dl>
        <p>
          Numer rachunku jest przekazywany także w dokumencie rozliczeniowym. W razie wątpliwości co do numeru rachunku (np. po otrzymaniu wiadomości o
          jego zmianie) potwierdź go z Wykonawcą przed wykonaniem przelewu.
        </p>
      </Section>

      <Section id="ceny" title="§ 4. Ceny">
        <ol>
          <li>Ceny usług podane na stronie są cenami minimalnymi („od”) wyrażonymi w złotych polskich. Ostateczną cenę określa zaakceptowana oferta.</li>
          <li>
            Ceny oznaczone jako „netto” nie zawierają podatku VAT. Status Wykonawcy w zakresie VAT i sposób doliczania podatku:{" "}
            <Fill>do uzupełnienia</Fill>.
          </li>
          <li>
            Cena pakietu promocyjnego (800 zł) jest kwotą <Fill>do uzupełnienia: netto albo brutto</Fill>.
          </li>
        </ol>
      </Section>

      <Section id="rozliczenie" title="§ 5. Sposób rozliczenia">
        <ol>
          <li>
            Sposób rozliczenia – w szczególności to, czy płatność następuje jednorazowo, czy w częściach, oraz w jakich momentach – strony ustalają
            indywidualnie w ofercie lub umowie.
          </li>
          <li>Regulamin nie przewiduje automatycznie zaliczki ani podziału płatności na części. Taki sposób rozliczenia obowiązuje tylko wtedy, gdy strony wprost go uzgodnią.</li>
          <li>
            Domyślny sposób rozliczenia, jeśli umowa go nie określa: <Fill>do uzupełnienia – decyzja Wykonawcy</Fill>.
          </li>
        </ol>
      </Section>

      <Section id="termin" title="§ 6. Termin płatności">
        <ol>
          <li>
            Termin płatności wynosi <Fill>do uzupełnienia: np. 7 dni</Fill> od dnia wystawienia dokumentu rozliczeniowego, chyba że umowa stanowi inaczej.
          </li>
          <li>Za dzień zapłaty uznaje się dzień uznania rachunku bankowego Wykonawcy.</li>
        </ol>
      </Section>

      <Section id="potwierdzenie" title="§ 7. Potwierdzenie płatności">
        <ol>
          <li>
            Wykonawca potwierdza zaksięgowanie płatności <Fill>do uzupełnienia: np. wiadomością e-mail w ciągu 2 dni roboczych od uznania rachunku</Fill>.
          </li>
          <li>Klient może przesłać potwierdzenie przelewu, ale nie zastępuje ono uznania rachunku Wykonawcy.</li>
        </ol>
      </Section>

      <Section id="rozpoczecie" title="§ 8. Rozpoczęcie realizacji">
        <p>
          Prace rozpoczynają się po zawarciu umowy w terminie w niej wskazanym. Jeżeli strony uzgodniły płatność przed rozpoczęciem prac (lub jej część),
          realizacja rozpoczyna się po zaksięgowaniu tej płatności. Szczegóły: <Fill>do uzupełnienia</Fill>.
        </p>
      </Section>

      <Section id="opoznienia" title="§ 9. Opóźnienia w płatności">
        <ol>
          <li>W razie opóźnienia w płatności Wykonawca może naliczyć odsetki w wysokości wynikającej z przepisów prawa.</li>
          <li>
            Uprawnienie Wykonawcy do wstrzymania prac lub wdrożenia do czasu zapłaty: <Fill>do uzupełnienia i weryfikacji prawnej</Fill>.
          </li>
        </ol>
      </Section>

      <Section id="zwroty" title="§ 10. Zwroty">
        <ol>
          <li>Zwrot płatności może nastąpić w szczególności w przypadku uznanej reklamacji, nadpłaty albo skutecznego odstąpienia od umowy.</li>
          <li>Zwrotu dokonuje się przelewem bankowym na rachunek, z którego wpłynęła płatność, chyba że strony uzgodnią inny rachunek.</li>
          <li>
            W przypadku odstąpienia od umowy przez Konsumenta zwrot następuje niezwłocznie, nie później niż w terminie 14 dni od otrzymania oświadczenia
            o odstąpieniu, z uwzględnieniem kwoty należnej za świadczenia spełnione do chwili odstąpienia.
          </li>
          <li>
            Termin zwrotu w pozostałych przypadkach: <Fill>do uzupełnienia: np. 14 dni</Fill>.
          </li>
        </ol>
      </Section>

      <Section id="dokumenty" title="§ 11. Dokumentowanie transakcji">
        <ol>
          <li>
            Każda płatność jest dokumentowana <Fill>do uzupełnienia: fakturą VAT albo rachunkiem – zależnie od statusu Wykonawcy</Fill>, przesyłanym w formie
            elektronicznej na adres e-mail Klienta.
          </li>
          <li>Zwroty i zmiany kwot są dokumentowane odpowiednim dokumentem korygującym.</li>
          <li>Dane potrzebne do wystawienia dokumentu Klient przekazuje przed jego wystawieniem.</li>
        </ol>
      </Section>

      <Section id="koncowe" title="§ 12. Postanowienia końcowe">
        <ol>
          <li>
            Pytania dotyczące płatności można kierować na adres{" "}
            {email ? (
              <a href={`mailto:${email}`} className="link">
                {email}
              </a>
            ) : (
              <Fill>do uzupełnienia: adres e-mail</Fill>
            )}
            .
          </li>
          <li>W sprawach nieuregulowanych stosuje się przepisy prawa polskiego.</li>
          <li>
            Regulamin obowiązuje od <Fill>do uzupełnienia: data</Fill>.
          </li>
        </ol>
      </Section>
    </LegalDocument>
  );
}
