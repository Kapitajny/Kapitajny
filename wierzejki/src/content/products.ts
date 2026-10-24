/**
 * OFERTA – KATEGORIE I GRUPY ASORTYMENTOWE
 *
 * Struktura odpowiada katalogom PDF z dotychczasowej strony (mięso, wędliny, garmażerka).
 * Pokazujemy grupy asortymentowe i przykładowe nazwy z katalogów – bez gramatur, cen i składów,
 * bo te muszą pochodzić z aktualnych kart produktów firmy.
 */

import type { MediaKey } from "./media";

export type CategoryId = "mieso" | "wedliny" | "garmaz";

export interface ProductGroup {
  id: string;
  category: CategoryId;
  name: string;
  description: string;
  /** Przykłady z katalogu firmy (nazwy własne pisane tak, jak w źródle). */
  examples: string[];
  /** Dla kogo grupa jest szczególnie istotna. */
  channels: ("sklep" | "hurt" | "horeca")[];
}

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  /** Krótki opis na kafel/stronę główną. */
  summary: string;
  /** Akapit otwierający podstronę. */
  intro: string;
  media: MediaKey;
  catalog: { label: string; href: string; cover?: MediaKey } | null;
}

/** Strona z katalogami na dotychczasowej witrynie – działa jako zastępczy link do PDF. */
export const LEGACY_CATALOGS_URL = "https://wierzejki.pl/?katalogi=";

export const categories: Category[] = [
  {
    id: "mieso",
    slug: "mieso",
    name: "Mięso",
    summary: "Wieprzowina i wołowina z własnego uboju i rozbioru – w tuszach, ćwierćtuszach i elementach.",
    intro:
      "Ubój i rozbiór odbywają się w zakładzie w Płudach. Odbiorcy hurtowi kupują półtusze, ćwierćtusze i elementy, klienci sklepów firmowych – mięso porcjowane na co dzień.",
    media: "categoryMeat",
    catalog: { label: "Katalog mięs (dotychczasowa strona)", href: LEGACY_CATALOGS_URL, cover: "catalogMeat" },
  },
  {
    id: "wedliny",
    slug: "wedliny",
    name: "Wędliny",
    summary: "Wędzonki, kiełbasy, wyroby blokowe, kiełbasy suche i wędliny podrobowe z przetwórni w Płudach.",
    intro:
      "Wędliny powstają w budynku przetwórstwa zakładu w Płudach. Katalog firmy dzieli je na pięć grup – od wędzonek po wędliny podrobowe.",
    media: "categoryCharcuterie",
    catalog: {
      label: "Katalog wędlin (PDF, dotychczasowa strona)",
      href: "https://www.wierzejki.pl/templates/default/files/wierzejki_katalog_wedlin_nowy.pdf",
    },
  },
  {
    id: "garmaz",
    slug: "wyroby-garmazeryjne",
    name: "Wyroby garmażeryjne",
    summary: "Pierogi, krokiety, naleśniki, kopytka i kluski – gotowe do podgrzania lub ugotowania.",
    intro:
      "Garmażerka to najbardziej domowa część oferty: pierogi w wielu farszach, krokiety, naleśniki i kluski – dla klientów sklepów firmowych i odbiorców hurtowych.",
    media: "categoryReadyMeals",
    catalog: {
      label: "Katalog garmażerki (PDF, dotychczasowa strona)",
      href: "https://wierzejki.pl/templates/default/files/wierzejki_katalog_garmazerka.pdf",
    },
  },
];

export const productGroups: ProductGroup[] = [
  // Mięso
  {
    id: "wieprzowina",
    category: "mieso",
    name: "Wieprzowina",
    description: "Półtusze oraz pełny rozbiór na elementy kulinarne.",
    examples: ["schab", "szynka", "karkówka", "łopatka"],
    channels: ["sklep", "hurt", "horeca"],
  },
  {
    id: "wolowina",
    category: "mieso",
    name: "Wołowina",
    description: "Tusze, ćwierćtusze i elementy z rozbioru wołowego.",
    examples: ["pistola", "rostbef", "antrykot", "polędwica"],
    channels: ["sklep", "hurt", "horeca"],
  },
  {
    id: "mieso-garmazeryjne",
    category: "mieso",
    name: "Mięso kulinarne",
    description: "Elementy przygotowane do pieczenia, smażenia i dalszej obróbki w kuchni.",
    examples: ["mięso do pieczenia", "kotlety", "mięso garmażeryjne"],
    channels: ["sklep", "horeca"],
  },
  // Wędliny – grupy według spisu treści katalogu wędlin
  {
    id: "wedzonki",
    category: "wedliny",
    name: "Wędzonki",
    description: "Wędzone mięśnie, boczki i żeberka – do krojenia w plastry lub w kawałku.",
    examples: ["wędzonka firmowa", "żeberka wędzone", "baleron", "słonina paprykowana"],
    channels: ["sklep", "hurt"],
  },
  {
    id: "kielbasy",
    category: "wedliny",
    name: "Kiełbasy",
    description: "Kiełbasy parzone i wędzone – od codziennych po wyroby firmowe.",
    examples: ["kiełbasa wierzejska", "kiełbasa krakowska", "kiełbasa biała parzona", "frankfurterki"],
    channels: ["sklep", "hurt", "horeca"],
  },
  {
    id: "blokowe",
    category: "wedliny",
    name: "Produkty blokowe",
    description: "Wędliny formowane, wygodne do krojenia w plastry.",
    examples: [],
    channels: ["sklep", "hurt", "horeca"],
  },
  {
    id: "suche",
    category: "wedliny",
    name: "Kiełbasy suche i podsuszane",
    description: "Kiełbasy cienkie i podsuszane, wygodne na kanapki i w drogę.",
    examples: ["kabanosy"],
    channels: ["sklep", "hurt"],
  },
  {
    id: "podrobowe",
    category: "wedliny",
    name: "Wędliny podrobowe",
    description: "Klasyka polskiego masarstwa: salcesony, pasztety i pokrewne wyroby.",
    examples: ["salceson", "pasztet"],
    channels: ["sklep", "hurt"],
  },
  // Garmażerka – według katalogu garmażerki
  {
    id: "pierogi",
    category: "garmaz",
    name: "Pierogi",
    description: "Na słono i na słodko – od klasycznych ruskich po farsze sezonowe.",
    examples: ["ruskie", "z mięsem", "z kapustą i grzybami", "z serem", "gryczane", "z owocami leśnymi"],
    channels: ["sklep", "horeca"],
  },
  {
    id: "krokiety",
    category: "garmaz",
    name: "Krokiety",
    description: "Naleśnikowe krokiety panierowane, do odsmażenia.",
    examples: ["z mięsem", "z kapustą i grzybami", "z pieczarkami i serem"],
    channels: ["sklep", "horeca"],
  },
  {
    id: "nalesniki",
    category: "garmaz",
    name: "Naleśniki",
    description: "Zawijane z nadzieniem, gotowe do podgrzania.",
    examples: ["z serem", "z serem i rodzynkami"],
    channels: ["sklep", "horeca"],
  },
  {
    id: "kluski",
    category: "garmaz",
    name: "Kopytka i kluski",
    description: "Dodatki do obiadu i dania na szybko.",
    examples: ["kopytka", "kluski leniwe"],
    channels: ["sklep", "horeca"],
  },
];

export const channelLabels: Record<ProductGroup["channels"][number], string> = {
  sklep: "Sklepy firmowe",
  hurt: "Hurt",
  horeca: "Gastronomia i stołówki",
};

export function getCategory(id: CategoryId): Category {
  return categories.find((c) => c.id === id)!;
}

export function groupsOf(id: CategoryId): ProductGroup[] {
  return productGroups.filter((g) => g.category === id);
}
