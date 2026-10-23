import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { DISPATCH_TIME, RETURN_DAYS, SHIPPING_METHODS } from "@/data/shipping";
import { formatPrice } from "@/lib/pricing";
import { LegalPage, Pending } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Dostawa i zwroty",
  description: `Koszty i czas dostawy, ${RETURN_DAYS} dni na odstąpienie od umowy, reklamacje.`,
  alternates: { canonical: "/dostawa-i-zwroty" },
};

export default function ShippingReturnsPage() {
  const returnsAddress = siteConfig.seller.returnsAddress;
  return (
    <LegalPage
      title="Dostawa i zwroty"
      path="/dostawa-i-zwroty"
      intro="Ile kosztuje wysyłka, kiedy przyjdzie paczka i jak oddać produkt."
      sections={[
        {
          id: "dostawa",
          title: "Dostawa",
          content: (
            <>
              <p>Wysyłamy wyłącznie na terenie Polski. Paczkę przygotowujemy {DISPATCH_TIME} od zaksięgowania płatności.</p>
              <ul>
                {SHIPPING_METHODS.map((m) => (
                  <li key={m.id}>
                    <strong>{m.name}</strong> – {formatPrice(m.price)}. {m.description}
                  </li>
                ))}
              </ul>
              <p>Koszt dostawy widzisz w podsumowaniu zamówienia przed płatnością. Nie oferujemy obecnie darmowej dostawy.</p>
            </>
          ),
        },
        {
          id: "platnosci",
          title: "Płatności",
          content: (
            <p>
              Płatności online obsługuje Stripe. Dostępne metody (np. karta) wyświetlają się na stronie płatności. Zamówienie realizujemy po potwierdzeniu płatności przez
              operatora.
            </p>
          ),
        },
        {
          id: "zwroty",
          title: `Zwrot w ${RETURN_DAYS} dni`,
          content: (
            <>
              <p>
                Jako konsument możesz odstąpić od umowy bez podania przyczyny w ciągu {RETURN_DAYS} dni od otrzymania paczki. Wystarczy wysłać nam oświadczenie – przez{" "}
                <Link href="/kontakt">formularz kontaktowy</Link> lub e-mailem – i odesłać produkt w ciągu {RETURN_DAYS} dni od złożenia oświadczenia.
              </p>
              <p>Adres zwrotów: {returnsAddress ?? <Pending>adres zwrotów</Pending>}.</p>
              <p>
                Zwracamy zapłaconą kwotę, w tym koszt najtańszej oferowanej dostawy, w ciągu 14 dni od otrzymania oświadczenia, tą samą metodą płatności. Możemy wstrzymać
                zwrot do czasu otrzymania produktu. Koszt odesłania produktu pokrywa kupujący.
              </p>
              <p>Produkt nie może nosić śladów użytkowania wykraczających poza sprawdzenie rozmiaru i dopasowania (jak przymierzanie w sklepie).</p>
            </>
          ),
        },
        {
          id: "reklamacje",
          title: "Reklamacje",
          content: (
            <p>
              Jeśli produkt jest niezgodny z umową (np. ma wadę), zgłoś reklamację przez <Link href="/kontakt">formularz kontaktowy</Link>, opisując problem i dołączając
              numer zamówienia. Odpowiemy w ciągu 14 dni. Szczegóły w <Link href="/regulamin">regulaminie</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
