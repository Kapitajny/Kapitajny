/**
 * FAQ — PYTANIA I ODPOWIEDZI.
 *
 * Fragmenty w podwójnych nawiasach kwadratowych, np. [[wysokość zadatku]], są widoczne na stronie
 * jako wyraźnie oznaczone miejsca do uzupełnienia. Odpowiedzi celowo nie zawierają zasad,
 * których studio jeszcze nie potwierdziło (zadatki, terminy, odwołania, wiek, pielęgnacja).
 * Zastąp je własnymi zasadami i usuń nawiasy.
 */

export interface FaqItem {
  q: string;
  a: string[];
}

export interface FaqCategory {
  id: string;
  label: string;
  items: FaqItem[];
}

export const FAQ: FaqCategory[] = [
  {
    id: "booking",
    label: "Booking & Appointments",
    items: [
      {
        q: "Jak umówić się na tatuaż?",
        a: [
          "Najwygodniej przez formularz Book your tattoo — krok po kroku opiszesz pomysł, styl, miejsce i rozmiar, a także dodasz zdjęcia inspiracji. Studio wraca z odpowiedzią i proponuje dalsze kroki.",
          "Wysłanie formularza nie jest jeszcze rezerwacją terminu. Termin potwierdza studio po zapoznaniu się z projektem.",
        ],
      },
      {
        q: "Jak długo czeka się na termin?",
        a: ["[[Orientacyjny czas oczekiwania na konsultację i na sesję]]"],
      },
      {
        q: "Czy mogę przełożyć lub odwołać wizytę?",
        a: ["[[Zasady zmiany i odwołania terminu, w tym wymagany czas wyprzedzenia]]"],
      },
      {
        q: "Czy konsultacja jest obowiązkowa?",
        a: ["[[Kiedy studio wymaga konsultacji, czy odbywa się na miejscu czy online i czy jest płatna]]"],
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing & Payments",
    items: [
      {
        q: "Ile kosztuje tatuaż?",
        a: [
          "Cena zależy od rozmiaru, miejsca na ciele, poziomu szczegółowości i charakteru projektu. Kalkulator w sekcji Pricing pokazuje orientacyjny przedział, ale ostateczną wycenę zawsze przygotowuje tatuator po poznaniu projektu.",
        ],
      },
      {
        q: "Czy pobierany jest zadatek?",
        a: ["[[Czy studio pobiera zadatek, w jakiej wysokości i na jakich zasadach jest zwracany lub zaliczany na poczet ceny]]"],
      },
      {
        q: "Jakie formy płatności są dostępne?",
        a: ["[[Dostępne formy płatności w studiu]]"],
      },
      {
        q: "Jak rozliczane są duże projekty?",
        a: ["[[Sposób rozliczania projektów wielosesyjnych — np. za sesję lub za cały projekt]]"],
      },
    ],
  },
  {
    id: "preparation",
    label: "Tattoo Preparation",
    items: [
      {
        q: "Jak przygotować się do wizyty?",
        a: ["[[Zalecenia studia przed sesją — sen, posiłek, nawodnienie, ubiór, czego unikać]]"],
      },
      {
        q: "Czy mogę przyjść z własnym projektem?",
        a: [
          "Tak — w formularzu wybierz opcję Existing Concept i dołącz zdjęcia lub szkice. Tatuator oceni projekt i zaproponuje ewentualne zmiany kompozycji, wielkości lub umiejscowienia.",
          "[[Zasady studia dotyczące wykonywania cudzych projektów i praw autorskich]]",
        ],
      },
      {
        q: "Czy są przeciwwskazania do tatuowania?",
        a: [
          "Jeśli masz wątpliwości zdrowotne, przyjmujesz leki lub masz choroby skóry, skonsultuj się z lekarzem przed wizytą i poinformuj o tym tatuatora.",
          "[[Lista przeciwwskazań przyjęta przez studio]]",
        ],
      },
    ],
  },
  {
    id: "process",
    label: "Tattoo Process",
    items: [
      {
        q: "Jak wygląda proces od pomysłu do tatuażu?",
        a: [
          "Najpierw rozmowa o pomyśle i jego znaczeniu, potem koncepcja projektu, dopasowanie kompozycji i wielkości, wybór umiejscowienia — a na końcu sesja i wskazówki dotyczące pielęgnacji.",
        ],
      },
      {
        q: "Czy zobaczę projekt przed sesją?",
        a: ["[[Kiedy i w jakiej formie klient otrzymuje projekt oraz ile poprawek obejmuje cena]]"],
      },
      {
        q: "Ile trwa sesja?",
        a: ["[[Orientacyjna długość sesji dla małych, średnich i dużych projektów]]"],
      },
    ],
  },
  {
    id: "aftercare",
    label: "Aftercare",
    items: [
      {
        q: "Jak pielęgnować świeży tatuaż?",
        a: [
          "Szczegółowe zalecenia przekazuje tatuator po zakończeniu sesji — stosuj się do nich, bo zależą od techniki i miejsca na ciele.",
          "[[Zalecenia pielęgnacyjne studia: opatrunek, mycie, preparaty, czego unikać]]",
        ],
      },
      {
        q: "Czy poprawki są w cenie?",
        a: ["[[Zasady i termin bezpłatnych poprawek]]"],
      },
    ],
  },
  {
    id: "safety",
    label: "Safety & Hygiene",
    items: [
      {
        q: "Jakie standardy higieny stosuje studio?",
        a: ["[[Opis procedur higienicznych studia — sterylizacja, materiały jednorazowe, dezynfekcja stanowiska]]"],
      },
      {
        q: "Jakich tuszy używacie?",
        a: ["[[Informacja o stosowanych tuszach i ich zgodności z obowiązującymi przepisami]]"],
      },
      {
        q: "Od jakiego wieku można zrobić tatuaż?",
        a: ["[[Zasady studia dotyczące wieku klientów i wymaganych dokumentów]]"],
      },
    ],
  },
];
