/** WYDARZENIA – PRZYKŁADOWE (projekt demonstracyjny). Daty w formacie RRRR-MM-DD. */

export interface StudioEvent {
  id: string;
  type: string;
  title: string;
  date: string;
  time: string;
  summary: string;
  details: string[];
  price: string;
}

export const EVENTS: StudioEvent[] = [
  {
    id: "dzien-otwarty",
    type: "Dzień otwarty",
    title: "Dzień otwarty: zatańcz z nami za darmo",
    date: "2026-11-07",
    time: "10:00 – 14:00",
    summary: "Krótkie, 30-minutowe zajęcia z każdego stylu, rozmowy z instruktorami i czas na pytania.",
    details: [
      "Zajęcia pokazowe co 45 minut – możesz przyjść na jedne albo na wszystkie.",
      "Nie potrzebujesz doświadczenia ani specjalnego stroju.",
      "Instruktorzy pomogą dobrać grupę i odpowiedzą na pytania o karnety.",
    ],
    price: "Wstęp wolny",
  },
  {
    id: "warsztaty-parter",
    type: "Warsztaty",
    title: "Warsztaty: praca w parterze",
    date: "2026-11-15",
    time: "11:00 – 14:00",
    summary: "Trzy godziny z Haną: bezpieczne przejścia do parteru, rolowania i płynne wstawanie.",
    details: [
      "Dla osób, które mają za sobą kilka zajęć tańca współczesnego.",
      "Weź nakolanniki i strój, który nie krępuje ruchów.",
      "Liczba miejsc ograniczona do 14 osób.",
    ],
    price: "140 zł",
  },
  {
    id: "rozciaganie",
    type: "Zajęcia specjalne",
    title: "Wieczór rozciągania i oddechu",
    date: "2026-11-20",
    time: "19:30 – 21:00",
    summary: "Spokojny wieczór przy wyciszonej muzyce: mobilność, rozciąganie i ćwiczenia oddechowe.",
    details: [
      "Zajęcia dla każdego, niezależnie od stylu i poziomu.",
      "Wejście w ramach karnetu lub pojedynczego wejścia.",
      "Zabierz wygodny, ciepły strój.",
    ],
    price: "W ramach karnetu",
  },
  {
    id: "spotkanie",
    type: "Wydarzenie dla uczestników",
    title: "Taneczne spotkanie społeczności",
    date: "2026-11-28",
    time: "18:00 – 21:00",
    summary: "Wieczór dla uczestników zajęć i ich bliskich: wspólny taniec, muzyka i rozmowy.",
    details: [
      "Bez programu i bez ocen – po prostu tańczymy razem.",
      "Możesz przyprowadzić osobę towarzyszącą.",
      "Prosimy o wcześniejsze potwierdzenie obecności.",
    ],
    price: "Wstęp wolny dla uczestników",
  },
  {
    id: "pokaz",
    type: "Pokaz",
    title: "Zimowy pokaz grup",
    date: "2026-12-12",
    time: "17:00 – 19:00",
    summary: "Grupy studia pokazują choreografie przygotowane w tym sezonie. Udział w pokazie jest dobrowolny.",
    details: [
      "Występują chętne osoby ze wszystkich poziomów – także te, które zaczęły we wrześniu.",
      "Próby generalne odbywają się w ramach zwykłych zajęć.",
      "Widownia: wstęp dla rodziny i przyjaciół uczestników.",
    ],
    price: "Wstęp wolny",
  },
];

const dateFormatter = new Intl.DateTimeFormat("pl-PL", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const dayFormatter = new Intl.DateTimeFormat("pl-PL", { day: "numeric", timeZone: "UTC" });
const monthFormatter = new Intl.DateTimeFormat("pl-PL", { month: "short", timeZone: "UTC" });

/** Daty bez godziny traktujemy jako UTC, żeby wynik nie zależał od strefy czasowej serwera. */
export function formatEventDate(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  const long = dateFormatter.format(date);
  return { long: long.charAt(0).toUpperCase() + long.slice(1), day: dayFormatter.format(date), month: monthFormatter.format(date).replace(".", "") };
}
