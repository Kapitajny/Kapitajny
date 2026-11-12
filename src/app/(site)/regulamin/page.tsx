import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { LegalPage, Todo } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Regulamin wypożyczalni" };

export default function TermsPage() {
  return (
    <LegalPage title="Regulamin wypożyczalni">
      <h2>1. Wypożyczalnia</h2>
      <p>
        Usługodawcą jest <Todo>nazwa firmy, NIP, adres siedziby</Todo>, prowadzący wypożyczalnię skuterów wodnych {site.name} w przystani: {site.address.street},{" "}
        {site.address.postal} {site.address.city} (adres przykładowy w wersji demonstracyjnej).
      </p>
      <h2>2. Rezerwacja</h2>
      <ol>
        <li>Rezerwacji dokonuje się przez stronę internetową, wybierając skuter, czas wynajmu, datę i godzinę rozpoczęcia oraz podając dane kontaktowe.</li>
        <li>Po wysłaniu formularza rezerwacja ma status „wstępna”. Wypożyczalnia potwierdza ją telefonicznie lub e-mailem.</li>
        <li>Cena wynajmu jest zależna od modelu i czasu wynajmu i wynika z cennika obowiązującego w chwili rezerwacji.</li>
        <li>Między wynajmami wypożyczalnia rezerwuje czas na przygotowanie skutera, dlatego niektóre godziny mogą być niedostępne.</li>
      </ol>
      <h2>3. Płatność i kaucja</h2>
      <ol>
        <li>Opłatę za wynajem i kaucję zwrotną uiszcza się na miejscu, przed wypłynięciem. <Todo>akceptowane formy płatności</Todo></li>
        <li>Kaucja jest zwracana po oddaniu skutera bez uszkodzeń, w stanie zgodnym z protokołem wydania.</li>
        <li>
          Opłaty dodatkowe (np. za przekroczenie czasu wynajmu, paliwo): <Todo>zasady opłat dodatkowych</Todo>.
        </li>
      </ol>
      <h2>4. Anulowanie</h2>
      <ol>
        <li>Klient może bezpłatnie anulować rezerwację w terminie podanym w potwierdzeniu, korzystając z linku do rezerwacji.</li>
        <li>Wypożyczalnia może odwołać wynajem, gdy warunki pogodowe nie pozwalają na bezpieczne pływanie. Klient otrzymuje wtedy inny termin lub zwrot wpłat.</li>
      </ol>
      <h2>5. Warunki korzystania ze skutera</h2>
      <p>
        Szczegółowe warunki (wiek, uprawnienia, trzeźwość, akwen, kamizelki) opisują{" "}
        <Link href="/zasady-wynajmu" className="link">
          zasady wynajmu
        </Link>
        .
      </p>
      <h2>6. Reklamacje</h2>
      <p>
        Reklamacje można składać e-mailem lub na miejscu. Odpowiadamy w ciągu 14 dni. <Todo>adres e-mail do reklamacji</Todo>
      </p>
    </LegalPage>
  );
}
