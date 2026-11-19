import { UPLOAD_LIMITS } from "@/config/booking";
import { LIMITS } from "@/lib/booking/schema";

/**
 * SŁOWNIK POLSKI — język domyślny. Wszystkie teksty interfejsu i treści strony.
 * Słownik angielski (`en.ts`) musi mieć dokładnie te same klucze — pilnuje tego TypeScript.
 *
 * Fragmenty w [[podwójnych nawiasach]] są wyświetlane jako oznaczone miejsca do uzupełnienia przez studio.
 */

const mb = (bytes: number) => `${Math.round(bytes / (1024 * 1024))} MB`;

export const pl = {
  meta: {
    title: "SUMI — japońska sztuka tatuażu | Studio tatuażu w Warszawie",
    titleTemplate: "%s | SUMI — studio tatuażu w Warszawie",
    description:
      "Studio tatuażu w Warszawie inspirowane japońską sztuką. Autorskie projekty, indywidualne konsultacje i dopracowana kompozycja — od pierwszej rozmowy po pielęgnację.",
    keywords: ["studio tatuażu Warszawa", "tatuaż japoński", "irezumi", "tatuator Warszawa", "tatuaż autorski", "cienka linia", "tatuaż czarno-szary"],
    pages: {
      booking: {
        title: "Zaprojektuj swój tatuaż",
        description: "Opowiedz nam o swoim pomyśle na tatuaż: styl, miejsce, rozmiar, budżet i zdjęcia inspiracji. Formularz konsultacji studia w Warszawie.",
      },
      terms: { title: "Regulamin", description: "Zasady korzystania ze strony i formularza konsultacji studia." },
      privacy: { title: "Polityka prywatności", description: "Jak studio przetwarza dane osobowe przekazane przez formularz konsultacji." },
    },
  },

  common: {
    skipToContent: "Przejdź do treści",
    homeLink: (name: string) => `${name} — strona główna`,
    backToStudio: "Wróć do studia",
    homepage: "Strona główna",
    close: "Zamknij",
    optional: "Opcjonalnie",
    todo: "do uzupełnienia",
    todoBy: "Do uzupełnienia przez studio:",
    samplePhotos: "Zdjęcia poglądowe",
    language: {
      label: "Język strony",
      switchTo: "Zmień język na",
      names: { pl: "Polski", en: "English" },
      changed: "Język strony: polski",
    },
  },

  nav: {
    label: "Nawigacja główna",
    items: {
      top: "Start",
      gallery: "Galeria",
      about: "O nas",
      specialties: "Specjalizacje",
      reviews: "Opinie",
      pricing: "Cennik",
      faq: "Pytania",
    },
    book: "Rezerwacja",
    bookLong: "Zaprojektuj swój tatuaż",
    menu: "Menu",
    menuTitle: "Nawigacja",
    menuClose: "Zamknij menu",
  },

  hero: {
    title: "Japońska sztuka tatuażu w Warszawie",
    lead: "Autorskie projekty tatuaży inspirowane japońską sztuką — jej symboliką, proporcjami i harmonią. Każdy projekt zaczynamy od rozmowy o Twojej historii.",
    ctaPrimary: "Zaprojektuj swój tatuaż",
    ctaSecondary: "Zobacz prace",
    screenLabel: "Wybrane prace na parawanie byōbu",
    scrollHint: "Przewiń, aby zobaczyć galerię",
  },

  gallery: {
    title: "Galeria tatuaży",
    lead: "Prace w pełnej skali. Wybierz zdjęcie, aby obejrzeć je w powiększeniu.",
    sampleNote: "Zdjęcia poglądowe — zostaną zastąpione realizacjami studia. Prace podpisane nazwiskiem pochodzą od innych autorów.",
    filterLabel: "Filtruj według stylu",
    all: "Wszystkie",
    shown: (count: number) => `Wyświetlane prace: ${count}`,
    enlarge: "Powiększ:",
    credit: (author: string) => `Autor: ${author}`,
    lightbox: {
      label: (title: string) => `Podgląd: ${title}`,
      close: "Zamknij podgląd",
      prev: "Poprzednie",
      next: "Następne",
      counter: (index: number, total: number) => `${index} z ${total}`,
      thumbnails: "Miniatury zdjęć",
      thumbnail: (title: string) => `Pokaż: ${title}`,
    },
    styles: {
      "black-grey": "Czerń i szarość",
      "fine-line": "Cienka linia",
      ornamental: "Ornament",
      blackwork: "Pełna czerń",
      color: "Kolor",
    },
  },

  work: {
    items: {
      "candle-lantern": {
        title: "Świeca i latarnia",
        placement: "Pełny rękaw",
        alt: "Kolorowy rękaw na czarnym tle: płonąca świeca, sylwetki postaci i świecąca latarnia",
      },
      "wolf-peony": {
        title: "Wilk i piwonie",
        placement: "Ramię",
        alt: "Tatuaż w czerni i szarości na ramieniu: wilk otoczony kwiatami piwonii i liśćmi",
      },
      "lotus-spine": { title: "Lotos", placement: "Plecy", alt: "Delikatny tatuaż kwiatu lotosu z ornamentem wzdłuż kręgosłupa" },
      "skull-anubis": {
        title: "Czaszka i Anubis",
        placement: "Pełny rękaw",
        alt: "Realistyczny rękaw w czerni i szarości: czaszka, głowa Anubisa i skorpion na dłoni",
      },
      "tiger-chest": { title: "Tygrys", placement: "Klatka piersiowa", alt: "Realistyczny tatuaż głowy tygrysa na klatce piersiowej" },
      "floral-mandala": {
        title: "Róża i mandala",
        placement: "Przedramię",
        alt: "Tatuaż na przedramieniu: róża, mandala i kwiaty hibiskusa w cieniowaniu czernią",
      },
      "polynesian-sleeve": {
        title: "Rękaw polinezyjski",
        placement: "Pełny rękaw",
        alt: "Rękaw w stylu polinezyjskim od barku po nadgarstek, widok z boku",
      },
      "tigers-leg": { title: "Trzy tygrysy", placement: "Łydka", alt: "Trzy tygrysy narysowane cienkim konturem na łydce" },
      "lotus-hip": { title: "Lotos z piórami", placement: "Biodro", alt: "Ornamentalny tatuaż lotosu z zawieszonymi piórami na biodrze i udzie" },
      "fine-line-lettering": { title: "C'est la vie", placement: "Ramię", alt: "Cienki, kaligraficzny napis „C'est la vie” na ramieniu" },
      "ship-shoulder": {
        title: "Żaglowiec",
        placement: "Ramię",
        alt: "Kolorowy tatuaż żaglowca na ramieniu, pod nim postać w kapeluszu",
      },
      "money-mask": { title: "Maska i banknoty", placement: "Pełny rękaw", alt: "Realistyczny rękaw: kobieca twarz, maska i banknoty" },
      polynesian: {
        title: "Ornament polinezyjski",
        placement: "Klatka piersiowa i rękaw",
        alt: "Tatuaż w stylu polinezyjskim obejmujący klatkę piersiową, bark i całe ramię",
      },
      "spider-color": { title: "Pająk i pajęczyna", placement: "Głowa", alt: "Kolorowy tatuaż pająka z pajęczyną na boku głowy" },
      "lotus-thighs": { title: "Lotosy w symetrii", placement: "Uda", alt: "Dwa symetryczne ornamentalne tatuaże lotosu z tyłu ud" },
      "clown-mask": {
        title: "Dwie maski",
        placement: "Przedramię",
        alt: "Realistyczny tatuaż na przedramieniu: postać z makijażem klauna i maska",
      },
      "tiger-calf": { title: "Tygrys i słońce", placement: "Łydka", alt: "Tygrys narysowany konturem i ornamentalne słońce na łydce" },
      "cards-dice": { title: "Karty i kości", placement: "Przedramię", alt: "Tatuaż w czerni i szarości: karty, kości do gry, łańcuch i bila numer osiem" },
      "mask-calf": { title: "Maska", placement: "Łydka", alt: "Tatuaż na łydce: maska, kobieca twarz i worek z pieniędzmi" },
      "spider-chest": { title: "Pająk", placement: "Klatka piersiowa", alt: "Mały, wypełniony czernią tatuaż pająka na środku klatki piersiowej" },
    },
  },

  about: {
    srTitle: "O nas.",
    chaptersLabel: "Rozdziały sekcji O nas",
    chapters: ["Filozofia", "Inspiracje", "Podejście", "Rzemiosło", "Doświadczenie", "Wartości"],
    philosophy: {
      title: "Więcej niż tusz. Forma sztuki.",
      paragraphs: [
        "Tatuaż to coś więcej niż obraz naniesiony na skórę. To osobista historia, emocje, symbolika i sposób wyrażania własnej tożsamości.",
        "W naszym studio wierzymy, że każdy projekt powinien mieć swój charakter i znaczenie. Nie tworzymy tatuaży według jednego schematu. Każdy pomysł traktujemy indywidualnie, zwracając uwagę na estetykę, kompozycję, detale i osobiste oczekiwania klienta.",
        "Inspirujemy się japońską sztuką, w której znaczenie mają nie tylko przedstawione motywy, ale również ich symbolika, proporcje i harmonia.",
      ],
      quote: "Naszym celem jest tworzenie prac, które pozostają wartościowe zarówno wizualnie, jak i emocjonalnie.",
    },
    heritage: {
      title: "Zakorzenieni w japońskiej sztuce.",
      paragraphs: [
        "Japońska sztuka tatuażu posiada bogatą tradycję, w której każdy motyw może opowiadać własną historię.",
        "Smoki, karpie koi, kwiaty wiśni, fale, tygrysy czy maski Hannya to nie tylko efektowne wzory. Są częścią kultury wizualnej pełnej symboliki i odniesień do natury, siły, przemiany oraz ludzkich doświadczeń.",
        "Czerpiemy inspirację z tej tradycji, jednocześnie traktując ją jako punkt wyjścia do współczesnej interpretacji.",
        "Zależy nam na szacunku do źródeł inspiracji, świadomym projektowaniu i dopracowanej kompozycji.",
      ],
      motifsLabel: "Motywy japońskiego tatuażu i ich znaczenie",
      motifs: [
        { kanji: "龍", name: "Smok", meaning: "Siła, mądrość i opiekuńcza moc żywiołu wody." },
        { kanji: "鯉", name: "Karp koi", meaning: "Wytrwałość i przemiana — karp, który pokonuje wodospad, staje się smokiem." },
        { kanji: "桜", name: "Kwiat wiśni", meaning: "Piękno i ulotność chwili." },
        { kanji: "波", name: "Fala", meaning: "Potęga natury i nieustanny ruch życia." },
        { kanji: "虎", name: "Tygrys", meaning: "Odwaga, siła i ochrona." },
        { kanji: "般若", name: "Maska Hannya", meaning: "Maska teatru nō — gniew i zazdrość, ale też talizman chroniący przed złem." },
      ],
    },
    approach: {
      title: "Twoja historia. Twój projekt. Twój tatuaż.",
      paragraphs: [
        "Każdy człowiek ma inną historię, estetykę i pomysł na siebie. Dlatego proces tworzenia tatuażu rozpoczynamy od rozmowy i poznania oczekiwań klienta.",
        "Chcemy zrozumieć, co stoi za danym pomysłem, jakie znaczenie ma wybrany motyw i jaki efekt wizualny klient chce osiągnąć.",
        "Na tej podstawie dobierana jest koncepcja projektu, jego kompozycja, wielkość oraz umiejscowienie na ciele.",
        "Nie chodzi wyłącznie o odwzorowanie pomysłu. Chodzi o stworzenie projektu, który będzie przemyślany i dopasowany do konkretnej osoby.",
      ],
      stepsLabel: "Jak powstaje projekt",
      steps: [
        { title: "Rozmowa", text: "Poznajemy pomysł, jego znaczenie i efekt, który chcesz osiągnąć." },
        { title: "Koncepcja", text: "Na tej podstawie wybieramy kierunek i charakter projektu." },
        { title: "Kompozycja i wielkość", text: "Dopracowujemy układ, skalę i proporcje motywu." },
        { title: "Umiejscowienie", text: "Dobieramy miejsce na ciele, które najlepiej poprowadzi grafikę." },
      ],
    },
    craft: {
      title: "Każdy detal ma znaczenie.",
      paragraphs: [
        "Dobry tatuaż wymaga znacznie więcej niż umiejętności wykonania wzoru.",
        "Liczy się projekt, proporcja, odpowiednia kompozycja, precyzja linii, praca z kontrastem oraz zrozumienie tego, jak grafika będzie prezentować się na ludzkim ciele.",
        "W naszym podejściu estetyka i jakość wykonania są równie ważne.",
        "Zwracamy uwagę na detale, ponieważ to właśnie one decydują o charakterze całej pracy.",
      ],
      items: [
        { term: "Projekt", text: "Rysunek przygotowany z myślą o skórze, a nie przeniesiony wprost z ekranu." },
        { term: "Proporcja", text: "Skala motywu dobrana do miejsca i sylwetki." },
        { term: "Kompozycja", text: "Rytm elementów, tło i przestrzeń wokół motywu." },
        { term: "Precyzja linii", text: "Czysty, pewny kontur prowadzony z wyczuciem." },
        { term: "Kontrast", text: "Świadoma praca światłem, cieniem i czernią." },
        { term: "Ciało", text: "Grafika, która współgra z ruchem i kształtem ciała." },
      ],
    },
    experience: {
      title: "Przestrzeń dla kreatywności.",
      paragraphs: [
        "Wizyta w studiu tatuażu powinna być przemyślanym i komfortowym doświadczeniem.",
        "Zależy nam na atmosferze, w której można spokojnie porozmawiać o swoim pomyśle, poznać proces projektowania i świadomie podjąć decyzję o wykonaniu tatuażu.",
        "Stawiamy na komunikację, przejrzystość i indywidualne podejście na każdym etapie współpracy.",
        "Od pierwszego kontaktu, przez konsultację i przygotowanie projektu, aż po wykonanie tatuażu i wskazówki dotyczące pielęgnacji.",
      ],
      journeyLabel: "Etapy współpracy",
      journey: [
        { title: "Pierwszy kontakt", text: "Formularz lub wiadomość z opisem pomysłu." },
        { title: "Konsultacja", text: "Rozmowa o motywie, stylu, wielkości i miejscu." },
        { title: "Projekt", text: "Przygotowanie projektu dopasowanego do Ciebie." },
        { title: "Wykonanie", text: "Sesja w spokojnej, komfortowej atmosferze." },
        { title: "Pielęgnacja", text: "Wskazówki, jak dbać o tatuaż po sesji." },
      ],
    },
    values: {
      title: "Nasze wartości",
      items: [
        { kanji: "芸", name: "Artyzm", text: "Każdy projekt traktujemy jako indywidualną pracę artystyczną." },
        { kanji: "精", name: "Precyzja", text: "Dbamy o kompozycję, detale i jakość wykonania." },
        { kanji: "個", name: "Indywidualność", text: "Szanujemy osobisty charakter każdego pomysłu." },
        { kanji: "信", name: "Zaufanie", text: "Stawiamy na uczciwą komunikację, przejrzyste zasady i świadome decyzje klientów." },
      ],
    },
    closing: {
      title: "Sztuka, która staje się częścią Ciebie.",
      text: "Odkryj sztukę tatuażu inspirowaną Japonią. Poznaj nasze prace, opowiedz nam o swoim pomyśle i rozpocznij proces tworzenia własnego projektu.",
      cta: "Rozpocznij swój projekt",
    },
  },

  specialties: {
    title: "Nasze specjalizacje",
    lead: "Kierunki, w których pracujemy. Wybierz styl, aby zobaczyć przykład i krótki opis.",
    placeholder: "Miejsce na zdjęcie pracy w tym stylu",
    seeWork: "Zobacz prace w tym stylu",
    items: {
      "japanese-traditional": {
        name: "Tradycyjny styl japoński",
        description:
          "Klasyczne motywy irezumi: wyraźny kontur, płaskie wypełnienia i tło z fal, chmur lub wiatru, które spaja całą kompozycję z linią ciała.",
      },
      "japanese-neo-traditional": {
        name: "Neotradycyjny styl japoński",
        description: "Tradycyjne japońskie motywy w świeższej formie — bogatsze przejścia tonalne, swobodniejsza paleta i współczesne proporcje.",
      },
      "black-grey": {
        name: "Czerń i szarość",
        description: "Praca samą czernią i jej rozcieńczeniami. Miękkie cieniowanie, głęboki kontrast i światło budowane odcieniem szarości.",
      },
      "fine-line": {
        name: "Cienka linia",
        description: "Cienka, precyzyjna linia i dużo oddechu wokół motywu. Dla subtelnych projektów, liternictwa i drobnych form.",
      },
      "japanese-symbolism": {
        name: "Japońska symbolika",
        description:
          "Tygrys, smok, karp koi, kwiat wiśni, maska Hannya. Motywy dobierane świadomie — z uwagą na ich znaczenie i wzajemne relacje w kompozycji.",
      },
      custom: {
        name: "Projekty indywidualne",
        description:
          "Projekt rysowany od zera na podstawie Twojej historii. Kompozycja, skala i umiejscowienie dopasowane do konkretnej osoby i miejsca na ciele.",
      },
    },
  },

  reviews: {
    title: "Opinie klientów",
    emptyLead: "Tu pojawią się prawdziwe opinie klientów studia, zdjęcia zagojonych prac i materiały z mediów społecznościowych.",
    slotReview: "Miejsce na opinię klienta: ocena, treść, imię i źródło",
    slotPhoto: "Miejsce na zdjęcie od klienta lub wpis z mediów społecznościowych",
    readAll: "Przeczytaj wszystkie opinie",
    instagram: "Obserwuj na Instagramie",
    rating: (value: number) => `Ocena ${value} na 5`,
    summary: (average: string, count: number) => `Średnia ocena ${average} na 5. Liczba opinii: ${count}`,
    prev: "Poprzednie opinie",
    next: "Następne opinie",
    listLabel: "Opinie klientów",
  },

  pricing: {
    title: "Cennik",
    lead: "Sprawdź orientacyjny koszt tatuażu. Wybierz rozmiar, miejsce, poziom szczegółowości i charakter projektu.",
    groups: { size: "Rozmiar", placement: "Miejsce na ciele", detail: "Poziom szczegółowości", character: "Charakter projektu" },
    sizes: {
      small: { label: "Mały", detail: "do 5 cm" },
      medium: { label: "Średni", detail: "5–15 cm" },
      large: { label: "Duży", detail: "15–30 cm" },
      "extra-large": { label: "Bardzo duży", detail: "ponad 30 cm" },
    },
    placements: {
      forearm: "Przedramię",
      "upper-arm": "Ramię",
      thigh: "Udo",
      calf: "Łydka",
      back: "Plecy",
      chest: "Klatka piersiowa",
      neck: "Szyja",
      hand: "Dłoń",
    },
    detail: {
      simple: { label: "Prosty", description: "Kontur, niewiele wypełnień" },
      detailed: { label: "Szczegółowy", description: "Cieniowanie, więcej elementów" },
      intricate: { label: "Bardzo szczegółowy", description: "Gęsta kompozycja, drobny detal" },
    },
    character: {
      "fine-line": "Cienka linia i liternictwo",
      "black-grey": "Czerń i szarość",
      japanese: "Tradycyjny japoński",
      color: "Kolor i neotradycja",
    },
    rulerLabel: "Skala rozmiaru w centymetrach",
    resultLabel: "Szacunkowy przedział",
    sampleNote: "Wartości przykładowe: studio uzupełni swój cennik. Do tego czasu wynik ma wyłącznie charakter poglądowy.",
    finalNote: "Ostateczna cena zależy od indywidualnej wyceny tatuatora po poznaniu projektu.",
    cta: "Umów konsultację",
    ctaNote: "Wybrane parametry przeniesiemy do formularza.",
    currency: "zł",
    factorsLabel: "Co wpływa na wynik",
  },

  faq: {
    title: "Najczęściej zadawane pytania",
    lead: "Odpowiedzi na pytania, które padają najczęściej przed pierwszą wizytą.",
    searchLabel: "Szukaj w pytaniach",
    searchPlaceholder: "np. zadatek, pielęgnacja",
    clearSearch: "Wyczyść wyszukiwanie",
    noResults: "Brak pytań pasujących do wyszukiwania. Spróbuj innego słowa.",
    results: (count: number) => `Wyniki wyszukiwania: ${count}`,
    categoriesLabel: "Kategorie pytań",
    categories: [
      {
        id: "booking",
        label: "Rezerwacje i terminy",
        items: [
          {
            q: "Jak umówić się na tatuaż?",
            a: [
              "Najwygodniej przez formularz „Zaprojektuj swój tatuaż” — krok po kroku opiszesz pomysł, styl, miejsce i rozmiar, a także dodasz zdjęcia inspiracji. Studio odpowiada i proponuje dalsze kroki.",
              "Wysłanie formularza nie jest jeszcze rezerwacją terminu. Termin potwierdza studio po zapoznaniu się z projektem.",
            ],
          },
          { q: "Jak długo czeka się na termin?", a: ["[[orientacyjny czas oczekiwania na konsultację i na sesję]]"] },
          { q: "Czy mogę przełożyć lub odwołać wizytę?", a: ["[[zasady zmiany i odwołania terminu, w tym wymagany czas wyprzedzenia]]"] },
          {
            q: "Czy konsultacja jest obowiązkowa?",
            a: ["[[kiedy studio wymaga konsultacji, czy odbywa się na miejscu czy online i czy jest płatna]]"],
          },
        ],
      },
      {
        id: "pricing",
        label: "Ceny i płatności",
        items: [
          {
            q: "Ile kosztuje tatuaż?",
            a: [
              "Cena zależy od rozmiaru, miejsca na ciele, poziomu szczegółowości i charakteru projektu. Kalkulator w sekcji „Cennik” pokazuje orientacyjny przedział, ale ostateczną wycenę zawsze przygotowuje tatuator po poznaniu projektu.",
            ],
          },
          {
            q: "Czy pobierany jest zadatek?",
            a: ["[[czy studio pobiera zadatek, w jakiej wysokości i na jakich zasadach jest zwracany lub zaliczany na poczet ceny]]"],
          },
          { q: "Jakie formy płatności są dostępne?", a: ["[[dostępne formy płatności w studiu]]"] },
          { q: "Jak rozliczane są duże projekty?", a: ["[[sposób rozliczania projektów wielosesyjnych, np. za sesję lub za cały projekt]]"] },
        ],
      },
      {
        id: "preparation",
        label: "Przygotowanie do tatuażu",
        items: [
          { q: "Jak przygotować się do wizyty?", a: ["[[zalecenia studia przed sesją: sen, posiłek, nawodnienie, ubiór, czego unikać]]"] },
          {
            q: "Czy mogę przyjść z własnym projektem?",
            a: [
              "Tak — w formularzu wybierz opcję „Istniejąca koncepcja” i dołącz zdjęcia lub szkice. Tatuator oceni projekt i zaproponuje ewentualne zmiany kompozycji, wielkości lub umiejscowienia.",
              "[[zasady studia dotyczące wykonywania cudzych projektów i praw autorskich]]",
            ],
          },
          {
            q: "Czy są przeciwwskazania do tatuowania?",
            a: [
              "Jeśli masz wątpliwości zdrowotne, przyjmujesz leki lub masz choroby skóry, skonsultuj się z lekarzem przed wizytą i poinformuj o tym tatuatora.",
              "[[lista przeciwwskazań przyjęta przez studio]]",
            ],
          },
        ],
      },
      {
        id: "process",
        label: "Przebieg tatuowania",
        items: [
          {
            q: "Jak wygląda proces od pomysłu do tatuażu?",
            a: [
              "Najpierw rozmowa o pomyśle i jego znaczeniu, potem koncepcja projektu, dopasowanie kompozycji i wielkości, wybór umiejscowienia — a na końcu sesja i wskazówki dotyczące pielęgnacji.",
            ],
          },
          { q: "Czy zobaczę projekt przed sesją?", a: ["[[kiedy i w jakiej formie klient otrzymuje projekt oraz ile poprawek obejmuje cena]]"] },
          { q: "Ile trwa sesja?", a: ["[[orientacyjna długość sesji dla małych, średnich i dużych projektów]]"] },
        ],
      },
      {
        id: "aftercare",
        label: "Pielęgnacja",
        items: [
          {
            q: "Jak pielęgnować świeży tatuaż?",
            a: [
              "Szczegółowe zalecenia przekazuje tatuator po zakończeniu sesji — stosuj się do nich, bo zależą od techniki i miejsca na ciele.",
              "[[zalecenia pielęgnacyjne studia: opatrunek, mycie, preparaty, czego unikać]]",
            ],
          },
          { q: "Czy poprawki są w cenie?", a: ["[[zasady i termin bezpłatnych poprawek]]"] },
        ],
      },
      {
        id: "safety",
        label: "Bezpieczeństwo i higiena",
        items: [
          {
            q: "Jakie standardy higieny stosuje studio?",
            a: ["[[opis procedur higienicznych studia: sterylizacja, materiały jednorazowe, dezynfekcja stanowiska]]"],
          },
          { q: "Jakich tuszy używacie?", a: ["[[informacja o stosowanych tuszach i ich zgodności z obowiązującymi przepisami]]"] },
          { q: "Od jakiego wieku można zrobić tatuaż?", a: ["[[zasady studia dotyczące wieku klientów i wymaganych dokumentów]]"] },
        ],
      },
    ],
  },

  booking: {
    title: "Zaprojektuj swój tatuaż",
    subtitle: "Twój pomysł. Nasza sztuka. Stwórzmy coś wyjątkowego.",
    intro:
      "Opowiedz nam o swoim tatuażu krok po kroku: pomyśle, stylu, miejscu, rozmiarze i inspiracjach. Na tej podstawie przygotujemy konsultację.",
    duration: "Zajmie to około 5–7 minut. Sześć krótkich kroków.",
    steps: [
      {
        short: "Twoje dane",
        title: "Poznajmy się.",
        description: "Zacznij od danych kontaktowych, abyśmy mogli odpowiedzieć w sprawie Twojego projektu.",
      },
      { short: "Koncepcja", title: "Opowiedz nam swoją historię.", description: "Każdy tatuaż zaczyna się od pomysłu. Opisz, co masz na myśli." },
      {
        short: "Styl i miejsce",
        title: "Określ swój styl.",
        description: "Wybierz kierunek artystyczny i miejsce na ciele, które najlepiej pasują do Twojej wizji.",
      },
      {
        short: "Rozmiar i budżet",
        title: "Porozmawiajmy o szczegółach.",
        description: "Rozmiar, budżet i termin pomogą nam przygotować realny plan projektu.",
      },
      {
        short: "Inspiracje",
        title: "Pokaż nam swoje inspiracje.",
        description: "Dodaj zdjęcia, szkice lub inne materiały, które pomogą nam zrozumieć Twoją wizję.",
      },
      { short: "Podsumowanie", title: "Twój projekt, Twoja wizja.", description: "Sprawdź odpowiedzi przed wysłaniem. Każdą część możesz edytować." },
    ],
    progress: {
      label: "Etapy formularza",
      stepOf: (step: number, total: number) => `Krok ${step} z ${total}`,
    },
    fields: {
      fullName: "Imię i nazwisko",
      email: "Adres e-mail",
      phone: "Numer telefonu",
      phoneHint: "Jeśli mieszkasz poza Polską, podaj numer z kierunkowym kraju.",
      contactMethod: "Preferowana forma kontaktu",
      contactEmail: "E-mail",
      contactPhone: "Telefon",
      description: "Opis tatuażu",
      descriptionHint: `Co najmniej ${LIMITS.description.min} znaków.`,
      descriptionPlaceholder: "Opisz swój pomysł, inspirację, symbolikę lub historię stojącą za tatuażem.",
      meaning: "Co ten tatuaż dla Ciebie znaczy?",
      firstTattoo: "Czy to Twój pierwszy tatuaż?",
      yes: "Tak",
      no: "Nie",
      designType: "Czy to zupełnie nowy projekt, czy istniejąca koncepcja?",
      designNew: "Nowy projekt",
      designExisting: "Istniejąca koncepcja",
      styles: "Styl tatuażu",
      stylesHint: "Możesz wybrać kilka.",
      placement: "Miejsce na ciele",
      placementNote: "Opisz miejsce",
      side: "Strona ciała",
      size: "Rozmiar tatuażu",
      budget: "Szacowany budżet",
      budgetHint: "Orientacyjny przedział pomaga zaplanować projekt. To nie jest wycena.",
      preferredDate: "Preferowany termin",
      preferredDateHint: "To tylko preferencja — dostępność potwierdzimy z Tobą.",
      preferredTime: "Preferowana pora dnia",
      charactersUsed: "Liczba znaków:",
    },
    options: {
      styles: {
        "japanese-traditional": { label: "Tradycyjny japoński", hint: "Wyraźny kontur, klasyczne motywy irezumi." },
        "japanese-neo-traditional": { label: "Neotradycyjny japoński", hint: "Tradycyjne motywy we współczesnej formie." },
        "black-grey": { label: "Czerń i szarość", hint: "Miękkie cieniowanie w odcieniach czerni." },
        "fine-line": { label: "Cienka linia", hint: "Cienkie, precyzyjne linie i delikatny detal." },
        realism: { label: "Realizm", hint: "Realistyczne portrety i przedmioty." },
        minimalist: { label: "Minimalizm", hint: "Małe, proste formy z dużą ilością przestrzeni." },
        other: { label: "Inny / jeszcze nie wiem", hint: "Pomożemy znaleźć właściwy kierunek." },
      },
      placements: {
        arm: "Ręka",
        forearm: "Przedramię",
        "upper-arm": "Ramię",
        "full-sleeve": "Pełny rękaw",
        chest: "Klatka piersiowa",
        back: "Plecy",
        neck: "Szyja",
        leg: "Noga",
        thigh: "Udo",
        calf: "Łydka",
        hand: "Dłoń",
        other: "Inne / jeszcze nie wiem",
      },
      sides: { left: "Lewa", right: "Prawa", both: "Obie", "not-sure": "Jeszcze nie wiem" },
      sizes: {
        small: { label: "Mały", detail: "do 5 cm" },
        medium: { label: "Średni", detail: "5–15 cm" },
        large: { label: "Duży", detail: "15–30 cm" },
        "extra-large": { label: "Bardzo duży", detail: "ponad 30 cm" },
        sleeve: { label: "Pełny rękaw lub duża kompozycja", detail: "projekt na kilka sesji" },
        "not-sure": { label: "Jeszcze nie wiem", detail: "ustalimy to razem" },
      },
      budgets: {
        "under-500": "Poniżej 500 zł",
        "500-1000": "500–1000 zł",
        "1000-2000": "1000–2000 zł",
        "2000-4000": "2000–4000 zł",
        "4000-plus": "Powyżej 4000 zł",
        consultation: "Najpierw potrzebuję konsultacji",
      },
      times: { any: "Dowolna", morning: "Rano", afternoon: "Po południu", evening: "Wieczorem" },
    },
    bodyMap: {
      caption: "Widok z przodu: Twoja prawa strona jest po lewej.",
      back: "Plecy oznaczone linią przerywaną.",
    },
    upload: {
      dropTitle: "Przeciągnij zdjęcia tutaj",
      limitReached: "Osiągnięto limit zdjęć",
      choose: "Wybierz zdjęcia",
      rules: `JPG, JPEG, PNG lub WEBP. Do ${UPLOAD_LIMITS.maxFiles} zdjęć, każde do ${mb(UPLOAD_LIMITS.maxSourceBytes)}. Przed wysłaniem zdjęcia są zmniejszane, a dane o lokalizacji usuwane.`,
      preparing: "Przygotowywanie…",
      listLabel: "Dodane zdjęcia",
      imageAlt: (index: number, name: string) => `Zdjęcie inspiracji ${index}: ${name}`,
      remove: (name: string) => `Usuń ${name}`,
      removed: (name: string) => `Usunięto: ${name}.`,
      errorType: (name: string) => `${name}: akceptowane są tylko zdjęcia JPG, JPEG, PNG i WEBP.`,
      errorSize: (name: string) => `${name}: plik jest większy niż ${mb(UPLOAD_LIMITS.maxSourceBytes)}.`,
      errorCount: (name: string) => `${name}: możesz dodać maksymalnie ${UPLOAD_LIMITS.maxFiles} zdjęć.`,
      errorUnreadable: (name: string) => `${name}: nie udało się odczytać zdjęcia. Zapisz je jako JPG lub PNG i spróbuj ponownie.`,
    },
    review: {
      groups: ["Dane osobowe", "Koncepcja tatuażu", "Styl i miejsce", "Rozmiar i budżet", "Zdjęcia inspiracji"],
      edit: "Edytuj",
      editGroup: (name: string) => `Edytuj: ${name}`,
      labels: {
        fullName: "Imię i nazwisko",
        email: "E-mail",
        phone: "Telefon",
        contactMethod: "Forma kontaktu",
        description: "Opis",
        meaning: "Znaczenie",
        firstTattoo: "Pierwszy tatuaż",
        design: "Projekt",
        styles: "Styl",
        placement: "Miejsce",
        side: "Strona",
        size: "Rozmiar",
        budget: "Budżet",
        date: "Preferowany termin",
        images: "Załączone",
      },
      noPreference: "Bez preferencji",
      noImages: "Brak zdjęć",
      privacyBefore: "Potwierdzam zapoznanie się z ",
      privacyLink: "Polityką prywatności",
      privacyAfter: " i rozumiem, w jaki sposób moje dane zostaną wykorzystane do odpowiedzi na to zapytanie.",
      accuracy: "Potwierdzam, że podane informacje są prawdziwe.",
    },
    summary: {
      title: "Twój projekt",
      empty: "Tu zobaczysz podsumowanie swoich wyborów.",
      images: (count: number) => `Zdjęcia inspiracji: ${count}`,
    },
    actions: {
      previous: "Wstecz",
      continue: "Dalej",
      cancel: "Anuluj",
      saveAndReview: "Zapisz i wróć do podsumowania",
      submit: "Wyślij swój projekt",
      submitting: "Wysyłanie…",
    },
    restored: "Przywróciliśmy wcześniej wpisane odpowiedzi.",
    startOver: "Zacznij od nowa",
    honeypot: "Pozostaw to pole puste",
    notConfigured: {
      title: "Formularz online nie jest jeszcze aktywny.",
      text: "Możesz go przejrzeć, ale zgłoszenia nie są jeszcze odbierane — studio musi najpierw podłączyć swoją skrzynkę.",
      contact: "Skontaktuj się ze studiem bezpośrednio:",
      submitDisabled: "Wysyłanie jest wyłączone, dopóki studio nie uruchomi formularza online.",
    },
    errors: {
      fullName: {
        required: "Podaj imię i nazwisko.",
        tooShort: "Imię i nazwisko wydaje się za krótkie.",
        tooLong: `Użyj maksymalnie ${LIMITS.fullName.max} znaków.`,
      },
      email: { required: "Podaj adres e-mail.", invalid: "Wpisz adres e-mail w formacie imie@przyklad.pl." },
      phone: {
        invalid: "Wpisz numer telefonu z 7–15 cyframi, np. +48 600 000 000.",
        requiredForPhone: "Podaj numer telefonu albo wybierz kontakt e-mailowy.",
      },
      contactMethod: { required: "Wybierz formę kontaktu." },
      description: {
        required: "Opisz swój pomysł na tatuaż.",
        tooShort: `Napisz trochę więcej — co najmniej ${LIMITS.description.min} znaków.`,
        tooLong: `Skróć opis do ${LIMITS.description.max} znaków.`,
      },
      meaning: { tooLong: `Skróć ten tekst do ${LIMITS.meaning.max} znaków.` },
      firstTattoo: { required: "Zaznacz, czy to Twój pierwszy tatuaż." },
      designType: { required: "Wybierz nowy projekt lub istniejącą koncepcję." },
      styles: { required: "Wybierz co najmniej jeden styl albo „Inny / jeszcze nie wiem”.", invalid: "Wybierz style z listy." },
      placement: { required: "Wybierz miejsce na ciele albo „Inne / jeszcze nie wiem”." },
      placementNote: { tooLong: `Użyj maksymalnie ${LIMITS.placementNote.max} znaków.` },
      side: { required: "Wybierz stronę ciała albo „Jeszcze nie wiem”." },
      size: { required: "Wybierz rozmiar albo „Jeszcze nie wiem”." },
      budget: { required: "Wybierz przedział budżetu albo „Najpierw potrzebuję konsultacji”." },
      preferredDate: {
        invalid: "Wpisz poprawną datę.",
        past: "Wybierz datę od dzisiaj.",
        tooFar: "Wybierz datę w ciągu najbliższego roku.",
      },
      preferredTime: { required: "Wybierz porę dnia." },
      privacyAccepted: { required: "Potwierdź zapoznanie się z Polityką prywatności." },
      accuracyConfirmed: { required: "Potwierdź, że podane informacje są prawdziwe." },
    },
    serverErrors: {
      not_configured: "Formularz online nie jest jeszcze aktywny, więc zgłoszenie nie zostało wysłane. Skontaktuj się ze studiem bezpośrednio.",
      unsupported_media_type: "Nieobsługiwany format żądania. Odśwież stronę i spróbuj ponownie.",
      too_large: "Zdjęcia są zbyt duże, aby wysłać je razem. Usuń jedno ze zdjęć lub użyj mniejszych plików.",
      rate_limited: "Zbyt wiele zgłoszeń z tego połączenia. Odczekaj kilka minut i spróbuj ponownie.",
      bad_request: "Nie udało się odczytać danych formularza. Spróbuj ponownie.",
      spam_suspected: "Nie udało się zweryfikować zgłoszenia. Odczekaj chwilę i spróbuj ponownie albo skontaktuj się ze studiem bezpośrednio.",
      verification_failed: "Weryfikacja nie powiodła się. Odśwież weryfikację i spróbuj ponownie.",
      invalid_file: "Jedno ze zdjęć jest uszkodzone, za duże lub ma nieobsługiwany format. Usuń je i spróbuj ponownie.",
      validation_failed: "Niektóre odpowiedzi wymagają poprawy.",
      delivery_failed: "Nie udało się dostarczyć zgłoszenia do studia. Twoje odpowiedzi są zachowane — spróbuj ponownie za chwilę.",
      network: "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie — Twoje odpowiedzi są zachowane.",
      unknown: (status: number) => `Serwer nie przyjął zgłoszenia (błąd ${status}). Spróbuj ponownie.`,
      imagesPending: "Zdjęcia są jeszcze przygotowywane. Poczekaj chwilę i spróbuj ponownie.",
      verificationMissing: "Dokończ weryfikację nad przyciskiem wysyłania.",
    },
    success: {
      title: "Dziękujemy za podzielenie się swoją wizją.",
      text: "Twój projekt został wysłany. Nasz zespół zapozna się ze zgłoszeniem i odpowie najszybciej, jak to możliwe.",
      reference: "Numer zgłoszenia:",
      note: "Wysłanie zgłoszenia nie oznacza potwierdzenia terminu wizyty. Skontaktujemy się z Tobą, aby ustalić szczegóły i datę.",
      back: "Wróć na stronę główną",
    },
    aside: {
      privacyTitle: "Twoja prywatność",
      privacyBefore: "Używamy Twoich danych wyłącznie do odpowiedzi na to zgłoszenie. Przeczytaj ",
      privacyLink: "Politykę prywatności",
      privacyAfter: ".",
      questionsTitle: "Masz pytania?",
      questionsText: "Skontaktuj się ze studiem bezpośrednio:",
      contactTodo: "Dane kontaktowe studia: do uzupełnienia",
      confirmationTitle: "To nie jest rezerwacja",
      confirmationText: "Wysłanie formularza nie rezerwuje terminu. Studio skontaktuje się z Tobą, aby ustalić datę.",
    },
  },

  footer: {
    navLabel: "Stopka",
    studio: "Studio",
    contact: "Kontakt",
    social: "Media społecznościowe",
    info: "Informacje",
    links: { about: "O nas", gallery: "Galeria", specialties: "Specjalizacje", pricing: "Cennik", faq: "Pytania", contact: "Kontakt" },
    todo: { address: "Adres studia", email: "E-mail", phone: "Telefon", hours: "Godziny pracy", socials: "Profile społecznościowe" },
    openMaps: "Otwórz w mapach",
    rights: (year: number, name: string) => `© ${year} ${name}. Wszelkie prawa zastrzeżone.`,
    copyright: "Projekty i zdjęcia prac są chronione prawem autorskim.",
  },

  legal: {
    draftNote:
      "Wersja robocza dokumentu. Przed publikacją strony uzupełnij dane oznaczone jako „do uzupełnienia” i przekaż treść do weryfikacji prawnikowi.",
    updated: "Ostatnia aktualizacja:",
    date: "data",
    links: { terms: "Regulamin", privacy: "Polityka prywatności" },
  },

  notFound: {
    title: "Ta strona nie istnieje.",
    text: "Adres mógł się zmienić albo zawierać literówkę. Wróć na stronę główną, aby zobaczyć prace studia.",
    back: "Wróć na stronę główną",
  },
};

export type Dictionary = typeof pl;
