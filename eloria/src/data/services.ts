import type { ImageKey } from "@/config/images";

/**
 * KATALOG ZABIEGÓW
 *
 * TREŚCI PRZYKŁADOWE – opisy procedur, wskazania, przeciwwskazania, czasy trwania i zasady kwalifikacji
 * zostały przygotowane na potrzeby projektu demonstracyjnego i MUSZĄ zostać zweryfikowane
 * przez personel medyczny kliniki przed publikacją.
 *
 * Teksty mają charakter informacyjny: podmiot leczniczy nie może reklamować swoich świadczeń
 * (art. 14 ustawy o działalności leczniczej), dlatego unikamy obietnic efektów, porównań i promocji,
 * a nazwy produktów leczniczych nie pojawiają się w opisach.
 */

export type CategorySlug = "medycyna-estetyczna" | "kosmetologia" | "terapie-skory";

export interface ServiceCategory {
  slug: CategorySlug;
  name: string;
  intro: string;
  /** Kto wykonuje zabiegi w tej kategorii. */
  performedBy: string;
}

export interface ServiceStep {
  title: string;
  text: string;
}

export interface Service {
  slug: string;
  category: CategorySlug;
  name: string;
  /** Jedno zdanie – w nagłówku podstrony i w meta description. */
  lede: string;
  /** Krótki opis do list zabiegów. */
  summary: string;
  image: ImageKey;
  description: string[];
  steps: ServiceStep[];
  indications: string[];
  contraindications: string[];
  contraindicationsNote?: string;
  qualification: string[];
  facts: { label: string; value: string }[];
}

export const categories: ServiceCategory[] = [
  {
    slug: "medycyna-estetyczna",
    name: "Medycyna estetyczna",
    intro:
      "Konsultacje i zabiegi wykonywane przez lekarza. Zaczynamy od rozmowy i kwalifikacji, a plan dobieramy do budowy twarzy, stanu skóry i Twoich oczekiwań.",
    performedBy: "lekarz",
  },
  {
    slug: "kosmetologia",
    name: "Kosmetologia",
    intro:
      "Zabiegi wykonywane przez kosmetologów na profesjonalnych preparatach – z dbałością o komfort, barierę ochronną skóry i pielęgnację, którą da się utrzymać w domu.",
    performedBy: "kosmetolog",
  },
  {
    slug: "terapie-skory",
    name: "Terapie skóry",
    intro:
      "Opieka nad skórą, która wymaga więcej uwagi: wrażliwą, reaktywną, z niedoskonałościami lub osłabioną po zabiegach. Pracujemy etapami i w kontakcie z lekarzem.",
    performedBy: "kosmetolog we współpracy z lekarzem",
  },
];

export const services: Service[] = [
  // ── Medycyna estetyczna ──────────────────────────────────────────────────
  {
    slug: "konsultacja-medycyny-estetycznej",
    category: "medycyna-estetyczna",
    name: "Konsultacja medycyny estetycznej",
    lede: "Spokojna rozmowa z lekarzem, ocena twarzy i skóry oraz plan, który uwzględnia Twoje oczekiwania i stan zdrowia.",
    summary: "Rozmowa z lekarzem, ocena twarzy i skóry, plan postępowania na piśmie.",
    image: "svcConsultation",
    description: [
      "Konsultacja to punkt wyjścia do każdego zabiegu medycyny estetycznej w ÉLORIA. Lekarz poznaje Twoją historię zdrowia, pyta o dotychczasowe zabiegi i o to, co chcesz zmienić – oraz czego zmieniać nie chcesz.",
      "Na podstawie wywiadu oraz oceny proporcji twarzy i jakości skóry lekarz omawia możliwe kierunki postępowania, ich ograniczenia i ryzyko. Czasem najlepszą rekomendacją jest zmiana pielęgnacji albo rezygnacja z zabiegu – mówimy o tym otwarcie.",
      "Konsultacja nie zobowiązuje do wykonania zabiegu. Po wizycie otrzymujesz pisemne podsumowanie zaleceń.",
    ],
    steps: [
      { title: "Wywiad medyczny", text: "Choroby przewlekłe, przyjmowane leki, alergie, wcześniejsze zabiegi i ich przebieg." },
      { title: "Rozmowa o oczekiwaniach", text: "Ustalamy, na czym Ci zależy i jaka zmiana będzie dla Ciebie naturalna." },
      { title: "Ocena twarzy i skóry", text: "W świetle dziennym, w spoczynku i podczas mimiki. Za Twoją zgodą wykonujemy dokumentację fotograficzną." },
      { title: "Plan i podsumowanie", text: "Propozycja postępowania, możliwe alternatywy, orientacyjny harmonogram i koszty." },
    ],
    indications: [
      "Planujesz pierwszy zabieg medycyny estetycznej i chcesz poznać możliwości.",
      "Zauważasz zmiany w wyglądzie skóry lub rysów twarzy i chcesz ocenić je z lekarzem.",
      "Chcesz uporządkować dotychczasowe zabiegi w spójny, długofalowy plan.",
      "Potrzebujesz drugiej opinii przed decyzją o zabiegu.",
    ],
    contraindicationsNote:
      "Sama konsultacja nie ma przeciwwskazań. Lekarz omawia natomiast przeciwwskazania do zabiegów, które bierzecie pod uwagę, m.in.:",
    contraindications: [
      "ciąża i okres karmienia piersią,",
      "aktywne infekcje i stany zapalne skóry w okolicy zabiegowej,",
      "choroby autoimmunologiczne i zaburzenia krzepnięcia – wymagają indywidualnej oceny,",
      "niektóre leki, np. przeciwzakrzepowe lub izotretynoina.",
    ],
    qualification: [
      "Konsultacja jest pierwszym etapem kwalifikacji do zabiegów lekarskich. Decyzję o zabiegu podejmuje lekarz wspólnie z Tobą, po zebraniu wywiadu i ocenie przeciwwskazań.",
      "Weź ze sobą listę przyjmowanych leków oraz – jeśli je masz – wyniki badań i dokumentację wcześniejszych zabiegów.",
    ],
    facts: [
      { label: "Prowadzi", value: "lekarz" },
      { label: "Czas wizyty", value: "ok. 45–60 minut" },
      { label: "Przygotowanie", value: "lista leków, dokumentacja wcześniejszych zabiegów" },
      { label: "Po wizycie", value: "pisemne podsumowanie zaleceń" },
    ],
  },
  {
    slug: "zabiegi-na-twarz",
    category: "medycyna-estetyczna",
    name: "Zabiegi na twarz",
    lede: "Zabiegi lekarskie dobierane do budowy twarzy – z myślą o subtelnej zmianie, która nie odbiera mimiki ani charakteru rysów.",
    summary: "Zabiegi lekarskie dobierane do proporcji twarzy, wykonywane etapami.",
    image: "svcFace",
    description: [
      "Pod tą nazwą kryje się grupa zabiegów lekarskich, których celem może być m.in. złagodzenie zmarszczek mimicznych, poprawa proporcji wybranych okolic lub nawilżenie i uelastycznienie skóry. Konkretną metodę i preparat lekarz dobiera dopiero po konsultacji.",
      "Pracujemy w duchu umiaru: wolimy etapowanie i ocenę po czasie niż jednorazową, dużą korektę. Zabiegi wykonujemy w gabinecie spełniającym wymogi sanitarne, z użyciem wyrobów dopuszczonych do obrotu, a każdy etap dokumentujemy.",
      "Efekt i czas jego utrzymywania się zależą od indywidualnych cech organizmu i nie mogą być zagwarantowane. Lekarz omawia je z Tobą przed zabiegiem.",
    ],
    steps: [
      { title: "Konsultacja i kwalifikacja", text: "Wywiad, ocena twarzy, omówienie oczekiwań i przeciwwskazań." },
      { title: "Zgoda i przygotowanie", text: "Omówienie przebiegu i możliwych powikłań, świadoma zgoda, demakijaż i dezynfekcja skóry, w razie potrzeby znieczulenie miejscowe." },
      { title: "Zabieg", text: "Wykonywany przez lekarza, zwykle w ciągu kilkudziesięciu minut." },
      { title: "Zalecenia i kontrola", text: "Pisemne zalecenia pozabiegowe i wizyta kontrolna w ustalonym terminie." },
    ],
    indications: [
      "Zmarszczki mimiczne w górnej części twarzy.",
      "Utrata objętości lub zmiana proporcji wybranych okolic twarzy.",
      "Odwodnienie i utrata elastyczności skóry.",
      "Chęć odświeżenia wyglądu przy zachowaniu naturalnej mimiki.",
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią.",
      "Aktywne infekcje, opryszczka lub stany zapalne w miejscu zabiegu.",
      "Choroby autoimmunologiczne w okresie zaostrzenia.",
      "Zaburzenia krzepnięcia lub przyjmowanie leków przeciwzakrzepowych.",
      "Skłonność do powstawania bliznowców.",
      "Nadwrażliwość na składniki preparatu.",
      "Choroby nerwowo-mięśniowe – w przypadku niektórych procedur.",
    ],
    qualification: [
      "Do zabiegów na twarz kwalifikuje wyłącznie lekarz, podczas konsultacji poprzedzającej zabieg. Lekarz może odroczyć zabieg lub zaproponować inne postępowanie, jeśli uzna to za bezpieczniejsze.",
      "Zabiegów medycyny estetycznej nie wykonujemy u osób niepełnoletnich.",
    ],
    facts: [
      { label: "Prowadzi", value: "lekarz" },
      { label: "Przed zabiegiem", value: "konsultacja kwalifikacyjna" },
      { label: "Czas zabiegu", value: "zwykle 30–60 minut, zależnie od metody" },
      { label: "Kontrola", value: "według zaleceń lekarza, zwykle po 2–4 tygodniach" },
    ],
  },
  {
    slug: "zabiegi-poprawiajace-kondycje-skory",
    category: "medycyna-estetyczna",
    name: "Zabiegi poprawiające kondycję skóry",
    lede: "Zabiegi lekarskie wspierające nawilżenie, jędrność i jakość skóry – prowadzone w serii, w rytmie dopasowanym do jej potrzeb.",
    summary: "Seria zabiegów lekarskich wspierających nawilżenie i jędrność skóry.",
    image: "svcSkinQuality",
    description: [
      "Ta grupa zabiegów skupia się nie na rysach twarzy, lecz na samej skórze: jej nawilżeniu, gęstości, elastyczności i kolorycie. W zależności od potrzeb lekarz może zaproponować zabiegi z zastosowaniem preparatów rewitalizujących lub stymulujących – na twarz, szyję, dekolt albo dłonie.",
      "Zwykle zalecana jest seria zabiegów w odstępach kilku tygodni, uzupełniona pielęgnacją domową. Plan ustalamy po konsultacji i weryfikujemy przy każdej wizycie.",
    ],
    steps: [
      { title: "Konsultacja", text: "Ocena skóry, wywiad, dobór metody i liczby zabiegów." },
      { title: "Przygotowanie skóry", text: "Demakijaż, dezynfekcja, znieczulenie miejscowe w kremie." },
      { title: "Zabieg", text: "Wykonywany przez lekarza w obszarze ustalonym na konsultacji." },
      { title: "Zalecenia", text: "Wskazówki na pierwsze dni po zabiegu i termin kolejnej wizyty z serii." },
    ],
    indications: [
      "Skóra odwodniona, matowa, pozbawiona blasku.",
      "Utrata jędrności i elastyczności.",
      "Drobne zmarszczki i zmniejszona gęstość skóry.",
      "Skóra szyi, dekoltu i dłoni wymagająca rewitalizacji.",
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią.",
      "Aktywne zmiany zapalne lub infekcje w obszarze zabiegowym.",
      "Choroby autoimmunologiczne w okresie zaostrzenia.",
      "Zaburzenia krzepnięcia.",
      "Nadwrażliwość na składniki preparatu.",
      "Świeża opalenizna lub niedawne zabiegi złuszczające – zależnie od metody.",
    ],
    qualification: [
      "Kwalifikacji dokonuje lekarz podczas konsultacji. Przy kolejnych zabiegach z serii lekarz każdorazowo ocenia skórę i aktualny stan zdrowia.",
    ],
    facts: [
      { label: "Prowadzi", value: "lekarz" },
      { label: "Seria", value: "zwykle 2–4 zabiegi" },
      { label: "Odstęp", value: "kilka tygodni" },
      { label: "Po zabiegu", value: "możliwe przejściowe zaczerwienienie i drobne grudki" },
    ],
  },

  // ── Kosmetologia ─────────────────────────────────────────────────────────
  {
    slug: "oczyszczanie-skory",
    category: "kosmetologia",
    name: "Oczyszczanie skóry",
    lede: "Dokładne, a przy tym łagodne oczyszczanie dopasowane do typu skóry – bez pośpiechu i bez naruszania bariery ochronnej.",
    summary: "Oczyszczanie dopasowane do typu skóry, zakończone ukojeniem i ochroną.",
    image: "svcCleansing",
    description: [
      "Oczyszczanie zaczynamy od oceny skóry: inaczej pracujemy ze skórą tłustą i z rozszerzonymi porami, inaczej ze skórą wrażliwą lub odwodnioną. W zależności od potrzeb łączymy oczyszczanie manualne, peeling enzymatyczny lub kwasowy o łagodnym stężeniu oraz oczyszczanie aparaturowe.",
      "Zabieg kończymy maską kojącą i ochroną przeciwsłoneczną. Otrzymujesz też wskazówki, jak podtrzymać efekt w codziennej pielęgnacji.",
    ],
    steps: [
      { title: "Analiza skóry", text: "Krótki wywiad i ocena skóry w świetle lampy z lupą." },
      { title: "Przygotowanie", text: "Demakijaż i delikatne zmiękczenie naskórka." },
      { title: "Oczyszczanie", text: "Metody dobrane do typu i aktualnej kondycji skóry." },
      { title: "Ukojenie i ochrona", text: "Maska kojąca, pielęgnacja kończąca i filtr przeciwsłoneczny." },
    ],
    indications: [
      "Zaskórniki i rozszerzone pory.",
      "Skóra tłusta lub mieszana.",
      "Szara, zmęczona cera.",
      "Przygotowanie skóry do kolejnych zabiegów.",
    ],
    contraindications: [
      "Nasilone, aktywne stany zapalne skóry.",
      "Infekcje skóry – bakteryjne, wirusowe lub grzybicze.",
      "Świeże oparzenia słoneczne.",
      "Leczenie izotretynoiną (obecnie lub niedawno zakończone).",
      "Nadwrażliwość na składniki preparatów.",
    ],
    qualification: [
      "Kwalifikacja odbywa się na początku wizyty: kosmetolog zbiera wywiad i ocenia skórę.",
      "Jeśli zmiany wymagają diagnostyki lekarskiej – na przykład trądzik o dużym nasileniu – zaproponujemy konsultację z lekarzem przed zabiegiem.",
    ],
    facts: [
      { label: "Prowadzi", value: "kosmetolog" },
      { label: "Czas zabiegu", value: "ok. 75–90 minut" },
      { label: "Częstotliwość", value: "zwykle co 4–6 tygodni" },
      { label: "Po zabiegu", value: "możliwe przejściowe zaczerwienienie" },
    ],
  },
  {
    slug: "zabiegi-pielegnacyjne",
    category: "kosmetologia",
    name: "Zabiegi pielęgnacyjne",
    lede: "Zabiegi, które nawilżają, odżywiają i przywracają skórze komfort – z czasem na odpoczynek wliczonym w wizytę.",
    summary: "Nawilżenie, odżywienie i masaż twarzy, szyi oraz dekoltu.",
    image: "svcCare",
    description: [
      "Zabiegi pielęgnacyjne łączą profesjonalne preparaty z technikami manualnymi, w tym z masażem twarzy, szyi i dekoltu. Ich celem jest poprawa nawilżenia, odżywienie i wygładzenie skóry – a także chwila wytchnienia.",
      "Przebieg dobieramy do aktualnej kondycji skóry i pory roku: zimą częściej skupiamy się na odbudowie bariery ochronnej, latem na nawilżeniu i ukojeniu.",
    ],
    steps: [
      { title: "Rozmowa i ocena skóry", text: "Ustalamy, czego skóra potrzebuje dzisiaj." },
      { title: "Oczyszczanie i peeling", text: "Łagodne, dopasowane do wrażliwości skóry." },
      { title: "Masaż i maska", text: "Masaż twarzy, szyi i dekoltu, maska dobrana do potrzeb skóry." },
      { title: "Pielęgnacja kończąca", text: "Serum, krem i ochrona przeciwsłoneczna." },
    ],
    indications: [
      "Skóra odwodniona lub szorstka.",
      "Zmęczenie i brak blasku.",
      "Skóra przesuszona po sezonie grzewczym albo po lecie.",
      "Potrzeba regularnej pielęgnacji gabinetowej.",
    ],
    contraindications: [
      "Aktywne infekcje skóry.",
      "Świeże rany i oparzenia w obszarze zabiegowym.",
      "Nadwrażliwość na składniki preparatów.",
      "Gorączka i ostre stany zapalne – w przypadku masażu.",
    ],
    qualification: [
      "Przed zabiegiem kosmetolog przeprowadza krótki wywiad. Poinformuj nas o ciąży, alergiach i przyjmowanych lekach – dobierzemy odpowiednie preparaty.",
    ],
    facts: [
      { label: "Prowadzi", value: "kosmetolog" },
      { label: "Czas zabiegu", value: "60–90 minut" },
      { label: "Częstotliwość", value: "co 3–6 tygodni" },
      { label: "Po zabiegu", value: "makijaż najlepiej dopiero następnego dnia" },
    ],
  },
  {
    slug: "terapie-kosmetologiczne",
    category: "kosmetologia",
    name: "Terapie kosmetologiczne",
    lede: "Zaplanowane serie zabiegów z wykorzystaniem kwasów, aparatury i preparatów aktywnych – ukierunkowane na konkretny problem skóry.",
    summary: "Seria zabiegów ukierunkowana na konkretny problem skóry.",
    image: "svcTherapies",
    description: [
      "Terapia kosmetologiczna to nie pojedynczy zabieg, lecz zaplanowana seria. Po analizie skóry kosmetolog dobiera metody – na przykład peelingi chemiczne, mikronakłuwanie, zabiegi z wykorzystaniem ultradźwięków lub światła – i ustala harmonogram wizyt.",
      "Między zabiegami kluczowa jest pielęgnacja domowa i codzienna ochrona przeciwsłoneczna. Postępy oceniamy wspólnie, a plan w razie potrzeby modyfikujemy.",
    ],
    steps: [
      { title: "Analiza i dokumentacja", text: "Wywiad, analiza skóry, za Twoją zgodą zdjęcia porównawcze." },
      { title: "Plan terapii", text: "Dobór metod, liczby zabiegów i odstępów między nimi." },
      { title: "Seria zabiegów", text: "Każdy zabieg poprzedza ocena aktualnej kondycji skóry." },
      { title: "Podsumowanie", text: "Ocena postępów i plan pielęgnacji podtrzymującej." },
    ],
    indications: [
      "Przebarwienia i nierówny koloryt skóry.",
      "Zmiany skórne po trądziku.",
      "Rozszerzone pory i nadmierne wydzielanie sebum.",
      "Utrata jędrności i drobne zmarszczki.",
    ],
    contraindications: [
      "Ciąża i okres karmienia piersią – w przypadku wielu metod.",
      "Leczenie izotretynoiną, obecnie lub w ostatnich miesiącach.",
      "Aktywna opryszczka i infekcje skóry.",
      "Świeża opalenizna.",
      "Skłonność do bliznowców.",
      "Rozrusznik serca lub metalowe implanty w obszarze zabiegu – dla części urządzeń.",
      "Choroba nowotworowa – wymaga zgody lekarza prowadzącego.",
    ],
    qualification: [
      "Przed pierwszym zabiegiem kosmetolog przeprowadza wywiad i analizę skóry. W przypadku części metod wykonujemy próbę uczuleniową albo prosimy o konsultację z lekarzem.",
    ],
    facts: [
      { label: "Prowadzi", value: "kosmetolog, we współpracy z lekarzem" },
      { label: "Seria", value: "zwykle 3–6 zabiegów" },
      { label: "Odstęp", value: "2–6 tygodni, zależnie od metody" },
      { label: "Pora roku", value: "zabiegi złuszczające najlepiej jesienią i zimą" },
    ],
  },
  {
    slug: "indywidualny-plan-pielegnacji",
    category: "kosmetologia",
    name: "Indywidualny plan pielęgnacji",
    lede: "Uporządkowany plan pielęgnacji domowej i gabinetowej na najbliższe miesiące – spisany, czytelny i realny do utrzymania.",
    summary: "Spisany plan pielęgnacji domowej i gabinetowej na kolejne miesiące.",
    image: "svcPlan",
    description: [
      "Wiele osób ma w łazience kilkanaście kosmetyków, a mimo to nie widzi poprawy. Plan pielęgnacji porządkuje rutynę: co stosować rano i wieczorem, w jakiej kolejności i jak łączyć ją z zabiegami w gabinecie.",
      "Nie wymagamy kupowania konkretnych marek. Jeśli Twoje kosmetyki dobrze się sprawdzają, włączamy je do planu.",
    ],
    steps: [
      { title: "Analiza skóry i rutyny", text: "Przynieś swoje kosmetyki lub zdjęcia ich etykiet." },
      { title: "Cele i priorytety", text: "Ustalamy, od czego zacząć i czego na razie nie zmieniać." },
      { title: "Plan na piśmie", text: "Rutyna poranna i wieczorna, kalendarz zabiegów gabinetowych." },
      { title: "Wizyta kontrolna", text: "Po 6–8 tygodniach sprawdzamy, jak skóra reaguje na zmiany." },
    ],
    indications: [
      "Brak efektów mimo regularnej pielęgnacji.",
      "Nowa sytuacja: ciąża, przeprowadzka, zmiana klimatu, inny etap życia.",
      "Nadmiar kosmetyków i niepewność, jak je łączyć.",
      "Chęć połączenia pielęgnacji domowej z zabiegami w gabinecie.",
    ],
    contraindicationsNote:
      "Plan pielęgnacji nie ma przeciwwskazań. Jeśli zmiany skórne wymagają diagnostyki lub leczenia – na przykład niepokojące znamiona lub nasilone zmiany zapalne – skierujemy Cię do lekarza.",
    contraindications: [],
    qualification: ["Spotkanie nie wymaga kwalifikacji. Prosimy o przyjście bez makijażu lub w lekkim makijażu."],
    facts: [
      { label: "Prowadzi", value: "kosmetolog" },
      { label: "Czas wizyty", value: "ok. 60 minut" },
      { label: "Otrzymujesz", value: "plan pielęgnacji na piśmie" },
      { label: "Kontrola", value: "po 6–8 tygodniach" },
    ],
  },

  // ── Terapie skóry ────────────────────────────────────────────────────────
  {
    slug: "pielegnacja-skory-problematycznej",
    category: "terapie-skory",
    name: "Pielęgnacja skóry problematycznej",
    lede: "Etapowa opieka nad skórą z niedoskonałościami, zaczerwienieniami lub nadwrażliwością – cierpliwie i we współpracy z lekarzem.",
    summary: "Etapowa opieka nad skórą z niedoskonałościami i zaczerwienieniami.",
    image: "svcProblemSkin",
    description: [
      "Skóra problematyczna potrzebuje planu, a nie jednego intensywnego zabiegu. Zaczynamy od wywiadu i analizy, a następnie łączymy łagodne zabiegi gabinetowe z dopasowaną pielęgnacją domową.",
      "Jeśli zmiany wymagają diagnostyki lub leczenia farmakologicznego – na przykład trądzik o umiarkowanym lub ciężkim nasileniu albo trądzik różowaty – kierujemy na konsultację lekarską. Zabiegi kosmetologiczne mogą wtedy wspierać leczenie, ale go nie zastępują.",
    ],
    steps: [
      { title: "Wywiad i analiza", text: "Historia zmian, dotychczasowe leczenie, pielęgnacja, styl życia." },
      { title: "Konsultacja lekarska", text: "Gdy zmiany tego wymagają – przed rozpoczęciem zabiegów." },
      { title: "Seria łagodnych zabiegów", text: "Dobranych do aktualnego stanu skóry, bez nadmiernego drażnienia." },
      { title: "Pielęgnacja i kontrola", text: "Pielęgnacja domowa i regularna ocena postępów." },
    ],
    indications: [
      "Zaskórniki, grudki i krostki.",
      "Skóra łojotokowa.",
      "Zaczerwienienia i skłonność do podrażnień.",
      "Przebarwienia pozapalne.",
    ],
    contraindications: [
      "Aktywne infekcje bakteryjne, wirusowe lub grzybicze.",
      "Leczenie izotretynoiną – dotyczy części zabiegów.",
      "Świeże oparzenia słoneczne.",
      "Nadwrażliwość na składniki preparatów.",
    ],
    qualification: [
      "Kwalifikacja obejmuje wywiad i analizę skóry, za Twoją zgodą także dokumentację fotograficzną. Przy podejrzeniu choroby skóry prosimy o konsultację z lekarzem przed rozpoczęciem terapii.",
    ],
    facts: [
      { label: "Prowadzi", value: "kosmetolog, w razie potrzeby lekarz" },
      { label: "Forma", value: "seria zabiegów" },
      { label: "Częstotliwość", value: "co 2–4 tygodnie" },
      { label: "Przygotowanie", value: "2 dni bez domowych peelingów i retinoidów, o ile lekarz nie zaleci inaczej" },
    ],
  },
  {
    slug: "zabiegi-regeneracyjne",
    category: "terapie-skory",
    name: "Zabiegi regeneracyjne",
    lede: "Zabiegi kojące i odbudowujące barierę ochronną – po lecie, po intensywnych terapiach i w okresach większego obciążenia skóry.",
    summary: "Ukojenie i odbudowa bariery ochronnej skóry.",
    image: "svcRegeneration",
    description: [
      "Skóra bywa przesuszona, ściągnięta i reaktywna – po sezonie grzewczym, po urlopie w słońcu, po serii zabiegów złuszczających albo w okresie stresu. Zabiegi regeneracyjne skupiają się na ukojeniu i odbudowie bariery hydrolipidowej.",
      "Stosujemy łagodne preparaty, maski i techniki, które nie obciążają skóry. Zabieg może być samodzielny albo stanowić przerwę w intensywniejszej terapii.",
    ],
    steps: [
      { title: "Ocena skóry", text: "Sprawdzamy stopień przesuszenia i reaktywności." },
      { title: "Łagodne oczyszczanie", text: "Bez złuszczania mechanicznego i silnych kwasów." },
      { title: "Regeneracja", text: "Ampułka i maska regenerująca, w razie potrzeby światło LED o niskiej intensywności." },
      { title: "Ochrona i zalecenia", text: "Pielęgnacja kończąca i wskazówki na kolejne dni." },
    ],
    indications: [
      "Skóra przesuszona i ściągnięta.",
      "Podrażnienia po słońcu lub zabiegach.",
      "Osłabiona bariera ochronna.",
      "Skóra wrażliwa i reaktywna.",
    ],
    contraindications: [
      "Aktywne infekcje skóry.",
      "Otwarte rany w obszarze zabiegowym.",
      "Nadwrażliwość na składniki preparatów.",
      "Leki fotouczulające i padaczka światłoczuła – w przypadku zabiegów ze światłem LED.",
    ],
    qualification: [
      "Przed zabiegiem kosmetolog przeprowadza krótki wywiad. Po zabiegach lekarskich termin zabiegu regeneracyjnego ustalamy z lekarzem prowadzącym.",
    ],
    facts: [
      { label: "Prowadzi", value: "kosmetolog" },
      { label: "Czas zabiegu", value: "ok. 60 minut" },
      { label: "Forma", value: "pojedynczo lub w serii" },
      { label: "Po zabiegu", value: "bez przerwy w codziennej aktywności" },
    ],
  },
  {
    slug: "konsultacja-pielegnacyjna",
    category: "terapie-skory",
    name: "Konsultacja dotycząca pielęgnacji",
    lede: "Rozmowa z kosmetologiem o Twojej skórze: co jej służy, czego unikać i od czego zacząć.",
    summary: "Ocena skóry i rekomendacje na start – bez zobowiązań.",
    image: "svcSkinAdvice",
    description: [
      "To spotkanie dla osób, które chcą zrozumieć potrzeby swojej skóry, zanim zdecydują się na zabiegi. Kosmetolog ocenia skórę, omawia obecną pielęgnację i wyjaśnia, jakie zabiegi gabinetowe mogą mieć w Twoim przypadku sens – a jakie nie.",
      "Konsultacja to rozmowa i rekomendacje na start. Jeśli potrzebujesz szczegółowego programu na kolejne miesiące, zaproponujemy indywidualny plan pielęgnacji.",
    ],
    steps: [
      { title: "Rozmowa", text: "Co Ci przeszkadza, jak wygląda Twoja codzienna pielęgnacja." },
      { title: "Analiza skóry", text: "Ocena typu i aktualnej kondycji skóry." },
      { title: "Rekomendacje", text: "Proste zmiany w pielęgnacji i ewentualne zabiegi." },
      { title: "Dalsze kroki", text: "W razie potrzeby konsultacja lekarska lub plan pielęgnacji." },
    ],
    indications: [
      "Nie wiesz, od czego zacząć.",
      "Zauważasz zmiany w skórze, na przykład nową wrażliwość lub przebarwienia.",
      "Planujesz pierwszy zabieg kosmetologiczny.",
      "Masz wątpliwości co do stosowanych kosmetyków.",
    ],
    contraindicationsNote: "Konsultacja nie ma przeciwwskazań.",
    contraindications: [],
    qualification: ["Konsultacja nie wymaga kwalifikacji. Najlepiej przyjść bez makijażu i z listą stosowanych kosmetyków."],
    facts: [
      { label: "Prowadzi", value: "kosmetolog" },
      { label: "Czas wizyty", value: "ok. 45 minut" },
      { label: "Przygotowanie", value: "bez makijażu, lista kosmetyków" },
      { label: "Po wizycie", value: "notatka z zaleceniami" },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getCategory(slug: CategorySlug): ServiceCategory {
  return categories.find((category) => category.slug === slug)!;
}

export function servicesIn(category: CategorySlug): Service[] {
  return services.filter((service) => service.category === category);
}

export function isCategorySlug(value: string): value is CategorySlug {
  return categories.some((category) => category.slug === value);
}
