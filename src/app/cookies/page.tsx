import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { MapConsentControl } from "@/components/legal/MapConsentControl";
import { Pending } from "@/components/legal/Pending";

export const metadata: Metadata = {
  title: "Polityka plików cookies",
  description: "Jakich plików cookies i pamięci przeglądarki używa strona NOIR COFFEE i kiedy potrzebna jest Twoja zgoda.",
};

const sections: LegalSection[] = [
  {
    id: "czym-sa",
    title: "Czym są pliki cookies i pamięć przeglądarki",
    content: (
      <p>
        Pliki cookies to niewielkie pliki zapisywane na Twoim urządzeniu przez odwiedzane strony. Podobnie działają mechanizmy pamięci przeglądarki:{" "}
        <em>localStorage</em> (dane przechowywane do czasu ich usunięcia) i <em>sessionStorage</em> (dane usuwane po zamknięciu karty). Zgodnie z art. 399
        ustawy – Prawo komunikacji elektronicznej zapisywanie takich informacji wymaga Twojej zgody, chyba że jest niezbędne do świadczenia usługi, o którą
        prosisz.
      </p>
    ),
  },
  {
    id: "co-uzywamy",
    title: "Z czego korzysta strona NOIR COFFEE",
    content: (
      <>
        <p>
          Strona <strong>nie używa</strong> plików cookies analitycznych ani marketingowych i nie śledzi Cię między stronami. Korzystamy wyłącznie z poniższych
          mechanizmów:
        </p>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th scope="col">Nazwa</th>
                <th scope="col">Rodzaj</th>
                <th scope="col">Do czego służy</th>
                <th scope="col">Jak długo</th>
                <th scope="col">Zgoda</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>noir-cart-v1</code>
                </td>
                <td>localStorage</td>
                <td>zawartość koszyka i wybrany lokal odbioru – koszyk nie znika po odświeżeniu strony</td>
                <td>do opróżnienia koszyka, opłacenia zamówienia lub usunięcia danych przeglądarki</td>
                <td>niewymagana – niezbędne do działania koszyka</td>
              </tr>
              <tr>
                <td>
                  <code>noir-checkout-attempt</code>
                </td>
                <td>sessionStorage</td>
                <td>identyfikator próby płatności chroniący przed przypadkowym podwójnym złożeniem zamówienia</td>
                <td>do zamknięcia karty</td>
                <td>niewymagana – niezbędne do składania zamówień</td>
              </tr>
              <tr>
                <td>
                  <code>noir-checkout-contact</code>
                </td>
                <td>sessionStorage</td>
                <td>imię i e-mail wpisane w formularzu zamówienia, aby nie trzeba ich było wpisywać ponownie po powrocie ze strony płatności</td>
                <td>do zamknięcia karty</td>
                <td>niewymagana – służy wyłącznie realizacji zamówienia</td>
              </tr>
              <tr>
                <td>
                  <code>noir-maps-consent</code>
                </td>
                <td>localStorage</td>
                <td>zapamiętanie, że zgodzono się na wczytywanie mapy Google</td>
                <td>do cofnięcia zgody lub usunięcia danych przeglądarki</td>
                <td>zapisywane dopiero po kliknięciu „Wczytaj mapę”</td>
              </tr>
              <tr>
                <td>Mapa Google</td>
                <td>pliki cookies podmiotu zewnętrznego (Google)</td>
                <td>wyświetlenie interaktywnej mapy w sekcji „Nasze lokale”</td>
                <td>zgodnie z polityką Google</td>
                <td>
                  <strong>wymagana</strong> – mapa ładuje się dopiero po kliknięciu „Wczytaj mapę”
                </td>
              </tr>
              <tr>
                <td>Stripe Checkout</td>
                <td>pliki cookies operatora płatności na stronie checkout.stripe.com</td>
                <td>bezpieczeństwo płatności i zapobieganie oszustwom – działa na stronie operatora po przejściu do płatności</td>
                <td>zgodnie z polityką Stripe</td>
                <td>niezbędne do przeprowadzenia płatności</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Pliki cookies ustawiane przez dostawcę hostingu lub sieć CDN: <Pending>sprawdzić po wyborze hostingu i uzupełnić tabelę</Pending>.
        </p>
      </>
    ),
  },
  {
    id: "zgoda-na-mape",
    title: "Zgoda na mapę Google",
    content: (
      <>
        <p>
          Mapa Google nie jest wczytywana automatycznie. Po kliknięciu „Wczytaj mapę” przeglądarka łączy się z serwerami Google, które otrzymują m.in. Twój
          adres IP i mogą zapisywać własne pliki cookies. Swoją decyzję możesz w każdej chwili zmienić:
        </p>
        <MapConsentControl />
        <p>Cofnięcie zgody zatrzymuje automatyczne wczytywanie mapy. Pliki cookies zapisane już przez Google usuniesz w ustawieniach przeglądarki.</p>
      </>
    ),
  },
  {
    id: "zarzadzanie",
    title: "Jak zarządzać plikami cookies",
    content: (
      <>
        <p>
          W ustawieniach przeglądarki możesz usunąć zapisane dane strony oraz zablokować pliki cookies. Zablokowanie pamięci przeglądarki sprawi, że koszyk nie
          będzie zapamiętywany po odświeżeniu strony, ale nadal będzie można złożyć zamówienie w jednej sesji.
        </p>
        <p>
          Jeżeli w przyszłości na stronie pojawią się narzędzia analityczne lub marketingowe, zostaną uruchomione dopiero po wyrażeniu zgody w banerze zgód, a
          ta polityka zostanie zaktualizowana.
        </p>
      </>
    ),
  },
  {
    id: "kontakt",
    title: "Kontakt",
    content: (
      <p>
        Pytania dotyczące plików cookies i danych osobowych prosimy kierować na adres wskazany w <Link href="/polityka-prywatnosci">Polityce prywatności</Link>.
        Wersja obowiązująca od: <Pending>data</Pending>.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      title="Polityka plików cookies"
      path="/cookies"
      intro={<p>Opisujemy wyłącznie technologie, których strona faktycznie używa – bez analityki i reklam.</p>}
      sections={sections}
    />
  );
}
