/**
 * KARIERA
 *
 * `workAreas` opisuje obszary, w których firma rekrutowała według zakładki „Praca” dotychczasowej strony
 * (produkcja i magazyn w Płudach, sprzedaż w sklepach firmowych, transport). To NIE są aktualne oferty.
 *
 * `jobOffers` – aktualne ogłoszenia. Dodawaj wyłącznie oferty potwierdzone przez dział kadr;
 * każda dostaje własną podstronę /kariera/[slug] i trafia do mapy strony.
 */

export interface WorkArea {
  id: string;
  name: string;
  place: string;
  description: string;
  /** Stanowiska wymienione w źródle. */
  roles: string[];
}

export interface JobOffer {
  slug: string;
  title: string;
  place: string;
  /** Data publikacji w ISO (RRRR-MM-DD). */
  publishedAt: string;
  /** Do kiedy przyjmowane są zgłoszenia (ISO), jeśli określono. */
  validUntil?: string;
  employmentType: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  offer: string[];
  applyEmail: string;
}

export const workAreas: WorkArea[] = [
  {
    id: "produkcja",
    name: "Produkcja",
    place: "Zakład w Płudach",
    description: "Praca przy uboju, rozbiorze i przetwórstwie mięsa w zakładzie w Płudach.",
    roles: ["rozbieracz-wykrawacz", "jeliciarz", "pracownik uboju"],
  },
  {
    id: "magazyn",
    name: "Magazyn i logistyka",
    place: "Zakład w Płudach",
    description: "Przyjęcia, kompletacja i wydawanie towaru do sklepów i odbiorców hurtowych.",
    roles: ["magazynier", "kierowca"],
  },
  {
    id: "sprzedaz",
    name: "Sprzedaż w sklepach firmowych",
    place: "Warszawa i okolice",
    description: "Obsługa klientów przy ladzie mięsnej: doradztwo, krojenie, porcjowanie i dbałość o ekspozycję.",
    roles: ["sprzedawca"],
  },
];

/** Aktualne oferty pracy. Pusta lista = komunikat „brak aktualnych ogłoszeń”. */
export const jobOffers: JobOffer[] = [];

export const recruitmentSteps = [
  { title: "Wybierz obszar", text: "Produkcja, magazyn i transport w Płudach albo sprzedaż w sklepach firmowych." },
  { title: "Wyślij zgłoszenie", text: "CV na adres sekretariatu lub telefon – w temacie wpisz obszar pracy i miejscowość." },
  { title: "Rozmowa", text: "Sekretariat przekazuje zgłoszenie osobie prowadzącej rekrutację w danym dziale." },
];
