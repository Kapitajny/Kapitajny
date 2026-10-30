import type { ImageKey } from "@/config/images";

/**
 * Katalog zabiegów. Treści medyczne są poglądowe (koncept) i przed publikacją muszą zostać
 * sprawdzone i zatwierdzone przez personel medyczny studia.
 */

export type CategorySlug = "medycyna-estetyczna" | "zabiegi-na-skore" | "kosmetologia" | "konsultacja-skory";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Jedno zdanie do list i strony głównej. */
  summary: string;
  intro: string;
  image: ImageKey;
}

export interface Treatment {
  slug: string;
  name: string;
  category: CategorySlug;
  lede: string;
  description: string[];
  duration: string;
  /** Jak zwykle planujemy wizyty – opis, nie obietnica. */
  course: string;
  /** Kolejne etapy wizyty. */
  process: { title: string; text: string }[];
  indications: string[];
  contraindications: string[];
  qualification: string;
  image: ImageKey;
}

export const categories: Category[] = [
  {
    slug: "medycyna-estetyczna",
    name: "Medycyna estetyczna",
    summary: "Zabiegi wykonywane przez lekarza, które pracują z Twoimi proporcjami, a nie przeciw nim.",
    intro:
      "Każdy zabieg medycyny estetycznej w VÉRA wykonuje lekarz i poprzedza go wywiad medyczny. Planujemy małymi, przemyślanymi krokami i ustalamy efekt, zanim cokolwiek zostanie zrobione.",
    image: "assessment",
  },
  {
    slug: "zabiegi-na-skore",
    name: "Zabiegi na skórę",
    summary: "Peelingi i mikroigłowanie planowane jako seria, dopasowane do pory roku i rodzaju skóry.",
    intro:
      "Zabiegi, które odnawiają powierzchnię skóry i wspierają jej strukturę. Planujemy je jako serię, dopasowujemy do pory roku i zawsze łączymy z pielęgnacją domową, którą da się utrzymać.",
    image: "serum",
  },
  {
    slug: "kosmetologia",
    name: "Kosmetologia profesjonalna",
    summary: "Zabiegi na twarz, masaż i pielęgnacja dłoni w wykonaniu kosmetologów – bez pośpiechu i z precyzją.",
    intro:
      "Pielęgnacja twarzy i dłoni wykonywana ręcznie. Każdy rytuał zaczyna się od krótkiej oceny skóry, aby produkty i techniki pasowały do tego, jak skóra wygląda tego dnia – a nie na papierze.",
    image: "facialRitual",
  },
  {
    slug: "konsultacja-skory",
    name: "Konsultacja skóry",
    summary: "Godzina na zrozumienie Twojej skóry, zanim zdecydujesz o jakimkolwiek zabiegu.",
    intro:
      "Punkt wyjścia dla większości naszych klientek i klientów. Specjalista ocenia skórę, słucha, co chcesz zmienić, i proponuje plan – łącznie z opcją, by nie robić nic.",
    image: "consultation",
  },
];

const standardMedicalContra = ["Ciąża i karmienie piersią", "Aktywna infekcja, stan zapalny lub opryszczka w miejscu zabiegu", "Nieustabilizowana choroba ogólnoustrojowa lub gorączka"];

export const treatments: Treatment[] = [
  /* ───────────── Medycyna estetyczna ───────────── */
  {
    slug: "redukcja-zmarszczek-mimicznych",
    name: "Redukcja zmarszczek mimicznych",
    category: "medycyna-estetyczna",
    lede: "Wygładzenie zmarszczek na czole, między brwiami i wokół oczu – zaplanowane tak, by twarz zachowała naturalną mimikę.",
    description: [
      "Preparat na receptę podaje się w bardzo małych dawkach do wybranych mięśni, aby zmniejszyć siłę ich skurczu. Zmarszczki powstające przy powtarzanej mimice stają się w kolejnych dniach mniej widoczne.",
      "Dążymy do wypoczętej twarzy, a nie nieruchomej. Dawki i punkty planujemy razem z Tobą przed lustrem, a wizyta kontrolna jest częścią planu.",
    ],
    duration: "30 minut",
    course: "Jedna wizyta i kontrola po około dwóch tygodniach",
    process: [
      { title: "Wywiad medyczny", text: "Lekarz pyta o zdrowie, przyjmowane leki i wcześniejsze zabiegi." },
      { title: "Analiza twarzy", text: "Wspólnie oglądamy Twoją mimikę i ustalamy, które zmarszczki wygładzić, a które zostawić." },
      { title: "Zabieg", text: "Niewielkie dawki podaje się cienką igłą. Większość osób opisuje to jako krótkie ukłucia." },
      { title: "Kontrola", text: "Po około dwóch tygodniach oceniamy efekt i decydujemy, czy potrzebna jest korekta." },
    ],
    indications: ["Poziome zmarszczki na czole", "Pionowe zmarszczki między brwiami", "Zmarszczki w zewnętrznych kącikach oczu"],
    contraindications: [
      ...standardMedicalContra,
      "Choroby nerwowo-mięśniowe",
      "Uczulenie na którykolwiek składnik preparatu",
      "Niektóre leki – lekarz sprawdza je podczas wywiadu",
    ],
    qualification:
      "O kwalifikacji decyduje lekarz podczas konsultacji, po wywiadzie i badaniu. Lekarz może uznać, że zabieg nie jest dla Ciebie odpowiedni, albo zalecić jego odłożenie.",
    image: "assessment",
  },
  {
    slug: "modelowanie-kwasem-hialuronowym",
    name: "Modelowanie kwasem hialuronowym",
    category: "medycyna-estetyczna",
    lede: "Przywrócenie objętości i konturu ust, policzków lub linii żuchwy wypełniaczem z kwasem hialuronowym – w proporcji do Twoich rysów.",
    description: [
      "Kwas hialuronowy naturalnie występuje w skórze. Jako wypełniacz może uzupełnić objętość, która z czasem się zmniejszyła, albo delikatnie podkreślić usta, kości policzkowe i linię żuchwy.",
      "Pracujemy na niewielkich ilościach, a punktem odniesienia są Twoje własne proporcje. Gdy ma to sens, rozkładamy efekt na dwie wizyty zamiast jednej.",
    ],
    duration: "45–60 minut",
    course: "Zwykle jedna wizyta; plan może obejmować wizytę uzupełniającą",
    process: [
      { title: "Wywiad medyczny", text: "Pytania o zdrowie, wcześniejsze wypełniacze i Twoje oczekiwania – rozmawiamy otwarcie." },
      { title: "Analiza proporcji", text: "Oceniamy twarz jako całość i wspólnie zaznaczamy planowane obszary." },
      { title: "Zabieg", text: "Po znieczuleniu miejscowym preparat podaje się igłą lub kaniulą." },
      { title: "Zalecenia i kontrola", text: "Otrzymujesz pisemne zalecenia pozabiegowe. Efekt oceniamy na wizycie kontrolnej." },
    ],
    indications: ["Utrata objętości policzków lub skroni", "Podkreślenie konturu lub nawilżenie ust", "Złagodzenie bruzd nosowo-wargowych", "Kontur żuchwy i brody"],
    contraindications: [
      ...standardMedicalContra,
      "Choroba autoimmunologiczna w fazie aktywnej",
      "Zaburzenia krzepnięcia lub leczenie przeciwzakrzepowe",
      "Wcześniej podany wypełniacz trwały w tym obszarze",
    ],
    qualification:
      "Lekarz kwalifikuje do zabiegu po wywiadzie i badaniu. Jeśli Twoim celom lepiej posłuży inne rozwiązanie – albo żaden zabieg – usłyszysz to podczas konsultacji.",
    image: "profile",
  },
  {
    slug: "skin-boostery",
    name: "Skin boostery",
    category: "medycyna-estetyczna",
    lede: "Mikroiniekcje nieusieciowanego kwasu hialuronowego wspierające nawilżenie i teksturę skóry twarzy, szyi i dekoltu.",
    description: [
      "Skin boostery wprowadzają lekką, płynną postać kwasu hialuronowego w wielu drobnych punktach. Ich celem jest lepsze nawilżenie i elastyczność skóry, a nie dodanie objętości.",
      "Zwykle planujemy je jako krótką serię, często w chłodniejszych miesiącach, i łączymy z regularną pielęgnacją domową.",
    ],
    duration: "45 minut",
    course: "Zwykle seria dwóch–trzech wizyt w odstępie kilku tygodni",
    process: [
      { title: "Wywiad medyczny", text: "Sprawdzamy stan zdrowia i ostatnie zabiegi oraz oglądamy skórę w świetle dziennym." },
      { title: "Przygotowanie", text: "Oczyszczenie skóry i znieczulenie miejscowe." },
      { title: "Zabieg", text: "Niewielkie ilości preparatu podaje się cienką igłą w całym obszarze." },
      { title: "Zalecenia", text: "Drobne ślady mogą być widoczne przez dzień lub dwa. Wyjaśniamy, czego w tym czasie unikać." },
    ],
    indications: ["Odwodniona, matowa skóra", "Drobne zmarszczki na szyi lub dekolcie", "Skóra zmęczona po lecie"],
    contraindications: [...standardMedicalContra, "Choroba autoimmunologiczna w fazie aktywnej", "Uczulenie na preparaty z kwasem hialuronowym"],
    qualification: "Kwalifikacja przez lekarza podczas konsultacji. Serię planujemy dopiero po ocenie skóry na miejscu.",
    image: "hydration",
  },

  /* ───────────── Zabiegi na skórę ───────────── */
  {
    slug: "peeling-chemiczny",
    name: "Peeling chemiczny",
    category: "zabiegi-na-skore",
    lede: "Kontrolowane złuszczanie kwasami dobranymi do Twojej skóry, które wyrównuje jej teksturę i koloryt.",
    description: [
      "Peeling polega na nałożeniu wybranego kwasu lub mieszanki kwasów, które rozluźniają zewnętrzną warstwę naskórka. W zależności od preparatu i stężenia może wygładzić teksturę, pomóc przy niedoskonałościach lub wyrównać koloryt.",
      "Zamiast jednego mocnego peelingu wybieramy serię łagodniejszych i planujemy je na miesiące z mniejszym nasłonecznieniem.",
    ],
    duration: "40 minut",
    course: "Zwykle seria trzech–sześciu wizyt",
    process: [
      { title: "Ocena skóry", text: "Oglądamy skórę i pytamy o niedawną ekspozycję na słońce, retinoidy i inne substancje aktywne." },
      { title: "Przygotowanie", text: "Oczyszczenie i odtłuszczenie, aby kwas działał równomiernie." },
      { title: "Peeling", text: "Kwas jest nakładany i odmierzany w czasie. Mrowienie lub uczucie ciepła jest normalne." },
      { title: "Neutralizacja i ochrona", text: "Kończymy kojącą pielęgnacją i filtrem SPF oraz omawiamy pielęgnację domową." },
    ],
    indications: ["Nierówna tekstura i rozszerzone pory", "Skóra skłonna do niedoskonałości", "Nierówny koloryt i przebarwienia pozapalne"],
    contraindications: [...standardMedicalContra, "Niedawne oparzenie słoneczne lub intensywne opalanie", "Doustne retinoidy obecnie lub niedawno", "Rany lub uszkodzona skóra w miejscu zabiegu"],
    qualification: "Kwalifikacja przez specjalistę po ocenie skóry. Rodzaj i stężenie peelingu dobieramy indywidualnie i mogą się zmieniać w trakcie serii.",
    image: "serum",
  },
  {
    slug: "mikroiglowanie",
    name: "Mikroigłowanie",
    category: "zabiegi-na-skore",
    lede: "Drobne, kontrolowane mikronakłucia pobudzające naturalną odnowę skóry – dla lepszej tekstury i jędrności.",
    description: [
      "Urządzenie z bardzo cienkimi igłami tworzy w skórze mikrokanaliki. To naturalna reakcja naprawcza skóry z czasem wspiera gładszą teksturę.",
      "Efekty narastają stopniowo w trakcie serii. Po każdej wizycie skóra jest zwykle zaróżowiona przez dzień lub dwa.",
    ],
    duration: "60 minut",
    course: "Seria trzech–czterech wizyt co około cztery tygodnie",
    process: [
      { title: "Ocena skóry", text: "Sprawdzamy przeciwwskazania i ustalamy obszary zabiegowe." },
      { title: "Przygotowanie", text: "Oczyszczenie i znieczulenie miejscowe dla komfortu." },
      { title: "Zabieg", text: "Urządzenie prowadzi się po skórze z serum dobranym do Twojej skóry." },
      { title: "Ukojenie i zalecenia", text: "Kojąca maska, a potem jasne wskazówki na kolejne dni." },
    ],
    indications: ["Nierówna tekstura", "Płytkie blizny potrądzikowe", "Utrata jędrności", "Rozszerzone pory"],
    contraindications: [...standardMedicalContra, "Aktywne zmiany trądzikowe w miejscu zabiegu", "Skłonność do bliznowców", "Zaburzenia krzepnięcia"],
    qualification: "Kwalifikacja przez specjalistę podczas konsultacji skóry. W niektórych przypadkach najpierw kierujemy do lekarza.",
    image: "cream",
  },

  /* ───────────── Kosmetologia profesjonalna ───────────── */
  {
    slug: "rytual-vera",
    name: "Rytuał VÉRA na twarz",
    category: "kosmetologia",
    lede: "Nasz dziewięćdziesięciominutowy zabieg: oczyszczanie, delikatne złuszczanie, maska dobrana na miejscu i długi masaż modelujący.",
    description: [
      "Zabieg zaczyna się od krótkiej oceny skóry, tak by każdy etap odpowiadał temu, jak skóra wygląda tego dnia. Łączy staranne oczyszczanie, delikatne złuszczanie, maskę i powolny masaż twarzy.",
      "To dobra pierwsza wizyta, jeśli dopiero zaczynasz profesjonalną pielęgnację – i dobra comiesięczna rutyna, jeśli już ją znasz.",
    ],
    duration: "90 minut",
    course: "Jedna wizyta lub co miesiąc jako część planu pielęgnacji",
    process: [
      { title: "Ocena skóry", text: "Kilka pytań i uważne spojrzenie na skórę w dobrym świetle." },
      { title: "Oczyszczanie i złuszczanie", text: "Dwuetapowe oczyszczanie, a potem złuszczanie dopasowane do skóry." },
      { title: "Maska i masaż", text: "Maska dobrana na miejscu i modelujący masaż twarzy, szyi i ramion." },
      { title: "Zakończenie i porada", text: "Pielęgnacja z filtrem SPF i krótka wskazówka do pielęgnacji domowej." },
    ],
    indications: ["Skóra matowa lub zmęczona", "Skóra odwodniona", "Każdy, kto zaczyna regularną pielęgnację profesjonalną"],
    contraindications: ["Aktywna infekcja skóry lub opryszczka", "Niedawny zabieg medycyny estetycznej w tym obszarze – poinformuj nas", "Uczulenie na składniki kosmetyków"],
    qualification: "Osobna konsultacja nie jest potrzebna. Kosmetolog ocenia skórę na początku wizyty i w razie potrzeby zmienia lub przekłada poszczególne etapy.",
    image: "facialMask",
  },
  {
    slug: "masaz-modelujacy-twarzy",
    name: "Masaż modelujący twarzy",
    category: "kosmetologia",
    lede: "Manualny masaż twarzy, szyi i dekoltu, który rozluźnia napięcia i sprawia, że skóra wygląda na wypoczętą.",
    description: [
      "Powolny, głęboki masaż manualny łączący ruchy drenażu limfatycznego z pracą na mięśniach twarzy i żuchwy.",
      "Wiele osób rezerwuje go osobno; dobrze łączy się też z zabiegiem na twarz lub po okresie stresu.",
    ],
    duration: "60 minut",
    course: "Jedna wizyta lub krótka seria",
    process: [
      { title: "Krótki wywiad", text: "Pytamy o napięcia, zaciskanie zębów i o to, czego powinniśmy unikać." },
      { title: "Przygotowanie", text: "Lekkie oczyszczenie i olejek do masażu dobrany do skóry." },
      { title: "Masaż", text: "Twarz, szyja, dekolt i skóra głowy – w tempie, które pozwala odpocząć." },
      { title: "Zakończenie", text: "Usunięcie nadmiaru olejku i lekka pielęgnacja." },
    ],
    indications: ["Napięcie twarzy i żuchwy", "Obrzęki", "Zmęczony wygląd skóry"],
    contraindications: ["Aktywna infekcja lub stan zapalny skóry", "Gorączka", "Niedawny zabieg z wypełniaczem w tym obszarze – poinformuj nas"],
    qualification: "Osobna konsultacja nie jest potrzebna. Przy rezerwacji poinformuj nas o niedawnych zabiegach.",
    image: "facialRitual",
  },
  {
    slug: "rytual-dloni-i-manicure",
    name: "Rytuał dłoni i manicure",
    category: "kosmetologia",
    lede: "Złuszczanie, odżywcza maska i precyzyjna pielęgnacja paznokci – na koniec klasyczny kolor albo naturalne wykończenie.",
    description: [
      "Kompletny zabieg dla dłoni, które dużo pracują: złuszczanie, odżywcza maska, pielęgnacja skórek i nadanie kształtu paznokciom.",
      "Kończymy trwałym lakierem z krótkiej, przemyślanej palety – od nude po głęboką czerwień studia – albo po prostu wypolerowaną naturalną płytką.",
    ],
    duration: "75 minut",
    course: "Co trzy–cztery tygodnie",
    process: [
      { title: "Ocena dłoni i paznokci", text: "Oglądamy skórę, paznokcie i ewentualny produkt do usunięcia." },
      { title: "Złuszczanie i maska", text: "Delikatny peeling i ciepła, odżywcza maska." },
      { title: "Pielęgnacja paznokci", text: "Pielęgnacja skórek, kształt i przygotowanie płytki." },
      { title: "Wykończenie", text: "Trwały lakier lub naturalne wykończenie i krem do rąk." },
    ],
    indications: ["Suche lub szorstkie dłonie", "Łamliwe paznokcie", "Regularna pielęgnacja paznokci"],
    contraindications: ["Grzybicze lub bakteryjne zakażenie paznokci", "Rany na dłoniach", "Uczulenie na produkty do paznokci"],
    qualification: "Osobna konsultacja nie jest potrzebna. Jeśli zauważymy oznaki infekcji paznokcia, zalecimy najpierw wizytę u lekarza.",
    image: "nailsBurgundy",
  },

  /* ───────────── Konsultacja skóry ───────────── */
  {
    slug: "konsultacja-skory",
    name: "Konsultacja skóry",
    category: "konsultacja-skory",
    lede: "Godzina ze specjalistą bez pośpiechu, aby zrozumieć Twoją skórę i wyjść z pisemnym planem.",
    description: [
      "Rozmawiamy o tym, co chcesz zmienić, oglądamy skórę z bliska w świetle dziennym i omawiamy Twoją obecną pielęgnację. Następnie wyjaśniamy, co jest realne, z czym się wiąże i ile kosztuje.",
      "Wychodzisz z pisemnym planem. Może obejmować zabiegi w studiu, samą pielęgnację domową albo skierowanie do lekarza, jeśli coś wymaga najpierw konsultacji medycznej.",
    ],
    duration: "60 minut",
    course: "Jedna wizyta; plan omawiamy ponownie na kolejnym spotkaniu",
    process: [
      { title: "Rozmowa", text: "Twoje cele, doświadczenia z zabiegami i produktami oraz stan zdrowia." },
      { title: "Ocena skóry", text: "Uważne spojrzenie na skórę w świetle dziennym, w razie potrzeby w powiększeniu." },
      { title: "Możliwości", text: "Co może pomóc, z czym wiąże się każda opcja i czego byśmy nie polecali." },
      { title: "Pisemny plan", text: "Podsumowanie planu i pielęgnacji domowej, które wysyłamy po wizycie." },
    ],
    indications: ["Przed pierwszym zabiegiem w VÉRA", "Gdy nie wiesz, czego potrzebuje Twoja skóra", "Gdy wcześniejsze zabiegi nie spełniły oczekiwań"],
    contraindications: ["Brak przeciwwskazań do samej konsultacji"],
    qualification: "Dla osób pełnoletnich. Prosimy o zabranie listy obecnie stosowanych kosmetyków i leków.",
    image: "consultation",
  },
  {
    slug: "przeglad-planu-pielegnacji",
    name: "Przegląd planu pielęgnacji",
    category: "konsultacja-skory",
    lede: "Krótka wizyta kontrolna, aby sprawdzić, jak reaguje skóra, i dopasować plan na kolejny sezon.",
    description: [
      "Skóra zmienia się z porami roku, z hormonami i pod wpływem zabiegów. Wizyta kontrolna to okazja, by porównać ją z punktem wyjścia i wspólnie ustalić kolejne kroki.",
    ],
    duration: "30 minut",
    course: "Co kilka miesięcy lub gdy pojawią się pytania",
    process: [
      { title: "Porównanie", text: "Porównujemy skórę z notatkami i zdjęciami z pierwszej konsultacji." },
      { title: "Rozmowa", text: "Co zadziałało, co nie i jak pielęgnacja wpisuje się w Twój dzień." },
      { title: "Zaktualizowany plan", text: "Zmiany w zabiegach i pielęgnacji domowej na najbliższe miesiące." },
    ],
    indications: ["Osoby z planem pielęgnacji VÉRA", "Zmiana pory roku", "Zmiany w skórze lub stanie zdrowia"],
    contraindications: ["Brak przeciwwskazań do samej konsultacji"],
    qualification: "Dla osób po konsultacji skóry w VÉRA.",
    image: "spf",
  },
];

export function getCategory(slug: CategorySlug): Category {
  return categories.find((c) => c.slug === slug)!;
}

export function getTreatment(slug: string): Treatment | undefined {
  return treatments.find((t) => t.slug === slug);
}

export function treatmentsIn(category: CategorySlug): Treatment[] {
  return treatments.filter((t) => t.category === category);
}
