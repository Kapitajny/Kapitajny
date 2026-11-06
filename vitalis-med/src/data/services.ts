import type { IconName } from "@/components/ui/Icons";

export interface Service {
  slug: string;
  title: string;
  icon: IconName;
  /** Krótki opis – karta na stronie głównej. */
  summary: string;
  /** Dłuższy opis – podstrona „Nasze usługi”. */
  description: string;
  highlights: string[];
  /** Czy formularz powinien wymagać miejsca odbioru i miejsca docelowego. */
  isTransport: boolean;
}

/** ★ Katalog usług. Kolejność = kolejność na stronie. `slug` trafia do adresu formularza (?usluga=...). */
export const services: Service[] = [
  {
    slug: "prywatny-transport-medyczny",
    title: "Prywatny transport medyczny",
    icon: "ambulance",
    summary: "Komercyjny transport pacjenta ambulansem z opieką personelu medycznego – w terminie dopasowanym do Twoich potrzeb.",
    description:
      "Realizujemy odpłatny transport pacjentów, którzy wymagają opieki medycznej w czasie przejazdu. Dobieramy rodzaj ambulansu i skład zespołu do stanu pacjenta oraz charakteru przewozu – od krótkiego przejazdu w obrębie miasta po transport na dalekie odległości.",
    highlights: ["Dobór ambulansu i zespołu do potrzeb pacjenta", "Terminy uzgadniane z wyprzedzeniem lub w trybie pilnym", "Możliwość przejazdu opiekuna"],
    isTransport: true,
  },
  {
    slug: "transport-sanitarny",
    title: "Transport sanitarny",
    icon: "stretcher",
    summary: "Przewóz pacjentów niewymagających specjalistycznego zespołu ratownictwa – planowo i bezpiecznie.",
    description:
      "Transport sanitarny przeznaczony jest dla osób, które ze względu na stan zdrowia nie mogą skorzystać z transportu publicznego ani samochodu osobowego. Wykonujemy go ambulansami typu T z przeszkolonym zespołem. W określonych przypadkach transport może być realizowany w ramach NFZ – więcej w zakładce NFZ.",
    highlights: ["Ambulanse typu T z noszami i krzesełkiem kardiologicznym", "Pomoc przy wyprowadzeniu i wprowadzeniu pacjenta", "Przewozy jednorazowe i cykliczne"],
    isTransport: true,
  },
  {
    slug: "transport-miedzyszpitalny",
    title: "Transport pacjentów między szpitalami",
    icon: "hospital",
    summary: "Przewozy międzyszpitalne i między placówkami medycznymi, z przekazaniem dokumentacji i ciągłością opieki.",
    description:
      "Przewozimy pacjentów pomiędzy szpitalami, oddziałami, zakładami opiekuńczo-leczniczymi i ośrodkami rehabilitacyjnymi. Koordynujemy termin z placówką wysyłającą i przyjmującą, a zespół przejmuje pacjenta wraz z dokumentacją medyczną.",
    highlights: ["Koordynacja z placówką wysyłającą i przyjmującą", "Zespół dobrany do stanu pacjenta", "Współpraca z podmiotami leczniczymi na podstawie umów"],
    isTransport: true,
  },
  {
    slug: "transport-pacjentow-lezacych",
    title: "Transport pacjentów leżących",
    icon: "bed",
    summary: "Bezpieczny przewóz osób, które nie mogą siedzieć – z wniesieniem i zniesieniem pacjenta z mieszkania.",
    description:
      "Przewozimy pacjentów w pozycji leżącej na noszach z systemem mocowań. Zespół pomaga przy zniesieniu pacjenta z mieszkania i wniesieniu go na miejsce docelowe, także w budynkach bez windy, z użyciem krzesełka kardiologicznego lub noszy płachtowych.",
    highlights: ["Nosze z systemem mocowań i materac próżniowy", "Zniesienie i wniesienie pacjenta", "Transport z domu, szpitala lub ośrodka opieki"],
    isTransport: true,
  },
  {
    slug: "transport-na-badania",
    title: "Transport na badania i wizyty lekarskie",
    icon: "calendar",
    summary: "Przejazd na badania, zabiegi, dializy i konsultacje – z odbiorem po zakończeniu wizyty.",
    description:
      "Organizujemy przejazdy na zaplanowane badania diagnostyczne, zabiegi, rehabilitację, dializy i wizyty lekarskie. Na życzenie zespół czeka na pacjenta lub wraca po niego o ustalonej godzinie i odwozi go do domu.",
    highlights: ["Przejazd w obie strony", "Przewozy cykliczne, np. na dializy lub rehabilitację", "Przypomnienie o terminie przejazdu"],
    isTransport: true,
  },
  {
    slug: "zabezpieczenie-imprez",
    title: "Zabezpieczenie medyczne imprez i wydarzeń",
    icon: "event",
    summary: "Zabezpieczenie imprez masowych, sportowych, plenerowych i firmowych – zgodnie z wymaganiami prawa.",
    description:
      "Przygotowujemy zabezpieczenie medyczne wydarzeń: od kameralnych imprez firmowych po imprezy masowe i zawody sportowe. Pomagamy dobrać liczbę zespołów, ambulansów i punktów pomocy medycznej do skali wydarzenia oraz wymagań przepisów dotyczących bezpieczeństwa imprez masowych.",
    highlights: ["Zespoły medyczne, ambulanse i punkty pomocy medycznej", "Pomoc w przygotowaniu planu zabezpieczenia", "Imprezy masowe, sportowe, plenerowe i firmowe"],
    isTransport: false,
  },
  {
    slug: "obsluga-firm-i-instytucji",
    title: "Obsługa medyczna firm i instytucji",
    icon: "building",
    summary: "Stała współpraca z placówkami medycznymi, zakładami pracy, domami opieki i instytucjami.",
    description:
      "Zapewniamy stałą obsługę transportową i medyczną szpitali, przychodni, domów opieki, zakładów pracy i instytucji. Współpracę opieramy na umowie z ustalonymi czasami reakcji, sposobem zamawiania przejazdów i rozliczeniem miesięcznym.",
    highlights: ["Umowy ramowe i rozliczenia miesięczne", "Dedykowany koordynator współpracy", "Raporty z realizacji przewozów"],
    isTransport: false,
  },
  {
    slug: "transport-miedzynarodowy",
    title: "Transport międzynarodowy",
    icon: "globe",
    summary: "Transport pacjentów z zagranicy do Polski i z Polski za granicę – po indywidualnej kwalifikacji.",
    description:
      "Transport międzynarodowy realizujemy po indywidualnej kwalifikacji pacjenta i analizie trasy. Usługa jest dostępna w zakresie posiadanych uprawnień oraz możliwości organizacyjnych – każdorazowo potwierdzamy ją przed przyjęciem zlecenia.",
    highlights: ["Kwalifikacja pacjenta i planowanie trasy", "Koordynacja z placówką za granicą", "Wycena indywidualna"],
    isTransport: true,
  },
];

export function findService(slug: string | null | undefined): Service | undefined {
  return slug ? services.find((s) => s.slug === slug) : undefined;
}
