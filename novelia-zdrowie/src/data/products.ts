/**
 * Katalog publikacji NOVELIA ZDROWIE.
 *
 * Ceny w groszach (3999 = 39,99 zł). Ten sam katalog wykorzystuje serwer do wyliczenia kwoty płatności –
 * przeglądarka nie może narzucić ceny.
 *
 * Plik PDF każdego produktu (`file`) leży w katalogu prywatnym (domyślnie `private/ebooks/`).
 * Produkt można kupić wyłącznie wtedy, gdy jego plik istnieje – patrz `lib/server/files.ts`.
 */

export interface TocEntry {
  title: string;
  detail?: string;
  page?: number;
}

export interface PreviewPage {
  src: string;
  alt: string;
  caption: string;
}

export interface Product {
  slug: string;
  title: string;
  subtitle: string;
  /** Krótki opis na kartach w sklepie. */
  short: string;
  price: number;
  /** Nazwa pliku PDF w katalogu prywatnym. */
  file: string;
  /** Nazwa pliku, pod którą klient zapisuje e-book. */
  downloadName: string;
  cover: { src: string; width: number; height: number; alt: string };
  featured?: boolean;
  format: string[];
  description: string[];
  benefits: string[];
  audience: string[];
  toc: TocEntry[];
  previews: PreviewPage[];
  /** Informacja wyświetlana, dopóki plik PDF nie zostanie dodany do sklepu. */
  comingSoonNote?: string;
}

const MAIN = "/images/ebooks/zdrowiej-kazdego-dnia";

export const products: Product[] = [
  {
    slug: "zdrowiej-kazdego-dnia",
    title: "Zdrowiej każdego dnia",
    subtitle: "30 prostych przepisów na smaczne i zbilansowane posiłki",
    short: "Śniadania, obiady, kolacje i przekąski z wartościami odżywczymi, plan posiłków na 3 dni i praktyczny poradnik.",
    price: 3999,
    file: "zdrowiej-kazdego-dnia.pdf",
    downloadName: "Zdrowiej-kazdego-dnia-NOVELIA-ZDROWIE.pdf",
    cover: { src: `${MAIN}/okladka.jpg`, width: 1410, height: 2250, alt: "Okładka e-booka „Zdrowiej każdego dnia” – miska z awokado, pomidorkami, ciecierzycą i kaszą" },
    featured: true,
    format: ["PDF, format A4", "50 stron", "32 przepisy z wartościami odżywczymi", "Do czytania na telefonie, tablecie i komputerze"],
    description: [
      "„Zdrowiej każdego dnia” to praktyczny przewodnik po codziennej, zdrowej kuchni. Znajdziesz w nim proste przepisy na śniadania, obiady, kolacje i przekąski – z dostępnych składników i bez skomplikowanych technik.",
      "Każdy przepis zawiera listę składników z gramaturami, czas przygotowania, liczbę porcji i orientacyjne wartości odżywcze obliczone na podstawie ilości składników. Książkę uzupełniają rozdziały o komponowaniu zbilansowanych posiłków, planowaniu jadłospisu i gotowaniu z wyprzedzeniem.",
      "Na końcu czeka przykładowy plan posiłków na 3 dni z listą zakupów oraz poradnik: jak czytać etykiety, urozmaicać posiłki i ograniczać marnowanie żywności.",
    ],
    benefits: [
      "32 przepisy: 10 śniadań, 12 obiadów, 6 kolacji i 4 przekąski",
      "Gramatury, czas przygotowania i liczba porcji przy każdym przepisie",
      "Orientacyjna kaloryczność i makroskładniki na porcję",
      "Plan posiłków na 3 dni z gotową listą zakupów",
      "Zasady komponowania zbilansowanego talerza",
      "Poradnik: etykiety, przechowywanie, mniej marnowania",
    ],
    audience: [
      "chcesz odżywiać się bardziej świadomie, ale bez restrykcyjnych diet",
      "szukasz prostych przepisów z łatwo dostępnych składników",
      "chcesz lepiej planować codzienne posiłki i zakupy",
      "nie masz dużo czasu na gotowanie",
      "chcesz poznać zasady komponowania zbilansowanych posiłków",
    ],
    toc: [
      { title: "Podstawy świadomego odżywiania", detail: "komponowanie posiłków, grupy produktów, planowanie, gotowanie na kilka dni, lista produktów", page: 4 },
      { title: "Zdrowe śniadania", detail: "10 przepisów – od owsianek po wrapy na wynos", page: 11 },
      { title: "Zdrowe obiady", detail: "12 przepisów – drób, ryby, dania wegetariańskie i jednogarnkowe", page: 21 },
      { title: "Lekkie kolacje", detail: "6 przepisów – sałatki, zupy krem i frittata", page: 33 },
      { title: "Zdrowe przekąski", detail: "4 przepisy – hummus, kulki z daktyli, ciasteczka, pieczone jabłka", page: 39 },
      { title: "Planowanie posiłków", detail: "plan na 3 dni, lista zakupów, organizacja kuchni", page: 43 },
      { title: "Praktyczny poradnik", detail: "etykiety, urozmaicone posiłki, mniej marnowania, podsumowanie", page: 46 },
    ],
    previews: [
      { src: `${MAIN}/strona-03.jpg`, alt: "Spis treści e-booka", caption: "Spis treści" },
      { src: `${MAIN}/strona-11.jpg`, alt: "Strona z przepisem na owsiankę z gruszką", caption: "Śniadania – przepis" },
      { src: `${MAIN}/strona-22.jpg`, alt: "Strona z przepisem na kurczaka z batatami", caption: "Obiady – przepis" },
      { src: `${MAIN}/strona-33.jpg`, alt: "Strona z przepisem na sałatkę z burakiem", caption: "Kolacje – przepis" },
      { src: `${MAIN}/strona-06.jpg`, alt: "Strona o komponowaniu zbilansowanych posiłków", caption: "Jak komponować posiłki" },
      { src: `${MAIN}/strona-43.jpg`, alt: "Plan posiłków na 3 dni", caption: "Plan posiłków na 3 dni" },
    ],
  },
  {
    slug: "zdrowe-sniadania",
    title: "Zdrowe śniadania",
    subtitle: "30 inspiracji na dobry początek dnia",
    short: "Owsianki, kasze na ciepło, pasty, dania z jajek, placuszki i śniadania w słoiku – na każdy rodzaj poranka.",
    price: 2999,
    file: "zdrowe-sniadania.pdf",
    downloadName: "Zdrowe-sniadania-NOVELIA-ZDROWIE.pdf",
    cover: { src: "/images/ebooks/zdrowe-sniadania/okladka.jpg", width: 1410, height: 2250, alt: "Okładka e-booka „Zdrowe śniadania” – ilustracja miski owsianki z owocami" },
    format: ["PDF, format A4", "30 przepisów śniadaniowych", "Tygodniowy planer śniadań do wydruku"],
    description: [
      "„Zdrowe śniadania” to zbiór 30 pomysłów na pierwszy posiłek dnia – od rozgrzewających owsianek i kasz, przez kanapki i pasty, po dania z jajek, placuszki i śniadania, które przygotujesz wieczorem i zabierzesz ze sobą rano.",
      "Przepisy pogrupowano według rodzaju poranka: spokojnego weekendu, szybkiego dnia roboczego i śniadania w drodze. Każdy zawiera gramatury, czas przygotowania, liczbę porcji i orientacyjne wartości odżywcze.",
    ],
    benefits: [
      "30 śniadań w pięciu grupach tematycznych",
      "Propozycje na słodko i na słono",
      "Śniadania do przygotowania wieczorem",
      "Tygodniowy planer śniadań i lista zakupów",
    ],
    audience: ["rano masz mało czasu, ale nie chcesz rezygnować ze śniadania", "szukasz urozmaicenia zamiast codziennie tych samych kanapek", "chcesz zabierać zdrowe śniadania do pracy lub szkoły"],
    toc: [
      { title: "Śniadanie, które daje siłę na cały dzień", detail: "jak skomponować pierwszy posiłek" },
      { title: "Owsianki i kasze na ciepło", detail: "6 przepisów" },
      { title: "Pieczywo, pasty i kanapki", detail: "6 przepisów" },
      { title: "Jajka na wiele sposobów", detail: "6 przepisów" },
      { title: "Placuszki i wypieki śniadaniowe", detail: "6 przepisów" },
      { title: "Śniadania na wynos i w słoiku", detail: "6 przepisów" },
      { title: "Tygodniowy planer śniadań i lista zakupów", detail: "do wydrukowania" },
    ],
    previews: [
      { src: "/images/ebooks/zdrowe-sniadania/podglad-1.jpg", alt: "Spis treści e-booka „Zdrowe śniadania”", caption: "Spis treści" },
      { src: "/images/ebooks/zdrowe-sniadania/podglad-2.jpg", alt: "Przykładowy przepis: gryczanka z pieczonym jabłkiem", caption: "Przykładowy przepis" },
    ],
    comingSoonNote: "Publikacja jest w przygotowaniu. Sprzedaż ruszy po udostępnieniu pełnego pliku.",
  },
  {
    slug: "zdrowe-obiady",
    title: "Zdrowe obiady",
    subtitle: "30 pomysłów na zbilansowane posiłki",
    short: "Zupy, dania jednogarnkowe, ryby, drób i kuchnia roślinna – z planerem obiadów na cały tydzień.",
    price: 2999,
    file: "zdrowe-obiady.pdf",
    downloadName: "Zdrowe-obiady-NOVELIA-ZDROWIE.pdf",
    cover: { src: "/images/ebooks/zdrowe-obiady/okladka.jpg", width: 1410, height: 2250, alt: "Okładka e-booka „Zdrowe obiady” – ilustracja miski z kaszą, warzywami i kurczakiem" },
    format: ["PDF, format A4", "30 przepisów obiadowych", "Planer obiadów i lista zakupów do wydruku"],
    description: [
      "„Zdrowe obiady” to 30 sprawdzonych pomysłów na zbilansowany obiad – takich, które da się przygotować po pracy. Znajdziesz tu zupy, które sycą, dania jednogarnkowe, propozycje z drobiem i rybami, kuchnię roślinną oraz obiady z piekarnika.",
      "Publikacja pokazuje, jak zaplanować obiady na cały tydzień metodą „gotuj raz, jedz dwa razy”. Każdy przepis zawiera gramatury, czas przygotowania, liczbę porcji i orientacyjne wartości odżywcze.",
    ],
    benefits: ["30 obiadów w sześciu grupach tematycznych", "Dania na 2 dni i obiady z jednego garnka", "Metoda planowania obiadów na cały tydzień", "Planer obiadów i lista zakupów"],
    audience: ["codziennie zastanawiasz się, co ugotować na obiad", "chcesz gotować raz, a jeść dwa razy", "szukasz zbilansowanych dań dla całej rodziny"],
    toc: [
      { title: "Jak zaplanować obiady na cały tydzień", detail: "metoda „gotuj raz, jedz dwa razy”" },
      { title: "Zupy, które sycą", detail: "5 przepisów" },
      { title: "Dania jednogarnkowe", detail: "5 przepisów" },
      { title: "Drób i mięso", detail: "5 przepisów" },
      { title: "Ryby", detail: "5 przepisów" },
      { title: "Kuchnia roślinna", detail: "5 przepisów" },
      { title: "Obiady z piekarnika", detail: "5 przepisów" },
      { title: "Planer obiadów i lista zakupów", detail: "do wydrukowania" },
    ],
    previews: [
      { src: "/images/ebooks/zdrowe-obiady/podglad-1.jpg", alt: "Spis treści e-booka „Zdrowe obiady”", caption: "Spis treści" },
      { src: "/images/ebooks/zdrowe-obiady/podglad-2.jpg", alt: "Przykładowy przepis: pstrąg z piekarnika z kaszą gryczaną", caption: "Przykładowy przepis" },
    ],
    comingSoonNote: "Publikacja jest w przygotowaniu. Sprzedaż ruszy po udostępnieniu pełnego pliku.",
  },
  {
    slug: "zdrowe-nawyki",
    title: "Zdrowe nawyki",
    subtitle: "Praktyczny przewodnik świadomego odżywiania",
    short: "Jak krok po kroku zmieniać nawyki żywieniowe – z 4-tygodniowym planem zmian i dziennikiem nawyków.",
    price: 2999,
    file: "zdrowe-nawyki.pdf",
    downloadName: "Zdrowe-nawyki-NOVELIA-ZDROWIE.pdf",
    cover: { src: "/images/ebooks/zdrowe-nawyki/okladka.jpg", width: 1410, height: 2250, alt: "Okładka e-booka „Zdrowe nawyki” – ilustracja talerza z warzywami, komosą i ciecierzycą" },
    format: ["PDF, format A4", "Przewodnik w 8 rozdziałach", "Dziennik nawyków do wydruku"],
    description: [
      "„Zdrowe nawyki” to przewodnik dla osób, które chcą odżywiać się lepiej, ale nie chcą stosować restrykcyjnej diety. Zamiast listy zakazów proponuje metodę małych kroków: jedną konkretną zmianę na raz.",
      "Kolejne rozdziały omawiają regularność posiłków, nawodnienie, uważne jedzenie, zakupy i jedzenie poza domem. Publikację zamyka 4-tygodniowy plan zmian oraz dziennik nawyków do wydrukowania.",
    ],
    benefits: ["Metoda jednej zmiany – krok po kroku", "Praktyczne wskazówki na co dzień", "4-tygodniowy plan zmian", "Dziennik nawyków do wydrukowania"],
    audience: ["wiele razy zaczynasz „od poniedziałku”", "chcesz zmienić nawyki bez restrykcyjnej diety", "potrzebujesz prostego planu i narzędzi do śledzenia postępów"],
    toc: [
      { title: "Jak powstają nawyki", detail: "dlaczego małe kroki działają lepiej niż rewolucja" },
      { title: "Metoda jednej zmiany", detail: "jak wprowadzać zmiany po kolei" },
      { title: "Regularność posiłków", detail: "plan dnia, który da się utrzymać" },
      { title: "Nawodnienie na co dzień", detail: "proste sposoby na pamiętanie o wodzie" },
      { title: "Jedzenie uważne", detail: "tempo, sytość i sygnały głodu" },
      { title: "Zakupy i domowa spiżarnia", detail: "lista bazowa i czytanie etykiet" },
      { title: "Jedzenie poza domem", detail: "praca, podróże, spotkania" },
      { title: "4-tygodniowy plan zmian", detail: "z dziennikiem nawyków do wydrukowania" },
    ],
    previews: [
      { src: "/images/ebooks/zdrowe-nawyki/podglad-1.jpg", alt: "Spis treści e-booka „Zdrowe nawyki”", caption: "Spis treści" },
      { src: "/images/ebooks/zdrowe-nawyki/podglad-2.jpg", alt: "Przykładowa strona: metoda jednej zmiany i dziennik nawyków", caption: "Przykładowy rozdział" },
    ],
    comingSoonNote: "Publikacja jest w przygotowaniu. Sprzedaż ruszy po udostępnieniu pełnego pliku.",
  },
];

export const MAIN_PRODUCT_SLUG = "zdrowiej-kazdego-dnia";

export function getProduct(slug: unknown): Product | undefined {
  return typeof slug === "string" ? products.find((p) => p.slug === slug) : undefined;
}

export const mainProduct = getProduct(MAIN_PRODUCT_SLUG)!;

/** Maksymalna liczba pozycji w jednym zamówieniu (każda publikacja raz – to produkt cyfrowy). */
export const MAX_CART_ITEMS = products.length;
