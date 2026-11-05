/**
 * KARTA MENU – koncepcja 03 „Smash”. Ceny w groszach (2499 = 24,99 zł).
 * Zdjęcia leżą w `public/images/` (format 1136×1408 lub 1456×1088, tło musztardowe).
 */

export type CategoryId = "klasyczne" | "premium" | "ostre" | "zestawy" | "dodatki" | "napoje";

export interface Photo {
  src: string;
  alt: string;
  w: number;
  h: number;
}

export interface Category {
  id: CategoryId;
  label: string;
  /** Krótka nazwa na przycisku kategorii (telefon). */
  short: string;
  /** Jedno zdanie o tym, czym kategoria się wyróżnia. */
  note: string;
  /** Wspólne zdjęcie dla kategorii, w których nie każda pozycja ma własne. */
  photo?: Photo;
}

export interface MenuItem {
  id: string;
  category: CategoryId;
  name: string;
  price: number;
  /** Cena regularna, gdy pozycja jest w promocji. */
  regular?: number;
  description: string;
  photo?: Photo;
  /** 1–3, tylko dla pozycji ostrych */
  heat?: 1 | 2 | 3;
  tag?: string;
}

const P = (src: string, alt: string, w = 1136, h = 1408): Photo => ({ src: `/images/${src}.jpg`, alt, w, h });

export const CATEGORIES: Category[] = [
  { id: "klasyczne", label: "Burgery klasyczne", short: "Klasyczne", note: "Jeden lub dwa kotlety smash, cheddar i warzywa krojone na zmianie." },
  { id: "premium", label: "Burgery premium", short: "Premium", note: "Wyższe stosy, dodatki z własnej kuchni i sosy robione w małych partiach." },
  { id: "ostre", label: "Burgery ostre", short: "Ostre", note: "Ostrość od 1 do 3. Trójkę zamawiaj razem z lemoniadą." },
  {
    id: "zestawy",
    label: "Zestawy",
    short: "Zestawy",
    note: "Burger, frytki i napój w jednej cenie. Napój 0,4 l do wyboru.",
    photo: P("zestawy", "Zestaw: smash cheeseburger, grube frytki w białym kartoniku i cola w papierowym kubku na musztardowym tle", 1456, 1088),
  },
  { id: "dodatki", label: "Frytki i dodatki", short: "Dodatki", note: "Frytki kroimy z całych ziemniaków i smażymy dwa razy." },
  {
    id: "napoje",
    label: "Napoje",
    short: "Napoje",
    note: "Lemoniadę i shake’i robimy na miejscu, bez gotowych mieszanek.",
    photo: P("napoje", "Lemoniada z cytryną i miętą, shake waniliowy z wisienką i shake czekoladowy w wysokich szklankach na musztardowym tle"),
  },
];

export const MENU: MenuItem[] = [
  // Burgery klasyczne
  {
    id: "double-cheese",
    category: "klasyczne",
    name: "Double Cheese",
    price: 3299,
    description: "Dwa smashowane kotlety, podwójny cheddar, ogórek kiszony, biała cebula, musztarda, ketchup.",
    photo: P("double-cheese", "Double Cheese: dwa chrupiące kotlety smash, spływający cheddar, ogórki i siekana cebula w błyszczącej bułce"),
    tag: "Bestseller",
  },
  {
    id: "classic-burger",
    category: "klasyczne",
    name: "Classic Burger",
    price: 2499,
    description: "Kotlet smash 150 g, cheddar, sałata, pomidor, czerwona cebula, ogórek kiszony, sos BUŁA.",
    photo: P("classic-burger", "Classic Burger z kotletem smash, cheddarem, sałatą, pomidorem i czerwoną cebulą"),
  },
  {
    id: "house-smash",
    category: "klasyczne",
    name: "House Smash",
    price: 2799,
    description: "Kotlet smash 120 g, cheddar, sałata lodowa, pomidor, majonez ze szczypiorkiem.",
    photo: P("house-smash", "House Smash do połowy zawinięty w biały papier, z pomidorem i majonezem ze szczypiorkiem"),
  },
  {
    id: "crispy-chicken",
    category: "klasyczne",
    name: "Crispy Chicken",
    price: 2999,
    description: "Filet z kurczaka w chrupiącej panierce, sałata, pomidor, ogórek, majonez czosnkowy.",
    photo: P("crispy-chicken", "Crispy Chicken z grubym, złocistym filetem w panierce, sałatą i ogórkiem"),
  },

  // Burgery premium
  {
    id: "big-house",
    category: "premium",
    name: "Big House",
    price: 3999,
    description: "Trzy kotlety smash, potrójny cheddar, bekon, karmelizowana cebula, ogórek, sos BUŁA.",
    photo: P("big-house", "Big House: wysoki burger z trzema kotletami, potrójnym cheddarem i bekonem"),
    tag: "Największy w karcie",
  },
  {
    id: "bbq-bacon",
    category: "premium",
    name: "BBQ Bacon",
    price: 3499,
    description: "Kotlet smash 180 g, chrupiący bekon, cheddar, smażona cebulka, wędzony sos BBQ.",
    photo: P("bbq-bacon", "BBQ Bacon z grubymi plastrami bekonu, smażoną cebulką i spływającym sosem BBQ"),
    tag: "Bestseller",
  },
  {
    id: "cheddar-lava",
    category: "premium",
    name: "Cheddar Lava",
    price: 3799,
    description: "Kotlet smash 180 g, gorący sos cheddar polewany przy podaniu, majonez.",
    photo: P("cheddar-lava", "Cheddar Lava: gęsty pomarańczowy sos serowy spływa po kotlecie i bułce"),
  },
  {
    id: "trufla-parmezan",
    category: "premium",
    name: "Trufla & Parmezan",
    price: 4299,
    description: "Kotlet smash 180 g, pieczarki z masłem, parmezan, majonez truflowy, rukola, ciemna bułka.",
    photo: P("trufla-parmezan", "Burger z pieczarkami, płatkami parmezanu i rukolą w ciemnej bułce"),
  },

  // Burgery ostre
  {
    id: "fire-burger",
    category: "ostre",
    name: "Fire Burger",
    price: 3699,
    description: "Kotlet smash 180 g, pepper jack, świeże jalapeño, papryczki chili, sos z habanero.",
    photo: P("fire-burger", "Fire Burger z plastrami czerwonego chili, jalapeño i ostrym sosem spływającym z bułki"),
    heat: 3,
    tag: "Bestseller",
  },
  {
    id: "jalapeno-smash",
    category: "ostre",
    name: "Jalapeño Smash",
    price: 3399,
    description: "Dwa kotlety smash, ser amerykański, marynowane jalapeño, majonez chipotle.",
    photo: P("jalapeno-smash", "Jalapeño Smash z grubą warstwą marynowanych plastrów jalapeño"),
    heat: 2,
  },
  {
    id: "hot-chicken",
    category: "ostre",
    name: "Hot Chicken",
    price: 3199,
    description: "Kurczak w chrupiącej panierce glazurowany olejem chili, coleslaw, ogórek.",
    photo: P("hot-chicken", "Hot Chicken: czerwony od oleju chili filet z kurczaka z coleslawem w miękkiej bułce"),
    heat: 2,
  },

  // Zestawy
  {
    id: "zestaw-fire",
    category: "zestawy",
    name: "Zestaw Fire",
    price: 4499,
    regular: 4999,
    description: "Fire Burger, frytki z przyprawą chili i lemoniada domowa. Cena promocyjna od poniedziałku do czwartku.",
    heat: 3,
    tag: "Promocja pon.–czw.",
  },
  { id: "zestaw-classic", category: "zestawy", name: "Zestaw Classic", price: 3699, description: "Classic Burger, frytki klasyczne i napój 0,4 l do wyboru." },
  {
    id: "zestaw-duo",
    category: "zestawy",
    name: "Zestaw dla dwojga",
    price: 8499,
    description: "Dwa burgery klasyczne do wyboru, duże frytki, krążki cebulowe, dwa sosy i dwa napoje.",
  },

  // Frytki i dodatki
  {
    id: "frytki",
    category: "dodatki",
    name: "Frytki klasyczne",
    price: 999,
    description: "Grube frytki z całych ziemniaków, sól morska, ketchup.",
    photo: P("frytki", "Grube złociste frytki ze skórką wysypujące się z białej papierowej torebki"),
  },
  {
    id: "frytki-ser-bekon",
    category: "dodatki",
    name: "Frytki ser & bekon",
    price: 1599,
    description: "Frytki z gorącym sosem cheddar, chrupiącym bekonem i szczypiorkiem.",
    photo: P("frytki-ser-bekon", "Frytki w papierowej łódce zalane sosem cheddar, z bekonem i szczypiorkiem"),
  },
  {
    id: "krazki-cebulowe",
    category: "dodatki",
    name: "Krążki cebulowe",
    price: 1299,
    description: "Osiem krążków w piwnym cieście, sos czosnkowy.",
    photo: P("krazki-cebulowe", "Wieża krążków cebulowych w piwnym cieście obok miseczki sosu"),
  },
  {
    id: "zapiekanka",
    category: "dodatki",
    name: "Zapiekanka z pieczarkami",
    price: 1699,
    description: "Połówka bagietki, pieczarki z cebulą, mozzarella zapiekana na złoto, ketchup.",
    photo: P("zapiekanka", "Zapiekanka z pieczarkami, roztopionym serem, szczypiorkiem i ketchupem na białym papierze"),
  },

  // Napoje
  {
    id: "lemoniada",
    category: "napoje",
    name: "Lemoniada domowa",
    price: 1199,
    description: "Cytryna, limonka, mięta i trzcina cukrowa. Robiona codziennie rano.",
  },
  { id: "shake-waniliowy", category: "napoje", name: "Shake waniliowy", price: 1499, description: "Lody waniliowe, mleko, bita śmietana i wiśnia." },
  { id: "shake-czekoladowy", category: "napoje", name: "Shake czekoladowy", price: 1499, description: "Lody czekoladowe, sos czekoladowy, bita śmietana." },
  { id: "cola", category: "napoje", name: "Cola 0,4 l", price: 899, description: "Z lodem, z cytryną na życzenie." },
];

export function formatPrice(grosze: number) {
  return (grosze / 100).toFixed(2).replace(".", ",") + " zł";
}

/** Najtańszy burger – do naklejki w hero. */
export const FROM_PRICE = Math.min(...MENU.filter((m) => ["klasyczne", "premium", "ostre"].includes(m.category)).map((m) => m.price));
