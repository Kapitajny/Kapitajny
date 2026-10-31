import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { Pending } from "@/components/legal/Pending";

export const metadata: Metadata = { title: "Polityka plików cookies", alternates: { canonical: "/polityka-cookies" } };

export default function CookiesPage() {
  return (
    <LegalPage
      title="Polityka plików cookies"
      path="/polityka-cookies"
      intro={<p>Jak sklep NOVELIA ZDROWIE korzysta z plików cookies i pamięci przeglądarki.</p>}
      sections={[
        {
          id: "czym",
          title: "Czym są pliki cookies",
          content: <p>Pliki cookies to niewielkie pliki tekstowe zapisywane na urządzeniu użytkownika. Podobną funkcję pełni pamięć lokalna przeglądarki (localStorage, sessionStorage).</p>,
        },
        {
          id: "sklep",
          title: "Co zapisuje sklep",
          content: (
            <>
              <p>Sklep w obecnej wersji nie stosuje cookies analitycznych ani marketingowych. Korzysta wyłącznie z mechanizmów niezbędnych do działania:</p>
              <table>
                <thead>
                  <tr>
                    <th>Nazwa</th>
                    <th>Rodzaj</th>
                    <th>Cel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>novelia-cart-v1</td>
                    <td>pamięć lokalna (localStorage)</td>
                    <td>zapamiętanie zawartości koszyka; nie zawiera danych osobowych</td>
                  </tr>
                  <tr>
                    <td>novelia-checkout-attempt</td>
                    <td>pamięć sesji (sessionStorage)</td>
                    <td>ochrona przed podwójnym zamówieniem przy ponownym kliknięciu; usuwana po zamknięciu karty</td>
                  </tr>
                </tbody>
              </table>
            </>
          ),
        },
        {
          id: "zewnetrzne",
          title: "Usługi zewnętrzne",
          content: (
            <p>
              Podczas płatności użytkownik jest przekierowywany do serwisu Stripe, który stosuje własne pliki cookies niezbędne do bezpiecznej realizacji płatności i
              przeciwdziałania oszustwom – zgodnie z polityką prywatności Stripe.
            </p>
          ),
        },
        {
          id: "zarzadzanie",
          title: "Zarządzanie",
          content: <p>Możesz usunąć dane zapisane przez sklep w ustawieniach przeglądarki. Usunięcie pamięci lokalnej spowoduje wyczyszczenie koszyka.</p>,
        },
        {
          id: "zmiany",
          title: "Zmiany",
          content: (
            <p>
              Jeżeli sklep zacznie korzystać z narzędzi analitycznych lub marketingowych, przed ich uruchomieniem zostanie wdrożony baner zgody, a polityka zostanie
              zaktualizowana. <Pending>dotyczy planowanych narzędzi, np. statystyk odwiedzin</Pending>
            </p>
          ),
        },
      ]}
    />
  );
}
