/** Oferta, cennik i opcje formularza – jedno źródło dla wszystkich podstron. */

export type ServiceValue = "strona" | "sklep" | "inne";

export const serviceOptions: { value: ServiceValue; label: string }[] = [
  { value: "strona", label: "Strona internetowa" },
  { value: "sklep", label: "Sklep internetowy" },
  { value: "inne", label: "Inne zapytanie" },
];

export const budgetOptions = [
  { value: "do-1000", label: "Do 1 000 zł" },
  { value: "1000-2000", label: "1 000–2 000 zł" },
  { value: "2000-5000", label: "2 000–5 000 zł" },
  { value: "powyzej-5000", label: "Powyżej 5 000 zł" },
  { value: "nie-wiem", label: "Nie wiem – potrzebuję wyceny" },
] as const;

export type BudgetValue = (typeof budgetOptions)[number]["value"];

export const prices = {
  website: 1300,
  shop: 2000,
  promo: 800,
  promoSeats: 5,
};

/** 1300 → „1 300” (twarda spacja między tysiącami – czytelniej przy cenach). */
export function formatPrice(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const services = [
  {
    id: "strona",
    href: "/strony-internetowe",
    name: "Strony internetowe",
    price: prices.website,
    lead: "Strony firmowe, usługowe i landing page – zaprojektowane od podstaw pod Twoją markę i klientów.",
    scope: ["Indywidualny projekt graficzny", "Wersja na telefon, tablet i komputer", "Formularz kontaktowy", "Podstawowa optymalizacja SEO", "Wdrożenie strony"],
    cta: "Zamów stronę internetową",
  },
  {
    id: "sklep",
    href: "/sklepy-internetowe",
    name: "Sklepy internetowe",
    price: prices.shop,
    lead: "Sklepy z kategoriami, kartami produktów, koszykiem i przemyślanym procesem zamówienia.",
    scope: ["Indywidualny wygląd sklepu", "Responsywność", "Kategorie i karty produktów", "Koszyk i proces zamówienia", "Podstawowa konfiguracja"],
    cta: "Zapytaj o sklep internetowy",
  },
] as const;

export const reasons = [
  {
    title: "Projekt od podstaw",
    text: "Każdą stronę projektujemy pod konkretną firmę – jej klientów, ofertę i charakter. Bez podmieniania logo w gotowym szablonie.",
  },
  {
    title: "Dobrze na każdym ekranie",
    text: "Układ, typografia i przyciski są dopracowane osobno dla telefonu, tabletu i komputera – bo tam są Twoi klienci.",
  },
  {
    title: "Szybkość i porządny kod",
    text: "Lekkie strony, zoptymalizowane obrazy i czysta struktura. Strona ładuje się szybko i łatwiej ją później rozwijać.",
  },
  {
    title: "Przejrzyste ceny",
    text: "Ceny „od” są podane wprost. Ostateczną wycenę ustalamy przed rozpoczęciem prac – bez dopisywania kosztów w trakcie.",
  },
  {
    title: "Bezpośredni kontakt",
    text: "Rozmawiasz bezpośrednio z ComputerIT – z tymi, którzy projektują i tworzą Twoją stronę. Bez pośredników.",
  },
  {
    title: "SEO i dostępność od startu",
    text: "Poprawna struktura nagłówków, opisy dla wyszukiwarek, kontrast i obsługa klawiatury są częścią projektu, a nie dodatkiem.",
  },
] as const;

export const processSteps = [
  { title: "Rozmowa", text: "Poznajemy firmę, cel strony i klientów, do których ma trafić. Ustalamy potrzebne podstrony i funkcje." },
  { title: "Zakres i wycena", text: "Przygotowujemy propozycję zakresu, terminu i ceny. Prace zaczynamy dopiero po jej akceptacji." },
  { title: "Projekt", text: "Projektujemy wygląd strony głównej i kluczowych widoków. Wprowadzamy uzgodnione poprawki." },
  { title: "Wdrożenie", text: "Budujemy stronę, testujemy ją na różnych urządzeniach i przeglądarkach, uzupełniamy treści." },
  { title: "Publikacja", text: "Uruchamiamy stronę pod uzgodnionym adresem i przekazujemy dostępy oraz wskazówki do dalszej pracy." },
] as const;
