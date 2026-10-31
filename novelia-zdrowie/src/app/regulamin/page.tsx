import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { Pending } from "@/components/legal/Pending";
import { SellerBlock } from "@/components/legal/SellerBlock";

export const metadata: Metadata = { title: "Regulamin sklepu", alternates: { canonical: "/regulamin" } };

export default function TermsPage() {
  return (
    <LegalPage
      title="Regulamin sklepu"
      path="/regulamin"
      intro={<p>Zasady korzystania ze sklepu internetowego NOVELIA ZDROWIE oraz składania zamówień na publikacje cyfrowe (e-booki).</p>}
      sections={[
        {
          id: "postanowienia",
          title: "Postanowienia ogólne",
          content: (
            <>
              <p>Sklep internetowy NOVELIA ZDROWIE (dalej: „Sklep”) prowadzi:</p>
              <SellerBlock />
              <p>
                Regulamin określa zasady korzystania ze Sklepu, składania zamówień, płatności, dostarczania treści cyfrowych oraz składania reklamacji. Szczegółowe zasady
                dotyczące publikacji cyfrowych zawiera <Link href="/regulamin-tresci-cyfrowych">Regulamin sprzedaży treści cyfrowych</Link>, stanowiący integralną część
                niniejszego Regulaminu.
              </p>
              <p>Regulamin jest udostępniany nieodpłatnie na stronie Sklepu w formie umożliwiającej jego pobranie, utrwalenie i wydrukowanie.</p>
            </>
          ),
        },
        {
          id: "definicje",
          title: "Definicje",
          content: (
            <ul>
              <li>
                <strong>Klient</strong> – osoba fizyczna, osoba prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej, która składa Zamówienie.
              </li>
              <li>
                <strong>Konsument</strong> – Klient będący osobą fizyczną, dokonujący zakupu niezwiązanego bezpośrednio z jego działalnością gospodarczą lub zawodową.
              </li>
              <li>
                <strong>Przedsiębiorca na prawach konsumenta</strong> – osoba fizyczna prowadząca jednoosobową działalność gospodarczą, zawierająca umowę bezpośrednio
                związaną z jej działalnością, gdy z treści umowy wynika, że nie posiada ona dla niej charakteru zawodowego (art. 7aa ustawy o prawach konsumenta).
              </li>
              <li>
                <strong>Treść cyfrowa / Publikacja</strong> – e-book w formacie PDF oferowany w Sklepie, dostarczany wyłącznie w formie elektronicznej.
              </li>
              <li>
                <strong>Zamówienie</strong> – oświadczenie woli Klienta zmierzające do zawarcia umowy sprzedaży (dostarczenia) Treści cyfrowej.
              </li>
            </ul>
          ),
        },
        {
          id: "wymagania",
          title: "Wymagania techniczne",
          content: (
            <>
              <p>Do korzystania ze Sklepu i Publikacji niezbędne są:</p>
              <ul>
                <li>urządzenie z dostępem do internetu i aktualną przeglądarką internetową z włączoną obsługą JavaScript,</li>
                <li>aktywny adres e-mail,</li>
                <li>oprogramowanie umożliwiające odczyt plików PDF (np. wbudowane w system operacyjny lub przeglądarkę).</li>
              </ul>
              <p>Zakazane jest dostarczanie przez Klienta treści o charakterze bezprawnym.</p>
            </>
          ),
        },
        {
          id: "zamowienia",
          title: "Składanie zamówień i zawarcie umowy",
          content: (
            <ol>
              <li>Klient dodaje wybrane Publikacje do koszyka i przechodzi do formularza zamówienia.</li>
              <li>Klient podaje adres e-mail (na który zostanie dostarczony link do pobrania), opcjonalnie imię i nazwisko, akceptuje Regulamin oraz składa oświadczenie dotyczące dostarczenia Treści cyfrowej przed upływem terminu do odstąpienia od umowy.</li>
              <li>Kliknięcie przycisku „Zamawiam i płacę” oznacza złożenie Zamówienia z obowiązkiem zapłaty i przekierowuje Klienta do serwisu operatora płatności.</li>
              <li>Umowa zostaje zawarta z chwilą potwierdzenia płatności przez operatora płatności. Potwierdzenie zawarcia umowy, wraz z treścią złożonych oświadczeń, Sprzedawca przesyła na adres e-mail Klienta.</li>
              <li>Jeżeli płatność nie zostanie zrealizowana w czasie ważności sesji płatności, Zamówienie zostaje anulowane.</li>
            </ol>
          ),
        },
        {
          id: "ceny",
          title: "Ceny i płatności",
          content: (
            <>
              <p>Ceny podane w Sklepie są cenami brutto w złotych polskich (PLN) i zawierają podatek VAT, jeżeli ma on zastosowanie <Pending>status VAT sprzedawcy i stawka VAT dla e-booków</Pending>. Dostarczenie Publikacji jest bezpłatne.</p>
              <p>
                Płatności obsługuje operator płatności Stripe. Dostępne metody płatności opisuje strona <Link href="/platnosci">Płatności</Link>. Sprzedawca nie przechowuje
                danych kart płatniczych.
              </p>
              <p>
                Faktura: <Pending>zasady wystawiania faktur / rachunków, np. na życzenie Klienta zgłoszone e-mailem</Pending>.
              </p>
            </>
          ),
        },
        {
          id: "dostarczenie",
          title: "Dostarczenie Publikacji",
          content: (
            <p>
              Publikacja jest dostarczana niezwłocznie po potwierdzeniu płatności – poprzez udostępnienie linku do pobrania na stronie potwierdzenia Zamówienia oraz w
              wiadomości e-mail. Szczegóły zawiera strona <Link href="/dostawa">Dostawa produktów cyfrowych</Link>.
            </p>
          ),
        },
        {
          id: "odstapienie",
          title: "Prawo odstąpienia od umowy",
          content: (
            <>
              <p>
                Konsumentowi (oraz Przedsiębiorcy na prawach konsumenta) co do zasady przysługuje prawo odstąpienia od umowy zawartej na odległość w terminie 14 dni bez
                podania przyczyny.
              </p>
              <p>
                Zgodnie z art. 38 ust. 1 pkt 13 ustawy z dnia 30 maja 2014 r. o prawach konsumenta prawo odstąpienia od umowy nie przysługuje w odniesieniu do umowy o
                dostarczanie treści cyfrowych niedostarczanych na nośniku materialnym, za które Konsument jest zobowiązany do zapłaty ceny, jeżeli Sprzedawca rozpoczął
                świadczenie za wyraźną i uprzednią zgodą Konsumenta, który został poinformowany przed rozpoczęciem świadczenia, że po jego spełnieniu utraci prawo
                odstąpienia od umowy, i przyjął to do wiadomości, a Sprzedawca przekazał Konsumentowi potwierdzenie, o którym mowa w art. 15 ust. 1 i 2 albo art. 21 ust. 1
                tej ustawy.
              </p>
              <p>Zgodę i oświadczenie Klient składa w formularzu zamówienia, a ich potwierdzenie otrzymuje w wiadomości e-mail.</p>
            </>
          ),
        },
        {
          id: "reklamacje",
          title: "Reklamacje",
          content: (
            <p>
              Sprzedawca odpowiada za zgodność Publikacji z umową. Zasady składania reklamacji oraz przysługujące uprawnienia opisuje strona{" "}
              <Link href="/reklamacje-i-zwroty">Prawa konsumenta i reklamacje</Link>.
            </p>
          ),
        },
        {
          id: "dane",
          title: "Dane osobowe",
          content: (
            <p>
              Zasady przetwarzania danych osobowych określa <Link href="/polityka-prywatnosci">Polityka prywatności</Link>, a zasady stosowania plików cookies –{" "}
              <Link href="/polityka-cookies">Polityka plików cookies</Link>.
            </p>
          ),
        },
        {
          id: "koncowe",
          title: "Postanowienia końcowe",
          content: (
            <>
              <p>W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu cywilnego i ustawy o prawach konsumenta.</p>
              <p>Postanowienia Regulaminu nie wyłączają ani nie ograniczają praw Konsumentów wynikających z bezwzględnie obowiązujących przepisów prawa.</p>
              <p>
                Sprzedawca może zmienić Regulamin z ważnych przyczyn (np. zmiana przepisów). Zmiany nie dotyczą Zamówień złożonych przed wejściem zmian w życie. Data
                obowiązywania: <Pending>data</Pending>.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
