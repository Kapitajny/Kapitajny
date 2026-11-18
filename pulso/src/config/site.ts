/**
 * ★ Główna konfiguracja marki PULSO.
 *
 * Wszystkie pola oznaczone `null` to dane, których jeszcze nie ma. Strona ich NIE wymyśla:
 * puste pola są po prostu ukrywane (np. e-mail w stopce) albo zastępowane neutralnym komunikatem.
 */
export const site = {
  name: "PULSO",
  fullName: "PULSO Digital Advertising Agency",
  tagline: "Your growth. Our strategy.",
  description:
    "PULSO planuje, uruchamia i optymalizuje kampanie reklamowe w Meta, Google, YouTube i TikToku. Stała, jawna opłata za obsługę, budżet reklamowy płacony bezpośrednio platformom.",
  /**
   * Pełny adres strony po publikacji, np. "https://pulso.pl" (bez podkatalogu i ukośnika na końcu).
   * Dopóki jest pusty, strona blokuje indeksowanie (robots.txt, meta robots) i nie generuje mapy strony.
   * Ustaw go dopiero, gdy dokumenty prawne i ceny są zatwierdzone.
   */
  url: null as string | null,
  locale: "pl_PL",

  /** Dane kontaktowe: uzupełnij, gdy będą znane. Puste pola nie są wyświetlane. */
  contact: {
    email: null as string | null,
    phone: null as string | null,
    hours: null as string | null,
  },

  /** Dane rejestrowe firmy (stopka, polityka prywatności, informacje prawne). */
  company: {
    legalName: null as string | null,
    address: null as string | null,
    nip: null as string | null,
    regon: null as string | null,
    krs: null as string | null,
  },

  /** Profile społecznościowe: dodaj tylko istniejące, np. { label: "Instagram", href: "https://..." }. */
  social: [] as { label: string; href: string }[],
} as const;

/**
 * ★ Obsługa formularza kontaktowego.
 *
 * Strona jest statyczna, więc zgłoszenia wysyła zewnętrzna usługa. Wpisz adres endpointu, który
 * przyjmuje POST z JSON-em i zwraca kod 2xx, np.:
 *   - Formspree:  "https://formspree.io/f/<id-formularza>"
 *   - Web3Forms:  "https://api.web3forms.com/submit" (+ accessKey poniżej)
 *   - własny webhook (Make, Zapier, n8n, Cloudflare Worker)
 * Dopóki `endpoint` jest pusty, formularz działa w całości, ale uczciwie informuje, że wysyłka
 * nie jest jeszcze włączona, i nie udaje wysłania wiadomości.
 * Można też ustawić zmienną środowiskową NEXT_PUBLIC_CONTACT_ENDPOINT podczas budowania.
 */
export const contactForm = {
  endpoint: (process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || null) as string | null,
  /** Klucz Web3Forms (jeśli używasz tej usługi). Jest publiczny z założenia. */
  accessKey: (process.env.NEXT_PUBLIC_CONTACT_ACCESS_KEY || null) as string | null,
} as const;

export const nav = [
  { href: "#uslugi", label: "Oferta", id: "uslugi" },
  { href: "#portfolio", label: "Portfolio", id: "portfolio" },
  { href: "#proces", label: "Proces współpracy", id: "proces" },
  { href: "#cennik", label: "Cennik", id: "cennik" },
  { href: "#faq", label: "FAQ", id: "faq" },
] as const;

export const legalLinks = [
  { href: "/polityka-prywatnosci/", label: "Polityka prywatności" },
  { href: "/informacje-prawne/", label: "Informacje prawne" },
] as const;

/**
 * ★ Statystyki agencji. Sekcja jest ukryta, dopóki `enabled` jest false.
 * Wpisuj wyłącznie prawdziwe, możliwe do udokumentowania liczby.
 */
export const agencyStats = {
  enabled: false,
  items: [
    // { value: 24, suffix: "", label: "obsługiwanych klientów" },
    // { value: 120, suffix: "+", label: "uruchomionych kampanii" },
  ] as { value: number; suffix?: string; label: string }[],
  /** Krótki przypis pod liczbami, np. stan na dzień. */
  note: "",
};
