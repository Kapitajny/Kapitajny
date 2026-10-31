import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { Pending } from "@/components/legal/Pending";

export const metadata: Metadata = { title: "Płatności", alternates: { canonical: "/platnosci" } };

export default function PaymentsPage() {
  return (
    <LegalPage
      title="Informacje o płatnościach"
      path="/platnosci"
      intro={<p>Jak zapłacić za e-book i kiedy płatność zostaje potwierdzona.</p>}
      sections={[
        {
          id: "operator",
          title: "Operator płatności",
          content: (
            <p>
              Płatności w sklepie obsługuje Stripe Payments Europe, Ltd. Po złożeniu zamówienia zostajesz przekierowany(-a) na bezpieczną stronę płatności Stripe
              (połączenie szyfrowane). Sklep nie przechowuje danych kart płatniczych.
            </p>
          ),
        },
        {
          id: "metody",
          title: "Metody płatności",
          content: (
            <>
              <p>W zależności od konfiguracji konta operatora mogą być dostępne:</p>
              <ul>
                <li>karty płatnicze (Visa, Mastercard i inne),</li>
                <li>BLIK,</li>
                <li>szybkie przelewy online (Przelewy24),</li>
                <li>portfele cyfrowe (Apple Pay, Google Pay).</li>
              </ul>
              <p>
                Aktywne metody: <Pending>lista metod włączonych w panelu Stripe</Pending>.
              </p>
            </>
          ),
        },
        {
          id: "potwierdzenie",
          title: "Potwierdzenie płatności",
          content: (
            <p>
              Zamówienie zostaje oznaczone jako opłacone dopiero po otrzymaniu potwierdzenia od operatora płatności. W przypadku płatności kartą lub BLIKIEM trwa to
              zwykle kilka sekund. Po potwierdzeniu otrzymasz dostęp do pliku (patrz <Link href="/dostawa">Dostawa produktów cyfrowych</Link>).
            </p>
          ),
        },
        {
          id: "nieudana",
          title: "Nieudana lub przerwana płatność",
          content: <p>Jeśli przerwiesz płatność lub sesja płatności wygaśnie (po 30 minutach), zamówienie zostanie anulowane, a środki nie zostaną pobrane. Możesz złożyć zamówienie ponownie – publikacje pozostaną w koszyku.</p>,
        },
        {
          id: "faktury",
          title: "Rachunki i faktury",
          content: (
            <p>
              <Pending>zasady wystawiania dokumentów sprzedaży (paragon/faktura), sposób zgłoszenia potrzeby faktury z NIP</Pending>
            </p>
          ),
        },
      ]}
    />
  );
}
