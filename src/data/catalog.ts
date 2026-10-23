/**
 * Katalog sklepu – dane demonstracyjne.
 *
 * Ceny są w groszach (PLN). Stany magazynowe to stan początkowy – sprzedaż (opłacone zamówienia)
 * i aktywne rezerwacje odejmuje serwer (`src/lib/server/inventory.ts`).
 * Zdjęcia produktów leżą w `public/images/products/<image>.jpg` oraz `<image>-detail.jpg`.
 */

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

export type CategorySlug = "bluzy" | "spodnie";

export interface Subcategory {
  slug: string;
  name: string;
  description: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Liczba pojedyncza używana w opisach („bluza”, „spodnie”). */
  singular: string;
  description: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    slug: "bluzy",
    name: "Bluzy",
    singular: "bluza",
    description: "Ciężka dzianina pętelkowa, obniżone ramiona i proste kolory. Hoodie, zipy i krótkie bluzy boxy.",
    subcategories: [
      { slug: "oversize", name: "Oversize", description: "Szeroki korpus i obniżona linia ramion. Bierz swój zwykły rozmiar – luz jest wpisany w krój." },
      { slug: "z-kapturem", name: "Z kapturem", description: "Hoodie i zipy z podwójnym kapturem, ściągaczem i kieszenią kangurką." },
      { slug: "bez-kaptura", name: "Bez kaptura", description: "Krótkie, pudełkowe bluzy z okrągłym dekoltem i ściągaczem u dołu." },
      { slug: "rozpinane", name: "Rozpinane", description: "Zip hoodie na metalowym zamku dwukierunkowym – do noszenia otwarte lub zapięte." },
      { slug: "z-nadrukami", name: "Z nadrukami", description: "Znak buta w dwóch skalach: duży nadruk na piersi albo mały znak przy sercu." },
    ],
  },
  {
    slug: "spodnie",
    name: "Spodnie",
    singular: "spodnie",
    description: "Cargo, denim i dresy w szerokich krojach. Wysoki stan, długa nogawka, która układa się na bucie.",
    subcategories: [
      { slug: "baggy", name: "Baggy", description: "Luźne udo i szeroka nogawka na całej długości. Najlepiej z grubą podeszwą." },
      { slug: "cargo", name: "Cargo", description: "Kieszenie miechowe na udach, mocna bawełna i regulacja w pasie lub przy nogawce." },
      { slug: "dresowe", name: "Dresowe", description: "Dzianina pętelkowa, gumka w pasie i sznurek. Do kompletu z bluzami z tej samej dzianiny." },
      { slug: "straight-fit", name: "Straight fit", description: "Prosta nogawka od biodra do kostki. Spokojna sylwetka, która pasuje do wszystkiego." },
      { slug: "szeroka-nogawka", name: "Szeroka nogawka", description: "Nogawka rozszerzona od uda, która zakrywa but. Najszersze kroje w sklepie." },
    ],
  },
];

export const COLORS = {
  black: { name: "Czarny", hex: "#141414" },
  "washed-black": { name: "Sprany czarny", hex: "#2f2f30" },
  graphite: { name: "Grafitowy", hex: "#3a3a3a" },
  grey: { name: "Szary", hex: "#8f8f8c" },
  "grey-marl": { name: "Szary melanż", hex: "#b4b4b2" },
  "light-grey": { name: "Jasnoszary", hex: "#c9c9c4" },
  white: { name: "Biały", hex: "#f4f4f2" },
  ecru: { name: "Ecru", hex: "#ddd6c6" },
  stone: { name: "Kamienny", hex: "#b6b1a6" },
  olive: { name: "Oliwkowy", hex: "#55573f" },
  mocha: { name: "Mokka", hex: "#594a3e" },
  navy: { name: "Granatowy", hex: "#2b3140" },
} as const;
export type ColorId = keyof typeof COLORS;

export type Fit = "oversize" | "boxy" | "relaxed" | "baggy" | "straight" | "wide";

export const FITS: Record<Fit, { name: string; description: string }> = {
  oversize: { name: "Oversize", description: "Obniżone ramiona i szeroki korpus. Weź swój zwykły rozmiar; o rozmiar mniej, jeśli wolisz bliżej ciała." },
  boxy: { name: "Boxy", description: "Krótki, szeroki, pudełkowy krój. Długość do pasa, szerokie rękawy do łokcia." },
  relaxed: { name: "Relaxed", description: "Swobodny, ale nie przeskalowany krój. Zwykły rozmiar daje klasyczny luz." },
  baggy: { name: "Baggy", description: "Luźne udo i szeroka nogawka na całej długości. Wysoki stan." },
  straight: { name: "Straight", description: "Prosta nogawka od biodra do kostki, średni stan." },
  wide: { name: "Szeroka nogawka", description: "Nogawka rozszerzona od uda, zakrywa but. Wysoki stan na gumce." },
};

export interface Drop {
  id: string;
  name: string;
  /** Data publikacji (YYYY-MM-DD). */
  date: string;
}

/** Kolejne wydania kolekcji. „Nowości” to produkty z najnowszego dropu. */
export const drops: Drop[] = [
  { id: "2026-08", name: "Drop sierpień 2026", date: "2026-08-21" },
  { id: "2026-09", name: "Drop wrzesień 2026", date: "2026-09-18" },
  { id: "2026-10", name: "Drop październik 2026", date: "2026-10-16" },
];

export interface Collection {
  slug: string;
  name: string;
  description: string;
  /** Produkt, którego zdjęcie otwiera kolekcję. */
  coverImage: string;
}

export const collections: Collection[] = [
  {
    slug: "mono",
    name: "Mono",
    description: "Czerń, grafit, szarości i biel. Rzeczy, które łączą się ze sobą bez zastanawiania.",
    coverImage: "jeans-baggy-black",
  },
  {
    slug: "sole",
    name: "Sole",
    description: "Wszystko ze znakiem buta – od dużego nadruku na piersi po mały znak na nogawce.",
    coverImage: "sole-hoodie-black",
  },
  {
    slug: "earth",
    name: "Earth",
    description: "Oliwka, mokka, kamień i ecru. Ciepłe, przygaszone kolory do zestawiania z czernią.",
    coverImage: "earth-hoodie-olive",
  },
];

/** Stan magazynowy w kolejności rozmiarów XS, S, M, L, XL, XXL. */
type StockRow = [number, number, number, number, number, number];

export interface ColorVariant {
  color: ColorId;
  /** Nazwa pliku zdjęcia bez rozszerzenia (public/images/products). */
  image: string;
  stock: StockRow;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Rodzaj produktu, np. „Bluza z kapturem”. */
  kind: string;
  category: CategorySlug;
  /** Podkategorie (slug), w których produkt się pojawia. */
  styles: string[];
  collections: string[];
  drop: string;
  fit: Fit;
  material: string;
  description: string;
  details: string[];
  care: string;
  /** Cena w groszach. */
  price: number;
  /** Cena przed obniżką – wypełniaj wyłącznie przy rzeczywistej promocji. */
  compareAtPrice?: number;
  variants: ColorVariant[];
}

const FLEECE = "80% bawełna, 20% poliester; dzianina pętelkowa 420 g/m²";
const FLEECE_LIGHT = "100% bawełna; dzianina pętelkowa 360 g/m²";
const TWILL = "100% bawełna; diagonal 280 g/m²";
const RIPSTOP = "100% bawełna; ripstop 250 g/m²";
const DENIM = "100% bawełna; denim 13,5 oz";
const CARE_FLEECE = "Pranie w 30°C na lewej stronie, bez suszarki bębnowej. Nie prasuj nadruku.";
const CARE_WOVEN = "Pranie w 30°C na lewej stronie z podobnymi kolorami. Suszenie na wieszaku.";

export const products: Product[] = [
  // ------------------------------------------------------------------ BLUZY
  {
    id: "B01",
    slug: "core-hoodie",
    name: "CORE Hoodie",
    kind: "Bluza z kapturem",
    category: "bluzy",
    styles: ["z-kapturem", "oversize"],
    collections: ["mono"],
    drop: "2026-08",
    fit: "oversize",
    material: FLEECE,
    description: "Podstawa szafy: gruba pętelka, podwójny kaptur bez metalowych końcówek sznurka i kangurka szyta z jednego kawałka.",
    details: ["Podwójny kaptur", "Kieszeń kangurka", "Obniżona linia ramion", "Ściągacze 2×2 przy rękawach i u dołu"],
    care: CARE_FLEECE,
    price: 28900,
    variants: [
      { color: "black", image: "core-hoodie-black", stock: [3, 8, 12, 10, 6, 2] },
      { color: "graphite", image: "core-hoodie-graphite", stock: [0, 4, 7, 6, 3, 0] },
    ],
  },
  {
    id: "B02",
    slug: "ash-hoodie",
    name: "ASH Hoodie",
    kind: "Bluza z kapturem",
    category: "bluzy",
    styles: ["z-kapturem", "oversize"],
    collections: ["mono"],
    drop: "2026-09",
    fit: "oversize",
    material: FLEECE,
    description: "Ten sam krój co CORE w jasnej szarości. Dobrze wygląda z czarnymi cargo i szerokim denimem.",
    details: ["Podwójny kaptur", "Kieszeń kangurka", "Obniżona linia ramion", "Ściągacze 2×2"],
    care: CARE_FLEECE,
    price: 28900,
    variants: [{ color: "grey", image: "core-hoodie-grey", stock: [2, 5, 9, 9, 4, 1] }],
  },
  {
    id: "B03",
    slug: "sole-print-hoodie",
    name: "SOLE Print Hoodie",
    kind: "Bluza z kapturem z nadrukiem",
    category: "bluzy",
    styles: ["z-kapturem", "oversize", "z-nadrukami"],
    collections: ["sole"],
    drop: "2026-10",
    fit: "oversize",
    material: FLEECE,
    description: "Duży znak buta na piersi, drukowany sitodrukiem w trzech kolorach. Na czarnej i szarej bluzie znak jest odwrócony – białe panele, czarne przeszycia.",
    details: ["Sitodruk na piersi, ok. 28 cm szerokości", "Podwójny kaptur", "Kieszeń kangurka", "Obniżona linia ramion"],
    care: CARE_FLEECE,
    price: 32900,
    variants: [
      { color: "black", image: "sole-hoodie-black", stock: [2, 6, 10, 8, 5, 2] },
      { color: "ecru", image: "sole-hoodie-ecru", stock: [1, 4, 6, 5, 2, 0] },
      { color: "grey", image: "sole-hoodie-grey", stock: [0, 3, 5, 4, 2, 1] },
    ],
  },
  {
    id: "B04",
    slug: "mark-hoodie",
    name: "MARK Hoodie",
    kind: "Bluza z kapturem z nadrukiem",
    category: "bluzy",
    styles: ["z-kapturem", "z-nadrukami"],
    collections: ["sole", "mono"],
    drop: "2026-09",
    fit: "relaxed",
    material: FLEECE_LIGHT,
    description: "Biała bluza z małym znakiem buta na środku piersi. Lżejsza dzianina, klasyczny luz bez przeskalowania.",
    details: ["Znak buta na piersi, ok. 9 cm", "Kaptur ze sznurkiem", "Kieszeń kangurka", "Ściągacze 1×1"],
    care: CARE_FLEECE,
    price: 29900,
    variants: [{ color: "white", image: "mark-hoodie-white", stock: [3, 7, 9, 8, 4, 2] }],
  },
  {
    id: "B05",
    slug: "track-zip-hoodie",
    name: "TRACK Zip Hoodie",
    kind: "Bluza rozpinana z kapturem",
    category: "bluzy",
    styles: ["rozpinane", "z-kapturem", "oversize"],
    collections: ["mono"],
    drop: "2026-08",
    fit: "oversize",
    material: FLEECE,
    description: "Zip na metalowym zamku dwukierunkowym. Kieszenie boczne z ukrytym szwem i wysoki kaptur, który stoi.",
    details: ["Zamek dwukierunkowy", "Dwie kieszenie boczne", "Podwójny kaptur", "Obniżona linia ramion"],
    care: CARE_FLEECE,
    price: 31900,
    variants: [
      { color: "black", image: "track-zip-black", stock: [2, 7, 11, 9, 6, 3] },
      { color: "graphite", image: "track-zip-graphite", stock: [1, 3, 6, 6, 2, 0] },
    ],
  },
  {
    id: "B06",
    slug: "field-zip-hoodie",
    name: "FIELD Zip Hoodie",
    kind: "Bluza rozpinana z kapturem",
    category: "bluzy",
    styles: ["rozpinane", "z-kapturem"],
    collections: ["earth"],
    drop: "2026-09",
    fit: "relaxed",
    material: FLEECE,
    description: "Rozpinana bluza w przygaszonej oliwce i mokce. Mniej luzu niż TRACK – dobrze leży pod kurtką.",
    details: ["Zamek dwukierunkowy", "Dwie kieszenie boczne", "Podwójny kaptur", "Ściągacze 2×2"],
    care: CARE_FLEECE,
    price: 31900,
    variants: [
      { color: "olive", image: "field-zip-olive", stock: [0, 4, 6, 5, 3, 1] },
      { color: "mocha", image: "field-zip-mocha", stock: [1, 3, 5, 4, 2, 0] },
    ],
  },
  {
    id: "B07",
    slug: "sole-boxy-crew",
    name: "SOLE Boxy Crew",
    kind: "Bluza bez kaptura z krótkim rękawem",
    category: "bluzy",
    styles: ["bez-kaptura", "z-nadrukami", "oversize"],
    collections: ["sole"],
    drop: "2026-10",
    fit: "boxy",
    material: FLEECE,
    description: "Krótka, pudełkowa bluza z rękawem do łokcia i dużym znakiem buta. Na czarnej wersji nadruk jest odwrócony.",
    details: ["Sitodruk na piersi, ok. 30 cm", "Okrągły dekolt ze ściągaczem", "Rękaw do łokcia", "Długość do pasa"],
    care: CARE_FLEECE,
    price: 24900,
    variants: [
      { color: "black", image: "boxy-sole-black", stock: [3, 6, 8, 7, 4, 1] },
      { color: "ecru", image: "boxy-sole-ecru", stock: [1, 3, 5, 4, 2, 0] },
    ],
  },
  {
    id: "B08",
    slug: "earth-hoodie",
    name: "EARTH Hoodie",
    kind: "Bluza z kapturem",
    category: "bluzy",
    styles: ["z-kapturem", "oversize"],
    collections: ["earth"],
    drop: "2026-09",
    fit: "oversize",
    material: FLEECE,
    description: "Krój CORE w oliwce i mokce. Ta sama gruba pętelka i podwójny kaptur.",
    details: ["Kolor jednolity także na ściągaczach", "Podwójny kaptur", "Kieszeń kangurka", "Obniżona linia ramion"],
    care: CARE_FLEECE,
    price: 28900,
    variants: [
      { color: "olive", image: "earth-hoodie-olive", stock: [1, 5, 7, 6, 3, 1] },
      { color: "mocha", image: "earth-hoodie-mocha", stock: [0, 2, 6, 5, 3, 0] },
    ],
  },
  {
    id: "B09",
    slug: "blank-hoodie",
    name: "BLANK Hoodie",
    kind: "Bluza z kapturem",
    category: "bluzy",
    styles: ["z-kapturem"],
    collections: ["earth"],
    drop: "2026-08",
    fit: "relaxed",
    material: FLEECE_LIGHT,
    description: "Jasna bluza bez żadnych oznaczeń. Lżejsza dzianina na wczesną jesień i warstwy.",
    details: ["Bez nadruków i metek na zewnątrz", "Kaptur ze sznurkiem", "Kieszeń kangurka", "Ściągacze 1×1"],
    care: CARE_FLEECE,
    price: 26900,
    variants: [
      { color: "ecru", image: "blank-hoodie-ecru", stock: [2, 5, 8, 6, 3, 1] },
      { color: "stone", image: "blank-hoodie-stone", stock: [0, 4, 5, 5, 2, 0] },
    ],
  },
  {
    id: "B10",
    slug: "mini-sole-hoodie",
    name: "MINI SOLE Hoodie",
    kind: "Bluza z kapturem z nadrukiem",
    category: "bluzy",
    styles: ["z-kapturem", "z-nadrukami"],
    collections: ["sole"],
    drop: "2026-10",
    fit: "relaxed",
    material: FLEECE,
    description: "Mały znak buta po lewej stronie piersi. Spokojniejsza wersja SOLE na co dzień.",
    details: ["Nadruk przy sercu, ok. 8 cm", "Podwójny kaptur", "Kieszeń kangurka", "Ściągacze 2×2"],
    care: CARE_FLEECE,
    price: 29900,
    variants: [
      { color: "black", image: "mini-hoodie-black", stock: [2, 6, 9, 9, 5, 2] },
      { color: "ecru", image: "mini-hoodie-ecru", stock: [1, 4, 6, 4, 2, 1] },
    ],
  },
  {
    id: "B11",
    slug: "mini-sole-zip",
    name: "MINI SOLE Zip",
    kind: "Bluza rozpinana z nadrukiem",
    category: "bluzy",
    styles: ["rozpinane", "z-kapturem", "z-nadrukami"],
    collections: ["sole"],
    drop: "2026-10",
    fit: "oversize",
    material: FLEECE,
    description: "TRACK Zip z małym znakiem buta przy zamku. Ten sam ciężar dzianiny i ten sam zamek dwukierunkowy.",
    details: ["Nadruk przy sercu, ok. 8 cm", "Zamek dwukierunkowy", "Dwie kieszenie boczne", "Podwójny kaptur"],
    care: CARE_FLEECE,
    price: 33900,
    variants: [
      { color: "black", image: "mini-zip-black", stock: [1, 5, 8, 7, 4, 1] },
      { color: "ecru", image: "mini-zip-ecru", stock: [0, 2, 4, 4, 1, 0] },
    ],
  },
  {
    id: "B12",
    slug: "earth-boxy-crew",
    name: "EARTH Boxy Crew",
    kind: "Bluza bez kaptura z krótkim rękawem",
    category: "bluzy",
    styles: ["bez-kaptura", "z-nadrukami", "oversize"],
    collections: ["earth", "sole"],
    drop: "2026-09",
    fit: "boxy",
    material: FLEECE,
    description: "SOLE Boxy Crew w oliwce i mokce. Nadruk zostaje biało-szary, panele buta przyjmują kolor dzianiny.",
    details: ["Sitodruk na piersi, ok. 30 cm", "Okrągły dekolt", "Rękaw do łokcia", "Długość do pasa"],
    care: CARE_FLEECE,
    price: 24900,
    variants: [
      { color: "olive", image: "boxy-earth-olive", stock: [1, 3, 5, 4, 2, 0] },
      { color: "mocha", image: "boxy-earth-mocha", stock: [0, 3, 4, 4, 1, 1] },
    ],
  },
  {
    id: "B13",
    slug: "tonal-hoodie",
    name: "TONAL Hoodie",
    kind: "Bluza z kapturem z nadrukiem",
    category: "bluzy",
    styles: ["z-kapturem", "oversize", "z-nadrukami"],
    collections: ["mono", "sole"],
    drop: "2026-10",
    fit: "oversize",
    material: FLEECE,
    description: "Grafitowa bluza z dużym znakiem buta w odcieniach szarości. Nadruk widać z bliska, z daleka zlewa się z dzianiną.",
    details: ["Tonalny sitodruk, ok. 28 cm", "Podwójny kaptur", "Kieszeń kangurka", "Obniżona linia ramion"],
    care: CARE_FLEECE,
    price: 32900,
    variants: [{ color: "graphite", image: "tonal-hoodie-graphite", stock: [1, 4, 7, 6, 3, 1] }],
  },
  {
    id: "B14",
    slug: "stone-zip-hoodie",
    name: "STONE Zip Hoodie",
    kind: "Bluza rozpinana z kapturem",
    category: "bluzy",
    styles: ["rozpinane", "z-kapturem", "oversize"],
    collections: ["earth"],
    drop: "2026-08",
    fit: "oversize",
    material: FLEECE,
    description: "Zip w jasnych, kamiennych odcieniach. Krój TRACK, czyli szeroko i z wysokim kapturem.",
    details: ["Zamek dwukierunkowy", "Dwie kieszenie boczne", "Podwójny kaptur", "Obniżona linia ramion"],
    care: CARE_FLEECE,
    price: 30900,
    variants: [
      { color: "stone", image: "stone-zip-stone", stock: [1, 4, 6, 5, 2, 0] },
      { color: "grey", image: "stone-zip-grey", stock: [0, 3, 5, 5, 3, 1] },
    ],
  },
  {
    id: "B15",
    slug: "ash-boxy-crew",
    name: "ASH Boxy Crew",
    kind: "Bluza bez kaptura z krótkim rękawem",
    category: "bluzy",
    styles: ["bez-kaptura", "z-nadrukami", "oversize"],
    collections: ["mono", "sole"],
    drop: "2026-08",
    fit: "boxy",
    material: FLEECE,
    description: "Pudełkowa bluza z dużym znakiem buta w szarości i grafitowej wersji.",
    details: ["Sitodruk na piersi, ok. 30 cm", "Okrągły dekolt", "Rękaw do łokcia", "Długość do pasa"],
    care: CARE_FLEECE,
    price: 24900,
    variants: [
      { color: "grey", image: "boxy-grey-grey", stock: [2, 4, 6, 5, 2, 1] },
      { color: "graphite", image: "boxy-grey-graphite", stock: [1, 3, 5, 3, 2, 0] },
    ],
  },
  {
    id: "B16",
    slug: "deep-hoodie",
    name: "DEEP Hoodie",
    kind: "Bluza z kapturem",
    category: "bluzy",
    styles: ["z-kapturem", "oversize"],
    collections: [],
    drop: "2026-09",
    fit: "oversize",
    material: FLEECE,
    description: "Głęboki granat zamiast czerni. Krój CORE z tą samą grubą pętelką.",
    details: ["Podwójny kaptur", "Kieszeń kangurka", "Obniżona linia ramion", "Ściągacze 2×2"],
    care: CARE_FLEECE,
    price: 28900,
    variants: [{ color: "navy", image: "wash-hoodie-navy", stock: [1, 3, 6, 6, 3, 0] }],
  },
  {
    id: "B17",
    slug: "tonal-zip-hoodie",
    name: "TONAL Zip Hoodie",
    kind: "Bluza rozpinana z nadrukiem",
    category: "bluzy",
    styles: ["rozpinane", "z-kapturem", "z-nadrukami"],
    collections: ["mono"],
    drop: "2026-10",
    fit: "oversize",
    material: FLEECE,
    description: "Grafitowy zip z małym, tonalnym znakiem buta przy zamku.",
    details: ["Tonalny nadruk przy sercu", "Zamek dwukierunkowy", "Dwie kieszenie boczne", "Podwójny kaptur"],
    care: CARE_FLEECE,
    price: 32900,
    variants: [{ color: "graphite", image: "tonal-zip-graphite", stock: [0, 3, 5, 5, 2, 1] }],
  },

  // ---------------------------------------------------------------- SPODNIE
  {
    id: "P01",
    slug: "parachute-cargo",
    name: "PARACHUTE Cargo",
    kind: "Spodnie cargo baggy",
    category: "spodnie",
    styles: ["cargo", "baggy"],
    collections: ["mono"],
    drop: "2026-08",
    fit: "baggy",
    material: RIPSTOP,
    description: "Szerokie cargo z regulacją nogawki na stoperach. Dół można ściągnąć nad butem albo zostawić prosto.",
    details: ["Kieszenie miechowe na udach", "Stopery przy nogawce", "Pas z guzikiem i rozporkiem na zamek", "Pięć kieszeni"],
    care: CARE_WOVEN,
    price: 34900,
    variants: [
      { color: "black", image: "cargo-baggy-black", stock: [2, 7, 10, 9, 5, 2] },
      { color: "olive", image: "cargo-baggy-olive", stock: [1, 4, 6, 6, 3, 0] },
    ],
  },
  {
    id: "P02",
    slug: "parachute-cargo-earth",
    name: "PARACHUTE Cargo Earth",
    kind: "Spodnie cargo baggy",
    category: "spodnie",
    styles: ["cargo", "baggy"],
    collections: ["earth"],
    drop: "2026-09",
    fit: "baggy",
    material: RIPSTOP,
    description: "PARACHUTE w kamieniu i mokce. Jasna wersja do ciemnych bluz, ciemna do ecru.",
    details: ["Kieszenie miechowe na udach", "Stopery przy nogawce", "Pas z guzikiem", "Pięć kieszeni"],
    care: CARE_WOVEN,
    price: 34900,
    variants: [
      { color: "stone", image: "cargo-earth-stone", stock: [1, 4, 5, 5, 2, 1] },
      { color: "mocha", image: "cargo-earth-mocha", stock: [0, 3, 5, 4, 2, 0] },
    ],
  },
  {
    id: "P03",
    slug: "parachute-cargo-night",
    name: "PARACHUTE Cargo Night",
    kind: "Spodnie cargo baggy",
    category: "spodnie",
    styles: ["cargo", "baggy"],
    collections: ["mono"],
    drop: "2026-10",
    fit: "baggy",
    material: RIPSTOP,
    description: "Granat i grafit – ciemne kolory, które nie są czernią. Krój i detale jak w PARACHUTE.",
    details: ["Kieszenie miechowe na udach", "Stopery przy nogawce", "Pas z guzikiem", "Pięć kieszeni"],
    care: CARE_WOVEN,
    price: 34900,
    variants: [
      { color: "navy", image: "cargo-navy-navy", stock: [1, 3, 6, 5, 3, 1] },
      { color: "graphite", image: "cargo-navy-graphite", stock: [0, 4, 6, 5, 2, 0] },
    ],
  },
  {
    id: "P04",
    slug: "utility-cargo-straight",
    name: "UTILITY Cargo Straight",
    kind: "Spodnie cargo straight fit",
    category: "spodnie",
    styles: ["cargo", "straight-fit"],
    collections: ["mono"],
    drop: "2026-08",
    fit: "straight",
    material: TWILL,
    description: "Prosta nogawka i płaskie kieszenie na udach. Cargo, które można założyć także do pracy.",
    details: ["Płaskie kieszenie na udach z klapką", "Prosta nogawka", "Pas z guzikiem", "Szlufki pod szeroki pasek"],
    care: CARE_WOVEN,
    price: 32900,
    variants: [
      { color: "light-grey", image: "cargo-straight-grey", stock: [2, 5, 8, 7, 4, 1] },
      { color: "black", image: "cargo-straight-black", stock: [3, 6, 9, 8, 5, 2] },
    ],
  },
  {
    id: "P05",
    slug: "utility-cargo-night",
    name: "UTILITY Cargo Night",
    kind: "Spodnie cargo straight fit",
    category: "spodnie",
    styles: ["cargo", "straight-fit"],
    collections: ["mono"],
    drop: "2026-09",
    fit: "straight",
    material: TWILL,
    description: "UTILITY w grafitowym i granatowym diagonalu.",
    details: ["Płaskie kieszenie na udach z klapką", "Prosta nogawka", "Pas z guzikiem", "Szlufki pod szeroki pasek"],
    care: CARE_WOVEN,
    price: 32900,
    variants: [
      { color: "graphite", image: "cargo-straight-graphite", stock: [1, 4, 6, 6, 3, 1] },
      { color: "navy", image: "cargo-straight-navy", stock: [0, 3, 5, 4, 2, 0] },
    ],
  },
  {
    id: "P06",
    slug: "field-cargo",
    name: "FIELD Cargo",
    kind: "Spodnie cargo straight fit",
    category: "spodnie",
    styles: ["cargo", "straight-fit"],
    collections: ["earth"],
    drop: "2026-09",
    fit: "straight",
    material: TWILL,
    description: "Prosty krój cargo w oliwce i ecru. Pasuje do FIELD Zip Hoodie z tej samej palety.",
    details: ["Płaskie kieszenie na udach z klapką", "Prosta nogawka", "Pas z guzikiem", "Pięć kieszeni"],
    care: CARE_WOVEN,
    price: 32900,
    variants: [
      { color: "olive", image: "cargo-field-olive", stock: [1, 4, 7, 6, 3, 0] },
      { color: "ecru", image: "cargo-field-ecru", stock: [1, 3, 5, 4, 2, 1] },
    ],
  },
  {
    id: "P07",
    slug: "core-sweatpants",
    name: "CORE Sweatpants",
    kind: "Spodnie dresowe",
    category: "spodnie",
    styles: ["dresowe", "straight-fit"],
    collections: ["mono"],
    drop: "2026-08",
    fit: "straight",
    material: FLEECE,
    description: "Dresy z tej samej pętelki co CORE Hoodie. Prosta nogawka bez ściągacza na dole.",
    details: ["Gumka w pasie i płaski sznurek", "Kieszenie boczne i kieszeń z tyłu", "Prosta nogawka", "Dzianina 420 g/m²"],
    care: CARE_FLEECE,
    price: 22900,
    variants: [
      { color: "grey-marl", image: "core-sweats-grey", stock: [3, 7, 10, 9, 5, 2] },
      { color: "black", image: "core-sweats-black", stock: [3, 8, 12, 10, 6, 3] },
      { color: "ecru", image: "core-sweats-ecru", stock: [1, 3, 5, 4, 2, 0] },
    ],
  },
  {
    id: "P08",
    slug: "mini-sole-sweatpants",
    name: "MINI SOLE Sweatpants",
    kind: "Spodnie dresowe z nadrukiem",
    category: "spodnie",
    styles: ["dresowe", "straight-fit"],
    collections: ["sole"],
    drop: "2026-10",
    fit: "straight",
    material: FLEECE,
    description: "CORE Sweatpants z małym znakiem buta na udzie. Do kompletu z MINI SOLE Hoodie.",
    details: ["Nadruk na udzie, ok. 7 cm", "Gumka w pasie i sznurek", "Kieszenie boczne", "Prosta nogawka"],
    care: CARE_FLEECE,
    price: 24900,
    variants: [
      { color: "grey-marl", image: "mini-sweats-grey", stock: [2, 5, 7, 7, 3, 1] },
      { color: "black", image: "mini-sweats-black", stock: [2, 6, 9, 8, 4, 2] },
    ],
  },
  {
    id: "P09",
    slug: "earth-sweatpants",
    name: "EARTH Sweatpants",
    kind: "Spodnie dresowe",
    category: "spodnie",
    styles: ["dresowe", "straight-fit"],
    collections: ["earth"],
    drop: "2026-09",
    fit: "straight",
    material: FLEECE,
    description: "Dresy w oliwce i mokce – w tych samych kolorach co EARTH Hoodie.",
    details: ["Dzianina 420 g/m²", "Gumka w pasie i sznurek", "Kieszenie boczne", "Prosta nogawka"],
    care: CARE_FLEECE,
    price: 22900,
    variants: [
      { color: "olive", image: "earth-sweats-olive", stock: [1, 4, 6, 5, 3, 0] },
      { color: "mocha", image: "earth-sweats-mocha", stock: [0, 3, 5, 5, 2, 1] },
    ],
  },
  {
    id: "P10",
    slug: "wash-baggy-jeans",
    name: "WASH Baggy Jeans",
    kind: "Jeansy baggy",
    category: "spodnie",
    styles: ["baggy", "szeroka-nogawka"],
    collections: ["mono"],
    drop: "2026-09",
    fit: "baggy",
    material: DENIM,
    description: "Sprany czarny denim z przetarciami na udach. Szeroko od biodra po kostkę.",
    details: ["Pięć kieszeni", "Rozporek na guziki", "Ręczne przetarcia", "Długość nogawki 82 cm w rozmiarze M"],
    care: CARE_WOVEN,
    price: 37900,
    variants: [{ color: "washed-black", image: "jeans-baggy-black", stock: [2, 5, 8, 8, 4, 1] }],
  },
  {
    id: "P11",
    slug: "grey-wash-jeans",
    name: "GREY WASH Jeans",
    kind: "Jeansy baggy",
    category: "spodnie",
    styles: ["baggy", "szeroka-nogawka"],
    collections: ["mono"],
    drop: "2026-10",
    fit: "baggy",
    material: DENIM,
    description: "Ten sam krój co WASH w jasnoszarym wybarwieniu.",
    details: ["Pięć kieszeni", "Rozporek na guziki", "Ręczne przetarcia", "Długość nogawki 82 cm w rozmiarze M"],
    care: CARE_WOVEN,
    price: 37900,
    variants: [{ color: "grey", image: "jeans-baggy-grey", stock: [1, 4, 6, 6, 3, 0] }],
  },
  {
    id: "P12",
    slug: "raw-baggy-jeans",
    name: "RAW Baggy Jeans",
    kind: "Jeansy baggy",
    category: "spodnie",
    styles: ["baggy", "szeroka-nogawka"],
    collections: ["earth"],
    drop: "2026-10",
    fit: "baggy",
    material: DENIM,
    description: "Szeroki denim w ecru i mokce. Jasna wersja z delikatnym wytarciem na kolanach.",
    details: ["Pięć kieszeni", "Rozporek na guziki", "Wytarcia na kolanach", "Długość nogawki 82 cm w rozmiarze M"],
    care: CARE_WOVEN,
    price: 37900,
    variants: [
      { color: "ecru", image: "jeans-ecru-ecru", stock: [1, 3, 5, 5, 2, 1] },
      { color: "mocha", image: "jeans-ecru-mocha", stock: [0, 2, 4, 4, 2, 0] },
    ],
  },
  {
    id: "P13",
    slug: "sole-wide-pants",
    name: "SOLE Wide Pants",
    kind: "Spodnie dresowe z szeroką nogawką",
    category: "spodnie",
    styles: ["dresowe", "szeroka-nogawka"],
    collections: ["sole", "mono"],
    drop: "2026-10",
    fit: "wide",
    material: FLEECE_LIGHT,
    description: "Najszersze spodnie w sklepie: wysoki stan na gumce i nogawka, która zakrywa but. Mały znak buta na udzie.",
    details: ["Nadruk na udzie, ok. 7 cm", "Szeroka gumka w pasie", "Kieszenie boczne", "Nogawka bez ściągacza"],
    care: CARE_FLEECE,
    price: 26900,
    variants: [
      { color: "black", image: "wide-sole-black", stock: [3, 6, 9, 8, 4, 2] },
      { color: "white", image: "wide-sole-white", stock: [2, 4, 6, 5, 2, 0] },
    ],
  },
  {
    id: "P14",
    slug: "wide-tone-pants",
    name: "WIDE Tone Pants",
    kind: "Spodnie dresowe z szeroką nogawką",
    category: "spodnie",
    styles: ["dresowe", "szeroka-nogawka"],
    collections: ["earth"],
    drop: "2026-10",
    fit: "wide",
    material: FLEECE_LIGHT,
    description: "SOLE Wide Pants w trzech przygaszonych kolorach z tonalnym znakiem na udzie.",
    details: ["Tonalny nadruk na udzie", "Szeroka gumka w pasie", "Kieszenie boczne", "Nogawka bez ściągacza"],
    care: CARE_FLEECE,
    price: 26900,
    variants: [
      { color: "grey", image: "wide-tone-grey", stock: [1, 4, 6, 5, 3, 1] },
      { color: "stone", image: "wide-tone-stone", stock: [1, 3, 5, 4, 2, 0] },
      { color: "olive", image: "wide-tone-olive", stock: [0, 3, 4, 4, 2, 0] },
    ],
  },
];

/* --------------------------------------------------------------------------------------------
 * Tabele rozmiarów (przykładowe wymiary w cm, mierzone na płasko)
 * ------------------------------------------------------------------------------------------ */

export interface SizeChart {
  columns: string[];
  rows: { size: Size; values: number[] }[];
  note: string;
}

const chart = (columns: string[], values: number[][], note: string): SizeChart => ({
  columns,
  rows: SIZES.map((size, i) => ({ size, values: values.map((column) => column[i]) })),
  note,
});

const TOP_COLUMNS = ["Szerokość klatki", "Długość", "Długość rękawa"];
const BOTTOM_COLUMNS = ["Obwód pasa", "Długość wewnętrzna nogawki", "Szerokość nogawki u dołu"];
const TOP_NOTE = "Szerokość klatki mierzona na płasko 2 cm pod pachą, długość od najwyższego punktu ramienia, rękaw od szwu ramienia.";
const BOTTOM_NOTE = "Obwód pasa w spoczynku (gumka/guzik zapięty), szerokość nogawki mierzona na płasko przy dolnej krawędzi.";

export const SIZE_CHARTS: Record<Fit, SizeChart> = {
  oversize: chart(TOP_COLUMNS, [[60, 63, 66, 69, 72, 75], [68, 70, 72, 74, 76, 78], [55, 56, 57, 58, 59, 60]], TOP_NOTE),
  relaxed: chart(TOP_COLUMNS, [[53, 56, 59, 62, 65, 68], [66, 68, 70, 72, 74, 76], [61, 62, 63, 64, 65, 66]], TOP_NOTE),
  boxy: chart(TOP_COLUMNS, [[61, 64, 67, 70, 73, 76], [59, 61, 63, 65, 67, 69], [24, 25, 26, 27, 28, 29]], TOP_NOTE),
  baggy: chart(BOTTOM_COLUMNS, [[70, 74, 78, 84, 90, 96], [78, 80, 82, 83, 84, 85], [25, 26, 27, 28, 29, 30]], BOTTOM_NOTE),
  straight: chart(BOTTOM_COLUMNS, [[70, 74, 78, 84, 90, 96], [76, 78, 80, 81, 82, 83], [20, 21, 22, 23, 24, 25]], BOTTOM_NOTE),
  wide: chart(BOTTOM_COLUMNS, [[66, 70, 74, 80, 86, 92], [78, 80, 82, 83, 84, 85], [31, 32, 33, 34, 35, 36]], BOTTOM_NOTE),
};
