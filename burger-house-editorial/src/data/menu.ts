/**
 * KARTA MENU. Ceny w groszach (2499 = 24,99 zł).
 * Zdjęcia leżą w `public/images/` – nazwa pliku w polu `image`.
 */

export type CategoryId = "klasyczne" | "premium" | "ostre" | "zestawy" | "dodatki" | "napoje";

export interface Category {
  id: CategoryId;
  label: string;
  /** Zdjęcie kategorii i wariant kompozycji (a–f) w koncepcji editorial. */
  photo: { src: string; alt: string; w: number; h: number };
  layout: "a" | "b" | "c" | "d" | "e" | "f";
  /** Jedno zdanie pod listą kategorii – mówi, czym kategoria się wyróżnia. */
  note: string;
}

export interface MenuItem {
  id: string;
  category: CategoryId;
  name: string;
  price: number;
  description: string;
  image: string;
  alt: string;
  /** 1–3, tylko dla pozycji ostrych */
  heat?: 1 | 2 | 3;
  tag?: string;
}

export const CATEGORIES: Category[] = [
  { id: "klasyczne", label: "Burgery klasyczne", photo: { src: "/images/klasyczne.jpg", alt: "Classic Burger z sałatą, pomidorem i czerwoną cebulą na białym papierze, jasne tło", w: 1264, h: 1264 }, layout: "a", note: "Wołowina mielona rano, cheddar, warzywa krojone na zmianie. Bez udziwnień." },
  { id: "premium", label: "Burgery premium", photo: { src: "/images/premium.jpg", alt: "Burger z pieczarkami, parmezanem i rukolą w ciemnej bułce na szarym talerzu", w: 1136, h: 1408 }, layout: "b", note: "Większe kotlety, dłużej dojrzewające dodatki i sosy robione u nas w małych partiach." },
  { id: "ostre", label: "Burgery ostre", photo: { src: "/images/ostre.jpg", alt: "Burger z jalapeño i sosem chili, obok dwie czerwone papryczki, ostre światło dzienne", w: 1536, h: 1024 }, layout: "c", note: "Skala ostrości od 1 do 3. Trójkę zamawiaj z lemoniadą." },
  { id: "zestawy", label: "Zestawy", photo: { src: "/images/zestawy.jpg", alt: "Z góry: cheeseburger w papierze, frytki w papierowym rożku i cola z lodem na jasnym stole", w: 1680, h: 944 }, layout: "d", note: "Burger, frytki i napój w jednej cenie. Napój 0,4 l do wyboru." },
  { id: "dodatki", label: "Frytki i dodatki", photo: { src: "/images/dodatki.jpg", alt: "Grube frytki z solą morską wysypujące się z białej papierowej torebki", w: 1136, h: 1408 }, layout: "e", note: "Frytki kroimy z całych ziemniaków i smażymy dwa razy." },
  { id: "napoje", label: "Napoje", photo: { src: "/images/napoje.jpg", alt: "Lemoniada z miętą i cytryną obok gęstego shake’a waniliowego w porannym świetle", w: 1088, h: 1456 }, layout: "f", note: "Lemoniadę i shake’i przygotowujemy na miejscu." },
];

export const MENU: MenuItem[] = [
  // Burgery klasyczne
  {
    id: "classic-burger",
    category: "klasyczne",
    name: "Classic Burger",
    price: 2499,
    description: "Wołowina 150 g, cheddar, sałata, pomidor, czerwona cebula, ogórek kiszony, sos BUŁA.",
    image: "classic-burger.jpg",
    alt: "Classic Burger z kotletem wołowym, cheddarem, sałatą, pomidorem i czerwoną cebulą w błyszczącej bułce",
  },
  {
    id: "double-cheese",
    category: "klasyczne",
    name: "Double Cheese",
    price: 3299,
    description: "Dwa smashowane kotlety, podwójny cheddar, ogórek, biała cebula, musztarda, ketchup.",
    image: "double-cheese.jpg",
    alt: "Double Cheese z dwoma chrupiącymi kotletami i spływającym podwójnym cheddarem",
    tag: "Bestseller",
  },
  {
    id: "house-smash",
    category: "klasyczne",
    name: "House Smash",
    price: 2799,
    description: "Kotlet smash 120 g, cheddar, sałata lodowa, pomidor, majonez ze szczypiorkiem.",
    image: "house-smash.jpg",
    alt: "House Smash zawinięty w papier: kotlet z cheddarem, sałata lodowa, pomidor i majonez ze szczypiorkiem",
  },
  {
    id: "crispy-chicken",
    category: "klasyczne",
    name: "Crispy Chicken",
    price: 2999,
    description: "Filet z kurczaka w chrupiącej panierce, sałata, pomidor, ogórek, majonez czosnkowy.",
    image: "crispy-chicken.jpg",
    alt: "Crispy Chicken z grubym, złocistym filetem z kurczaka w panierce, sałatą i pomidorem",
  },

  // Burgery premium
  {
    id: "bbq-bacon",
    category: "premium",
    name: "BBQ Bacon",
    price: 3499,
    description: "Wołowina 180 g, chrupiący bekon, cheddar, krążki cebulowe, wędzony sos BBQ.",
    image: "bbq-bacon.jpg",
    alt: "BBQ Bacon z chrupiącym bekonem, krążkami cebulowymi i ciemnym sosem BBQ",
    tag: "Bestseller",
  },
  {
    id: "big-house",
    category: "premium",
    name: "Big House",
    price: 3999,
    description: "Trzy kotlety wołowe, potrójny cheddar, bekon, karmelizowana cebula, sałata, pomidor, sos BUŁA.",
    image: "big-house.jpg",
    alt: "Wysoki Big House z trzema kotletami, potrójnym cheddarem i bekonem, spięty drewnianym szpikulcem",
    tag: "Największy w karcie",
  },
  {
    id: "cheddar-lava",
    category: "premium",
    name: "Cheddar Lava",
    price: 3799,
    description: "Wołowina 180 g, cheddar, gorący sos serowy polewany przy podaniu, sałata, pomidor, majonez.",
    image: "cheddar-lava.jpg",
    alt: "Cheddar Lava polewany gorącym sosem serowym, który spływa po bułce i kotlecie",
  },
  {
    id: "trufla-parmezan",
    category: "premium",
    name: "Trufla & Parmezan",
    price: 4299,
    description: "Wołowina 180 g, pieczarki z masłem, parmezan, majonez truflowy, rukola, ciemna bułka.",
    image: "trufla-parmezan.jpg",
    alt: "Burger Trufla & Parmezan z pieczarkami, płatkami parmezanu i rukolą w ciemnej bułce",
  },

  // Burgery ostre
  {
    id: "fire-burger",
    category: "ostre",
    name: "Fire Burger",
    price: 3699,
    description: "Wołowina 180 g, pepper jack, świeże jalapeño, papryczki chili, sos z habanero.",
    image: "fire-burger.jpg",
    alt: "Fire Burger ze świeżymi jalapeño, papryczkami chili i spływającym czerwonym sosem",
    heat: 3,
    tag: "Bestseller",
  },
  {
    id: "jalapeno-smash",
    category: "ostre",
    name: "Jalapeño Smash",
    price: 3399,
    description: "Dwa kotlety smash, ser amerykański, marynowane jalapeño, majonez chipotle.",
    image: "jalapeno-smash.jpg",
    alt: "Jalapeño Smash z dwoma kotletami, roztopionym serem i plastrami marynowanego jalapeño",
    heat: 2,
  },
  {
    id: "hot-chicken",
    category: "ostre",
    name: "Hot Chicken",
    price: 3199,
    description: "Kurczak w chrupiącej panierce glazurowany olejem chili, coleslaw, ogórek.",
    image: "hot-chicken.jpg",
    alt: "Hot Chicken z chrupiącym kurczakiem w czerwonej glazurze chili i coleslawem",
    heat: 2,
  },

  // Zestawy
  {
    id: "zestaw-classic",
    category: "zestawy",
    name: "Zestaw Classic",
    price: 3699,
    description: "Classic Burger, frytki klasyczne i napój 0,4 l do wyboru.",
    image: "zestaw-classic.jpg",
    alt: "Zestaw Classic: cheeseburger, frytki w czerwonym kartoniku i szklanka coli z lodem",
  },
  {
    id: "zestaw-fire",
    category: "zestawy",
    name: "Zestaw Fire",
    price: 4999,
    description: "Fire Burger, frytki z przyprawą chili i lemoniada domowa.",
    image: "zestaw-fire.jpg",
    alt: "Zestaw Fire: ostry burger z jalapeño, frytki z chili i lemoniada z limonką",
    heat: 3,
    tag: "Promocja pon.–czw.",
  },
  {
    id: "zestaw-duo",
    category: "zestawy",
    name: "Zestaw dla dwojga",
    price: 8499,
    description: "Dwa burgery klasyczne do wyboru, duże frytki, krążki cebulowe, dwa sosy i dwa napoje.",
    image: "zestaw-duo.jpg",
    alt: "Zestaw dla dwojga na desce: dwa burgery, frytki, krążki cebulowe, sosy i dwie cole",
  },

  // Frytki i dodatki
  {
    id: "frytki",
    category: "dodatki",
    name: "Frytki klasyczne",
    price: 999,
    description: "Grube frytki z całych ziemniaków, sól morska, ketchup.",
    image: "frytki.jpg",
    alt: "Złociste grube frytki w czerwonym kartoniku z miseczką ketchupu",
  },
  {
    id: "frytki-ser-bekon",
    category: "dodatki",
    name: "Frytki ser & bekon",
    price: 1599,
    description: "Frytki z gorącym sosem cheddar, chrupiącym bekonem i szczypiorkiem.",
    image: "frytki-ser-bekon.jpg",
    alt: "Frytki polane sosem cheddar z bekonem i szczypiorkiem w żeliwnej patelni",
  },
  {
    id: "krazki-cebulowe",
    category: "dodatki",
    name: "Krążki cebulowe",
    price: 1299,
    description: "Osiem krążków w piwnym cieście, sos czosnkowy.",
    image: "krazki-cebulowe.jpg",
    alt: "Stos chrupiących krążków cebulowych w cieście z sosem czosnkowym",
  },
  {
    id: "zapiekanka",
    category: "dodatki",
    name: "Zapiekanka z pieczarkami",
    price: 1699,
    description: "Połówka bagietki, pieczarki z cebulą, mozzarella zapiekana na złoto, ketchup.",
    image: "zapiekanka.jpg",
    alt: "Zapiekanka z pieczarkami i roztopioną mozzarellą, polana falą ketchupu",
  },

  // Napoje
  {
    id: "cola",
    category: "napoje",
    name: "Cola 0,4 l",
    price: 899,
    description: "Z lodem, z cytryną na życzenie.",
    image: "cola.jpg",
    alt: "Wysoka szklanka coli z kostkami lodu i kroplami na szkle",
  },
  {
    id: "lemoniada",
    category: "napoje",
    name: "Lemoniada domowa",
    price: 1199,
    description: "Cytryna, limonka, mięta i trzcina cukrowa. Robiona codziennie rano.",
    image: "lemoniada.jpg",
    alt: "Lemoniada z plastrami cytryny, miętą i lodem w wysokiej szklance",
  },
  {
    id: "shake-waniliowy",
    category: "napoje",
    name: "Shake waniliowy",
    price: 1499,
    description: "Lody waniliowe, mleko, bita śmietana i wiśnia.",
    image: "shake-waniliowy.jpg",
    alt: "Gęsty shake waniliowy z bitą śmietaną, wisienką i słomką w paski",
  },
  {
    id: "shake-czekoladowy",
    category: "napoje",
    name: "Shake czekoladowy",
    price: 1499,
    description: "Lody czekoladowe, sos czekoladowy, bita śmietana.",
    image: "shake-czekoladowy.jpg",
    alt: "Shake czekoladowy z bitą śmietaną i sosem czekoladowym spływającym po szkle",
  },
];

export const BESTSELLER_IDS = ["double-cheese", "bbq-bacon", "fire-burger", "big-house"] as const;

export function getItem(id: string) {
  const item = MENU.find((m) => m.id === id);
  if (!item) throw new Error(`Brak pozycji menu: ${id}`);
  return item;
}

export function formatPrice(grosze: number) {
  return (grosze / 100).toFixed(2).replace(".", ",") + " zł";
}

export const PROMO = {
  itemId: "zestaw-fire",
  price: 4499,
  regular: 4999,
  validity: "Od poniedziałku do czwartku w obu lokalach, na miejscu i na wynos.",
};
