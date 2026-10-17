import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { Pending } from "@/components/legal/Pending";

export const metadata: Metadata = {
  title: "Informacje o płatnościach i zwrotach",
  description: "Jak działają płatności online w NOIR COFFEE, co się dzieje przy nieudanej płatności i kiedy przysługuje zwrot środków.",
};

const sections: LegalSection[] = [
  {
    id: "operator",
    title: "Operator płatności",
    content: (
      <p>
        Płatności online obsługuje <strong>Stripe Payments Europe, Limited</strong> (Irlandia). Po kliknięciu „Zamawiam i płacę” nastąpi przekierowanie na
        bezpieczną stronę płatności Stripe. Nie przechowujemy pełnych danych Twojej karty – przetwarza je wyłącznie operator płatności.
      </p>
    ),
  },
  {
    id: "metody",
    title: "Metody płatności",
    content: (
      <>
        <p>
          Dostępne metody płatności są wyświetlane w oknie płatności i zależą od konfiguracji konta sprzedawcy w Stripe. Stripe umożliwia m.in. płatności kartą,
          BLIK-iem i przez Przelewy24 – jeśli sprzedawca je włączy.
        </p>
        <p>
          Metody płatności aktywne w tym sklepie: <Pending>lista po konfiguracji konta Stripe</Pending>.
        </p>
      </>
    ),
  },
  {
    id: "kwota",
    title: "Kwota i waluta",
    content: (
      <ul>
        <li>Płatności realizowane są w złotych polskich (PLN).</li>
        <li>Pobierana kwota jest równa sumie widocznej w podsumowaniu zamówienia – ceny są cenami brutto, bez opłat za płatność i bez kosztów dostawy.</li>
        <li>Cena każdej pozycji jest ponownie przeliczana na serwerze na podstawie aktualnego menu przed utworzeniem płatności.</li>
      </ul>
    ),
  },
  {
    id: "przebieg",
    title: "Przebieg płatności i potwierdzenie",
    content: (
      <ol>
        <li>Płatność następuje z góry, przed przygotowaniem zamówienia.</li>
        <li>Na dokończenie płatności masz 30 minut. Po tym czasie sesja płatności wygasa, a zamówienie zostaje anulowane bez obciążenia.</li>
        <li>
          Zamówienie uznajemy za opłacone dopiero wtedy, gdy operator płatności przekaże nam potwierdzenie transakcji. Do tego czasu strona pokazuje status
          „czekamy na potwierdzenie płatności” – nigdy nie wyświetlamy potwierdzenia opłacenia bez informacji od operatora.
        </li>
        <li>
          Fakturę lub paragon wystawiamy: <Pending>zasady dokumentowania sprzedaży – do ustalenia z księgowością (m.in. obowiązek kasy fiskalnej)</Pending>.
        </li>
      </ol>
    ),
  },
  {
    id: "nieudana",
    title: "Nieudana lub przerwana płatność",
    content: (
      <ul>
        <li>Jeśli płatność zostanie odrzucona lub przerwana, środki nie są pobierane, a zamówienie nie trafia do realizacji.</li>
        <li>
          Po przerwaniu płatności możesz wrócić do tej samej płatności (dopóki jest aktywna), anulować zamówienie albo złożyć je ponownie. Zawartość koszyka
          zostaje zachowana.
        </li>
        <li>
          Jeśli środki zostały pobrane, a strona nie wyświetliła potwierdzenia, nie płać ponownie – skontaktuj się z nami, podając numer zamówienia:{" "}
          <Pending>adres e-mail</Pending>.
        </li>
      </ul>
    ),
  },
  {
    id: "zwroty",
    title: "Zwroty środków",
    content: (
      <>
        <p>Zwrot pieniędzy przysługuje w szczególności, gdy:</p>
        <ul>
          <li>
            reklamacja z powodu niezgodności napoju z umową zostanie uwzględniona, a ponowne przygotowanie napoju nie jest możliwe lub Konsument żąda zwrotu w
            przypadkach przewidzianych w ustawie,
          </li>
          <li>zamówienie nie może zostać zrealizowane z przyczyn leżących po stronie sprzedawcy (np. awaria w lokalu),</li>
          <li>ta sama płatność została przypadkowo pobrana dwukrotnie.</li>
        </ul>
        <p>
          Inne przypadki zwrotów (np. dobrowolne anulowanie opłaconego zamówienia przed przygotowaniem): <Pending>decyzja właściciela</Pending>. Do czasu
          uzupełnienia tego punktu sprzedawca nie przyjmuje takiego zobowiązania.
        </p>
        <p>
          Zwrot realizujemy tą samą metodą płatności, której użyto przy zamówieniu, niezwłocznie, nie później niż w ciągu 14 dni od uznania reklamacji lub
          stwierdzenia podstawy do zwrotu. Czas zaksięgowania środków na Twoim rachunku zależy od banku lub wydawcy karty.
        </p>
      </>
    ),
  },
  {
    id: "odstapienie",
    title: "Odstąpienie od umowy",
    content: (
      <p>
        Prawo odstąpienia od umowy zawartej na odległość nie przysługuje w przypadku świeżo przygotowywanych napojów – są to rzeczy szybko psujące się (art. 38
        ust. 1 pkt 4 ustawy o prawach konsumenta). Jeżeli oferta online zostanie rozszerzona o inne produkty, zasady odstąpienia od umowy dla nich zostaną
        określone odrębnie. Szczegóły znajdziesz w <Link href="/regulamin#odstapienie">Regulaminie</Link>.
      </p>
    ),
  },
];

export default function PaymentsPage() {
  return (
    <LegalPage
      title="Informacje o płatnościach i zwrotach"
      path="/platnosci-i-zwroty"
      intro={<p>Jak płacisz za zamówienie online, kiedy uznajemy je za opłacone i w jakich sytuacjach zwracamy pieniądze.</p>}
      sections={sections}
    />
  );
}
