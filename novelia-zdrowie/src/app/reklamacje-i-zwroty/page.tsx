import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { Pending } from "@/components/legal/Pending";
import { seller } from "@/config/site";

export const metadata: Metadata = { title: "Prawa konsumenta i reklamacje", alternates: { canonical: "/reklamacje-i-zwroty" } };

export default function ComplaintsPage() {
  return (
    <LegalPage
      title="Prawa konsumenta, reklamacje i zwroty"
      path="/reklamacje-i-zwroty"
      intro={<p>Informacje o prawie odstąpienia od umowy, zgodności treści cyfrowej z umową i trybie składania reklamacji.</p>}
      sections={[
        {
          id: "odstapienie",
          title: "Prawo odstąpienia od umowy",
          content: (
            <>
              <p>Konsument może odstąpić od umowy zawartej na odległość w terminie 14 dni bez podania przyczyny – z zastrzeżeniem wyjątku dotyczącego treści cyfrowych.</p>
              <p>
                Prawo to nie przysługuje, jeżeli – za wyraźną i uprzednią zgodą Konsumenta, poinformowanego o utracie prawa odstąpienia – rozpoczęto dostarczanie treści
                cyfrowej (udostępniono plik do pobrania), a Sprzedawca przekazał potwierdzenie (art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta). Zgoda jest składana w
                formularzu zamówienia, a jej potwierdzenie trafia do Ciebie e-mailem.
              </p>
              <p>Jeśli zamówienie nie zostało opłacone albo plik nie został jeszcze udostępniony, prawo odstąpienia przysługuje na zasadach ogólnych.</p>
            </>
          ),
        },
        {
          id: "zgodnosc",
          title: "Zgodność treści cyfrowej z umową",
          content: (
            <>
              <p>Odpowiadamy za to, by publikacja była zgodna z umową: odpowiadała opisowi, była kompletna i dała się otworzyć. Jeżeli tak nie jest, możesz złożyć reklamację i żądać:</p>
              <ul>
                <li>doprowadzenia publikacji do zgodności z umową (np. dostarczenia poprawnego pliku),</li>
                <li>obniżenia ceny lub odstąpienia od umowy – gdy doprowadzenie do zgodności jest niemożliwe, nie nastąpiło w rozsądnym czasie lub brak zgodności jest istotny (zgodnie z art. 43m ustawy o prawach konsumenta).</li>
              </ul>
            </>
          ),
        },
        {
          id: "tryb",
          title: "Jak złożyć reklamację",
          content: (
            <>
              <p>
                Reklamację można złożyć e-mailem na adres {seller.email ? <a href={`mailto:${seller.email}`}>{seller.email}</a> : <Pending>adres e-mail do reklamacji</Pending>} lub
                przez <Link href="/kontakt">formularz kontaktowy</Link>. Prosimy o podanie:
              </p>
              <ul>
                <li>numeru zamówienia (NZ-XXXXXX) i adresu e-mail użytego przy zakupie,</li>
                <li>opisu problemu (np. plik nie otwiera się, brakuje stron),</li>
                <li>oczekiwanego sposobu rozwiązania.</li>
              </ul>
              <p>Na reklamację odpowiadamy w terminie 14 dni od jej otrzymania.</p>
            </>
          ),
        },
        {
          id: "zwrot",
          title: "Zwrot płatności",
          content: <p>W razie uwzględnienia reklamacji skutkującej obniżeniem ceny lub odstąpieniem od umowy zwracamy należność niezwłocznie, nie później niż w terminie 14 dni, przy użyciu takiej samej metody płatności, jakiej użył Konsument.</p>,
        },
        {
          id: "pozasadowe",
          title: "Pozasądowe rozwiązywanie sporów",
          content: (
            <>
              <p>Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń, m.in.:</p>
              <ul>
                <li>pomocy miejskiego lub powiatowego rzecznika konsumentów,</li>
                <li>stałego polubownego sądu konsumenckiego przy wojewódzkim inspektoracie Inspekcji Handlowej,</li>
                <li>informacji dostępnych na stronie Urzędu Ochrony Konkurencji i Konsumentów (prawakonsumenta.uokik.gov.pl).</li>
              </ul>
              <p>
                Zgoda Sprzedawcy na udział w postępowaniu pozasądowym: <Pending>decyzja sprzedawcy</Pending>.
              </p>
            </>
          ),
        },
        {
          id: "przedsiebiorcy",
          title: "Przedsiębiorcy na prawach konsumenta",
          content: <p>Powyższe uprawnienia przysługują również osobom fizycznym prowadzącym jednoosobową działalność gospodarczą, jeżeli zakup nie ma dla nich charakteru zawodowego (art. 7aa ustawy o prawach konsumenta).</p>,
        },
      ]}
    />
  );
}
