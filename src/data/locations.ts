/**
 * LOKALE NOIR COFFEE
 *
 * UWAGA: poniższe adresy i godziny są FIKCYJNYMI danymi demonstracyjnymi.
 * Nie są to zweryfikowane lokalizacje działających kawiarni.
 *
 * Przed uruchomieniem sprzedaży:
 *  1. wpisz prawdziwe adresy i godziny,
 *  2. ustaw `verified: true` – dopiero wtedy mapa pokaże konkretny adres
 *     (Google Maps zlokalizuje go na podstawie tekstu `mapsQuery`, bez ręcznych współrzędnych),
 *  3. usuń oznaczenia „adres demonstracyjny” z `addressNote`.
 */

export interface OpeningHours {
  /** Format HH:MM, czas lokalny Europe/Warsaw. */
  open: string;
  close: string;
}

export interface Location {
  id: string;
  name: string;
  district: string;
  street: string;
  city: string;
  /** Tekst używany do wyszukiwania w Google Maps (trasa / mapa po weryfikacji). */
  mapsQuery: string;
  verified: boolean;
  acceptsOrders: boolean;
  hours: {
    weekdays: OpeningHours;
    weekend: OpeningHours;
  };
}

export const LOCATIONS: Location[] = [
  {
    id: "srodmiescie",
    name: "NOIR COFFEE — Śródmieście",
    district: "Śródmieście",
    street: "ul. Karmelowa 12",
    city: "Gdańsk",
    mapsQuery: "ul. Karmelowa 12, Gdańsk",
    verified: false,
    acceptsOrders: true,
    hours: { weekdays: { open: "07:30", close: "19:00" }, weekend: { open: "09:00", close: "18:00" } },
  },
  {
    id: "wrzeszcz",
    name: "NOIR COFFEE — Wrzeszcz",
    district: "Wrzeszcz",
    street: "ul. Jaśminowa 8",
    city: "Gdańsk",
    mapsQuery: "ul. Jaśminowa 8, Gdańsk",
    verified: false,
    acceptsOrders: true,
    hours: { weekdays: { open: "07:00", close: "18:00" }, weekend: { open: "09:00", close: "17:00" } },
  },
  {
    id: "oliwa",
    name: "NOIR COFFEE — Oliwa",
    district: "Oliwa",
    street: "ul. Parkowa 21",
    city: "Gdańsk",
    mapsQuery: "ul. Parkowa 21, Gdańsk",
    verified: false,
    acceptsOrders: true,
    hours: { weekdays: { open: "08:00", close: "19:00" }, weekend: { open: "09:00", close: "18:00" } },
  },
];

export function getLocation(id: unknown): Location | undefined {
  return typeof id === "string" ? LOCATIONS.find((l) => l.id === id) : undefined;
}

/** Link do wyznaczenia trasy w Google Maps (oficjalny format Maps URLs, bez klucza API). */
export function getDirectionsUrl(location: Location): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.mapsQuery)}`;
}

export function formatHours(hours: OpeningHours): string {
  return `${hours.open}–${hours.close}`;
}
