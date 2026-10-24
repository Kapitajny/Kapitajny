/**
 * Ustawienia środowiska strony.
 * Wszystkie flagi są czytane ze zmiennych środowiskowych – patrz `.env.example` i README.
 */

export const siteConfig = {
  name: "Zakład Mięsny Wierzejki",
  shortName: "Wierzejki",
  /** Adres strony bez końcowego ukośnika. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000",
  description:
    "Zakład Mięsny Wierzejki z Płud w gminie Trzebieszów – od 1991 roku ubój, rozbiór i przetwórstwo mięsa. Mięso, wędliny i wyroby garmażeryjne dla klientów sklepów firmowych i odbiorców hurtowych.",
  /**
   * Tryb demonstracyjny: oznaczenie „niezależna koncepcja ComputerIT”, notatki o danych do weryfikacji
   * i strona /o-koncepcji. Wyłącz (NEXT_PUBLIC_DEMO_MODE=false) dopiero po uzyskaniu zgody firmy.
   */
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
  /** Indeksowanie w wyszukiwarkach – wyłącznie dla wersji opublikowanej przez firmę. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  agency: {
    name: "ComputerIT",
  },
};
