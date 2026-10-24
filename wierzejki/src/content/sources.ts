/**
 * Źródła informacji użytych w koncepcji. Wyświetlane na stronie /o-koncepcji (tryb demonstracyjny)
 * i opisane w README. Dotychczasowa witryna nie była dostępna bezpośrednio ze środowiska pracy –
 * jej treść odczytano z indeksu wyszukiwarki, dlatego wymaga potwierdzenia przez firmę.
 */

export const sources = [
  {
    label: "Dotychczasowa witryna wierzejki.pl – zakładki Kontakt, Historia, Hurtowy, Sklepy, Praca, Katalogi",
    href: "https://wierzejki.pl/",
    usedFor: "dane kontaktowe działów, kronika 1991–2008, hurtownie, odbiorcy i obszar dostaw, stanowiska, katalogi PDF",
  },
  {
    label: "Krajowy Rejestr Sądowy, KRS 0000057518",
    href: "https://rejestr.io/krs/57518/zaklad-miesny-wierzejki-j-m-zdanowscy",
    usedFor: "pełna nazwa, forma prawna, NIP, siedziba",
  },
  {
    label: "Katalog wędlin firmy (PDF)",
    href: "https://www.wierzejki.pl/templates/default/files/wierzejki_katalog_wedlin_nowy.pdf",
    usedFor: "grupy asortymentowe wędlin i przykładowe nazwy",
  },
  {
    label: "Katalog garmażerki firmy (PDF)",
    href: "https://wierzejki.pl/templates/default/files/wierzejki_katalog_garmazerka.pdf",
    usedFor: "rodzaje wyrobów garmażeryjnych i farszy",
  },
] as const;

/** Adresy dotychczasowej witryny przekierowywane do nowych podstron (patrz `src/proxy.ts`). */
export const legacyRedirects: Record<string, string> = {
  kontakt: "/kontakt",
  historia: "/o-firmie/historia",
  "hurtowy-hurt": "/dla-biznesu",
  sklepy: "/siec-sprzedazy",
  praca: "/kariera",
  katalogi: "/produkty",
  "nowe-numery-telefonow-sklepow-firmowych": "/siec-sprzedazy",
};
