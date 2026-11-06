import { MapConsentControl } from "@/components/contact/MapConsentControl";
import { LegalPage } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Polityka cookies",
  description: "Informacje o plikach cookies i podobnych technologiach używanych na stronie oraz o mapie Google wczytywanej po zgodzie.",
  path: "/polityka-cookies",
});

const toc = [
  { id: "czym-sa", label: "1. Czym są pliki cookies" },
  { id: "uzywane", label: "2. Z czego korzysta strona" },
  { id: "mapa", label: "3. Mapa Google" },
  { id: "zarzadzanie", label: "4. Zarządzanie ustawieniami" },
];

export default function CookiesPage() {
  return (
    <LegalPage title="Polityka cookies" path="/polityka-cookies" updated="06.11.2026" toc={toc}>
      <h2 id="czym-sa">1. Czym są pliki cookies</h2>
      <p>
        Pliki cookies to niewielkie pliki tekstowe zapisywane w urządzeniu użytkownika. Podobnie działa pamięć lokalna przeglądarki (localStorage), w
        której strona może zapisać proste ustawienia.
      </p>

      <h2 id="uzywane">2. Z czego korzysta strona</h2>
      <p>
        Strona <strong>nie używa plików cookies analitycznych ani marketingowych</strong>. Korzystamy wyłącznie z niezbędnych mechanizmów technicznych:
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Nazwa</th>
            <th scope="col">Rodzaj</th>
            <th scope="col">Cel i okres</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>vm-maps-consent</code>
            </td>
            <td>pamięć lokalna przeglądarki</td>
            <td>zapamiętanie zgody na wczytanie mapy Google; do czasu cofnięcia zgody lub wyczyszczenia danych przeglądarki</td>
          </tr>
        </tbody>
      </table>
      <p>Jeżeli w przyszłości dodamy narzędzia analityczne lub marketingowe, uruchomimy je wyłącznie po uzyskaniu zgody, a ta polityka zostanie zaktualizowana.</p>

      <h2 id="mapa">3. Mapa Google</h2>
      <p>
        Mapa w sekcji kontaktowej jest wczytywana dopiero po kliknięciu „Wczytaj mapę Google”. Wówczas Google Ireland Limited może zapisywać własne pliki
        cookies i otrzymuje adres IP użytkownika – zgodnie z polityką prywatności Google.
      </p>
      <MapConsentControl />

      <h2 id="zarzadzanie">4. Zarządzanie ustawieniami</h2>
      <p>
        Możesz w każdej chwili usunąć pliki cookies i dane witryn w ustawieniach przeglądarki albo zablokować ich zapisywanie. Zablokowanie mechanizmów
        niezbędnych może utrudnić korzystanie z niektórych funkcji (np. zapamiętania zgody na mapę).
      </p>
    </LegalPage>
  );
}
