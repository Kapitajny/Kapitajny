import type { PluralForms } from "./config";

/**
 * Teksty strony po polsku (język domyślny).
 * Wersja angielska w `en.ts` musi mieć dokładnie te same klucze – pilnuje tego typ `Dictionary`.
 */

export const pl = {
  meta: {
    title: "NOIR STUDIO – studio fotograficzne w Warszawie",
    description:
      "NOIR STUDIO to warszawskie studio fotograficzne: śluby, portrety, moda, fotografia komercyjna i sesje osobiste. Spokojne, przemyślane zdjęcia, które przetrwają dłużej niż dzień, w którym powstały.",
    ogTitle: "NOIR STUDIO – Chwile stają się ponadczasowe",
    ogLocale: "pl_PL",
    notFoundTitle: "Nie znaleziono strony",
  },

  common: {
    skipToContent: "Przejdź do treści",
    backToTop: "NOIR STUDIO, powrót na górę strony",
    city: "Warszawa",
    country: "Polska",
    visitsByAppointment: "Wizyty w studiu po wcześniejszym umówieniu",
    placeholder: "Zdjęcie zostanie dodane",
  },

  language: {
    label: "Język strony",
    /** Nazwy języków zawsze w ich własnym języku. */
    names: { pl: "Polski", en: "English" },
  },

  nav: {
    label: "Główna",
    footerLabel: "Stopka",
    menu: "Menu",
    menuDialog: "Menu strony",
    close: "Zamknij",
    items: { top: "Start", portfolio: "Portfolio", services: "Usługi", about: "O nas", contact: "Kontakt" },
  },

  hero: {
    titleLines: ["Chwile", "stają się", "ponadczasowe."],
    subtitle: "Fotografia to sztuka pamiętania.",
    cta: "Zobacz nasze prace",
    scroll: "Przewiń",
    scrollLabel: "Przewiń do portfolio",
  },

  portfolio: {
    title: "Wybrane prace",
    lead: "Śluby, portrety, moda, zlecenia dla firm i spokojniejsze historie rodzin we własnym domu. Wybierz dziedzinę, aby zobaczyć zdjęcia, które w niej zrobiliśmy, a potem otwórz dowolny kadr w pełnym widoku.",
    all: "Wszystkie",
    filterLabel: "Filtruj portfolio według kategorii",
    photos: { one: "zdjęcie", few: "zdjęcia", many: "zdjęć", other: "zdjęcia" } as PluralForms,
    /** {label} – nazwa kategorii, {count} – liczba, {photos} – odmienione „zdjęcie”. */
    showing: "{label}: {count} {photos}.",
    open: "Otwórz „{title}” w pełnym widoku",
    categories: {
      weddings: "Śluby",
      portraits: "Portrety",
      fashion: "Moda",
      commercial: "Dla firm",
      stories: "Historie osobiste",
    },
    items: {
      weddingVows: { title: "Przysięga przy ołtarzu", place: "Ceremonia w kościele" },
      portraitStudio: { title: "Studium jednego światła", place: "NOIR Studio, Warszawa" },
      fashionSummer: { title: "Lato, trzy pary okularów", place: "Lookbook w studiu" },
      commercialCamera: { title: "Aparat pod słońce", place: "Zdjęcie produktowe w plenerze" },
      storyMorning: { title: "Dziewiąty miesiąc, w ruchu", place: "Sesja ciążowa w studiu" },
      weddingWalk: { title: "Kiedy goście już wyszli", place: "Wilanów, Warszawa" },
      portraitWindow: { title: "Kożuch i jesienne światło", place: "Sesja w plenerze" },
      fashionStreet: { title: "Czerń na tle Pałacu", place: "Pałac Kultury i Nauki, Warszawa" },
      commercialProduct: { title: "Portret w pasiastej sukni", place: "Reprodukcja obrazu do katalogu" },
      storyKitchen: { title: "Niedzielne ciasto", place: "Lublin" },
      weddingDetails: { title: "Drugi kolczyk", place: "Warszawa" },
      storySea: { title: "Bałtyk, styczeń", place: "Łeba" },
      portraitHands: { title: "Dłonie pianisty", place: "Kraków" },
      fashionMotion: { title: "Czarna suknia w pół obrotu", place: "NOIR Studio, Warszawa" },
      commercialCraft: { title: "Ścieg siodlarski", place: "Pracownia kaletnicza, Poznań" },
      weddingDance: { title: "Pierwszy taniec, ostatnie świece", place: "Mazury" },
      storyLetters: { title: "Wszystko, co zachowała", place: "Toruń" },
      commercialArchitecture: { title: "Fasada o niebieskiej godzinie", place: "Gdańsk" },
      portraitArtist: { title: "Malarka wśród płócien", place: "Łódź" },
      fashionDetail: { title: "Klapa i srebro", place: "NOIR Studio, Warszawa" },
    },
  },

  lightbox: {
    dialog: "Podgląd zdjęć",
    photo: "Zdjęcie: {title}",
    counter: "Zdjęcie",
    prev: "Wstecz",
    next: "Dalej",
    prevLabel: "Poprzednie zdjęcie",
    nextLabel: "Następne zdjęcie",
    close: "Zamknij",
  },

  about: {
    title: "Za każdym kadrem kryje się historia.",
    name: "Maja Leśniak",
    role: "Założycielka i główna fotografka",
    story: [
      "NOIR STUDIO zaczęło się od jednego wynajętego pokoju w centrum Warszawy: jeden aparat, jedna lampa i rolka szarego tła. Wcześniej Maja przez lata asystowała fotografom mody i nauczyła się, jak wiele w zdjęciu rozstrzyga się, zanim padnie strzał migawki.",
      "Chciała przenieść tę dyscyplinę do zdjęć, które ludzie naprawdę zachowują: ze ślubu, z dłońmi rodzica, z dzieckiem w sobotni poranek. Studio nadal tak pracuje. Przyjmujemy mniej zleceń, niż moglibyśmy, i towarzyszymy każdemu od pierwszej rozmowy aż po ostatnią odbitkę.",
    ],
    quote: "Wolimy zrobić jedno zdjęcie, które zachowasz na czterdzieści lat, niż trzysta, które raz przewiniesz.",
    principlesTitle: "Jak pracujemy",
    principles: [
      {
        title: "Najpierw światło",
        text: "Zanim wyjmiemy aparat z torby, czytamy światło w pomieszczeniu. Tam rozstrzyga się większa część dobrego zdjęcia.",
      },
      {
        title: "Mniej reżyserii, więcej uważności",
        text: "Dajemy tyle wskazówek, ile trzeba, żeby poczuć się swobodnie, a potem odsuwamy się i czekamy na chwilę, która i tak by się wydarzyła.",
      },
      {
        title: "Uczciwy retusz",
        text: "Skóra pozostaje skórą. Poprawiamy światło i kolor, usuwamy to, co rozprasza, a resztę człowieka zostawiamy w spokoju.",
      },
    ],
    facts: [
      { term: "Za aparatem", detail: "Od 2012 roku" },
      { term: "Studio", detail: "Śródmieście, Warszawa" },
      { term: "Pracujemy", detail: "W Polsce i Europie" },
      { term: "Języki", detail: "Polski, angielski, włoski" },
    ],
  },

  services: {
    title: "Usługi",
    lead: "Każde zlecenie zaczynamy od rozmowy o tym, do czego mają służyć zdjęcia. Poniższy zakres to punkt wyjścia – szczegóły, harmonogram i wycenę dopasowujemy do Twojego dnia albo briefu.",
    scopeTitle: "Co obejmuje",
    items: {
      weddings: {
        name: "Fotografia ślubna",
        description:
          "Towarzyszymy dniu tak, jak naprawdę się toczy: tremie przed ceremonią, samej ceremonii, ludziom, którzy przyjechali, żeby przy niej być. Pracujemy cicho, reżyserujemy tylko wtedy, gdy to pomaga, i zostawiamy Wam archiwum, do którego Wasza rodzina wróci za trzydzieści lat.",
        scope: [
          "Reportaż z połowy albo z całego dnia",
          "Drugi fotograf na życzenie",
          "Krótka sesja portretowa we dwoje",
          "Galeria online z obrobionymi zdjęciami w ciągu sześciu tygodni",
          "Opcjonalnie album w lnianej oprawie i odbitki archiwalne",
        ],
        cta: "Zapytaj o termin ślubu",
      },
      portraits: {
        name: "Fotografia portretowa",
        description:
          "Dla osób, które potrzebują portretu, na którym wyglądają jak oni sami w dobry dzień, a nie jak filtr: artystów, autorów, założycieli firm, aktorów. Najpierw rozmawiamy, potem ustawiamy światło pod Twoją twarz i sposób, w jaki się trzymasz.",
        scope: [
          "Półtoragodzinna sesja w naszym studiu w Warszawie albo w plenerze",
          "Podpowiedzi co do ubrań i miejsca przed sesją",
          "Wspólny wybór ostatecznych kadrów",
          "Od ośmiu do piętnastu retuszowanych portretów w pełnej rozdzielczości",
          "Prawo do wykorzystania w prasie, książkach i marce osobistej",
        ],
        cta: "Zapytaj o sesję portretową",
      },
      fashion: {
        name: "Fotografia modowa",
        description:
          "Edytoriale, lookbooki i kampanie dla projektantów i marek. Zaczynamy od ubrania – jego ciężaru, kroju i tego, jak się porusza – i wokół niego budujemy plan zdjęciowy, casting i światło.",
        scope: [
          "Koncepcja kreatywna i moodboard",
          "Casting, stylizacja, koordynacja fryzjera i makijażysty",
          "Produkcja w studiu albo w plenerze",
          "Retusz według uzgodnionego standardu",
          "Licencje na druk, internet i media społecznościowe",
        ],
        cta: "Zapytaj o projekt modowy",
      },
      commercial: {
        name: "Fotografia komercyjna",
        description:
          "Produkty, wnętrza, architektura i ludzie, którzy tworzą firmę – fotografowani z tą samą starannością co nasze prace osobiste i dostarczani w formatach, z których Twój zespół naprawdę korzysta.",
        scope: [
          "Rozmowa przed produkcją i lista ujęć",
          "Produkty i martwa natura w studiu",
          "Wnętrza i architektura na miejscu",
          "Portrety zespołu i założycieli",
          "Pliki przygotowane do internetu, druku i sklepów online",
        ],
        cta: "Zapytaj o sesję dla firmy",
      },
      personal: {
        name: "Sesje osobiste",
        description:
          "Spokojne sesje w domu albo w miejscu, które jest dla Ciebie ważne: nowe dziecko, rodzina, para, rodzic, którego chcesz zapamiętać dokładnie takim, jaki jest. Bez studyjnych rekwizytów i prawie bez pozowania.",
        scope: [
          "Dwie–trzy godziny w domu albo w wybranym miejscu",
          "Wersje czarno-białe i kolorowe",
          "Galeria online do udostępnienia rodzinie",
          "Niewielki zestaw odbitek archiwalnych",
          "Możliwość zakupu vouchera podarunkowego",
        ],
        cta: "Zapytaj o sesję osobistą",
      },
    },
  },

  contact: {
    title: "Zaplanujmy Twoje zdjęcia.",
    lead: "Napisz, co masz na myśli, mniej więcej kiedy i kto stanie przed obiektywem. Odpowiemy z wolnymi terminami, planem sesji i wyceną.",
    studio: "Studio",
    visits: "Wizyty",
    visitsValue: "Po wcześniejszym umówieniu",
    email: "E-mail",
  },

  form: {
    name: "Imię i nazwisko",
    email: "Adres e-mail",
    session: "Rodzaj sesji",
    sessionPlaceholder: "Wybierz rodzaj sesji",
    date: "Preferowana data",
    optional: "(opcjonalnie)",
    message: "Wiadomość",
    messagePlaceholder: "Gdzie, kto i do czego mają służyć zdjęcia.",
    submit: "Wyślij zapytanie",
    sending: "Wysyłanie zapytania…",
    demoNote: "Wersja demonstracyjna: formularz nie jest jeszcze połączony ze skrzynką studia, więc zapytania nie są dostarczane.",
    sent: "Zapytanie wysłane. Odpowiadamy na każdą wiadomość w ciągu dwóch dni roboczych.",
    notConfigured: "Formularz demonstracyjny nie jest jeszcze połączony ze skrzynką studia, więc Twoje zapytanie nie zostało wysłane.",
    keptText: "Twój tekst nadal jest w formularzu, więc nic nie przepadło.",
    sendByEmail: "Wyślij je e-mailem",
    offline: "Brak połączenia. Sprawdź internet i spróbuj ponownie.",
    mail: {
      subject: "Zapytanie: {session}",
      fallbackSession: "fotografia",
      name: "Imię i nazwisko",
      date: "Preferowana data",
      flexible: "elastyczna",
    },
    sessionTypes: {
      wedding: "Fotografia ślubna",
      portrait: "Fotografia portretowa",
      fashion: "Fotografia modowa",
      commercial: "Fotografia komercyjna",
      personal: "Sesja osobista",
      other: "Coś innego",
    },
    errors: {
      nameMissing: "Wpisz imię i nazwisko.",
      nameLong: "Imię i nazwisko może mieć najwyżej 120 znaków.",
      emailMissing: "Wpisz adres e-mail, abyśmy mogli odpowiedzieć.",
      emailInvalid: "Wpisz adres e-mail w formacie nazwa@przyklad.pl.",
      session: "Wybierz rodzaj sesji.",
      dateInvalid: "Wpisz datę jako dzień, miesiąc i rok.",
      datePast: "Wybierz dzisiejszą albo późniejszą datę.",
      messageShort: "Napisz kilka słów o tym, co planujesz (co najmniej 10 znaków).",
      messageLong: "Wiadomość może mieć najwyżej 3000 znaków.",
    },
    api: {
      rateLimited: "Zbyt wiele prób. Odczekaj minutę i spróbuj ponownie.",
      badRequest: "Nie udało się odczytać zapytania. Odśwież stronę i spróbuj ponownie.",
      tooLarge: "Wiadomość jest za długa.",
      validation: "Niektóre pola wymagają poprawy.",
      deliveryFailed: "Nie udało się dostarczyć zapytania. Spróbuj ponownie za kilka minut.",
    },
  },

  footer: {
    note: "Fikcyjne studio zaprojektowane i zbudowane przez {agency} jako projekt demonstracyjny.",
  },

  notFound: {
    title: "Ten kadr jest pusty.",
    text: "Strona, której szukasz, nie istnieje albo została przeniesiona.",
    back: "Wróć do studia",
  },

  /** Teksty alternatywne zdjęć (opisują planowany kadr; po wgraniu zdjęcia opisz to, co na nim jest). */
  images: {
    heroDusk: "Fotograf klęczący o zmierzchu na wrzosowisku, z długim obiektywem na statywie skierowanym w dolinę",
    aboutPortrait: "Założycielka NOIR STUDIO podnosi aparat, obiektyw skierowany prosto na widza",
    cameraSunset: "Aparat na statywie zwrócony w stronę nisko stojącego słońca nad zamgloną doliną",
    cameraMountains: "Aparat z długim obiektywem na statywie nad zalesionymi wzgórzami i odległymi górami",
    weddingVows: "Para młoda trzyma się za ręce przed ołtarzem, obok ksiądz czyta przysięgę, w tle druhny w niebieskich sukienkach",
    weddingDance: "Pierwszy taniec pary w przyciemnionej sali oświetlonej świecami",
    weddingDetails: "Dłonie panny młodej zapinające perłowy kolczyk przed ceremonią",
    weddingWalk: "Nowożeńcy odchodzący o zmierzchu aleją drzew",
    portraitStudio: "Kobieta sfotografowana na gładkim ciemnym tle w jednym bocznym świetle",
    portraitWindow: "Uśmiechnięty mężczyzna w skórzanym kożuchu i wzorzystym szaliku, w ciepłym wieczornym świetle",
    portraitHands: "Zbliżenie dłoni starszego pianisty spoczywających na klawiszach",
    portraitArtist: "Malarka w pracowni wśród płócien, patrząca prosto w obiektyw",
    fashionSummer: "Trzy roześmiane młode kobiety w okularach przeciwsłonecznych i letnich ubraniach na beżowym tle",
    fashionMotion: "Materiał czarnej sukni uchwycony w obrocie na tle białej ściany",
    fashionStreet: "Czarno-białe zdjęcie modelki w czarnej sukni przy balustradzie, w tle Pałac Kultury i Nauki",
    fashionDetail: "Detal klapy szytej na miarę marynarki ze srebrną broszką",
    commercialCamera: "Dłoń unosząca lustrzankę z obiektywem pod słońce, na tle jasnego nieba",
    commercialProduct: "Reprodukcja obrazu olejnego: kobieta w pasiastej sukni z filiżanką, w zielonym fotelu na różowym tle",
    commercialCraft: "Dłonie kaletnika zszywające torbę przy warsztacie",
    commercialArchitecture: "Nowoczesna fasada biurowca z powtarzalnymi oknami o niebieskiej godzinie",
    storyKitchen: "Babcia i wnuczka pieką razem ciasto w małej kuchni",
    storyMorning: "Czarno-białe zdjęcie kobiety w ciąży w dżinsach, z rozwianymi włosami, na jasnym tle",
    storySea: "Ojciec i syn stojący zimą nad brzegiem Bałtyku",
    storyLetters: "Dłonie przeglądające stare rodzinne fotografie i listy na stole",
    serviceWeddings: "Para młoda trzyma się za ręce przed ołtarzem podczas ceremonii w kościele",
    servicePortraits: "Portret uśmiechniętego mężczyzny w skórzanym kożuchu",
    serviceFashion: "Modelka w czarnej sukni na tle Pałacu Kultury i Nauki, zdjęcie czarno-białe",
    serviceCommercial: "Reprodukcja obrazu olejnego przedstawiającego kobietę z filiżanką",
    servicePersonal: "Czarno-białe zdjęcie z sesji ciążowej, kobieta z rozwianymi włosami",
  },
};

export type Dictionary = typeof pl;
