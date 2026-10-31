export type Service = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  includes: string[];
  forWhom: string;
};

export const services: Service[] = [
  {
    slug: "koncepcja",
    title: "Projekt koncepcyjny",
    summary: "Układ funkcjonalny, kierunek estetyczny i wizualizacje kluczowych pomieszczeń.",
    description:
      "Dla osób, które chcą zobaczyć potencjał swojego wnętrza, zanim zapadną decyzje budowlane. Opracowujemy układ funkcjonalny, paletę materiałów i nastrój, który zostanie z Tobą na lata.",
    includes: [
      "inwentaryzacja i analiza przestrzeni",
      "dwa warianty układu funkcjonalnego",
      "moodboard materiałów i kolorystyki",
      "fotorealistyczne wizualizacje kluczowych wnętrz",
    ],
    forWhom: "Dla właścicieli, którzy chcą realizować projekt samodzielnie lub etapami.",
  },
  {
    slug: "kompleksowy",
    title: "Projekt kompleksowy",
    summary: "Pełna dokumentacja wykonawcza, zestawienia materiałów i rysunki zabudów na wymiar.",
    description:
      "Projekt, z którym ekipa wykonawcza wie dokładnie, co zbudować. Każda ściana, gniazdo, lampa i detal stolarski są rozrysowane, zwymiarowane i opisane.",
    includes: [
      "wszystko z projektu koncepcyjnego",
      "rysunki techniczne: ściany, posadzki, sufity, oświetlenie, elektryka",
      "projekty zabudów meblowych i detali",
      "zestawienie materiałów, wyposażenia i kosztorys orientacyjny",
    ],
    forWhom: "Dla apartamentów i domów, w których liczy się precyzja wykonania.",
  },
  {
    slug: "pod-klucz",
    title: "Projekt pod klucz",
    summary: "Projekt, zakupy, koordynacja wykonawców i nadzór aż do dnia przeprowadzki.",
    description:
      "Przejmujemy cały proces: od projektu, przez zamówienia i harmonogram, po odbiory i stylizację. Ty podejmujesz decyzje, my dbamy o resztę.",
    includes: [
      "wszystko z projektu kompleksowego",
      "zamówienia materiałów i wyposażenia",
      "koordynacja wykonawców i harmonogramu",
      "nadzór autorski, odbiory i finalna stylizacja",
    ],
    forWhom: "Dla osób, które cenią swój czas i chcą jednego partnera odpowiedzialnego za efekt.",
  },
  {
    slug: "konsultacja",
    title: "Konsultacja architektoniczna",
    summary: "Spotkanie w Twoim wnętrzu i konkretne rekomendacje, od układu po kolory.",
    description:
      "Dwugodzinne spotkanie na miejscu, po którym otrzymasz notatkę z rekomendacjami: co zmienić w układzie, jakie materiały wybrać i od czego zacząć.",
    includes: [
      "spotkanie w Twoim wnętrzu",
      "ocena układu i potencjału przestrzeni",
      "wskazówki materiałowe i kolorystyczne",
      "pisemna notatka z rekomendacjami",
    ],
    forWhom: "Dla osób przed zakupem nieruchomości lub w trakcie remontu.",
  },
];

export const processSteps = [
  {
    no: "01",
    title: "Rozmowa i poznanie potrzeb",
    text: "Poznajemy Twój styl życia, przyzwyczajenia i plany. Ustalamy zakres, budżet i harmonogram.",
    time: "1–2 tygodnie",
  },
  {
    no: "02",
    title: "Analiza przestrzeni",
    text: "Mierzymy, fotografujemy i sprawdzamy instalacje. Szukamy światła, osi widokowych i ograniczeń.",
    time: "1–2 tygodnie",
  },
  {
    no: "03",
    title: "Koncepcja i wizualizacje",
    text: "Pokazujemy układ, materiały i nastrój na wizualizacjach. Dopracowujemy je razem z Tobą.",
    time: "3–5 tygodni",
  },
  {
    no: "04",
    title: "Dokumentacja techniczna",
    text: "Rysujemy każdy detal dla wykonawców i przygotowujemy zestawienie materiałów oraz wyposażenia.",
    time: "4–6 tygodni",
  },
  {
    no: "05",
    title: "Realizacja i nadzór",
    text: "Koordynujemy prace, kontrolujemy jakość na budowie i stylizujemy wnętrze na koniec.",
    time: "zależnie od zakresu",
  },
] as const;

export const values = [
  {
    title: "Indywidualne podejście",
    text: "Nie mamy stylu katalogowego. Każde wnętrze zaczynamy od Twoich nawyków, a nie od trendów.",
  },
  {
    title: "Ponadczasowa estetyka",
    text: "Wybieramy materiały, które starzeją się szlachetnie: kamień, drewno, len, tynk wapienny.",
  },
  {
    title: "Dopracowane detale",
    text: "Rysujemy połączenia, cokoły i uchwyty, bo to one decydują o tym, jak wnętrze się odbiera.",
  },
  {
    title: "Kompleksowa obsługa",
    text: "Jeden zespół od pierwszego szkicu do odbioru, z jasnym harmonogramem i stałym kontaktem.",
  },
] as const;

/** Opinie przykładowe — treść demonstracyjna, nie są to rekomendacje rzeczywistych klientów. */
export const testimonials = [
  {
    quote:
      "Najbardziej ceniliśmy spokój. Zespół zawsze wiedział, co dzieje się na budowie, a my mogliśmy skupić się na wyborze materiałów i na tym, jak chcemy w tym domu żyć.",
    context: "Właściciele domu jednorodzinnego, Konstancin-Jeziorna",
  },
  {
    quote:
      "Dostaliśmy mieszkanie, które wygląda tak jasno i cicho, jak sobie wymarzyliśmy, ale przede wszystkim jest wygodne na co dzień. Każda szafa jest tam, gdzie powinna.",
    context: "Klienci, apartament na Żoliborzu",
  },
  {
    quote:
      "Byłam przekonana, że w 78 metrach nie zmieści się wszystko, czego potrzebuję. Projekt pokazał, że wystarczy dobrze przemyśleć każdy centymetr.",
    context: "Klientka, apartament na Powiślu",
  },
] as const;
