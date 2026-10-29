import { LegalPage } from "@/components/LegalPage";
import { DEMO_SESSION_COOKIE_NAME } from "@/lib/cookies";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pliki cookies",
  description: "Informacja o plikach cookies w serwisie demonstracyjnym InterPodatki: wyłącznie jedno ciasteczko techniczne, bez analityki i reklam.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPage path="/cookies" title="Pliki cookies" lede="Serwis demonstracyjny używa jednego ciasteczka technicznego. Nie stosujemy analityki ani reklam.">
      <h2>Ciasteczka używane w serwisie</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-left text-[0.9375rem]">
          <thead>
            <tr className="border-b border-line-strong text-sm text-muted">
              <th scope="col" className="py-2 pr-4 font-medium">Nazwa</th>
              <th scope="col" className="py-2 pr-4 font-medium">Cel</th>
              <th scope="col" className="py-2 font-medium">Czas</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <td className="py-3 pr-4 font-mono text-sm">{DEMO_SESSION_COOKIE_NAME}</td>
              <td className="py-3 pr-4">Anonimowy identyfikator sesji demonstracyjnej – wiąże zamówienia testowe i zgłoszenia z przeglądarką. Niezbędne do działania procesu zamówienia.</td>
              <td className="py-3">6 godzin</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Ciasteczko jest ustawiane dopiero po wysłaniu formularza lub złożeniu zamówienia testowego. Ma atrybut HttpOnly, więc nie jest dostępne dla skryptów na stronie.</p>
      <h2>Zarządzanie ciasteczkami</h2>
      <p>Możesz usunąć ciasteczka w ustawieniach przeglądarki. Usunięcie ciasteczka sesji spowoduje, że zamówienia testowe przestaną być widoczne w panelu demo.</p>
      <h2>Wersja produkcyjna</h2>
      <p>[do uzupełnienia: jeśli zostaną wdrożone narzędzia analityczne lub marketingowe, wymagany będzie mechanizm zgody przed ich uruchomieniem].</p>
    </LegalPage>
  );
}
