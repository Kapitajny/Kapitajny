import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { MapConsentControl } from "@/components/legal/MapConsentControl";

export const metadata: Metadata = { title: "Pliki cookies" };

export default function CookiesPage() {
  return (
    <LegalPage title="Pliki cookies">
      <p>Strona nie używa plików cookies reklamowych ani analitycznych.</p>
      <h2>Niezbędne</h2>
      <ul>
        <li>Pamięć przeglądarki (localStorage) zapisuje Twoją zgodę na wczytanie mapy Google.</li>
        <li>Panel administratora używa cookie sesji – dotyczy tylko obsługi wypożyczalni.</li>
      </ul>
      <h2>Mapa Google</h2>
      <p>Mapa wczytuje się dopiero po kliknięciu „Wczytaj mapę”. Wtedy Google może zapisywać własne pliki cookie i otrzymuje Twój adres IP.</p>
      <MapConsentControl />
    </LegalPage>
  );
}
