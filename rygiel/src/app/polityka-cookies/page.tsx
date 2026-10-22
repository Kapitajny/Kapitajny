import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { Pending } from "@/components/ui/Pending";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Polityka cookies",
  description: "Informacja o plikach cookies w serwisie Rygiel: serwis nie używa cookies analitycznych ani marketingowych i nie uruchamia śledzenia.",
  path: "/polityka-cookies",
});

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Polityka cookies"
      path="/polityka-cookies"
      updated="2026-10-22"
      lede="Krótko: serwis w obecnej wersji nie zapisuje plików cookies analitycznych ani marketingowych i nie korzysta z narzędzi śledzących."
    >
      <section aria-labelledby="czym-sa">
        <h2 id="czym-sa">1. Czym są pliki cookies</h2>
        <p>
          Pliki cookies to niewielkie pliki tekstowe zapisywane w&nbsp;przeglądarce przez odwiedzane strony. Podobnie działają inne technologie przechowywania
          danych w&nbsp;przeglądarce, na przykład localStorage.
        </p>
      </section>

      <section aria-labelledby="w-serwisie">
        <h2 id="w-serwisie">2. Cookies w&nbsp;tym serwisie</h2>
        <p>Serwis w&nbsp;obecnej wersji:</p>
        <ul>
          <li>nie używa cookies analitycznych (np. do statystyk odwiedzin),</li>
          <li>nie używa cookies marketingowych ani reklamowych,</li>
          <li>nie ładuje skryptów ani zasobów od podmiotów zewnętrznych – czcionki są serwowane z&nbsp;tej samej domeny,</li>
          <li>nie zapisuje danych w&nbsp;localStorage ani sessionStorage.</li>
        </ul>
        <p>
          Dlatego serwis nie wyświetla banera zgody na cookies – nie ma czego włączać ani wyłączać. Dostawca hostingu może stosować techniczne mechanizmy
          niezbędne do bezpiecznego działania infrastruktury: <Pending>informacja od dostawcy hostingu, jeśli dotyczy</Pending>.
        </p>
      </section>

      <section aria-labelledby="zmiany">
        <h2 id="zmiany">3. Jeśli to się zmieni</h2>
        <p>
          Jeżeli w&nbsp;przyszłości dodamy narzędzia analityczne lub marketingowe, zaktualizujemy tę politykę i&nbsp;wdrożymy mechanizm zgody. Opcjonalne narzędzia
          nie zostaną uruchomione, dopóki nie wyrazisz na nie zgody, a&nbsp;zgodę będzie można w&nbsp;każdej chwili zmienić.
        </p>
      </section>

      <section aria-labelledby="ustawienia">
        <h2 id="ustawienia">4. Ustawienia przeglądarki</h2>
        <p>
          Możesz w&nbsp;każdej chwili usunąć zapisane pliki cookies i&nbsp;zablokować ich zapisywanie w&nbsp;ustawieniach przeglądarki. Nie wpłynie to na działanie tego
          serwisu.
        </p>
        <p>
          Więcej o&nbsp;przetwarzaniu danych przeczytasz w&nbsp;<Link href="/polityka-prywatnosci">polityce prywatności</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
