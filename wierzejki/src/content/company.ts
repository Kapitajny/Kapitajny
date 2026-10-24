/**
 * DANE FIRMY I KONTAKTY
 *
 * Źródła: rejestr KRS (0000057518) oraz zakładka „Kontakt” dotychczasowej witryny wierzejki.pl
 * (odczytana pośrednio, przez indeks wyszukiwarki – patrz `content/sources.ts`).
 * Przed publikacją każdy numer i adres musi potwierdzić firma.
 *
 * Celowo nie podajemy imion i nazwisk pracowników – na stronie są tylko działy.
 */

export interface Phone {
  /** Numer w zapisie do wyświetlenia, np. "+48 25 643 75 00". */
  display: string;
  note?: string;
}

export interface Department {
  id: string;
  name: string;
  /** Czym dział się zajmuje – językiem odbiorcy. */
  scope: string;
  phones: Phone[];
  email?: string;
  /** Kto powinien się tu zgłosić. */
  audience: ("b2b" | "farmers" | "careers" | "general" | "logistics")[];
}

export const company = {
  legalName: 'Zakład Mięsny „Wierzejki” J.M. Zdanowscy Spółka Jawna',
  brand: "Wierzejki",
  foundedYear: 1991,
  foundedDate: "1991-12-26",
  founders: "Jan i Marek Zdanowscy",
  address: {
    street: "Płudy 21",
    postalCode: "21-404",
    city: "Trzebieszów",
    commune: "gmina Trzebieszów",
    county: "powiat łukowski",
    region: "województwo lubelskie",
    country: "PL",
  },
  registry: {
    krs: "0000057518",
    nip: "8250002694",
  },
  email: "info@wierzejki.pl",
  phone: "+48 25 643 75 00",
  fax: "+48 25 643 75 01",
  /** Obszar dostaw własnym transportem – według zakładki „Hurtowy” dotychczasowej strony. */
  deliveryArea: "województwa lubelskie i mazowieckie",
  /** Odbiorcy wymienieni na dotychczasowej stronie w zakładce „Hurtowy”. */
  wholesaleAudiences: ["hotele", "restauracje", "szkoły", "hurtownie", "stołówki"],
  /** Wyróżnienia wymienione na dotychczasowej stronie (bez dat – do uzupełnienia). */
  awards: ["Mistrz Agro-Ligi", "Laureat Ogólnopolskiego Finału konkursu „Polski Producent Żywności”"],
} as const;

export const departments: Department[] = [
  {
    id: "sekretariat",
    name: "Sekretariat",
    scope: "Sprawy ogólne, korespondencja i przekierowanie do właściwego działu.",
    phones: [{ display: "+48 25 643 75 00" }, { display: "+48 25 643 75 01", note: "faks" }],
    email: "info@wierzejki.pl",
    audience: ["general", "careers"],
  },
  {
    id: "zbyt",
    name: "Dział Zbytu",
    scope: "Sprzedaż hurtowa mięsa, wędlin i wyrobów garmażeryjnych, zamówienia odbiorców stałych.",
    phones: [{ display: "+48 25 643 75 10" }, { display: "+48 508 040 730" }],
    audience: ["b2b"],
  },
  {
    id: "handel-eksport",
    name: "Dział Handlu i Eksportu",
    scope: "Nowe kontakty handlowe, sieci i sprzedaż poza granice kraju.",
    phones: [{ display: "+48 25 643 75 06" }],
    audience: ["b2b"],
  },
  {
    id: "skup",
    name: "Dział Skupu Żywca",
    scope: "Współpraca z hodowcami – skup trzody chlewnej i bydła.",
    phones: [{ display: "+48 25 643 75 40" }],
    audience: ["farmers"],
  },
  {
    id: "transport",
    name: "Dział Transportu",
    scope: "Logistyka dostaw i sprawy kierowców.",
    phones: [{ display: "+48 25 796 05 49" }],
    email: "transport@wierzejki.pl",
    audience: ["logistics"],
  },
];

export function getDepartment(id: string): Department {
  const department = departments.find((d) => d.id === id);
  if (!department) throw new Error(`Unknown department: ${id}`);
  return department;
}

export const fullAddress = `${company.address.street}, ${company.address.postalCode} ${company.address.city}`;
