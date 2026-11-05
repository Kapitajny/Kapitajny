import type { Metadata } from "next";
import Link from "next/link";
import { Fill, LegalDocument, Section } from "@/components/legal/LegalDocument";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Regulamin usług – tworzenie stron internetowych",
  description: "Projekt regulaminu usług ComputerIT: zamówienia, zakres, współpraca, terminy, odbiór, poprawki, prawa autorskie i reklamacje.",
  alternates: { canonical: "/regulamin-uslug" },
};

const toc = [
  { id: "ogolne", title: "§ 1. Postanowienia ogólne" },
  { id: "definicje", title: "§ 2. Definicje" },
  { id: "zakres", title: "§ 3. Zakres usług" },
  { id: "zamowienia", title: "§ 4. Zapytania i zamówienia" },
  { id: "ustalanie-zakresu", title: "§ 5. Ustalanie zakresu" },
  { id: "wspolpraca", title: "§ 6. Zasady współpracy" },
  { id: "obowiazki-klienta", title: "§ 7. Obowiązki Klienta" },
  { id: "obowiazki-wykonawcy", title: "§ 8. Obowiązki Wykonawcy" },
  { id: "materialy", title: "§ 9. Materiały od Klienta" },
  { id: "terminy", title: "§ 10. Terminy realizacji" },
  { id: "odbior", title: "§ 11. Odbiór prac" },
  { id: "poprawki", title: "§ 12. Poprawki" },
  { id: "prawa-autorskie", title: "§ 13. Prawa autorskie i licencje" },
  { id: "odpowiedzialnosc", title: "§ 14. Odpowiedzialność" },
  { id: "reklamacje", title: "§ 15. Reklamacje" },
  { id: "odstapienie", title: "§ 16. Odstąpienie od umowy" },
  { id: "platnosci", title: "§ 17. Płatności" },
  { id: "koncowe", title: "§ 18. Postanowienia końcowe" },
];

export default function ServiceTermsPage() {
  const email = siteConfig.contact.email;
  return (
    <LegalDocument
      title="Regulamin usług – tworzenie stron internetowych"
      lead="Zasady, na jakich ComputerIT przyjmuje zapytania, ustala zakres i realizuje projekty stron internetowych oraz sklepów internetowych."
      toc={toc}
    >
      <Section id="ogolne" title="§ 1. Postanowienia ogólne">
        <ol>
          <li>Regulamin określa zasady świadczenia przez Wykonawcę usług projektowania i tworzenia stron internetowych oraz sklepów internetowych.</li>
          <li>
            Wykonawcą jest <Fill>do uzupełnienia: imię i nazwisko lub nazwa firmy, adres siedziby, NIP, REGON lub numer KRS – jeśli dotyczy</Fill>,
            prowadzący działalność pod marką {siteConfig.name}.
          </li>
          <li>
            Kontakt z Wykonawcą: adres e-mail {email ? <a href={`mailto:${email}`} className="link">{email}</a> : <Fill>do uzupełnienia: adres e-mail</Fill>}{" "}
            oraz{" "}
            <Link href="/kontakt" className="link">
              formularz kontaktowy
            </Link>
            .
          </li>
          <li>Szczegółowe warunki konkretnego projektu określa umowa lub zaakceptowana oferta. W razie rozbieżności pierwszeństwo mają ustalenia umowy.</li>
        </ol>
      </Section>

      <Section id="definicje" title="§ 2. Definicje">
        <ul>
          <li>
            <strong>Wykonawca</strong> – podmiot wskazany w § 1 ust. 2.
          </li>
          <li>
            <strong>Klient</strong> – osoba fizyczna, osoba prawna lub jednostka organizacyjna, która składa zapytanie lub zawiera umowę z Wykonawcą.
          </li>
          <li>
            <strong>Konsument</strong> – Klient będący konsumentem w rozumieniu art. 22¹ Kodeksu cywilnego, a także osoba fizyczna prowadząca działalność
            gospodarczą w zakresie, w jakim przepisy przyznają jej uprawnienia konsumenta.
          </li>
          <li>
            <strong>Projekt</strong> – strona internetowa lub sklep internetowy wykonywany na podstawie umowy, wraz z uzgodnionymi elementami (np. projekt
            graficzny, kod, konfiguracja).
          </li>
          <li>
            <strong>Oferta</strong> – przygotowana przez Wykonawcę propozycja zakresu, ceny i harmonogramu Projektu.
          </li>
        </ul>
      </Section>

      <Section id="zakres" title="§ 3. Zakres usług">
        <ol>
          <li>Wykonawca świadczy usługi projektowania graficznego i tworzenia stron internetowych oraz sklepów internetowych, a także ich wdrożenia.</li>
          <li>
            Usługi dodatkowe – w szczególności domena, hosting, płatne licencje, integracje z usługami zewnętrznymi (np. operatorami płatności, firmami
            kurierskimi), przygotowanie treści i zdjęć oraz opieka techniczna po wdrożeniu – są realizowane wyłącznie wtedy, gdy zostaną wprost uzgodnione
            w umowie, i mogą być wyceniane osobno.
          </li>
          <li>Ceny podane na stronie są cenami minimalnymi („od”) i nie stanowią oferty w rozumieniu art. 66 Kodeksu cywilnego.</li>
        </ol>
      </Section>

      <Section id="zamowienia" title="§ 4. Zapytania i zamówienia">
        <ol>
          <li>Wysłanie zapytania przez formularz, e-mail lub telefonicznie jest bezpłatne i nie jest zawarciem umowy.</li>
          <li>Na podstawie zapytania Wykonawca przygotowuje Ofertę. Oferta jest ważna przez <Fill>do uzupełnienia: np. 14 dni</Fill>, chyba że wskazano inaczej.</li>
          <li>
            Umowa zostaje zawarta z chwilą <Fill>do uzupełnienia: np. akceptacji Oferty przez Klienta w wiadomości e-mail albo podpisania umowy</Fill>.
          </li>
          <li>Pakiet promocyjny (strona internetowa za 800 zł) jest dostępny wyłącznie dla pierwszych pięciu Klientów, którzy zawrą umowę na jego warunkach. Zakres pakietu ustalany jest indywidualnie.</li>
        </ol>
      </Section>

      <Section id="ustalanie-zakresu" title="§ 5. Ustalanie zakresu">
        <ol>
          <li>Zakres Projektu – w szczególności liczba podstron, funkcje, wersje językowe i integracje – jest opisany w Ofercie lub umowie.</li>
          <li>Wykonawca realizuje wyłącznie funkcje i elementy uzgodnione w zakresie. Elementy nieopisane w zakresie nie są częścią Projektu.</li>
          <li>Zmiana zakresu w trakcie realizacji wymaga uzgodnienia przez obie strony i może wpłynąć na cenę oraz termin. Wykonawca informuje o tym przed wykonaniem zmiany.</li>
        </ol>
      </Section>

      <Section id="wspolpraca" title="§ 6. Zasady współpracy">
        <ol>
          <li>Strony komunikują się przede wszystkim drogą elektroniczną. Ustalenia przekazane e-mailem są wiążące, jeśli umowa nie stanowi inaczej.</li>
          <li>Każda ze stron wskazuje osobę do kontaktu, która może przekazywać materiały i akceptować kolejne etapy.</li>
          <li>Realizacja przebiega etapami opisanymi w Ofercie – zwykle: ustalenie zakresu, projekt graficzny, wykonanie, testy i wdrożenie.</li>
        </ol>
      </Section>

      <Section id="obowiazki-klienta" title="§ 7. Obowiązki Klienta">
        <ul>
          <li>terminowe przekazywanie materiałów i informacji potrzebnych do realizacji,</li>
          <li>udzielanie odpowiedzi i akceptacji w uzgodnionych terminach,</li>
          <li>zapewnienie dostępów niezbędnych do wdrożenia (np. do domeny lub hostingu), jeżeli wdrożenie wymaga takich dostępów,</li>
          <li>terminowe regulowanie płatności zgodnie z regulaminem płatności i umową.</li>
        </ul>
      </Section>

      <Section id="obowiazki-wykonawcy" title="§ 8. Obowiązki Wykonawcy">
        <ul>
          <li>wykonanie Projektu z należytą starannością, zgodnie z uzgodnionym zakresem,</li>
          <li>informowanie Klienta o postępach prac i okolicznościach, które mogą wpłynąć na termin lub zakres,</li>
          <li>zachowanie w poufności informacji przekazanych przez Klienta, które nie są publicznie dostępne,</li>
          <li>przekazanie Klientowi po zakończeniu prac dostępów i informacji niezbędnych do korzystania z Projektu w uzgodnionym zakresie.</li>
        </ul>
      </Section>

      <Section id="materialy" title="§ 9. Materiały od Klienta">
        <ol>
          <li>Klient przekazuje materiały potrzebne do realizacji (np. teksty, zdjęcia, logo, dane produktów) w formie elektronicznej.</li>
          <li>Klient oświadcza, że ma prawa do przekazanych materiałów i że ich wykorzystanie w Projekcie nie narusza praw osób trzecich.</li>
          <li>Jeśli Klient nie dysponuje materiałami, strony mogą uzgodnić ich przygotowanie lub zakup jako usługę dodatkową.</li>
        </ol>
      </Section>

      <Section id="terminy" title="§ 10. Terminy realizacji">
        <ol>
          <li>Termin realizacji jest ustalany indywidualnie w Ofercie lub umowie.</li>
          <li>
            Termin zależy od współpracy Klienta. Opóźnienie w przekazaniu materiałów, informacji, dostępów lub akceptacji przesuwa termin realizacji
            co najmniej o czas tego opóźnienia.
          </li>
          <li>Wykonawca niezwłocznie informuje Klienta o okolicznościach, które mogą wpłynąć na dotrzymanie terminu.</li>
        </ol>
      </Section>

      <Section id="odbior" title="§ 11. Odbiór prac">
        <ol>
          <li>Po zakończeniu etapu lub całego Projektu Wykonawca zgłasza go Klientowi do odbioru.</li>
          <li>
            Klient w terminie <Fill>do uzupełnienia: np. 7 dni</Fill> od zgłoszenia akceptuje prace albo przekazuje uwagi dotyczące niezgodności z
            uzgodnionym zakresem.
          </li>
          <li>
            Skutki braku odpowiedzi Klienta w tym terminie: <Fill>do uzupełnienia – decyzja i weryfikacja prawna, szczególnie w umowach z konsumentami</Fill>.
          </li>
        </ol>
      </Section>

      <Section id="poprawki" title="§ 12. Poprawki">
        <ol>
          <li>
            W cenie Projektu mieszczą się poprawki w liczbie <Fill>do uzupełnienia: np. 2 tury poprawek na etapie projektu graficznego</Fill>, chyba że
            umowa stanowi inaczej.
          </li>
          <li>Poprawka to zmiana w ramach uzgodnionego zakresu. Nowe funkcje, podstrony lub zmiana koncepcji po akceptacji są zmianą zakresu (§ 5 ust. 3).</li>
          <li>Dodatkowe tury poprawek mogą być wyceniane osobno – po wcześniejszej informacji i akceptacji Klienta.</li>
        </ol>
      </Section>

      <Section id="prawa-autorskie" title="§ 13. Prawa autorskie i licencje">
        <ol>
          <li>
            Autorskie prawa majątkowe do utworów stworzonych w ramach Projektu przechodzą na Klienta{" "}
            <Fill>do uzupełnienia: np. z chwilą zapłaty całego wynagrodzenia – albo udzielenie licencji</Fill> na polach eksploatacji wskazanych w umowie.
          </li>
          <li>
            Elementy dostarczane przez podmioty trzecie (np. kroje pisma, zdjęcia z banków zdjęć, biblioteki programistyczne, wtyczki) są wykorzystywane
            na warunkach licencji ich dostawców. Wykonawca informuje Klienta o takich elementach i ewentualnych kosztach licencji.
          </li>
          <li>
            Wykonawca może pokazać Projekt w swoim portfolio <Fill>do uzupełnienia: np. po uzyskaniu zgody Klienta</Fill>.
          </li>
        </ol>
      </Section>

      <Section id="odpowiedzialnosc" title="§ 14. Odpowiedzialność">
        <ol>
          <li>Wykonawca odpowiada za należyte wykonanie umowy na zasadach ogólnych, z zastrzeżeniem postanowień umowy.</li>
          <li>
            Wykonawca nie odpowiada za działanie usług podmiotów trzecich, których nie dostarcza (np. hostingu, domeny, operatorów płatności), ani za
            treści i materiały przekazane przez Klienta.
          </li>
          <li>
            Ewentualne ograniczenie odpowiedzialności w umowach z przedsiębiorcami: <Fill>do uzupełnienia i weryfikacji prawnej</Fill>. Postanowienia
            ograniczające odpowiedzialność nie dotyczą Konsumentów w zakresie, w jakim przepisy na to nie pozwalają.
          </li>
        </ol>
      </Section>

      <Section id="reklamacje" title="§ 15. Reklamacje">
        <ol>
          <li>Reklamacje dotyczące realizacji usług można składać na adres e-mail wskazany w § 1 ust. 3.</li>
          <li>Reklamacja powinna zawierać dane Klienta, opis problemu i – w miarę możliwości – zrzuty ekranu lub adres podstrony, której dotyczy.</li>
          <li>
            Wykonawca odpowiada na reklamację w terminie <Fill>do uzupełnienia: np. 14 dni</Fill> od jej otrzymania.
          </li>
        </ol>
      </Section>

      <Section id="odstapienie" title="§ 16. Odstąpienie od umowy">
        <p>
          <Fill>Jeśli dotyczy – do weryfikacji prawnej.</Fill> Konsument, który zawarł umowę na odległość, może od niej odstąpić bez podania przyczyny w
          terminie 14 dni od dnia jej zawarcia, na zasadach ustawy z dnia 30 maja 2014 r. o prawach konsumenta.
        </p>
        <ol>
          <li>
            Jeżeli Konsument zażąda rozpoczęcia prac przed upływem terminu na odstąpienie, a następnie od umowy odstąpi, zapłaci za świadczenia spełnione
            do chwili odstąpienia.
          </li>
          <li>
            Prawo odstąpienia nie przysługuje, jeżeli Wykonawca w pełni wykonał usługę za wyraźną zgodą Konsumenta, który został poinformowany przed
            rozpoczęciem świadczenia, że po jego spełnieniu utraci prawo odstąpienia.
          </li>
          <li>Oświadczenie o odstąpieniu można przesłać na adres e-mail wskazany w § 1 ust. 3. Wzór formularza odstąpienia: <Fill>do uzupełnienia</Fill>.</li>
        </ol>
      </Section>

      <Section id="platnosci" title="§ 17. Płatności">
        <p>
          Zasady płatności – w tym wyłączną formę płatności przelewem bankowym – opisuje{" "}
          <Link href="/regulamin-platnosci" className="link">
            Regulamin płatności
          </Link>
          .
        </p>
      </Section>

      <Section id="koncowe" title="§ 18. Postanowienia końcowe">
        <ol>
          <li>
            Zasady przetwarzania danych osobowych opisuje{" "}
            <Link href="/polityka-prywatnosci" className="link">
              Polityka prywatności
            </Link>
            .
          </li>
          <li>W sprawach nieuregulowanych regulaminem stosuje się przepisy prawa polskiego, w szczególności Kodeksu cywilnego i ustawy o prawach konsumenta.</li>
          <li>Zmiany regulaminu nie wpływają na umowy zawarte przed ich wprowadzeniem.</li>
          <li>
            Regulamin obowiązuje od <Fill>do uzupełnienia: data</Fill>.
          </li>
        </ol>
      </Section>
    </LegalDocument>
  );
}
