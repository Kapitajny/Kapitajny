/**
 * Realizacje – wyłącznie koncepcje demonstracyjne przygotowane przez ComputerIT dla fikcyjnych marek.
 * Każda ma działającą wersję w `public/demo/<slug>/` (adres `/demo/<slug>`), a zrzuty ekranu
 * w `public/portfolio/<slug>/` wykonano z tych samych wersji.
 */

export type ProjectKind = "strona" | "sklep";

export type Project = {
  slug: string;
  name: string;
  kind: ProjectKind;
  industry: string;
  summary: string;
  features: string[];
  demoUrl: string;
};

export const projects: Project[] = [
  {
    slug: "sklep-kapitajny",
    name: "Sklep KAPITAJNY",
    kind: "sklep",
    industry: "Moda i odzież",
    summary: "Sklep marki odzieżowej z katalogiem, wyszukiwarką, filtrami, wyborem koloru i rozmiaru oraz koszykiem.",
    features: ["Filtry i sortowanie", "Warianty produktu", "Koszyk i zamówienie demo"],
    demoUrl: "/demo/sklep-kapitajny",
  },
  {
    slug: "neon-nami",
    name: "NEON NAMI",
    kind: "sklep",
    industry: "Gastronomia",
    summary: "Restauracja sushi z menu, zamówieniami online, koszykiem, wyborem płatności i rezerwacją stolika.",
    features: ["Menu z koszykiem", "Zamówienie krok po kroku", "Rezerwacje"],
    demoUrl: "/demo/neon-nami",
  },
  {
    slug: "noir-coffee",
    name: "NOIR COFFEE",
    kind: "sklep",
    industry: "Kawiarnia",
    summary: "Kawiarnia z menu, personalizacją napojów, koszykiem i zamówieniem z wyborem lokalu i godziny odbioru.",
    features: ["Personalizacja napojów", "Koszyk", "Wybór godziny odbioru"],
    demoUrl: "/demo/noir-coffee",
  },
  {
    slug: "novelia-zdrowie",
    name: "NOVELIA ZDROWIE",
    kind: "sklep",
    industry: "Produkty cyfrowe",
    summary: "Sklep z e-bookami o zdrowym odżywianiu: katalog publikacji, karty produktów, koszyk i dokumenty sklepu.",
    features: ["Karty produktów", "Koszyk", "Komplet dokumentów sklepu"],
    demoUrl: "/demo/novelia-zdrowie",
  },
  {
    slug: "aureon-homes",
    name: "AUREON HOMES",
    kind: "strona",
    industry: "Nieruchomości",
    summary: "Butikowe biuro nieruchomości premium z katalogiem ofert, wyszukiwarką i formularzem dla właścicieli.",
    features: ["Katalog ofert", "Wyszukiwarka z filtrami", "Karty nieruchomości"],
    demoUrl: "/demo/aureon-homes",
  },
  {
    slug: "vantor-automotive",
    name: "VANTOR Automotive",
    kind: "strona",
    industry: "Motoryzacja",
    summary: "Studio serwisowe i renowacyjne dla samochodów sportowych – film na pierwszym ekranie i formularz konsultacji.",
    features: ["Film w sekcji głównej", "Oferta usług", "Formularz konsultacji"],
    demoUrl: "/demo/vantor-automotive",
  },
  {
    slug: "interpodatki",
    name: "InterPodatki",
    kind: "strona",
    industry: "Księgowość",
    summary: "Biuro rachunkowe z kalkulatorem abonamentu, porównaniem pakietów i podglądem panelu klienta.",
    features: ["Kalkulator abonamentu", "Porównanie pakietów", "Panel klienta"],
    demoUrl: "/demo/interpodatki",
  },
  {
    slug: "forma-atelier",
    name: "FORMA ATELIER",
    kind: "strona",
    industry: "Architektura wnętrz",
    summary: "Pracownia architektury wnętrz z filmem w tle, galeriami realizacji i opisem procesu projektowego.",
    features: ["Film w tle", "Galerie projektów", "Opis procesu"],
    demoUrl: "/demo/forma-atelier",
  },
  {
    slug: "vera-aesthetic-studio",
    name: "VÉRA Aesthetic Studio",
    kind: "strona",
    industry: "Medycyna estetyczna",
    summary: "Studio medycyny estetycznej z katalogiem zabiegów, prezentacją specjalistów i formularzem konsultacji.",
    features: ["Katalog zabiegów", "Specjaliści", "Formularz konsultacji"],
    demoUrl: "/demo/vera-aesthetic-studio",
  },
  {
    slug: "balans",
    name: "BALANS",
    kind: "strona",
    industry: "Zdrowie psychiczne",
    summary: "Centrum zdrowia psychicznego ze spokojną identyfikacją, prezentacją specjalistów, cennikiem i rejestracją.",
    features: ["Specjaliści", "Cennik", "Formularz rejestracji"],
    demoUrl: "/demo/balans",
  },
  {
    slug: "volt-gsm",
    name: "VOLT GSM",
    kind: "strona",
    industry: "Serwis telefonów",
    summary: "Serwis i skup smartfonów z filtrowaną ofertą urządzeń, formularzem wyceny i dwoma lokalami.",
    features: ["Filtrowana oferta", "Formularz wyceny", "Lokale"],
    demoUrl: "/demo/volt-gsm",
  },
  {
    slug: "piekarnia-morelowa",
    name: "Piekarnia Morelowa",
    kind: "strona",
    industry: "Piekarnia i cukiernia",
    summary: "Rodzinna piekarnia i cukiernia z historią marki, rytmem pracy piekarni i dwoma lokalami.",
    features: ["Historia marki", "Oferta pieczywa", "Lokale"],
    demoUrl: "/demo/piekarnia-morelowa",
  },
];

export const coverOf = (project: Project) => `/portfolio/${project.slug}/desktop-strona-glowna.jpg`;
export const mobileOf = (project: Project) => `/portfolio/${project.slug}/mobile-strona-glowna.jpg`;

export const kindLabel: Record<ProjectKind, string> = { strona: "Strona internetowa", sklep: "Sklep internetowy" };

export const getProject = (slug: string | null | undefined) => projects.find((project) => project.slug === slug);

/** Na przemian sklep i strona – na stronie głównej widać od razu oba rodzaje realizacji. */
export const interleaved: Project[] = (() => {
  const shops = projects.filter((p) => p.kind === "sklep");
  const sites = projects.filter((p) => p.kind === "strona");
  const out: Project[] = [];
  for (let n = 0; n < Math.max(shops.length, sites.length); n++) {
    if (shops[n]) out.push(shops[n]);
    if (sites[n]) out.push(sites[n]);
  }
  return out;
})();
