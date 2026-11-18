/** Treści sekcji: misja, proces, FAQ, opinie. */

export const mission = [
  {
    id: "dlaczego",
    title: "Dlaczego powstało PULSO",
    body: "Bo zbyt wiele firm płaci za reklamę, nie wiedząc, co dokładnie kupuje. Dostają zrzut ekranu z zasięgiem i fakturę. Chcemy, żeby każda złotówka miała swój cel, zanim zostanie wydana.",
  },
  {
    id: "podejscie",
    title: "Jak podchodzimy do reklamy",
    body: "Najpierw plan: kogo chcesz pozyskać, ile możesz zapłacić za klienta, w którym kanale ta osoba naprawdę bywa. Dopiero potem kampania. Czasem uczciwa odpowiedź brzmi: ten kanał nie jest dla Ciebie.",
  },
  {
    id: "dane",
    title: "Dlaczego liczą się dane i strategia",
    body: "Intuicja podpowiada, od czego zacząć. Dane mówią, co zostawić, a co wyłączyć. Mierzymy to, co ma znaczenie dla Twojej firmy: zapytania, sprzedaż, koszt pozyskania, a nie polubienia.",
  },
  {
    id: "wspolpraca",
    title: "Jak rozumiemy współpracę",
    body: "Jako partnerstwo z jasnymi zasadami. Stała opłata za obsługę, budżet reklamowy płacony bezpośrednio platformom, regularny raport i rozmowa. Wiesz, za co płacisz, i możesz to sprawdzić.",
  },
] as const;

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
  deliverable: string;
  /** Orientacyjne położenie na osi czasu (tydzień startu, długość w tygodniach). */
  start: number;
  span: number;
  /** Krok trwa w sposób ciągły po starcie (optymalizacja). */
  ongoing?: boolean;
};

export const processSteps: ProcessStep[] = [
  {
    id: "konsultacja",
    title: "Konsultacja i poznanie potrzeb",
    description: "Rozmawiamy o firmie, ofercie, klientach i celu. Sprawdzamy, czy i jak reklama może pomóc.",
    deliverable: "Wspólne rozumienie celu i budżetu",
    start: 1,
    span: 1,
  },
  {
    id: "analiza",
    title: "Analiza firmy i rynku",
    description: "Przeglądamy stronę, konkurencję, dotychczasowe kampanie i dane. Szukamy, gdzie są Twoi klienci.",
    deliverable: "Wnioski z analizy",
    start: 1.5,
    span: 1.5,
  },
  {
    id: "strategia",
    title: "Przygotowanie strategii",
    description: "Wybieramy kanały, grupy odbiorców, komunikaty i podział budżetu. Ustalamy, co i jak mierzymy.",
    deliverable: "Strategia kampanii na piśmie",
    start: 2.5,
    span: 1.5,
  },
  {
    id: "konfiguracja",
    title: "Konfiguracja kampanii",
    description: "Konfigurujemy konta reklamowe, piksele, konwersje i kampanie. Sprawdzamy, czy pomiar działa.",
    deliverable: "Gotowe i przetestowane konta",
    start: 3.5,
    span: 1,
  },
  {
    id: "uruchomienie",
    title: "Uruchomienie reklam",
    description: "Startujemy z kampaniami i uważnie obserwujemy pierwsze dni, żeby szybko reagować.",
    deliverable: "Aktywne kampanie",
    start: 4.5,
    span: 0.5,
  },
  {
    id: "optymalizacja",
    title: "Optymalizacja i raportowanie",
    description: "Wyłączamy to, co nie działa, wzmacniamy to, co działa. Raport i rozmowa w ustalonym rytmie.",
    deliverable: "Regularny raport z wnioskami",
    start: 5,
    span: 4,
    ongoing: true,
  },
];

export type FaqCategory = { id: string; label: string; items: { q: string; a: string }[] };

export const faq: FaqCategory[] = [
  {
    id: "platformy",
    label: "Reklamy i platformy",
    items: [
      {
        q: "Skąd mam wiedzieć, która platforma jest dla mnie?",
        a: "Nie musisz tego wiedzieć przed rozmową. W formularzu możesz zaznaczyć „Nie wiem”. Na konsultacji sprawdzimy, gdzie bywają Twoi klienci i jak podejmują decyzję, i zaproponujemy kanał, albo powiemy, że reklama płatna nie jest teraz najlepszym krokiem.",
      },
      {
        q: "Czy warto reklamować się na wszystkich platformach naraz?",
        a: "Zwykle nie. Lepiej dobrze prowadzić jeden lub dwa kanały niż rozproszyć budżet na cztery. Kolejne platformy dodajemy, gdy pierwsze działają i mamy dane do porównania.",
      },
      {
        q: "Czy przygotowujecie grafiki i filmy do reklam?",
        a: "Doradzamy, jakie materiały są potrzebne, i przygotowujemy proste kreacje oraz teksty reklam. Produkcja wideo czy sesje zdjęciowe to osobny zakres, o który można zapytać na konsultacji.",
      },
    ],
  },
  {
    id: "budzet",
    label: "Budżet reklamowy",
    items: [
      {
        q: "Czy budżet reklamowy jest wliczony w cenę pakietu?",
        a: "Nie. Cena pakietu to wyłącznie opłata za naszą pracę. Budżet reklamowy płacisz bezpośrednio platformom (Meta, Google, TikTok) z własnej karty lub konta, więc widzisz każdą wydaną złotówkę na ich fakturach.",
      },
      {
        q: "Jaki budżet reklamowy jest potrzebny na start?",
        a: "To zależy od branży, kanału i celu. Na konsultacji podamy orientacyjny przedział dla Twojej sytuacji. Nie zaczynamy kampanii z budżetem, który naszym zdaniem nie pozwoli zebrać sensownych danych.",
      },
      {
        q: "Czy mogę zmieniać budżet w trakcie?",
        a: "Tak. Budżet możemy zwiększać lub zmniejszać w zależności od wyników i sezonu. Każdą większą zmianę omawiamy z Tobą wcześniej.",
      },
    ],
  },
  {
    id: "cennik",
    label: "Cennik i płatności",
    items: [
      {
        q: "Czy ceny na stronie są ostateczne?",
        a: "Ceny pakietów są robocze i mogą się zmienić. Przed rozpoczęciem współpracy zawsze potwierdzamy zakres i cenę na piśmie.",
      },
      {
        q: "Czy podane ceny są netto?",
        a: "Tak, wszystkie ceny obsługi podajemy netto, za jeden miesiąc.",
      },
      {
        q: "Czy mogę zmienić pakiet później?",
        a: "Tak. Gdy dodasz lub wyłączysz platformę, zmieniamy pakiet od kolejnego okresu rozliczeniowego.",
      },
    ],
  },
  {
    id: "wspolpraca",
    label: "Współpraca",
    items: [
      {
        q: "Jak wygląda pierwszy krok?",
        a: "Wypełniasz formularz, a my odzywamy się, żeby umówić konsultację. Na rozmowie poznajemy Twoją firmę i cel, a Ty decydujesz, czy chcesz rozmawiać o współpracy.",
      },
      {
        q: "Do kogo należą konta reklamowe?",
        a: "Do Ciebie. Kampanie prowadzimy na Twoich kontach reklamowych, z dostępem nadanym agencji. Po zakończeniu współpracy konta, dane i historia kampanii zostają u Ciebie.",
      },
      {
        q: "Czy jest okres wypowiedzenia?",
        a: "Warunki współpracy, w tym okres wypowiedzenia, ustalamy w umowie przed startem. Zapytaj o nie na konsultacji.",
      },
    ],
  },
  {
    id: "raporty",
    label: "Raportowanie i wyniki",
    items: [
      {
        q: "Czy gwarantujecie wyniki sprzedażowe?",
        a: "Nie. Nikt uczciwy nie może zagwarantować sprzedaży z reklam, bo zależy ona też od oferty, ceny, strony i rynku. Gwarantujemy rzetelną pracę, jasny plan i przejrzysty raport z tego, co działa, a co nie.",
      },
      {
        q: "Co zawiera raport?",
        a: "Wydany budżet, wyniki najważniejsze dla Twojego celu (np. zapytania, sprzedaż, koszt pozyskania, ROAS), porównanie z poprzednim okresem, wnioski i plan na kolejny okres. Bez żargonu.",
      },
      {
        q: "Kiedy zobaczę pierwsze efekty?",
        a: "Pierwsze dane pojawiają się w ciągu kilku dni od startu, ale kampanie zwykle potrzebują kilku tygodni na zebranie danych i optymalizację. Na konsultacji omówimy realistyczne oczekiwania dla Twojej branży.",
      },
    ],
  },
];

/**
 * ★ Opinie klientów. Dodawaj wyłącznie prawdziwe opinie, za zgodą autora.
 * Dopóki lista jest pusta, sekcja pokazuje uczciwy pusty stan.
 */
export const testimonials: { quote: string; author: string; company: string; industry: string }[] = [];
