import type { Metadata } from "next";
import Link from "next/link";
import { LOCATIONS } from "@/data/locations";
import { ORDER_LIMITS } from "@/lib/pricing";
import { PICKUP_RULES } from "@/lib/pickup";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { Pending } from "@/components/legal/Pending";

export const metadata: Metadata = {
  title: "Regulamin zamawiania kawy online",
  description: "Zasady składania zamówień online w NOIR COFFEE: wybór lokalu i godziny odbioru, płatności, potwierdzenie zamówienia i reklamacje.",
};

const sections: LegalSection[] = [
  {
    id: "postanowienia-ogolne",
    title: "Postanowienia ogólne",
    content: (
      <>
        <ol>
          <li>
            Regulamin określa zasady składania zamówień na napoje kawowe za pośrednictwem strony internetowej NOIR COFFEE (dalej: „Strona”) z odbiorem osobistym
            w wybranym lokalu.
          </li>
          <li>
            Sprzedawcą jest <Pending>pełna nazwa firmy / imię i nazwisko przedsiębiorcy</Pending>, z siedzibą: <Pending>adres</Pending>, NIP:{" "}
            <Pending>NIP</Pending>, REGON: <Pending>REGON</Pending>, wpisany do <Pending>CEIDG lub KRS z numerem</Pending>, adres e-mail:{" "}
            <Pending>e-mail</Pending>, telefon: <Pending>telefon</Pending> (dalej: „Sprzedawca”). Aktualne dane znajdują się na stronie{" "}
            <Link href="/kontakt">Kontakt i dane sprzedawcy</Link>.
          </li>
          <li>Regulamin jest udostępniany nieodpłatnie na Stronie w formie, która umożliwia jego pobranie, utrwalenie i wydrukowanie.</li>
          <li>
            Pojęcia użyte w Regulaminie:
            <ul>
              <li>
                <strong>Klient</strong> – osoba fizyczna, osoba prawna lub jednostka organizacyjna składająca zamówienie;
              </li>
              <li>
                <strong>Konsument</strong> – osoba fizyczna dokonująca ze Sprzedawcą czynności prawnej niezwiązanej bezpośrednio z jej działalnością gospodarczą
                lub zawodową (art. 22<sup>1</sup> Kodeksu cywilnego);
              </li>
              <li>
                <strong>Przedsiębiorca na prawach konsumenta</strong> – osoba fizyczna zawierająca umowę bezpośrednio związaną z jej działalnością gospodarczą,
                gdy z treści umowy wynika, że nie ma ona dla niej charakteru zawodowego (art. 38a ustawy o prawach konsumenta);
              </li>
              <li>
                <strong>Produkt</strong> – napój przygotowywany na zamówienie, prezentowany w menu na Stronie;
              </li>
              <li>
                <strong>Lokal</strong> – kawiarnia NOIR COFFEE wybrana przez Klienta jako miejsce odbioru zamówienia.
              </li>
            </ul>
          </li>
        </ol>
      </>
    ),
  },
  {
    id: "wymagania-techniczne",
    title: "Wymagania techniczne",
    content: (
      <ol>
        <li>
          Do złożenia zamówienia potrzebne są: urządzenie z dostępem do internetu, aktualna przeglądarka internetowa z włączoną obsługą JavaScript i pamięci
          przeglądarki (localStorage i sessionStorage) oraz aktywny adres e-mail.
        </li>
        <li>Zakazane jest dostarczanie przez Klienta treści o charakterze bezprawnym, w tym podawanie danych osób trzecich bez ich zgody.</li>
      </ol>
    ),
  },
  {
    id: "produkty-i-ceny",
    title: "Produkty i ceny",
    content: (
      <ol>
        <li>Ceny Produktów podawane są w złotych polskich i są cenami brutto (zawierają podatek VAT).</li>
        <li>
          Cena końcowa uwzględnia wybrane przez Klienta opcje (np. rozmiar, rodzaj mleka, dodatki) i jest wyświetlana w koszyku oraz w podsumowaniu przed
          złożeniem zamówienia.
        </li>
        <li>
          Zamówienia są realizowane wyłącznie z odbiorem osobistym w Lokalu – Sprzedawca nie pobiera opłat za dostawę ani dodatkowych opłat za płatność online.
        </li>
        <li>
          Jedno zamówienie może obejmować maksymalnie {ORDER_LIMITS.maxItemsPerOrder} napojów, w tym do {ORDER_LIMITS.maxQuantityPerLine} sztuk tej samej
          pozycji.
        </li>
        <li>
          Informacje o składnikach i alergenach (np. mleko, składniki syropów) Sprzedawca udostępnia:{" "}
          <Pending>sposób udostępnienia informacji o alergenach</Pending>. Osoby z alergiami lub nietolerancjami pokarmowymi prosimy o kontakt z Lokalem przed
          złożeniem zamówienia.
        </li>
      </ol>
    ),
  },
  {
    id: "skladanie-zamowienia",
    title: "Składanie zamówienia, wybór lokalu i godziny odbioru",
    content: (
      <>
        <ol>
          <li>
            Aby złożyć zamówienie, Klient:
            <ol>
              <li>wybiera Produkty i ich opcje oraz dodaje je do koszyka,</li>
              <li>wybiera Lokal odbioru spośród lokali prezentowanych na Stronie ({LOCATIONS.map((l) => l.district).join(", ")}),</li>
              <li>wybiera dzień i godzinę odbioru spośród dostępnych terminów,</li>
              <li>podaje imię oraz adres e-mail,</li>
              <li>sprawdza podsumowanie zamówienia i akceptuje Regulamin,</li>
              <li>
                klika przycisk <strong>„Zamawiam i płacę”</strong>, co oznacza złożenie zamówienia z obowiązkiem zapłaty, a następnie dokonuje płatności na
                stronie operatora płatności.
              </li>
            </ol>
          </li>
          <li>
            Dostępne godziny odbioru są prezentowane w odstępach co {PICKUP_RULES.slotMinutes} minut, w godzinach otwarcia wybranego Lokalu, nie wcześniej niż
            ok. {PICKUP_RULES.leadMinutes} minut od złożenia zamówienia i nie później niż {PICKUP_RULES.lastPickupBeforeCloseMinutes} minut przed zamknięciem
            Lokalu. Zamówienia można składać na bieżący i następny dzień.
          </li>
          <li>
            Przed kliknięciem przycisku „Zamawiam i płacę” Klient może w każdej chwili zmienić zawartość koszyka, Lokal, godzinę odbioru i swoje dane. Zmiana
            Lokalu lub godziny po opłaceniu zamówienia jest możliwa wyłącznie po kontakcie ze Sprzedawcą i w miarę możliwości organizacyjnych Lokalu.
          </li>
          <li>Jeżeli w trakcie składania zamówienia wybrana godzina odbioru przestanie być dostępna, Strona poprosi o wybór innej godziny.</li>
        </ol>
      </>
    ),
  },
  {
    id: "zawarcie-umowy",
    title: "Zawarcie umowy i potwierdzenie zamówienia",
    content: (
      <ol>
        <li>
          Umowa sprzedaży zostaje zawarta z chwilą potwierdzenia przez operatora płatności, że zamówienie zostało opłacone. Po otrzymaniu tego potwierdzenia
          Strona wyświetla numer zamówienia oraz szczegóły odbioru. Strona nie wyświetla potwierdzenia opłacenia, dopóki operator płatności go nie przekaże.
        </li>
        <li>
          Potwierdzenie zawarcia umowy, obejmujące treść zamówienia i Regulamin, Sprzedawca przekazuje Klientowi na trwałym nośniku:{" "}
          <Pending>sposób przesyłania potwierdzenia, np. wiadomość e-mail – wymaga konfiguracji wysyłki wiadomości</Pending>.
        </li>
        <li>
          Zamówienie, które nie zostanie opłacone w ciągu 30 minut od przejścia do płatności, wygasa i nie jest realizowane. Klient może przed opłaceniem
          anulować zamówienie na stronie wyświetlanej po przerwaniu płatności.
        </li>
      </ol>
    ),
  },
  {
    id: "platnosci",
    title: "Płatności",
    content: (
      <ol>
        <li>
          Zamówienia online są płatne z góry, za pośrednictwem operatora płatności Stripe (Stripe Payments Europe, Limited, Irlandia). Dostępne metody płatności
          są prezentowane w oknie płatności i zależą od konfiguracji konta Sprzedawcy.
        </li>
        <li>Sprzedawca nie otrzymuje i nie przechowuje pełnych danych kart płatniczych – przetwarza je operator płatności.</li>
        <li>
          W przypadku nieudanej płatności zamówienie nie jest przyjmowane do realizacji. Klient może ponowić płatność – zawartość koszyka zostaje zachowana.
        </li>
        <li>
          Szczegóły dotyczące metod płatności i zwrotów opisuje dokument <Link href="/platnosci-i-zwroty">Informacje o płatnościach i zwrotach</Link>.
        </li>
      </ol>
    ),
  },
  {
    id: "odbior",
    title: "Odbiór zamówienia",
    content: (
      <ol>
        <li>Zamówienie jest przygotowywane na wybraną godzinę odbioru. Przy odbiorze należy podać numer zamówienia lub imię podane w zamówieniu.</li>
        <li>
          Zasady postępowania w przypadku nieodebrania zamówienia:{" "}
          <Pending>np. czas oczekiwania na odbiór i sposób rozliczenia nieodebranego zamówienia</Pending>.
        </li>
        <li>
          Jeżeli realizacja opłaconego zamówienia okaże się niemożliwa z przyczyn leżących po stronie Sprzedawcy (np. awaria w Lokalu), Sprzedawca niezwłocznie
          poinformuje o tym Klienta na adres e-mail podany w zamówieniu i zwróci całą zapłaconą kwotę.
        </li>
      </ol>
    ),
  },
  {
    id: "odstapienie",
    title: "Prawo odstąpienia od umowy",
    content: (
      <ol>
        <li>
          Konsumentowi, który zawarł umowę na odległość, co do zasady przysługuje prawo odstąpienia od niej w terminie 14 dni bez podawania przyczyny (art. 27
          ustawy z dnia 30 maja 2014 r. o prawach konsumenta).
        </li>
        <li>
          Prawo odstąpienia od umowy <strong>nie przysługuje</strong> w odniesieniu do umów, których przedmiotem jest rzecz ulegająca szybkiemu zepsuciu lub
          mająca krótki termin przydatności do użycia (art. 38 ust. 1 pkt 4 ustawy o prawach konsumenta). Dotyczy to napojów przygotowywanych na bieżąco,
          oferowanych w zamówieniach online. W odniesieniu do napojów przygotowywanych według indywidualnej specyfikacji Klienta zastosowanie może mieć również
          art. 38 ust. 1 pkt 3 tej ustawy.
        </li>
        <li>
          Powyższe wyłączenie dotyczy wyłącznie świeżo przygotowywanych napojów. Jeżeli oferta online zostanie rozszerzona o inne produkty (np. paczkowaną kawę
          ziarnistą lub akcesoria), zasady odstąpienia od umowy dla tych produktów zostaną określone odrębnie i nie będą automatycznie objęte wyłączeniem z ust.
          2.
        </li>
        <li>
          Anulowanie opłaconego zamówienia przed rozpoczęciem jego przygotowania: <Pending>czy i do kiedy Sprzedawca umożliwia dobrowolne anulowanie</Pending>.
          Do czasu uzupełnienia tego punktu Sprzedawca nie przyjmuje takiego zobowiązania.
        </li>
        <li>Postanowienia dotyczące Konsumenta stosuje się odpowiednio do Przedsiębiorcy na prawach konsumenta, w zakresie przewidzianym przepisami prawa.</li>
      </ol>
    ),
  },
  {
    id: "reklamacje",
    title: "Reklamacje",
    content: (
      <ol>
        <li>Sprzedawca odpowiada wobec Konsumenta za zgodność Produktu z umową na zasadach określonych w rozdziale 5a ustawy o prawach konsumenta.</li>
        <li>
          Ze względu na charakter Produktów zalecamy zgłaszanie zastrzeżeń bezpośrednio w Lokalu przy odbiorze – pozwala to na szybkie przygotowanie napoju
          ponownie. Reklamację można również złożyć na adres e-mail: <Pending>adres e-mail do reklamacji</Pending> lub pisemnie na adres:{" "}
          <Pending>adres korespondencyjny</Pending>.
        </li>
        <li>Reklamacja powinna zawierać numer zamówienia, opis problemu oraz żądanie Klienta. Brak tych informacji nie powoduje odrzucenia reklamacji.</li>
        <li>
          W przypadku niezgodności Produktu z umową Konsument może żądać jego wymiany (ponownego przygotowania napoju), a w przypadkach przewidzianych w ustawie
          – obniżenia ceny albo odstąpienia od umowy.
        </li>
        <li>Sprzedawca odpowiada na reklamację w terminie 14 dni od jej otrzymania.</li>
        <li>
          Zwrot należności następuje przy użyciu tej samej metody płatności, której użył Klient, niezwłocznie, nie później niż w terminie 14 dni od dnia uznania
          reklamacji lub otrzymania oświadczenia uprawniającego do zwrotu.
        </li>
      </ol>
    ),
  },
  {
    id: "rozwiazywanie-problemow",
    title: "Rozwiązywanie problemów i pozasądowe sposoby dochodzenia roszczeń",
    content: (
      <>
        <ol>
          <li>
            Jeżeli płatność została pobrana, a Strona nie wyświetliła potwierdzenia zamówienia, prosimy nie płacić ponownie i skontaktować się ze Sprzedawcą,
            podając numer zamówienia. Sprzedawca zweryfikuje status płatności u operatora i zwróci ewentualną podwójną płatność.
          </li>
          <li>
            W sprawach technicznych (np. błąd formularza, brak dostępnych godzin odbioru) prosimy o kontakt: <Pending>adres e-mail / telefon</Pending>.
          </li>
          <li>
            Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń, m.in.:
            <ul>
              <li>zwrócić się do stałego polubownego sądu konsumenckiego przy Wojewódzkim Inspektorze Inspekcji Handlowej w Gdańsku,</li>
              <li>zwrócić się do Wojewódzkiego Inspektora Inspekcji Handlowej z wnioskiem o wszczęcie postępowania mediacyjnego,</li>
              <li>skorzystać z bezpłatnej pomocy miejskiego lub powiatowego rzecznika konsumentów albo organizacji konsumenckich.</li>
            </ul>
            Informacje o tych procedurach są dostępne m.in. na stronie{" "}
            <a href="https://prawakonsumenta.uokik.gov.pl/" target="_blank" rel="noopener noreferrer">
              prawakonsumenta.uokik.gov.pl
            </a>
            . Skorzystanie z nich jest dobrowolne i wymaga zgody obu stron. Udział Sprzedawcy: <Pending>czy Sprzedawca wyraża gotowość udziału</Pending>.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: "dane-osobowe",
    title: "Dane osobowe",
    content: (
      <p>
        Zasady przetwarzania danych osobowych Klientów opisuje <Link href="/polityka-prywatnosci">Polityka prywatności</Link>, a informacje o technologiach
        zapisujących dane w przeglądarce – <Link href="/cookies">Polityka plików cookies</Link>.
      </p>
    ),
  },
  {
    id: "postanowienia-koncowe",
    title: "Postanowienia końcowe",
    content: (
      <ol>
        <li>Do zamówień złożonych przed zmianą Regulaminu stosuje się wersję obowiązującą w chwili złożenia zamówienia.</li>
        <li>
          W sprawach nieuregulowanych w Regulaminie zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu cywilnego i ustawy o prawach konsumenta.
          Regulamin nie wyłącza ani nie ogranicza praw Konsumenta wynikających z bezwzględnie obowiązujących przepisów.
        </li>
        <li>
          Regulamin obowiązuje od: <Pending>data wejścia w życie</Pending>.
        </li>
      </ol>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Regulamin zamawiania kawy online"
      path="/regulamin"
      intro={<p>Jak zamówić kawę na stronie NOIR COFFEE, wybrać lokal i godzinę odbioru, zapłacić online i zgłosić ewentualną reklamację.</p>}
      sections={sections}
    />
  );
}
