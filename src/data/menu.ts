/**
 * KATALOG PRODUKTÓW – jedyne źródło prawdy o menu i cenach.
 *
 * Z tego pliku korzysta zarówno interfejs (karty, koszyk), jak i serwer,
 * który na jego podstawie przelicza ceny przed utworzeniem płatności.
 * Ceny w groszach. Zmiana ceny tutaj zmienia ją wszędzie – także w Stripe.
 */
import type { ImageKey } from "@/config/images";
import type { OptionGroupId } from "./options";

export type CategoryId = "black" | "milk" | "cold" | "sweet";

export const MENU_FILTERS: { id: CategoryId | "all"; label: string }[] = [
  { id: "all", label: "Wszystkie" },
  { id: "black", label: "Czarne" },
  { id: "milk", label: "Mleczne" },
  { id: "cold", label: "Na zimno" },
  { id: "sweet", label: "Słodkie" },
];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  black: "Czarna",
  milk: "Mleczna",
  cold: "Na zimno",
  sweet: "Słodka",
};

/** Wybór z biblioteki opcji z możliwością nadpisania etykiety/dopłaty dla danego napoju. */
export type ChoiceRef = string | { id: string; label?: string; priceDelta?: number };

export interface ProductOptionConfig {
  group: OptionGroupId;
  choices: ChoiceRef[];
  /** Domyślny wybór dla grup typu `single` (gdy brak – pierwszy z listy). */
  defaultChoice?: string;
  /** Nadpisanie nazwy grupy, np. „Podanie” zamiast „Temperatura”. */
  label?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Krótka nuta smakowa – używana w sekcji „Klasyki”. */
  flavor: string;
  basePrice: number;
  categories: CategoryId[];
  image: ImageKey;
  /** Kolejność w sekcji „Klasyki, do których się wraca” (brak = nie jest tam pokazywany). */
  popularRank?: number;
  available: boolean;
  options: ProductOptionConfig[];
}

const MILK: ProductOptionConfig = { group: "milk", choices: ["cow", "oat", "lactose-free"] };
const HOT_TEMPERATURES: ProductOptionConfig = { group: "temperature", choices: ["hot", "extra-hot", "warm"] };
const BEANS: ProductOptionConfig = { group: "beans", choices: ["house", "decaf"] };
const CUP_SIZES: ProductOptionConfig = { group: "size", choices: ["s", "m", "l"] };
const ESPRESSO_SIZES: ProductOptionConfig = { group: "size", choices: ["single", "doppio"] };
const COLD_SIZES: ProductOptionConfig = {
  group: "size",
  choices: [
    { id: "m", label: "Standard · 350 ml", priceDelta: 0 },
    { id: "l", label: "Duża · 450 ml", priceDelta: 400 },
  ],
};
const ICE: ProductOptionConfig = { group: "ice", choices: ["regular", "light"] };

export const PRODUCTS: Product[] = [
  {
    id: "espresso",
    name: "Espresso",
    description: "Intensywne, klasyczne espresso z wyselekcjonowanych ziaren.",
    flavor: "Gęsta crema, pełne body i długi, kakaowy finisz.",
    basePrice: 1000,
    categories: ["black"],
    image: "espresso",
    popularRank: 4,
    available: true,
    options: [ESPRESSO_SIZES, BEANS],
  },
  {
    id: "americano",
    name: "Americano",
    description: "Espresso z gorącą wodą, o łagodniejszym charakterze.",
    flavor: "Czyste, klarowne i łagodne – na długie poranki.",
    basePrice: 1300,
    categories: ["black"],
    image: "americano",
    available: true,
    options: [
      {
        group: "size",
        choices: [
          { id: "s", label: "Standard · 250 ml", priceDelta: 0 },
          { id: "m", label: "Duża · 350 ml", priceDelta: 300 },
        ],
      },
      { group: "temperature", label: "Podanie", choices: [{ id: "hot", label: "Na gorąco" }, "iced"] },
      BEANS,
      { group: "extras", choices: ["extra-shot", "vanilla"] },
    ],
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Espresso, mleko i aksamitna pianka.",
    flavor: "Aksamitna pianka i nuty mlecznej czekolady.",
    basePrice: 1600,
    categories: ["milk"],
    image: "cappuccino",
    popularRank: 1,
    available: true,
    options: [CUP_SIZES, MILK, HOT_TEMPERATURES, BEANS, { group: "extras", choices: ["extra-shot", "vanilla", "caramel"] }],
  },
  {
    id: "caffe-latte",
    name: "Caffè Latte",
    description: "Delikatna kawa mleczna o kremowej konsystencji.",
    flavor: "Kremowa, delikatna i otulająca.",
    basePrice: 1700,
    categories: ["milk"],
    image: "caffeLatte",
    available: true,
    options: [CUP_SIZES, MILK, HOT_TEMPERATURES, BEANS, { group: "extras", choices: ["extra-shot", "vanilla", "caramel"] }],
  },
  {
    id: "flat-white",
    name: "Flat White",
    description: "Intensywne espresso z jedwabiście spienionym mlekiem.",
    flavor: "Podwójne espresso i jedwabista mikropianka – 180 ml.",
    basePrice: 1700,
    categories: ["milk"],
    image: "flatWhite",
    popularRank: 2,
    available: true,
    options: [MILK, HOT_TEMPERATURES, BEANS, { group: "extras", choices: ["vanilla"] }],
  },
  {
    id: "mocha",
    name: "Mocha",
    description: "Espresso, mleko i czekoladowy akcent.",
    flavor: "Espresso spotyka gorzką czekoladę.",
    basePrice: 1900,
    categories: ["milk", "sweet"],
    image: "mocha",
    available: true,
    options: [CUP_SIZES, MILK, HOT_TEMPERATURES, { group: "extras", choices: ["extra-shot", "whipped"] }],
  },
  {
    id: "espresso-macchiato",
    name: "Espresso Macchiato",
    description: "Espresso z niewielką ilością mlecznej pianki.",
    flavor: "Moc espresso złagodzona odrobiną pianki.",
    basePrice: 1200,
    categories: ["milk"],
    image: "espressoMacchiato",
    available: true,
    options: [ESPRESSO_SIZES, { ...MILK, label: "Mleko do pianki" }, BEANS],
  },
  {
    id: "iced-latte",
    name: "Iced Latte",
    description: "Chłodne mleko, espresso i lód.",
    flavor: "Orzeźwiające, chłodne i kremowe zarazem.",
    basePrice: 1800,
    categories: ["milk", "cold"],
    image: "icedLatte",
    popularRank: 3,
    available: true,
    options: [COLD_SIZES, MILK, ICE, BEANS, { group: "extras", choices: ["extra-shot", "vanilla", "caramel"] }],
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    description: "Kawa parzona na zimno, o łagodnym smaku.",
    flavor: "Parzony powoli na zimno – łagodny i naturalnie słodki.",
    basePrice: 1800,
    categories: ["black", "cold"],
    image: "coldBrew",
    available: true,
    options: [COLD_SIZES, ICE, { group: "extras", choices: ["vanilla"] }],
  },
  {
    id: "caramel-latte",
    name: "Caramel Latte",
    description: "Latte z nutą karmelu.",
    flavor: "Kremowe latte z karmelową słodyczą.",
    basePrice: 2000,
    categories: ["milk", "sweet"],
    image: "caramelLatte",
    available: true,
    options: [CUP_SIZES, MILK, HOT_TEMPERATURES, { group: "extras", choices: ["extra-shot", "whipped"] }],
  },
];

export const PRODUCTS_BY_ID: ReadonlyMap<string, Product> = new Map(PRODUCTS.map((p) => [p.id, p]));

export function getProduct(id: string): Product | undefined {
  return PRODUCTS_BY_ID.get(id);
}

export const POPULAR_PRODUCTS: Product[] = PRODUCTS.filter((p) => p.popularRank !== undefined).sort((a, b) => (a.popularRank ?? 0) - (b.popularRank ?? 0));
