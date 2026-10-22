import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { MapConsentControl } from "@/components/legal/MapConsentControl";

export const metadata: Metadata = {
  title: "Pliki cookies",
  description: `Informacje o plikach cookies i pamięci przeglądarki na stronie ${siteConfig.name}.`,
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  const sections: LegalSection[] = [
    {
      id: "zasada",
      title: "Jak korzystamy z cookies",
      content: (
        <p>
          Strona nie korzysta z narzędzi analitycznych ani reklamowych i sama nie zapisuje plików cookies. Jeśli w przyszłości dodamy takie narzędzia,
          poprosimy o Twoją zgodę i zaktualizujemy ten dokument.
        </p>
      ),
    },
    {
      id: "pamiec",
      title: "Pamięć przeglądarki",
      content: (
        <p>
          Gdy klikniesz „Wczytaj mapę”, zapisujemy tę decyzję w pamięci Twojej przeglądarki (localStorage), aby nie pytać ponownie. Informacja ta nie jest
          przesyłana do nas i możesz ją w każdej chwili usunąć poniżej lub w ustawieniach przeglądarki.
        </p>
      ),
    },
    {
      id: "mapa",
      title: "Mapa Google",
      content: (
        <>
          <p>
            Mapa dojazdu jest wczytywana dopiero po kliknięciu. Wtedy Google (Google Ireland Limited) otrzymuje Twój adres IP i może zapisywać własne pliki
            cookies – zgodnie z{" "}
            <a href="https://policies.google.com/privacy?hl=pl" target="_blank" rel="noopener noreferrer">
              polityką prywatności Google
            </a>
            .
          </p>
          <MapConsentControl />
        </>
      ),
    },
    {
      id: "rezerwacja",
      title: "Zewnętrzny system rezerwacji",
      content: (
        <p>
          Jeśli przycisk „Umów wizytę” prowadzi do zewnętrznego kalendarza rezerwacji, po przejściu na jego stronę obowiązują zasady cookies jego dostawcy.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Pliki cookies"
      path="/cookies"
      intro={<p>Krótko wyjaśniamy, jakie informacje strona zapisuje w Twojej przeglądarce.</p>}
      sections={sections}
    />
  );
}
