import type { StaticImageData } from "next/image";
import packGruszka from "@/assets/packshots/gruszka.webp";
import packJablko from "@/assets/packshots/jablko.webp";
import packMix from "@/assets/packshots/mix.webp";

export type FlavorId = "jablko" | "gruszka" | "jablko-gruszka";
export type Capacity = 3 | 5;

export type Flavor = {
  id: FlavorId;
  /** Nazwa smaku w mianowniku, np. na filtrach. */
  label: string;
  /** Nazwa soku. */
  juice: string;
  image: StaticImageData;
  imageAlt: string;
  short: string;
  description: string[];
  taste: string;
  composition: string;
};

export type Product = {
  slug: string;
  name: string;
  flavor: FlavorId;
  capacity: Capacity;
  /** Cena brutto w groszach. */
  price: number;
  /** Kolejność domyślna na liście. */
  order: number;
  featured: boolean;
};

/* Wszystkie produkty, ceny, opisy i składy są przykładowe (projekt demonstracyjny). */

export const flavors: Record<FlavorId, Flavor> = {
  jablko: {
    id: "jablko",
    label: "Jabłko",
    juice: "Sok jabłkowy",
    image: packJablko,
    imageAlt: "Worek z sokiem jabłkowym Wieś Soków z kranikiem, obok zielone jabłko i połówka jabłka",
    short: "Naturalnie mętny, orzeźwiający, ze słodyczą dojrzałych jabłek i lekką kwaskowatością.",
    description: [
      "Sok tłoczony z dojrzałych jabłek. Nie klarujemy go, dlatego jest naturalnie mętny, a na dnie może zebrać się osad. Wystarczy lekko poruszyć opakowaniem.",
      "Smakuje najlepiej schłodzony. Sprawdza się przy śniadaniu, do obiadu i jako baza domowych napojów.",
    ],
    taste: "Słodko-kwaśny, świeży",
    composition: "Sok jabłkowy tłoczony 100%, pasteryzowany.",
  },
  gruszka: {
    id: "gruszka",
    label: "Gruszka",
    juice: "Sok gruszkowy",
    image: packGruszka,
    imageAlt: "Worek z sokiem gruszkowym Wieś Soków z kranikiem, przed nim trzy zielone gruszki",
    short: "Łagodny i aksamitny, z miodową nutą dojrzałych gruszek.",
    description: [
      "Sok tłoczony z dojrzałych gruszek. Jest gęstszy i łagodniejszy od jabłkowego, o wyraźnie owocowym zapachu.",
      "Podawaj schłodzony albo lekko podgrzany z goździkiem i cynamonem w chłodniejsze dni.",
    ],
    taste: "Łagodny, miodowy",
    composition: "Sok gruszkowy tłoczony 100%, pasteryzowany.",
  },
  "jablko-gruszka": {
    id: "jablko-gruszka",
    label: "Jabłko z gruszką",
    juice: "Sok jabłkowo-gruszkowy",
    image: packMix,
    imageAlt: "Worek z sokiem jabłkowo-gruszkowym Wieś Soków z kranikiem, obok jabłko, połówka jabłka i gruszka",
    short: "Jabłkowa świeżość i gruszkowa łagodność w jednym opakowaniu.",
    description: [
      "Połączenie soku z jabłek i gruszek. Jabłko daje świeżość i lekką kwaskowatość, gruszka łagodzi smak i dodaje słodyczy.",
      "Dobry wybór, gdy przy stole spotykają się różne upodobania.",
    ],
    taste: "Zrównoważony, owocowy",
    composition: "Sok jabłkowy tłoczony 60%, sok gruszkowy tłoczony 40%, pasteryzowany.",
  },
};

export const flavorOrder: FlavorId[] = ["jablko", "gruszka", "jablko-gruszka"];
export const capacities: Capacity[] = [3, 5];

export const products: Product[] = [
  { slug: "sok-jablkowy-5l", name: "Sok jabłkowy", flavor: "jablko", capacity: 5, price: 3500, order: 1, featured: true },
  { slug: "sok-gruszkowy-5l", name: "Sok gruszkowy", flavor: "gruszka", capacity: 5, price: 3900, order: 2, featured: true },
  {
    slug: "sok-jablkowo-gruszkowy-5l",
    name: "Sok jabłkowo-gruszkowy",
    flavor: "jablko-gruszka",
    capacity: 5,
    price: 3700,
    order: 3,
    featured: false,
  },
  { slug: "sok-jablkowy-3l", name: "Sok jabłkowy", flavor: "jablko", capacity: 3, price: 2300, order: 4, featured: false },
  { slug: "sok-gruszkowy-3l", name: "Sok gruszkowy", flavor: "gruszka", capacity: 3, price: 2600, order: 5, featured: false },
  {
    slug: "sok-jablkowo-gruszkowy-3l",
    name: "Sok jabłkowo-gruszkowy",
    flavor: "jablko-gruszka",
    capacity: 3,
    price: 2400,
    order: 6,
    featured: false,
  },
];

const bySlug = new Map(products.map((product) => [product.slug, product]));

export function getProduct(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function capacityLabel(capacity: Capacity): string {
  return capacity === 5 ? "5 litrów" : "3 litry";
}

export function isFlavorId(value: string | null | undefined): value is FlavorId {
  return value === "jablko" || value === "gruszka" || value === "jablko-gruszka";
}
