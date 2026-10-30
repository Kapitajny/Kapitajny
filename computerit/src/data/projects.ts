/**
 * Portfolio – koncepcje demonstracyjne ComputerIT.
 *
 * Zrzuty ekranu leżą w `public/portfolio/<slug>/`. Projekt bez zrzutów (`shots: []`) dostaje okładkę
 * typograficzną zbudowaną z jego własnych tekstów – po dodaniu plików wystarczy uzupełnić `shots`.
 * Działające wersje demonstracyjne leżą w `public/demo/<slug>/` i są serwowane razem ze stroną ComputerIT –
 * `liveUrl` wskazuje na nie (albo na zewnętrzny adres), a `liveLabel` nazywa przycisk.
 */

export type Shot = {
  src: string;
  alt: string;
  caption: string;
  device: "desktop" | "mobile";
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  name: string;
  industry: string;
  summary: string;
  description: string[];
  scope: string[];
  note: string;
  liveUrl: string | null;
  liveLabel?: "Otwórz stronę" | "Otwórz sklep";
  /** Kolory okładki i ramek – zaczerpnięte z palety samego projektu. */
  palette: { background: string; foreground: string; accent: string };
  /** Cytaty z treści projektu – używane na okładce typograficznej. */
  lines: string[];
  /** Najważniejsze widoki i podstrony koncepcji. */
  structure?: string[];
  shots: Shot[];
};

const desktop = (slug: string, file: string, alt: string, caption: string): Shot => ({
  src: `/portfolio/${slug}/${file}.jpg`,
  alt,
  caption,
  device: "desktop",
  width: 2160,
  height: 1350,
});

const mobile = (slug: string, file: string, alt: string, caption: string): Shot => ({
  src: `/portfolio/${slug}/${file}.jpg`,
  alt,
  caption,
  device: "mobile",
  width: 780,
  height: 1688,
});

export const projects: Project[] = [
  {
    slug: "vantor-automotive",
    name: "VANTOR Automotive",
    industry: "Motoryzacja",
    summary: "Strona studia serwisowego i renowacyjnego dla samochodów sportowych i luksusowych z Warszawy.",
    description: [
      "Ciemna, filmowa estetyka podporządkowana samochodom: film wizerunkowy na pierwszym ekranie, duże kadry z warsztatu i spokojna typografia, która nie konkuruje ze zdjęciami.",
      "Strona prowadzi od oferty sześciu usług, przez opis procesu współpracy i przykładowe projekty renowacyjne, do formularza konsultacji, w którym klient opisuje swój samochód.",
    ],
    scope: [
      "Film wizerunkowy w sekcji głównej",
      "Oferta sześciu usług z zakresem prac",
      "Opis współpracy krok po kroku",
      "Prezentacja projektów renowacyjnych",
      "Orientacyjny cennik",
      "Formularz konsultacji z danymi samochodu",
      "Projekty polityki prywatności i regulaminu",
    ],
    note: "Marka, adres, dane kontaktowe, cennik i przedstawione realizacje są fikcyjne. Formularz działa w trybie demonstracyjnym.",
    liveUrl: "/demo/vantor-automotive/index.html",
    liveLabel: "Otwórz stronę",
    palette: { background: "#0b0b0b", foreground: "#f3f0e9", accent: "#b8955b" },
    lines: ["Więcej niż serwis.", "Standard, na który zasługuje Twój samochód."],
    shots: [
      desktop(
        "vantor-automotive",
        "desktop-strona-glowna",
        "Pierwszy ekran strony VANTOR Automotive: hasło „Więcej niż serwis.” obok szarego Porsche 911 w ciemnym warsztacie",
        "Pierwszy ekran z filmem wizerunkowym",
      ),
      desktop(
        "vantor-automotive",
        "desktop-oferta",
        "Sekcja oferty VANTOR Automotive z nagłówkiem „Kompleksowa opieka. Bez kompromisów.” i zdjęciem techników przy samochodach",
        "Oferta usług",
      ),
      desktop(
        "vantor-automotive",
        "desktop-renowacje",
        "Sekcja renowacji VANTOR Automotive z czerwonym klasycznym Ferrari na podnośniku",
        "Renowacje samochodów",
      ),
      desktop(
        "vantor-automotive",
        "desktop-projekt",
        "Opis projektu demonstracyjnego Porsche 911 z galerią zdjęć i listą przykładowych prac",
        "Projekt demonstracyjny z zakresem prac",
      ),
      desktop("vantor-automotive", "desktop-kontakt", "Sekcja kontaktu VANTOR Automotive z danymi studia i formularzem konsultacji", "Formularz konsultacji"),
      mobile("vantor-automotive", "mobile-strona-glowna", "Pierwszy ekran strony VANTOR Automotive na telefonie", "Wersja mobilna – pierwszy ekran"),
      mobile("vantor-automotive", "mobile-oferta", "Sekcja oferty VANTOR Automotive na telefonie", "Wersja mobilna – oferta"),
    ],
  },
  {
    slug: "sklep-kapitajny",
    name: "Sklep KAPITAJNY",
    industry: "Moda i odzież",
    summary: "Sklep internetowy marki odzieżowej z bluzami i spodniami w szerokich krojach – katalog, filtry, karta produktu i koszyk.",
    description: [
      "Monochromatyczny, mocny styl marki: ciężka, szeroka typografia, czarne tło i produkty na jasnych, studyjnych zdjęciach. Jedynym znakiem marki jest but – tak samo jak na ubraniach.",
      "Sklep skupia się na dwóch kategoriach. Każdy produkt ma opisany krój, dostępne kolory i rozmiary oraz tabelę wymiarów w centymetrach, a katalog można przeglądać według kroju, nowości i kolekcji.",
    ],
    scope: [
      "Katalog z kategoriami i filtrami",
      "Kolekcje i sekcja nowości",
      "Karta produktu z wyborem koloru i rozmiaru",
      "Tabela rozmiarów",
      "Wyszukiwarka i ulubione",
      "Koszyk i zamówienie demonstracyjne",
      "Regulamin, polityka prywatności, dostawa i zwroty",
    ],
    note: "W wersji podglądowej katalog, filtry, karta produktu, koszyk i zamówienie demonstracyjne działają w przeglądarce. Płatności, konta i wysyłka formularzy działają w pełnej wersji sklepu. Zdjęcia produktów są poglądowe.",
    liveUrl: "/demo/sklep-kapitajny/index.html",
    liveLabel: "Otwórz sklep",
    palette: { background: "#0b0b0b", foreground: "#f2f2f2", accent: "#ffffff" },
    lines: ["Bluzy. Spodnie. Nic ponad to."],
    shots: [
      desktop(
        "sklep-kapitajny",
        "desktop-strona-glowna",
        "Pierwszy ekran sklepu KAPITAJNY: hasło „Bluzy. Spodnie. Nic ponad to.” obok czarnej bluzy z nadrukiem buta i szerokich spodni",
        "Pierwszy ekran sklepu",
      ),
      desktop(
        "sklep-kapitajny",
        "desktop-kategorie",
        "Kategoria bluz z listą krojów: oversize, z kapturem, bez kaptura, rozpinane, z nadrukami",
        "Kategorie i kroje",
      ),
      desktop("sklep-kapitajny", "desktop-nowosci", "Sekcja „Nowa kolekcja” z kartami produktów, cenami i dostępnymi rozmiarami", "Nowa kolekcja"),
      desktop(
        "sklep-kapitajny",
        "desktop-produkt",
        "Karta produktu CORE Hoodie z galerią zdjęć, wyborem koloru i rozmiaru oraz przyciskiem dodania do koszyka",
        "Karta produktu",
      ),
      desktop("sklep-kapitajny", "desktop-koszyk", "Otwarty koszyk z bluzą CORE Hoodie w rozmiarze M i podsumowaniem wartości produktów", "Koszyk"),
      desktop("sklep-kapitajny", "desktop-kolekcje", "Sekcja kolekcji MONO, SOLE i EARTH ze zdjęciami produktów", "Kolekcje"),
      mobile("sklep-kapitajny", "mobile-strona-glowna", "Pierwszy ekran sklepu KAPITAJNY na telefonie", "Wersja mobilna – pierwszy ekran"),
      mobile("sklep-kapitajny", "mobile-nowosci", "Sekcja nowości sklepu KAPITAJNY na telefonie", "Wersja mobilna – nowości"),
    ],
  },
  {
    slug: "interpodatki",
    name: "InterPodatki",
    industry: "Księgowość",
    summary: "Strona biura rachunkowego z kalkulatorem abonamentu, porównaniem pakietów i podglądem panelu klienta.",
    description: [
      "Granatowa, spokojna kolorystyka i czytelne liczby budują zaufanie, którego oczekuje się od biura rachunkowego. Animowane tło i ilustracja panelu klienta na początku strony pokazują, jak współpraca wygląda na co dzień.",
      "Kalkulator przelicza szacunkowy abonament na bieżąco – na podstawie rodzaju działalności, usług, liczby dokumentów i pracowników – a ustawienia można przenieść do pełnej wyceny i zamówienia.",
    ],
    scope: [
      "Kalkulator abonamentu z wynikiem na żywo",
      "Porównanie pięciu pakietów",
      "Opis miesięcznego cyklu współpracy",
      "Film prezentujący serwis",
      "Formularz wyceny i zamówienie z płatnością demo",
      "Panel klienta w wersji demonstracyjnej",
      "FAQ i dokumenty prawne",
    ],
    note: "Marka jest fikcyjna, a ceny przykładowe. Formularze i płatność demo działają w przeglądarce – płatności nie są realizowane.",
    liveUrl: "/demo/interpodatki/index.html",
    liveLabel: "Otwórz stronę",
    palette: { background: "#0d1b33", foreground: "#eef3fb", accent: "#2f7bf6" },
    lines: ["Księgowość, która nadąża za Twoim biznesem."],
    shots: [
      desktop(
        "interpodatki",
        "desktop-strona-glowna",
        "Pierwszy ekran strony InterPodatki z logo i hasłem „Księgowość, która nadąża za Twoim biznesem.” na granatowym tle",
        "Pierwszy ekran z animowanym tłem",
      ),
      desktop(
        "interpodatki",
        "desktop-panel",
        "Ilustracja panelu klienta z liczbą zaksięgowanych dokumentów, wykresem przychodów i kosztów oraz kwotą abonamentu",
        "Ilustracja panelu klienta",
      ),
      desktop(
        "interpodatki",
        "desktop-kalkulator",
        "Kalkulator abonamentu z wyborem rodzaju działalności, usług, liczby dokumentów i szacunkową kwotą 700 zł",
        "Kalkulator abonamentu",
      ),
      desktop("interpodatki", "desktop-pakiety", "Tabela porównania pakietów Start, Biznes, Pro, Premium i Enterprise", "Porównanie pakietów"),
      desktop(
        "interpodatki",
        "desktop-uslugi",
        "Lista obszarów obsługi: księgowość dla JDG i spółek, obsługa podatkowa, kadry i płace z cenami od",
        "Obszary obsługi",
      ),
      desktop("interpodatki", "desktop-film", "Sekcja „Zobacz serwis w ruchu” z odtwarzaczem filmu prezentującego stronę", "Film prezentujący serwis"),
      mobile("interpodatki", "mobile-strona-glowna", "Pierwszy ekran strony InterPodatki na telefonie", "Wersja mobilna – pierwszy ekran"),
      mobile("interpodatki", "mobile-kalkulator", "Kalkulator abonamentu InterPodatki na telefonie", "Wersja mobilna – kalkulator"),
    ],
  },
  {
    slug: "noir-coffee",
    name: "NOIR COFFEE",
    industry: "Gastronomia",
    summary: "Strona kawiarni z menu, personalizacją napojów i zamówieniami online z odbiorem w lokalu.",
    description: [
      "Ciepła, papierowa paleta i szeryfowa typografia oddają charakter kawiarni, a zdjęcia napojów grają pierwsze skrzypce.",
      "Klient wybiera kawę, dopasowuje rozmiar, mleko i dodatki, wskazuje lokal i godzinę odbioru, a następnie płaci online. Cena liczona jest ponownie po stronie serwera.",
    ],
    scope: [
      "Menu dziesięciu kaw z filtrowaniem",
      "Personalizacja napojów z bieżącą ceną",
      "Koszyk i wybór godziny odbioru",
      "Płatności Stripe Checkout (tryb testowy)",
      "Galeria i sekcja lokali z mapą",
      "Projekty dokumentów prawnych",
    ],
    note: "Kawiarnia jest fikcyjna, a adresy lokali i godziny otwarcia mają charakter przykładowy. W wersji demonstracyjnej działają menu, koszyk i wybór godziny odbioru – płatności są wyłączone.",
    liveUrl: "/demo/noir-coffee",
    liveLabel: "Otwórz stronę",
    palette: { background: "#f5efe6", foreground: "#231812", accent: "#a57f55" },
    lines: ["Dobre poranki zaczynają się od dobrej kawy."],
    shots: [
      desktop(
        "noir-coffee",
        "desktop-strona-glowna",
        "Pierwszy ekran strony NOIR COFFEE: hasło „Dobre poranki zaczynają się od dobrej kawy.” obok zdjęcia cappuccino",
        "Pierwszy ekran",
      ),
      desktop("noir-coffee", "desktop-menu", "Menu NOIR COFFEE z filtrami kategorii i kartami kaw z cenami", "Menu z filtrowaniem"),
      desktop(
        "noir-coffee",
        "desktop-personalizacja",
        "Okno personalizacji cappuccino z wyborem rozmiaru, mleka, temperatury i ziarna",
        "Personalizacja napoju",
      ),
      desktop(
        "noir-coffee",
        "desktop-zamowienie",
        "Krok zamówienia NOIR COFFEE z wyborem lokalu, dnia odbioru i podsumowaniem koszyka",
        "Wybór lokalu i godziny odbioru",
      ),
      desktop("noir-coffee", "desktop-galeria", "Galeria zdjęć kawy na ciemnym tle w sekcji „Zobacz. Poczuj. Zamów.”", "Galeria"),
      desktop("noir-coffee", "desktop-lokale", "Sekcja lokali NOIR COFFEE z listą adresów i mapą wczytywaną po zgodzie", "Lokale i mapa"),
      mobile("noir-coffee", "mobile-strona-glowna", "Pierwszy ekran strony NOIR COFFEE na telefonie", "Wersja mobilna – pierwszy ekran"),
      mobile("noir-coffee", "mobile-menu", "Menu kaw NOIR COFFEE na telefonie", "Wersja mobilna – menu"),
    ],
  },
  {
    slug: "aureon-homes",
    name: "AUREON HOMES",
    industry: "Nieruchomości",
    summary: "Strona butikowego biura nieruchomości premium z katalogiem ofert, wyszukiwarką i formularzem dla właścicieli.",
    description: [
      "Wielostronicowa koncepcja dla biura nieruchomości z Warszawy i okolic. Spokojna, architektoniczna estetyka i wieczorne kadry willi budują poczucie wyjątkowości, a czytelne parametry ofert pozwalają porównywać nieruchomości na podstawie faktów.",
      "Wyszukiwarka łączy filtry transakcji, typu, lokalizacji, ceny i liczby pokoi, a wybrane filtry zapisują się w adresie strony. Sekcja opinii jest przygotowana na zweryfikowane wypowiedzi klientów – bez wymyślonych recenzji.",
    ],
    scope: [
      "Katalog ofert z filtrami i sortowaniem",
      "Filtry zapisywane w adresie strony",
      "Podstrony ofert z parametrami",
      "Opis współpracy w czterech etapach",
      "Formularz zgłoszenia nieruchomości",
      "FAQ, polityka prywatności i regulamin",
    ],
    note: "Marka, oferty, ceny, adres biura i dane kontaktowe są przykładowe, a ilustracje mają charakter poglądowy. Strona nie stanowi oferty rynkowej.",
    liveUrl: "/demo/aureon-homes/index.html",
    liveLabel: "Otwórz stronę",
    palette: { background: "#1b1f24", foreground: "#f1ece3", accent: "#d8b47a" },
    lines: ["Przestrzeń, w której zaczyna się kolejny rozdział.", "Nieruchomości to coś więcej niż adres."],
    structure: ["Strona główna z wyszukiwarką", "Nieruchomości", "Karta oferty", "O nas", "Usługi", "Dla właścicieli", "Kontakt"],
    shots: [
      desktop(
        "aureon-homes",
        "desktop-strona-glowna",
        "Pierwszy ekran AUREON HOMES: nowoczesna willa o zmierzchu i hasło „Przestrzeń, w której zaczyna się kolejny rozdział.”",
        "Pierwszy ekran",
      ),
      desktop(
        "aureon-homes",
        "desktop-wyszukiwarka",
        "Wyszukiwarka nieruchomości z filtrami transakcji, typu, lokalizacji, ceny i liczby pokoi nad sekcją polecanych ofert",
        "Wyszukiwarka i polecane oferty",
      ),
      desktop("aureon-homes", "desktop-katalog", "Katalog wszystkich nieruchomości z filtrami i sortowaniem", "Katalog ofert z filtrami"),
      desktop(
        "aureon-homes",
        "desktop-oferta",
        "Karta oferty domu z ogrodem w Konstancinie-Jeziornie z ceną, przyciskami kontaktu i galerią wizualizacji",
        "Karta oferty",
      ),
      desktop(
        "aureon-homes",
        "desktop-oferta-rzut",
        "Opis nieruchomości z listą udogodnień i formularzem zapytania o ofertę",
        "Udogodnienia i zapytanie o ofertę",
      ),
      desktop("aureon-homes", "desktop-kontakt", "Sekcja kontaktu AUREON HOMES z danymi biura i formularzem kontaktowym", "Kontakt"),
      mobile("aureon-homes", "mobile-strona-glowna", "Pierwszy ekran AUREON HOMES na telefonie", "Wersja mobilna – pierwszy ekran"),
      mobile("aureon-homes", "mobile-katalog", "Katalog nieruchomości na telefonie z przyciskiem filtrów", "Wersja mobilna – katalog"),
    ],
  },
  {
    slug: "vera-aesthetic-studio",
    name: "VÉRA Aesthetic Studio",
    industry: "Medycyna estetyczna",
    summary: "Strona studia medycyny estetycznej i pielęgnacji skóry z katalogiem zabiegów, zespołem i magazynem.",
    description: [
      "Koncepcja dla studia, które stawia na umiar i konsultację przed zabiegiem. Ciepłe, tynkowane tła i głęboki burgund tworzą kameralny, gabinetowy nastrój zamiast klinicznej bieli.",
      "Zabiegi pogrupowane są w cztery kategorie z osobnymi podstronami, wizyta opisana jest w czterech krokach, a magazyn z artykułami odpowiada na pytania zadawane przed pierwszą konsultacją.",
    ],
    scope: [
      "Katalog zabiegów w czterech kategoriach",
      "Podstrony poszczególnych zabiegów",
      "Opis wizyty krok po kroku",
      "Profile specjalistów",
      "Galeria z powiększaniem zdjęć",
      "Magazyn z artykułami",
      "Formularz umawiania konsultacji",
    ],
    note: "Studio, osoby i dane kontaktowe są fikcyjne. Formularze w wersji demonstracyjnej nie wysyłają danych.",
    liveUrl: "/demo/vera-aesthetic-studio/index.html",
    liveLabel: "Otwórz stronę",
    palette: { background: "#4e1620", foreground: "#f5e9e0", accent: "#e2b49a" },
    lines: ["Twoje piękno. Twoja tożsamość."],
    structure: ["Strona główna", "O nas", "Zabiegi", "Nasi specjaliści", "Magazyn", "Kontakt", "Umów konsultację"],
    shots: [
      desktop(
        "vera-aesthetic-studio",
        "desktop-strona-glowna",
        "Pierwszy ekran VÉRA Aesthetic Studio: portret kobiety w burgundowej sukni i hasło „Twoje piękno. Twoja tożsamość.”",
        "Pierwszy ekran",
      ),
      desktop("vera-aesthetic-studio", "desktop-filozofia", "Sekcja filozofii studia VÉRA z cytatem i portretem z profilu", "Filozofia studia"),
      desktop("vera-aesthetic-studio", "desktop-zabiegi", "Sekcja wybranych zabiegów na ciemnym tle ze zdjęciami zabiegu na twarz", "Wybrane zabiegi"),
      desktop(
        "vera-aesthetic-studio",
        "desktop-katalog-zabiegow",
        "Podstrona zabiegów z czterema kategoriami i sekcją medycyny estetycznej",
        "Katalog zabiegów",
      ),
      desktop("vera-aesthetic-studio", "desktop-specjalisci", "Podstrona „Nasi specjaliści” z portretem lekarza medycyny estetycznej", "Specjaliści"),
      desktop(
        "vera-aesthetic-studio",
        "desktop-konsultacja",
        "Formularz umawiania konsultacji z wyborem obszaru, zabiegu i preferowanego terminu",
        "Umawianie konsultacji",
      ),
      mobile("vera-aesthetic-studio", "mobile-strona-glowna", "Pierwszy ekran VÉRA na telefonie", "Wersja mobilna – pierwszy ekran"),
      mobile("vera-aesthetic-studio", "mobile-zabiegi", "Katalog zabiegów VÉRA na telefonie", "Wersja mobilna – zabiegi"),
    ],
  },
  {
    slug: "piekarnia-morelowa",
    name: "Piekarnia Morelowa",
    industry: "Piekarnia i cukiernia",
    summary: "Strona rodzinnej piekarni i cukierni z historią marki, rytmem pracy piekarni i dwoma lokalami.",
    description: [
      "Ciemna, nastrojowa identyfikacja nocnej piekarni: głęboki brąz, złote akcenty i wyrazisty krój DM Serif Display. Strona opowiada o rodzinnej tradycji od 1991 roku – od filozofii pracy, przez pieczywo i ręcznie wykańczane słodkości, po historię marki.",
      "Rytm pracy piekarni pokazany jest krok po kroku, od nocy do popołudnia, a historia marki – na osi czasu z rocznikami w konturowej typografii. Zamiast sklepu internetowego strona zaprasza do dwóch lokali, gdzie omawiane są zamówienia tortów.",
    ],
    scope: [
      "Ciemna identyfikacja z akcentem złota",
      "Rytm pracy piekarni krok po kroku",
      "Oferta pieczywa i cukierni",
      "Historia marki na osi czasu",
      "Dwa lokale z opisem",
      "Formularz kontaktowy (tryb demonstracyjny)",
    ],
    note: "Marka, jej historia oraz adresy lokali są fikcyjne i służą wyłącznie prezentacji projektu.",
    liveUrl: "/demo/piekarnia-morelowa/index.html",
    liveLabel: "Otwórz stronę",
    palette: { background: "#231912", foreground: "#f8f4ec", accent: "#b69a69" },
    lines: ["Tradycja, którą czuć w każdym kęsie.", "Pieczemy, zanim miasto się obudzi."],
    structure: ["Strona główna", "Nasza historia", "Pieczywo", "Cukiernia", "Nasze lokale", "Kontakt"],
    shots: [
      desktop(
        "piekarnia-morelowa",
        "desktop-strona-glowna",
        "Pierwszy ekran Piekarni Morelowej na ciemnym tle z hasłem „Tradycja, którą czuć w każdym kęsie.”",
        "Pierwszy ekran",
      ),
      desktop("piekarnia-morelowa", "desktop-pieczywo", "Sekcja „Pieczemy, zanim miasto się obudzi.” z rytmem pracy piekarni", "Pieczywo i rytm piekarni"),
      desktop("piekarnia-morelowa", "desktop-cukiernia", "Sekcja cukierni na bordowym tle ze zdjęciem tortu z morelami", "Cukiernia"),
      desktop("piekarnia-morelowa", "desktop-historia", "Historia marki z rocznikami 1991 i 2000 w konturowej typografii", "Historia marki"),
      desktop("piekarnia-morelowa", "desktop-kontakt", "Sekcja kontaktu „Zapach świeżego pieczywa najlepiej poznaje się osobiście.”", "Kontakt"),
      mobile("piekarnia-morelowa", "mobile-strona-glowna", "Pierwszy ekran Piekarni Morelowej na telefonie", "Wersja mobilna – pierwszy ekran"),
      mobile("piekarnia-morelowa", "mobile-historia", "Historia marki na telefonie", "Wersja mobilna – historia"),
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
