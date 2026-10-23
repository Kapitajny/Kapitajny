/**
 * ★ NAJCZĘSTSZE PYTANIA
 *
 * Każda odpowiedź to lista akapitów. Fragment w podwójnych nawiasach kwadratowych,
 * np. [[formy płatności]], jest wyświetlany jako wyraźne oznaczenie „do uzupełnienia”.
 * Przed publikacją dopasuj odpowiedzi do faktycznych zasad gabinetu i usuń oznaczenia.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string[];
}

export const FAQ: FaqItem[] = [
  {
    id: "pierwsza-wizyta",
    question: "Jak umówić się na pierwszą wizytę?",
    answer: [
      "Najprościej zadzwonić lub wysłać formularz na stronie Kontakt. Wystarczy imię, preferowany sposób kontaktu i orientacyjny termin. Oddzwonimy lub odpiszemy, żeby razem ustalić dzień i godzinę.",
      "Wysłanie formularza nie oznacza rezerwacji. Termin jest potwierdzony dopiero wtedy, gdy uzgodnimy go z Tobą telefonicznie lub mailowo.",
    ],
  },
  {
    id: "skierowanie",
    question: "Czy potrzebuję skierowania?",
    answer: [
      "To zależy od rodzaju świadczenia i sposobu jego finansowania. Na prywatne, odpłatne wizyty u fizjoterapeuty skierowanie zazwyczaj nie jest wymagane. Świadczenia finansowane ze środków publicznych (NFZ) wymagają skierowania od lekarza.",
      "Czy gabinet realizuje świadczenia w ramach NFZ: [[informacja o umowie z NFZ]]. Jeśli masz skierowanie, dokumentację lub zalecenia lekarskie, zabierz je na wizytę.",
    ],
  },
  {
    id: "przygotowanie",
    question: "Jak przygotować się do wizyty?",
    answer: [
      "Załóż wygodny strój, który pozwala swobodnie się poruszać i odsłonić okolicę, której dotyczą dolegliwości. Warto wcześniej zastanowić się, kiedy pojawiają się objawy i co je nasila lub łagodzi. To ułatwi rozmowę.",
      "Jeśli przyjmujesz leki lub masz zalecenia lekarskie, przygotuj ich listę.",
    ],
  },
  {
    id: "czas-trwania",
    question: "Ile trwa spotkanie?",
    answer: [
      "Pierwsza wizyta jest dłuższa, bo obejmuje rozmowę i ocenę funkcjonalną. Czas każdej wizyty podajemy w cenniku przy poszczególnych usługach.",
      "Liczbę i częstotliwość wizyt ustalamy indywidualnie, po ocenie Twoich potrzeb.",
    ],
  },
  {
    id: "platnosc-karta",
    question: "Czy można płacić kartą?",
    answer: ["Akceptowane formy płatności: [[formy płatności, np. gotówka, karta, BLIK]]."],
  },
  {
    id: "odwolanie",
    question: "Jak odwołać lub przełożyć wizytę?",
    answer: [
      "Zadzwoń lub napisz do nas możliwie wcześnie. Przełożymy wizytę na dogodny termin, a zwolnione miejsce zaproponujemy innej osobie.",
      "Zasady odwoływania wizyt: [[np. najpóźniej 24 godziny przed wizytą, ewentualne opłaty]].",
    ],
  },
  {
    id: "co-zabrac",
    question: "Co zabrać na rehabilitację?",
    answer: [
      "Wygodny strój sportowy, dokumentację medyczną związaną z problemem (np. wyniki badań obrazowych, wypis ze szpitala, zalecenia lekarza) oraz skierowanie, jeśli je posiadasz.",
      "Jeśli korzystasz z ortezy, kul lub innego zaopatrzenia, weź je ze sobą. [[ewentualnie: ręcznik, obuwie zmienne]]",
    ],
  },
];
