import type { StaticImageData } from "next/image";

import villa1 from "@/assets/photos/villa-natura-1.jpg";
import villa2 from "@/assets/photos/villa-natura-2.jpg";
import villa3 from "@/assets/photos/villa-natura-3.jpg";
import villa4 from "@/assets/photos/villa-natura-4.jpg";
import quiet1 from "@/assets/photos/quiet-residence-1.jpg";
import quiet2 from "@/assets/photos/quiet-residence-2.jpg";
import quiet3 from "@/assets/photos/quiet-residence-3.jpg";
import quiet4 from "@/assets/photos/quiet-residence-4.jpg";
import sand1 from "@/assets/photos/sandstone-house-1.jpg";
import sand2 from "@/assets/photos/sandstone-house-2.jpg";
import sand3 from "@/assets/photos/sandstone-house-3.jpg";
import sand4 from "@/assets/photos/sandstone-house-4.jpg";
import urban1 from "@/assets/photos/urban-harmony-1.jpg";
import urban2 from "@/assets/photos/urban-harmony-2.jpg";
import urban3 from "@/assets/photos/urban-harmony-3.jpg";
import urban4 from "@/assets/photos/urban-harmony-4.jpg";
import oak1 from "@/assets/photos/oak-residence-1.jpg";
import oak2 from "@/assets/photos/oak-residence-2.jpg";
import oak3 from "@/assets/photos/oak-residence-3.jpg";
import oak4 from "@/assets/photos/oak-residence-4.jpg";
import min1 from "@/assets/photos/minimal-living-1.jpg";
import min2 from "@/assets/photos/minimal-living-2.jpg";
import min3 from "@/assets/photos/minimal-living-3.jpg";
import min4 from "@/assets/photos/minimal-living-4.jpg";

export type Photo = { src: StaticImageData; alt: string };

export type Material = { name: string; use: string; swatch: string };

export type Project = {
  slug: string;
  name: string;
  kind: "Dom jednorodzinny" | "Apartament" | "Dom";
  area: number;
  location: string;
  year: string;
  scope: string;
  short: string;
  lead: string;
  concept: string[];
  materials: Material[];
  facts: { label: string; value: string }[];
  cover: Photo;
  gallery: [Photo, Photo, Photo];
};

export const projects: Project[] = [
  {
    slug: "villa-natura",
    name: "Villa Natura",
    kind: "Dom jednorodzinny",
    area: 240,
    location: "Konstancin-Jeziorna",
    year: "2025",
    scope: "Projekt pod klucz z nadzorem",
    short: "Dom otwarty na ogród. Dębowe belki, trawertyn i światło, które przez cały dzień zmienia charakter wnętrza.",
    lead: "Strefa dzienna o długości dwunastu metrów, w której salon, jadalnia i kuchnia dzielą jedno światło i jeden rytm belek stropowych.",
    concept: [
      "Właściciele chcieli domu, który nie konkuruje z ogrodem. Zamiast dzielić parter na pokoje, zaprojektowaliśmy jedną, ciągłą przestrzeń porządkowaną rytmem dziewięciu dębowych belek. Każda strefa ma własny punkt ciężkości: niską sofę zwróconą do ogrodu, długi stół pod lampionami z papieru ryżowego, wyspę kuchenną z ryflowanego dębu.",
      "Paleta materiałów jest celowo krótka. Bielony dąb, honowany trawertyn i tynk wapienny starzeją się szlachetnie i dobrze znoszą codzienne życie dużej rodziny. Stalowe, patynowane profile przeszkleń są cienkie na tyle, by widok na ogród pozostał najważniejszym obrazem w domu.",
    ],
    materials: [
      { name: "Dąb bielony, olejowany", use: "podłogi, belki stropowe, zabudowa kuchni", swatch: "#C8AE8E" },
      { name: "Trawertyn rzymski, honowany", use: "blat wyspy, stoliki, konsola", swatch: "#D9CBB4" },
      { name: "Tynk wapienny", use: "ściany i sufity", swatch: "#ECE6DC" },
      { name: "Len i bouclé", use: "sofa, zasłony, poduszki", swatch: "#E4DCCF" },
      { name: "Stal patynowana", use: "profile przeszkleń, oświetlenie", swatch: "#2B2620" },
    ],
    facts: [
      { label: "Powierzchnia", value: "240 m²" },
      { label: "Lokalizacja", value: "Konstancin-Jeziorna" },
      { label: "Zakres", value: "Projekt pod klucz z nadzorem" },
      { label: "Czas realizacji", value: "11 miesięcy" },
    ],
    cover: { src: villa1, alt: "Salon Villa Natura: niska sofa bouclé, trawertynowy stolik i dębowe belki stropowe" },
    gallery: [
      { src: villa2, alt: "Jadalnia z długim dębowym stołem i lampionami z papieru, w tle kuchnia" },
      { src: villa3, alt: "Zbliżenie na honowany trawertyn stolika kawowego z ceramiczną misą" },
      { src: villa4, alt: "Kuchnia z wyspą z ryflowanego dębu i trawertynowym blatem" },
    ],
  },
  {
    slug: "quiet-residence",
    name: "Quiet Residence",
    kind: "Apartament",
    area: 115,
    location: "Warszawa, Żoliborz",
    year: "2025",
    scope: "Projekt kompleksowy",
    short: "Jasny jesion, len i szałwiowa zieleń. Apartament zaprojektowany wokół porannego światła.",
    lead: "Mieszkanie dla dwojga osób pracujących z domu: ciche, jasne i uporządkowane tak, by codzienność nie zostawiała śladów.",
    concept: [
      "Wszystkie decyzje podporządkowaliśmy porannemu światłu, które wpada od wschodu do sypialni, a później przesuwa się do salonu. Ściany w ciepłej bieli, jesionowe deski i lniane zasłony rozpraszają je miękko, bez ostrych kontrastów.",
      "Przechowywanie ukryliśmy w zabudowie, a w salonie zostawiliśmy tylko otwarte półki na książki i ceramikę. Akcent szałwiowej zieleni pojawia się w tkaninach i grafice, nigdy na dużych płaszczyznach.",
    ],
    materials: [
      { name: "Jesion naturalny", use: "podłogi, zabudowy, meble na wymiar", swatch: "#DCCBB0" },
      { name: "Len stonowany", use: "zasłony, obicia, pościel", swatch: "#E6E0D5" },
      { name: "Trawertyn", use: "stoliki kawowe", swatch: "#D9CBB4" },
      { name: "Farba mineralna", use: "ściany w ciepłej bieli", swatch: "#EFEBE4" },
      { name: "Tkanina w kolorze szałwii", use: "poduszki, pled", swatch: "#A3A58C" },
    ],
    facts: [
      { label: "Powierzchnia", value: "115 m²" },
      { label: "Lokalizacja", value: "Warszawa, Żoliborz" },
      { label: "Zakres", value: "Projekt kompleksowy" },
      { label: "Czas realizacji", value: "7 miesięcy" },
    ],
    cover: { src: quiet1, alt: "Salon Quiet Residence z lnianą sofą, okrągłymi stolikami i zasłonami w porannym świetle" },
    gallery: [
      { src: quiet2, alt: "Jesionowy stolik pomocniczy z ceramicznym wazonem i gałązkami" },
      { src: quiet3, alt: "Sypialnia z tapicerowanym zagłówkiem, lnianą pościelą i szałwiowym pledem" },
      { src: quiet4, alt: "Szafka nocna z ceramiczną lampą i lnianym abażurem" },
    ],
  },
  {
    slug: "sandstone-house",
    name: "Sandstone House",
    kind: "Dom",
    area: 185,
    location: "Józefów",
    year: "2024",
    scope: "Projekt pod klucz",
    short: "Łuki, wapienne posadzki i piaskowe tynki. Dom, który przypomina późne, ciepłe popołudnie.",
    lead: "Architektura łuków i grubych ścian, w której słońce rysuje na posadzce kolejne kształty od południa do zachodu.",
    concept: [
      "Inspiracją były domy z wapienia i gliny, w których grubość ścian daje chłód latem i ciepło zimą. Trzy łukowe otwarcia prowadzą z salonu na taras, a powtarzający się motyw łuku pojawia się także w niszy i w oknie łazienki.",
      "Piaskowe tynki wapienne nakładaliśmy ręcznie, z widocznym śladem pacy. Posadzka z kamienia wapiennego biegnie z wnętrza na taras, zacierając granicę między domem a ogrodem.",
    ],
    materials: [
      { name: "Tynk wapienny w kolorze piasku", use: "ściany, nisze, zabudowana ława", swatch: "#E3D4BD" },
      { name: "Kamień wapienny", use: "posadzki wewnątrz i na tarasie", swatch: "#E3D9C8" },
      { name: "Piaskowiec", use: "stolik kawowy, umywalka", swatch: "#D9C3A2" },
      { name: "Dąb wędzony", use: "belki stropowe, meble", swatch: "#8E6A4A" },
      { name: "Tadelakt", use: "ściany łazienki", swatch: "#DCCBB2" },
    ],
    facts: [
      { label: "Powierzchnia", value: "185 m²" },
      { label: "Lokalizacja", value: "Józefów" },
      { label: "Zakres", value: "Projekt pod klucz" },
      { label: "Czas realizacji", value: "10 miesięcy" },
    ],
    cover: { src: sand1, alt: "Salon Sandstone House z trzema łukowymi otwarciami na taras i ciepłym światłem popołudnia" },
    gallery: [
      { src: sand2, alt: "Łukowa nisza w piaskowym tynku z ceramicznymi naczyniami" },
      { src: sand3, alt: "Łazienka z wolnostojącą wanną pod łukowym oknem" },
      { src: sand4, alt: "Kamienna umywalka nablatowa i okrągłe lustro w mosiężnej ramie" },
    ],
  },
  {
    slug: "urban-harmony",
    name: "Urban Harmony",
    kind: "Apartament",
    area: 78,
    location: "Warszawa, Powiśle",
    year: "2024",
    scope: "Projekt kompleksowy",
    short: "Orzech, grafitowy kamień i miasto za oknem. Kompaktowe mieszkanie o charakterze wieczornego salonu.",
    lead: "Siedemdziesiąt osiem metrów, które pracują jak większe mieszkanie: kuchnia z ukrytą zabudową, okrągły stół i salon z lamelową ścianą.",
    concept: [
      "Mieszkanie w kamienicy na Powiślu potrzebowało porządku i głębi. Ciemniejsza paleta orzecha i grafitu sprawia, że wnętrze wydaje się otulające, a jasne tynki i lniane zasłony zachowują lekkość przy oknach.",
      "Pełna wysokość zabudowy kuchennej mieści lodówkę, piekarnik i spiżarnię za ryflowanymi frontami. W salonie orzechowe lamele porządkują ścianę telewizyjną i poprawiają akustykę.",
    ],
    materials: [
      { name: "Orzech amerykański", use: "fronty, lamele, stół", swatch: "#6B4A33" },
      { name: "Kamień grafitowy, szczotkowany", use: "blat i ściana kuchenna", swatch: "#3A3833" },
      { name: "Dąb wędzony", use: "podłoga", swatch: "#8E6A4A" },
      { name: "Aksamit oliwkowy", use: "fotel", swatch: "#6F7258" },
      { name: "Mosiądz szczotkowany", use: "oświetlenie, armatura", swatch: "#7A6650" },
    ],
    facts: [
      { label: "Powierzchnia", value: "78 m²" },
      { label: "Lokalizacja", value: "Warszawa, Powiśle" },
      { label: "Zakres", value: "Projekt kompleksowy" },
      { label: "Czas realizacji", value: "5 miesięcy" },
    ],
    cover: { src: urban1, alt: "Kuchnia Urban Harmony z orzechową zabudową, grafitowym blatem i okrągłym stołem" },
    gallery: [
      { src: urban2, alt: "Okrągły orzechowy stół z lampionem i ceramiką" },
      { src: urban3, alt: "Salon z orzechową ścianą lamelową, sofą bouclé i oliwkowym fotelem" },
      { src: urban4, alt: "Aksamitny fotel w kolorze oliwki w świetle zachodzącego słońca" },
    ],
  },
  {
    slug: "oak-residence",
    name: "The Oak Residence",
    kind: "Dom",
    area: 210,
    location: "Magdalenka",
    year: "2023",
    scope: "Projekt pod klucz z nadzorem",
    short: "Dąb w roli głównej: lamele, belki i długi stół, przy którym spotyka się cała rodzina.",
    lead: "Dom dla wielopokoleniowej rodziny, w którym drewno porządkuje przestrzeń i nadaje jej ciepło przez cały rok.",
    concept: [
      "Jadalnia jest sercem domu. Stół na dziesięć osób stoi pod liniową lampą, a za nim dębowe lamele na całej wysokości ściany ukrywają drzwi do spiżarni i gabinetu. Belki stropowe biegną w poprzek, skracając optycznie długie pomieszczenie.",
      "W sypialni dębowa boazeria zastępuje zagłówek łóżka i mieści lampki nocne. Dąb olejowaliśmy na mat, aby zachował naturalny, lekko miodowy odcień.",
    ],
    materials: [
      { name: "Dąb europejski, olejowany", use: "lamele, belki, boazeria, stół", swatch: "#C8AE8E" },
      { name: "Tynk mineralny", use: "ściany", swatch: "#EAE3D8" },
      { name: "Len naturalny", use: "siedziska krzeseł, pościel", swatch: "#CBBFA9" },
      { name: "Ceramika ręcznie toczona", use: "naczynia, wazony", swatch: "#B8A995" },
      { name: "Stal czerniona", use: "oświetlenie liniowe", swatch: "#3A3229" },
    ],
    facts: [
      { label: "Powierzchnia", value: "210 m²" },
      { label: "Lokalizacja", value: "Magdalenka" },
      { label: "Zakres", value: "Projekt pod klucz z nadzorem" },
      { label: "Czas realizacji", value: "12 miesięcy" },
    ],
    cover: { src: oak1, alt: "Jadalnia The Oak Residence z dębowymi lamelami, belkami i stołem na dziesięć osób" },
    gallery: [
      { src: oak2, alt: "Nakryty stół z ceramiką i gałązkami oliwnymi pod liniową lampą" },
      { src: oak3, alt: "Sypialnia z dębową boazerią za łóżkiem i lnianą pościelą" },
      { src: oak4, alt: "Dębowa szafka nocna i wisząca lampka przy boazerii" },
    ],
  },
  {
    slug: "minimal-living",
    name: "Minimal Living",
    kind: "Apartament",
    area: 92,
    location: "Warszawa, Wilanów",
    year: "2023",
    scope: "Projekt koncepcyjny i kompleksowy",
    short: "Mikrocement, bouclé i pustka, która daje odpocząć. Minimalizm, który nie jest chłodny.",
    lead: "Wnętrze zredukowane do kilku przedmiotów, w którym światło i faktury wykonują całą pracę.",
    concept: [
      "Klientka poprosiła o mieszkanie, w którym po powrocie z pracy nic nie przyciąga uwagi. Ciągła powierzchnia mikrocementu na posadzkach i ścianach tworzy tło bez podziałów, a jedynymi akcentami są faktury: bouclé sofy, trawertyn stolika i obraz oparty o ścianę.",
      "Każdy przedmiot ma swoje miejsce w zabudowie, dlatego na widoku zostaje tylko to, co naprawdę cieszy. Minimalizm złagodziliśmy ciepłą temperaturą barwową światła i miękkimi tkaninami.",
    ],
    materials: [
      { name: "Mikrocement", use: "posadzki i ściany", swatch: "#DAD4CA" },
      { name: "Bouclé w kolorze kości słoniowej", use: "sofa, pufa", swatch: "#ECE7DE" },
      { name: "Trawertyn", use: "stolik kawowy", swatch: "#D9CBB4" },
      { name: "Kamień wapienny", use: "szafki nocne", swatch: "#E6DECF" },
      { name: "Len", use: "zasłony, pościel", swatch: "#F2EEE7" },
    ],
    facts: [
      { label: "Powierzchnia", value: "92 m²" },
      { label: "Lokalizacja", value: "Warszawa, Wilanów" },
      { label: "Zakres", value: "Projekt koncepcyjny i kompleksowy" },
      { label: "Czas realizacji", value: "6 miesięcy" },
    ],
    cover: { src: min1, alt: "Salon Minimal Living z długą sofą bouclé, trawertynowym stolikiem i dużym przeszkleniem" },
    gallery: [
      { src: min2, alt: "Trawertynowy stolik z ceramicznym wazonem i pojedynczą gałązką" },
      { src: min3, alt: "Minimalistyczna sypialnia z mikrocementu z lnianą pościelą" },
      { src: min4, alt: "Kamienna szafka nocna i ceramiczny wazon przy oknie" },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
