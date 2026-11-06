import Link from "next/link";
import { Fill, LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Regulamin świadczenia usług",
  description: "Projekt regulaminu świadczenia usług transportu medycznego i sanitarnego: zakres usług, zamawianie, płatności, odwoływanie i reklamacje.",
  path: "/regulamin",
});

const toc = [
  { id: "postanowienia", label: "§ 1. Postanowienia ogólne" },
  { id: "definicje", label: "§ 2. Definicje" },
  { id: "zakres", label: "§ 3. Zakres usług" },
  { id: "zamawianie", label: "§ 4. Zasady zamawiania transportu" },
  { id: "platnosci", label: "§ 5. Zasady płatności" },
  { id: "odwolywanie", label: "§ 6. Odwoływanie usług" },
  { id: "obowiazki", label: "§ 7. Obowiązki klienta" },
  { id: "reklamacje", label: "§ 8. Reklamacje" },
  { id: "odpowiedzialnosc", label: "§ 9. Odpowiedzialność stron" },
  { id: "koncowe", label: "§ 10. Postanowienia końcowe" },
];

export default function TermsPage() {
  const { contact } = siteConfig;
  return (
    <LegalPage title="Regulamin świadczenia usług" path="/regulamin" updated="06.11.2026" toc={toc}>
      <h2 id="postanowienia">§ 1. Postanowienia ogólne</h2>
      <ol>
        <li>
          Regulamin określa zasady świadczenia usług transportu medycznego, transportu sanitarnego oraz usług medycznych przez {siteConfig.legalName} z
          siedzibą w {contact.city}, {contact.street}, {contact.postalCode} {contact.city}, wpisaną do <Fill>rejestru – KRS / CEIDG</Fill> pod numerem{" "}
          <Fill>numer</Fill>, NIP <Fill>NIP</Fill>, REGON <Fill>REGON</Fill>, wpisaną do rejestru podmiotów wykonujących działalność leczniczą pod numerem
          księgi rejestrowej <Fill>numer RPWDL</Fill> (dalej: „Usługodawca”).
        </li>
        <li>
          Kontakt z Usługodawcą: telefon <a href={contact.phoneHref}>{contact.phoneDisplay}</a>, e-mail{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </li>
        <li>Regulamin dotyczy usług komercyjnych (odpłatnych). Świadczenia finansowane ze środków publicznych realizowane są na zasadach wynikających z przepisów prawa i umowy z Narodowym Funduszem Zdrowia, a postanowienia Regulaminu stosuje się do nich wyłącznie w zakresie nieuregulowanym tymi przepisami.</li>
        <li>
          Usługodawca nie jest jednostką systemu Państwowego Ratownictwa Medycznego dysponowaną na zgłoszenia alarmowe złożone przez stronę internetową.
          <strong> W stanie nagłego zagrożenia zdrowia lub życia należy dzwonić pod numer alarmowy 112 lub 999.</strong>
        </li>
      </ol>

      <h2 id="definicje">§ 2. Definicje</h2>
      <ul>
        <li>
          <strong>Klient</strong> – osoba fizyczna, osoba prawna lub jednostka organizacyjna zamawiająca usługę, w tym na rzecz Pacjenta.
        </li>
        <li>
          <strong>Pacjent</strong> – osoba, na rzecz której realizowana jest usługa.
        </li>
        <li>
          <strong>Zlecenie</strong> – zamówienie usługi potwierdzone przez dyspozytora Usługodawcy.
        </li>
        <li>
          <strong>Konsument</strong> – Klient będący konsumentem w rozumieniu art. 22¹ Kodeksu cywilnego.
        </li>
      </ul>

      <h2 id="zakres">§ 3. Zakres usług</h2>
      <ol>
        <li>
          Usługodawca świadczy w szczególności: prywatny transport medyczny, transport sanitarny, transport pacjentów między placówkami medycznymi,
          transport pacjentów w pozycji leżącej, transport na badania i wizyty lekarskie, zabezpieczenie medyczne imprez i wydarzeń, obsługę medyczną firm i
          instytucji oraz – w zakresie posiadanych uprawnień – transport międzynarodowy.
        </li>
        <li>Rodzaj ambulansu oraz skład zespołu dobiera Usługodawca na podstawie informacji przekazanych przez Klienta, z uwzględnieniem bezpieczeństwa Pacjenta.</li>
        <li>Usługodawca może odmówić przyjęcia Zlecenia, jeżeli jego realizacja zagrażałaby bezpieczeństwu Pacjenta lub zespołu albo wykraczałaby poza możliwości organizacyjne lub uprawnienia Usługodawcy.</li>
      </ol>

      <h2 id="zamawianie">§ 4. Zasady zamawiania transportu</h2>
      <ol>
        <li>
          Usługi można zamawiać telefonicznie (dyspozytornia czynna całą dobę), e-mailem lub przez formularz na stronie{" "}
          <Link href="/kontakt">Kontakt</Link>.
        </li>
        <li>Wysłanie formularza lub wiadomości e-mail stanowi zapytanie. Umowa zostaje zawarta z chwilą telefonicznego lub pisemnego potwierdzenia Zlecenia przez dyspozytora, obejmującego termin, trasę i cenę albo sposób jej ustalenia.</li>
        <li>Klient przekazuje informacje niezbędne do bezpiecznej realizacji usługi, w szczególności: adres odbioru i miejsce docelowe, preferowany termin, możliwość poruszania się Pacjenta, potrzebę zniesienia lub wniesienia oraz potrzebę przejazdu opiekuna. Informacje o stanie zdrowia Pacjenta przekazuje się w zakresie niezbędnym, najlepiej telefonicznie.</li>
        <li>Planowane przejazdy zaleca się zamawiać z wyprzedzeniem co najmniej <Fill>24 godzin</Fill>. Zlecenia pilne realizowane są w miarę dostępności zespołów.</li>
      </ol>

      <h2 id="platnosci">§ 5. Zasady płatności</h2>
      <ol>
        <li>
          Ceny usług komercyjnych ustalane są na podstawie <Link href="/cennik">cennika</Link> lub indywidualnej wyceny przekazanej przed potwierdzeniem
          Zlecenia. Ceny podawane są w złotych polskich i są cenami brutto <Fill>potwierdzić status VAT usług</Fill>.
        </li>
        <li>Ostateczna cena zależy w szczególności od odległości, czasu realizacji i oczekiwania, rodzaju ambulansu, składu zespołu oraz dodatkowych potrzeb Pacjenta.</li>
        <li>
          Dostępne formy płatności: <Fill>gotówka u zespołu / karta / BLIK / przelew na podstawie faktury</Fill>. Termin płatności przelewem:{" "}
          <Fill>7 dni od wystawienia faktury</Fill>.
        </li>
        <li>Klienci instytucjonalni mogą być rozliczani na podstawie odrębnej umowy.</li>
      </ol>

      <h2 id="odwolywanie">§ 6. Odwoływanie usług</h2>
      <ol>
        <li>Klient może odwołać Zlecenie telefonicznie lub e-mailem.</li>
        <li>
          Odwołanie Zlecenia nie później niż <Fill>12 godzin</Fill> przed planowanym terminem jest bezpłatne.
        </li>
        <li>
          W przypadku odwołania w terminie krótszym lub po przyjeździe zespołu na miejsce Usługodawca może obciążyć Klienta opłatą w wysokości{" "}
          <Fill>kwota lub zasada wyliczenia</Fill>, odpowiadającą poniesionym kosztom.
        </li>
        <li>Usługodawca może odwołać lub zmienić termin Zlecenia z ważnych przyczyn (np. awaria pojazdu, warunki drogowe zagrażające bezpieczeństwu), niezwłocznie informując Klienta i proponując inny termin.</li>
        <li>
          Konsumentowi, który zawarł umowę na odległość, przysługują prawa wynikające z ustawy o prawach konsumenta. Prawo odstąpienia od umowy nie
          przysługuje po pełnym wykonaniu usługi, jeżeli Konsument wyraźnie zażądał rozpoczęcia jej świadczenia przed upływem terminu do odstąpienia{" "}
          <Fill>do weryfikacji prawnej</Fill>.
        </li>
      </ol>

      <h2 id="obowiazki">§ 7. Obowiązki klienta</h2>
      <ul>
        <li>Przekazanie prawdziwych i kompletnych informacji niezbędnych do realizacji usługi.</li>
        <li>Zapewnienie dostępu do Pacjenta w uzgodnionym terminie oraz przygotowanie niezbędnych dokumentów (np. dokumentu tożsamości, wypisu, zlecenia).</li>
        <li>Niezwłoczne poinformowanie o zmianie terminu, adresu lub stanu Pacjenta mającej wpływ na sposób transportu.</li>
        <li>Stosowanie się do poleceń zespołu dotyczących bezpieczeństwa w czasie transportu.</li>
        <li>Terminowe uregulowanie należności.</li>
      </ul>

      <h2 id="reklamacje">§ 8. Reklamacje</h2>
      <ol>
        <li>
          Reklamacje można składać e-mailem na adres <a href={`mailto:${contact.email}`}>{contact.email}</a> lub pisemnie na adres siedziby.
        </li>
        <li>Reklamacja powinna zawierać dane Klienta, datę i opis usługi oraz opis zastrzeżeń.</li>
        <li>
          Usługodawca rozpatruje reklamację w terminie <Fill>14 dni</Fill> od jej otrzymania i przekazuje odpowiedź w formie, w jakiej została złożona,
          chyba że Klient wskaże inną.
        </li>
        <li>Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji, w tym z pomocy miejskiego lub powiatowego rzecznika konsumentów.</li>
        <li>
          Skargi dotyczące naruszenia praw pacjenta można kierować także do Rzecznika Praw Pacjenta – zob.{" "}
          <Link href="/prawa-pacjenta">Informacja o prawach pacjenta</Link>.
        </li>
      </ol>

      <h2 id="odpowiedzialnosc">§ 9. Odpowiedzialność stron</h2>
      <ol>
        <li>Usługodawca odpowiada za należyte wykonanie usługi zgodnie z przepisami prawa, aktualną wiedzą medyczną i zasadami bezpieczeństwa transportu.</li>
        <li>
          Usługodawca posiada obowiązkowe ubezpieczenie odpowiedzialności cywilnej podmiotu wykonującego działalność leczniczą{" "}
          <Fill>nazwa ubezpieczyciela i nr polisy – opcjonalnie</Fill>.
        </li>
        <li>Usługodawca nie odpowiada za opóźnienia wynikające z okoliczności, za które nie ponosi odpowiedzialności, w szczególności z siły wyższej, nadzwyczajnych warunków drogowych lub podania przez Klienta nieprawdziwych informacji.</li>
        <li>Usługodawca nie odpowiada za rzeczy wartościowe Pacjenta niepowierzone zespołowi do przechowania w czasie transportu.</li>
        <li>Postanowienia ograniczające odpowiedzialność nie dotyczą Konsumentów w zakresie, w jakim byłoby to sprzeczne z bezwzględnie obowiązującymi przepisami.</li>
      </ol>

      <h2 id="koncowe">§ 10. Postanowienia końcowe</h2>
      <ol>
        <li>
          Zasady przetwarzania danych osobowych określa <Link href="/polityka-prywatnosci">Polityka prywatności</Link> oraz{" "}
          <Link href="/klauzula-rodo">Klauzula informacyjna RODO</Link>.
        </li>
        <li>W sprawach nieuregulowanych stosuje się przepisy prawa polskiego, w szczególności Kodeksu cywilnego, ustawy o działalności leczniczej, ustawy o prawach pacjenta i Rzeczniku Praw Pacjenta oraz ustawy o prawach konsumenta.</li>
        <li>
          Regulamin obowiązuje od <Fill>data</Fill>. Zmiany Regulaminu nie dotyczą Zleceń potwierdzonych przed ich wejściem w życie.
        </li>
      </ol>
    </LegalPage>
  );
}
