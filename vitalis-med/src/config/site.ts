/**
 * ★ Najważniejsze ustawienia strony – nazwa firmy, dane kontaktowe i liczby prezentowane na stronie.
 *
 * Wszystkie dane są PRZYKŁADOWE (projekt demonstracyjny). Przed publikacją zastąp je prawdziwymi
 * danymi firmy. Pola `null` w `company` wyświetlają się na stronie jako „[do uzupełnienia]”.
 */

export const siteConfig = {
  name: "Vitalis Med",
  /** Pełna nazwa używana w dokumentach (np. forma prawna spółki). */
  legalName: "Vitalis Med [forma prawna – do uzupełnienia]",
  tagline: "Prywatne usługi medyczne",
  description:
    "Vitalis Med – prywatne pogotowie ratunkowe. Transport sanitarny i medyczny, transport pacjentów leżących, zabezpieczenie medyczne imprez oraz świadczenia w ramach kontraktu z NFZ. Dyspozytornia czynna całą dobę.",
  /** Adres strony bez końcowego ukośnika, np. https://vitalismed.pl */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000",
  /** Indeksowanie w wyszukiwarkach włącz dopiero po uzupełnieniu prawdziwych danych (NEXT_PUBLIC_ALLOW_INDEXING=true). */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",

  contact: {
    phoneDisplay: "+48 500 600 700",
    phoneHref: "tel:+48500600700",
    email: "kontakt@przykladowe-pogotowie.pl",
    street: "ul. Przykładowa 10",
    postalCode: "05-825",
    city: "Grodzisk Mazowiecki",
    region: "mazowieckie",
    /** Zapytanie dla mapy Google. Adres jest fikcyjny, więc mapa pokazuje miasto. */
    mapQuery: "Grodzisk Mazowiecki",
    /** Zmień na true po wpisaniu prawdziwego adresu – mapa pokaże wtedy dokładną lokalizację. */
    addressVerified: false,
    dispatchHours: "Dyspozytornia transportu: całą dobę, 7 dni w tygodniu",
    officeHours: "Biuro obsługi klienta: pon.–pt. 8:00–16:00",
  },

  /** Dane rejestrowe – celowo puste. Nie wpisuj fikcyjnych numerów. */
  company: {
    nip: null as string | null,
    regon: null as string | null,
    krs: null as string | null,
    /** Numer księgi rejestrowej w Rejestrze Podmiotów Wykonujących Działalność Leczniczą. */
    rpwdl: null as string | null,
  },

  /** ★ Statystyki z sekcji „O nas” – założenia projektu demonstracyjnego. */
  stats: [
    { value: "20", label: "ambulansów we flocie", note: "4 typu T, 5 typu S, 11 typu P" },
    { value: "ok. 200", label: "pracowników", note: "personel medyczny, kierowcy i zespół organizacyjny" },
    { value: "24/7", label: "gotowość operacyjna", note: "dyspozytornia transportu czynna całą dobę" },
    { value: "3", label: "rodzaje ambulansów", note: "typ T, typ S i typ P" },
  ],

  /** Numery alarmowe – pokazywane w pasku ostrzegawczym. */
  emergencyNumbers: ["112", "999"],
} as const;

export const mainNav = [
  { href: "/", label: "Strona główna" },
  { href: "/o-nas", label: "O nas" },
  { href: "/uslugi", label: "Nasze usługi" },
  { href: "/flota", label: "Nasza flota" },
  { href: "/cennik", label: "Cennik" },
  { href: "/nfz", label: "NFZ" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const legalNav = [
  { href: "/regulamin", label: "Regulamin świadczenia usług" },
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
  { href: "/polityka-cookies", label: "Polityka cookies" },
  { href: "/klauzula-rodo", label: "Klauzula informacyjna RODO" },
  { href: "/prawa-pacjenta", label: "Informacja o prawach pacjenta" },
] as const;

/** Link do formularza zamówienia transportu (opcjonalnie z preselekcją usługi). */
export function orderHref(service?: string) {
  return service ? `/kontakt?usluga=${encodeURIComponent(service)}#formularz` : "/kontakt#formularz";
}
