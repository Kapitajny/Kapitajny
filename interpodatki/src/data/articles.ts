export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "note"; text: string };

export const ARTICLE_CATEGORIES = {
  wspolpraca: "Współpraca z biurem",
  koszty: "Koszty i wycena",
  "formy-dzialalnosci": "Formy działalności",
  dokumenty: "Dokumenty",
  podatki: "Podatki",
} as const;
export type ArticleCategory = keyof typeof ARTICLE_CATEGORIES;

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  readingMinutes: number;
  publishedAt: string;
  tags: string[];
  body: ArticleBlock[];
};

const LEGAL_NOTE =
  "Artykuł ma charakter ogólny i edukacyjny. Nie stanowi porady prawnej ani podatkowej. Przepisy się zmieniają – przed podjęciem decyzji sprawdź aktualne regulacje i skonsultuj swoją sytuację z uprawnionym specjalistą.";

export const articles: Article[] = [
  {
    slug: "jak-przygotowac-firme-do-wspolpracy",
    title: "Jak przygotować firmę do współpracy z biurem rachunkowym?",
    excerpt:
      "Dobry start współpracy z biurem zależy od kilku decyzji podjętych na początku: kanału przekazywania dokumentów, osoby kontaktowej i wspólnego kalendarza.",
    category: "wspolpraca",
    readingMinutes: 5,
    publishedAt: "2026-09-08",
    tags: ["biuro rachunkowe", "start współpracy", "obieg dokumentów"],
    body: [
      {
        type: "p",
        text: "Zmiana biura rachunkowego albo pierwsze powierzenie księgowości zewnętrznej firmie to dobry moment, żeby uporządkować sposób pracy z dokumentami. Kilka ustaleń na początku oszczędza wielu pytań w kolejnych miesiącach.",
      },
      { type: "h2", text: "Zbierz podstawowe informacje o firmie" },
      {
        type: "p",
        text: "Biuro będzie potrzebowało danych rejestrowych, informacji o formie opodatkowania i o tym, czy firma rozlicza VAT. Przygotuj też listę rachunków bankowych, umów leasingowych i kredytowych oraz informację o zatrudnionych osobach.",
      },
      {
        type: "ul",
        items: [
          "dane rejestrowe i formę prawną działalności,",
          "informację o formie opodatkowania i rozliczeniach VAT,",
          "listę rachunków bankowych i stałych umów,",
          "dokumentację od poprzedniego biura, jeśli zmieniasz obsługę.",
        ],
      },
      { type: "h2", text: "Ustal jeden kanał przekazywania dokumentów" },
      {
        type: "p",
        text: "Najwięcej problemów powstaje wtedy, gdy dokumenty trafiają do biura na kilka sposobów naraz: część mailem, część w komunikatorze, część papierowo. Wybierz jeden kanał – na przykład panel klienta lub dedykowaną skrzynkę – i trzymaj się go.",
      },
      { type: "h2", text: "Wskaż osobę kontaktową" },
      {
        type: "p",
        text: "W większych firmach warto wyznaczyć jedną osobę, która odpowiada na pytania biura i zbiera dokumenty od pozostałych pracowników. Dzięki temu biuro nie musi szukać informacji w kilku miejscach.",
      },
      { type: "h2", text: "Uzgodnij kalendarz" },
      {
        type: "p",
        text: "Termin przekazywania dokumentów za dany miesiąc powinien być zapisany w umowie. Wyznacz w swoim kalendarzu stały dzień na zebranie dokumentów – to prosty nawyk, który ułatwia terminowe rozliczenia.",
      },
      { type: "note", text: LEGAL_NOTE },
    ],
  },
  {
    slug: "co-wplywa-na-cene-ksiegowosci",
    title: "Co wpływa na cenę miesięcznej obsługi księgowej?",
    excerpt:
      "Liczba dokumentów to tylko jeden z czynników. Na abonament wpływają też forma prawna, zatrudnienie, złożoność transakcji i oczekiwany zakres raportowania.",
    category: "koszty",
    readingMinutes: 6,
    publishedAt: "2026-09-15",
    tags: ["cena", "abonament", "wycena", "kalkulator"],
    body: [
      {
        type: "p",
        text: "Oferty biur rachunkowych potrafią się znacząco różnić. Zwykle nie wynika to z przypadku, lecz z innego założonego zakresu pracy. Poniżej opisujemy czynniki, które najczęściej wpływają na wycenę – także w naszym kalkulatorze demonstracyjnym.",
      },
      { type: "h2", text: "Forma prawna i rodzaj ewidencji" },
      {
        type: "p",
        text: "Pełna księgowość spółki wymaga więcej pracy niż uproszczona ewidencja jednoosobowej działalności: dochodzą zamknięcia miesięcy, uzgodnienia sald i dokumenty roczne. Dlatego cena bazowa dla spółek jest wyższa.",
      },
      { type: "h2", text: "Liczba i rodzaj dokumentów" },
      {
        type: "p",
        text: "Każdy dokument trzeba sprawdzić, opisać i zaksięgować. Przy dużej liczbie powtarzalnych dokumentów koszt jednostkowy zwykle maleje – stąd malejące stawki w kalkulatorze.",
      },
      { type: "h2", text: "Zatrudnienie" },
      {
        type: "p",
        text: "Kadry i płace to osobny obszar pracy. Koszt rośnie wraz z liczbą pracowników i liczbą zdarzeń kadrowych w miesiącu, takich jak nowe umowy, aneksy czy zaświadczenia.",
      },
      { type: "h2", text: "Złożoność rozliczeń" },
      {
        type: "ul",
        items: [
          "transakcje z kontrahentami zagranicznymi i rozliczenia w walutach,",
          "rozbudowany majątek trwały i leasingi,",
          "projekty rozliczane w czasie lub wiele lokalizacji,",
          "sprzedaż przez wiele platform i operatorów płatności.",
        ],
      },
      { type: "h2", text: "Zakres dodatkowy" },
      {
        type: "p",
        text: "Raportowanie zarządcze, częstsze zestawienia, pilna obsługa czy doradztwo podatkowe to usługi, które warto wyceniać świadomie – tylko wtedy, gdy rzeczywiście są potrzebne.",
      },
      {
        type: "note",
        text: "Kwoty w kalkulatorze InterPodatki są demonstracyjne. Służą pokazaniu mechanizmu wyceny, a nie stanowią oferty handlowej.",
      },
    ],
  },
  {
    slug: "jdg-a-spolka-z-oo",
    title: "Księgowość JDG a księgowość spółki z o.o.",
    excerpt:
      "Jednoosobowa działalność i spółka z o.o. różnią się nie tylko odpowiedzialnością właściciela, ale też zakresem ewidencji, dokumentów i obowiązków sprawozdawczych.",
    category: "formy-dzialalnosci",
    readingMinutes: 7,
    publishedAt: "2026-09-22",
    tags: ["JDG", "spółka z o.o.", "pełna księgowość", "forma prawna"],
    body: [
      {
        type: "p",
        text: "Wybór formy prowadzenia biznesu wpływa na wiele obszarów, w tym na księgowość. Poniższe porównanie ma charakter ogólny i pomaga zrozumieć, skąd biorą się różnice w zakresie pracy biura.",
      },
      { type: "h2", text: "Rodzaj ewidencji" },
      {
        type: "p",
        text: "Jednoosobowa działalność często może korzystać z uproszczonych form ewidencji – zależnie od formy opodatkowania i skali działalności. Spółka z o.o. prowadzi pełne księgi rachunkowe, co oznacza bardziej szczegółową ewidencję i regularne zamknięcia okresów.",
      },
      { type: "h2", text: "Dokumenty roczne" },
      {
        type: "p",
        text: "Spółka kapitałowa przygotowuje dokumenty roczne, które zatwierdzają jej organy. W jednoosobowej działalności obowiązki roczne są zwykle prostsze. Dokładny zakres obowiązków zależy od aktualnych przepisów i sytuacji firmy.",
      },
      { type: "h2", text: "Pieniądze firmy a pieniądze właściciela" },
      {
        type: "p",
        text: "W JDG granica między majątkiem firmy a majątkiem właściciela jest mniej formalna. W spółce środki należą do spółki, a ich przekazanie wspólnikom wymaga odpowiedniej podstawy. To jeden z powodów, dla których księgowość spółki wymaga większej staranności.",
      },
      { type: "h2", text: "Co to oznacza dla kosztów obsługi?" },
      {
        type: "ul",
        items: [
          "wyższa cena bazowa dla spółek wynika z szerszego zakresu ewidencji,",
          "spółki częściej potrzebują raportowania dla zarządu i wspólników,",
          "zmiana formy prawnej to decyzja, którą warto skonsultować z doradcą podatkowym i prawnikiem.",
        ],
      },
      { type: "note", text: LEGAL_NOTE },
    ],
  },
  {
    slug: "jak-przygotowac-dokumenty-do-rozliczenia",
    title: "Jak przygotować dokumenty do rozliczenia?",
    excerpt:
      "Kompletne, czytelne i opisane dokumenty to szybsze rozliczenie i mniej pytań od księgowej. Praktyczna lista kontrolna na koniec miesiąca.",
    category: "dokumenty",
    readingMinutes: 4,
    publishedAt: "2026-10-01",
    tags: ["dokumenty", "faktury", "koniec miesiąca", "lista kontrolna"],
    body: [
      {
        type: "p",
        text: "Większość opóźnień w rozliczeniach wynika z braków w dokumentach, a nie z pracy biura. Prosta lista kontrolna pomaga przekazać komplet za pierwszym razem.",
      },
      { type: "h2", text: "Lista kontrolna na koniec miesiąca" },
      {
        type: "ol",
        items: [
          "Zbierz faktury sprzedażowe wystawione w danym miesiącu, także korekty.",
          "Zbierz faktury i rachunki kosztowe – również te otrzymane mailem lub z platform zakupowych.",
          "Pobierz wyciągi ze wszystkich rachunków firmowych.",
          "Dołącz raporty z platform sprzedażowych i operatorów płatności, jeśli sprzedajesz online.",
          "Opisz dokumenty nietypowe – jednym zdaniem, czego dotyczą.",
          "Przekaż informacje o zmianach kadrowych: nowych umowach, nieobecnościach, premiach.",
        ],
      },
      { type: "h2", text: "Opis dokumentu oszczędza czas" },
      {
        type: "p",
        text: "Jeśli z faktury nie wynika jasno, czego dotyczy zakup, dopisz krótki komentarz. Księgowa nie musi wtedy pytać, a dokument może zostać od razu prawidłowo zaksięgowany.",
      },
      { type: "h2", text: "Dokumenty, które łatwo pominąć" },
      {
        type: "ul",
        items: [
          "faktury za subskrypcje i usługi internetowe,",
          "dokumenty z podróży służbowych,",
          "umowy zawarte w danym miesiącu,",
          "noty księgowe i potwierdzenia sald.",
        ],
      },
      { type: "note", text: LEGAL_NOTE },
    ],
  },
  {
    slug: "kiedy-potrzebne-doradztwo-podatkowe",
    title: "Kiedy przedsiębiorca może potrzebować profesjonalnego doradztwa podatkowego?",
    excerpt:
      "Bieżąca księgowość odpowiada na pytanie „jak to zaksięgować”. Doradztwo podatkowe – na pytanie „jakie będą skutki tej decyzji”. Kiedy warto po nie sięgnąć?",
    category: "podatki",
    readingMinutes: 6,
    publishedAt: "2026-10-09",
    tags: ["doradztwo podatkowe", "doradca podatkowy", "decyzje biznesowe"],
    body: [
      {
        type: "p",
        text: "Biuro rachunkowe dba o poprawną ewidencję i rozliczenia. Są jednak sytuacje, w których potrzebna jest analiza skutków podatkowych przed podjęciem decyzji. Wtedy warto skorzystać z pomocy osoby posiadającej uprawnienia doradcy podatkowego.",
      },
      { type: "h2", text: "Typowe sytuacje" },
      {
        type: "ul",
        items: [
          "planowana zmiana formy prawnej lub formy opodatkowania,",
          "nowy model biznesowy albo nowe źródło przychodów,",
          "transakcje z podmiotami zagranicznymi,",
          "sprzedaż lub przekazanie istotnego majątku,",
          "otrzymanie pisma od organu podatkowego,",
          "wątpliwości, których nie rozstrzyga jednoznacznie treść przepisów.",
        ],
      },
      { type: "h2", text: "Jak przygotować się do konsultacji" },
      {
        type: "p",
        text: "Opisz sytuację możliwie dokładnie, zbierz dokumenty, których dotyczy pytanie, i określ, do kiedy potrzebujesz odpowiedzi. Im pełniejsza informacja, tym trafniejsza analiza.",
      },
      { type: "h2", text: "Czego nie oczekiwać" },
      {
        type: "p",
        text: "Rzetelny doradca nie zagwarantuje konkretnego rozstrzygnięcia organu i nie zaproponuje rozwiązań, których jedynym celem jest uniknięcie podatku. Jego rolą jest wskazanie ryzyk i możliwych wariantów działania.",
      },
      { type: "note", text: LEGAL_NOTE },
    ],
  },
  {
    slug: "sklep-internetowy-ksiegowosc",
    title: "Księgowość sklepu internetowego – na co zwrócić uwagę?",
    excerpt:
      "Sprzedaż online generuje dużo drobnych transakcji z wielu źródeł. Dobrze ustawiony obieg raportów z platform i płatności to podstawa sprawnej księgowości.",
    category: "dokumenty",
    readingMinutes: 5,
    publishedAt: "2026-10-16",
    tags: ["e-commerce", "sklep internetowy", "raporty sprzedaży", "płatności online"],
    body: [
      {
        type: "p",
        text: "Sklep internetowy to często setki transakcji miesięcznie, kilka metod płatności i sprzedaż przez więcej niż jeden kanał. Z perspektywy księgowości najważniejsze jest, aby wszystkie te źródła dało się ze sobą uzgodnić.",
      },
      { type: "h2", text: "Źródła danych" },
      {
        type: "ul",
        items: [
          "system sklepu lub platforma sprzedażowa,",
          "raporty operatorów płatności,",
          "wyciągi bankowe,",
          "dokumenty zwrotów i reklamacji,",
          "faktury od dostawców i firm kurierskich.",
        ],
      },
      { type: "h2", text: "Uzgadnianie wpływów" },
      {
        type: "p",
        text: "Operatorzy płatności zwykle przekazują środki zbiorczo, po potrąceniu prowizji. Aby prawidłowo rozliczyć sprzedaż, trzeba powiązać wypłaty z konkretnymi zamówieniami – stąd znaczenie regularnych raportów.",
      },
      { type: "h2", text: "Sprzedaż zagraniczna" },
      {
        type: "p",
        text: "Sprzedaż do klientów z innych krajów może wiązać się z dodatkowymi obowiązkami. Ich zakres zależy od aktualnych przepisów i skali sprzedaży – przed wejściem na nowy rynek warto skonsultować się z doradcą podatkowym.",
      },
      { type: "note", text: LEGAL_NOTE },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
