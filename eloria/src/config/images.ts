/**
 * CENTRALNA MAPA ZDJĘĆ (shot list)
 *
 * Każde miejsce na zdjęcie w serwisie ma tu swój wpis: nazwę pliku, tekst alternatywny,
 * proporcje oraz brief dla fotografa. Zdjęcia leżą w `public/images/eloria/`.
 * Aby podmienić grafikę, wystarczy wgrać plik o nazwie z pola `file` – kod się nie zmienia.
 *
 * Dopóki pliku nie ma, w jego miejscu wyświetla się tonalna plansza w kolorystyce marki
 * z krótkim opisem kadru (`components/ui/Photo.tsx`).
 *
 * Wspólna linia wizualna wszystkich kadrów (wyznaczona przez zdjęcie gabinetu zabiegowego kliniki):
 * – wnętrza: kremowe, ryflowane fronty zabudowy, aksamitne zasłony w kolorze gorzkiej czekolady,
 *   złote detale (baterie, uchwyty), jasny kamień; ciepłe światło, bez chłodnej bieli „gabinetowej”;
 * – paleta ivory / blush / champagne, akcenty ciepłego brązu i złota;
 * – światło miękkie, rozproszone, bez lampy błyskowej i bez mocnych cieni;
 * – naturalna skóra z widoczną fakturą, minimalny retusz, bez efektu „przed/po”;
 * – kadry spokojne, z dużą ilością powietrza; ludzie w naturalnym ruchu, nie pozujący do obiektywu.
 *
 * Zalecenia techniczne: JPG lub WebP, min. 2000 px po dłuższym boku (hero: 2800 px),
 * proporcje zgodne z `aspect` – zdjęcie jest kadrowane przez `object-fit: cover`.
 * Po dodaniu plików w trybie produkcyjnym przebuduj projekt (`npm run build`).
 */

export const IMAGE_DIR = "/images/eloria";

export type PlaceholderTone = "ivory" | "blush" | "sand" | "dark";

export interface ImageDefinition {
  file: string;
  alt: string;
  /** Proporcje kadru (szerokość:wysokość). */
  aspect: string;
  /** Krótka nazwa kadru – wyświetlana na planszy zastępczej. */
  caption: string;
  /** Brief dla fotografa. */
  brief: string;
  tone: PlaceholderTone;
}

export const IMAGES = {
  // ── Strona główna ────────────────────────────────────────────────────────
  heroDetail: {
    file: "hero-detail.jpg",
    alt: "Dłoń z manicure w odcieniu nude i delikatnym złotym pierścionkiem, w rękawie jasnego swetra",
    aspect: "1:1",
    caption: "Detal, dłoń i manicure nude",
    brief: "Zdjęcie dostarczone przez klientkę (447 × 447 px). Docelowo wersja w wyższej rozdzielczości, min. 1200 px.",
    tone: "sand",
  },
  philosophy: {
    file: "philosophy-consultation.jpg",
    alt: "Lekarka rozmawiająca z pacjentką przy stole w gabinecie konsultacyjnym",
    aspect: "3:4",
    caption: "Rozmowa przy stole konsultacyjnym",
    brief:
      "Lekarka i pacjentka przy jasnym, dębowym stole, notatki i filiżanka. Ujęcie zza ramienia pacjentki, uważne słuchanie. Bez fartucha z logo, bez sprzętu na pierwszym planie.",
    tone: "ivory",
  },
  highlightRoom: {
    file: "highlight-treatment-room.jpg",
    alt: "Gabinet zabiegowy: kremowy fotel zabiegowy, lampa operacyjna, zabudowa z ryflowanymi frontami i aksamitne zasłony w kolorze czekolady",
    aspect: "3:2",
    caption: "Gabinet zabiegowy, szeroki plan",
    brief: "Zdjęcie gabinetu zabiegowego kliniki (2048 × 1376 px) – punkt odniesienia dla stylistyki pozostałych kadrów.",
    tone: "sand",
  },
  contactReception: {
    file: "contact-reception.jpg",
    alt: "Recepcja kliniki z kamiennym kontuarem i bukietem suszonych traw",
    aspect: "4:5",
    caption: "Recepcja",
    brief: "Kontuar recepcji z jasnego kamienia i ryflowanym frontem, złote detale, suszone trawy w ceramicznym wazonie, ciepłe światło.",
    tone: "dark",
  },

  // ── Wnętrza ──────────────────────────────────────────────────────────────
  interiorLounge: {
    file: "interior-lounge.jpg",
    alt: "Strefa oczekiwania z fotelem bouclé i niskim stolikiem z trawertynu",
    aspect: "4:5",
    caption: "Strefa oczekiwania",
    brief: "Fotel bouclé lub welurowy w kolorze ecru, stolik z trawertynu, w tle aksamitna zasłona w kolorze czekolady. Kadr pionowy.",
    tone: "ivory",
  },
  interiorConsultation: {
    file: "interior-consultation.jpg",
    alt: "Gabinet konsultacyjny z dębowym biurkiem i dwoma krzesłami",
    aspect: "3:2",
    caption: "Gabinet konsultacyjny",
    brief: "Dębowe biurko, dwa krzesła naprzeciw siebie, ceramiczny wazon z gałązką. Rozmowa twarzą w twarz, nie zza monitora.",
    tone: "blush",
  },
  interiorCorridor: {
    file: "interior-corridor.jpg",
    alt: "Korytarz kliniki z łukowym przejściem i miękkim światłem",
    aspect: "2:3",
    caption: "Korytarz, łukowe przejście",
    brief: "Perspektywa korytarza w kamienicy: wysoki sufit, sztukateria, łukowe przejście, światło padające z boku.",
    tone: "sand",
  },
  interiorWindow: {
    file: "interior-window.jpg",
    alt: "Okno kamienicy z lnianą zasłoną i widokiem na drzewa",
    aspect: "4:5",
    caption: "Okno, lniana zasłona",
    brief: "Wysokie okno warszawskiej kamienicy, lniana zasłona poruszona powietrzem, korony drzew za szybą.",
    tone: "ivory",
  },
  interiorTreatment: {
    file: "interior-treatment.jpg",
    alt: "Fotel zabiegowy przygotowany do zabiegu, obok złożone ręczniki",
    aspect: "1:1",
    caption: "Stanowisko zabiegowe",
    brief: "Fotel zabiegowy z bliska, złożone ręczniki w kolorze ecru, lampa w tle nieostra.",
    tone: "blush",
  },

  // ── Detale ───────────────────────────────────────────────────────────────
  detailTowels: {
    file: "detail-towels.jpg",
    alt: "Złożone ręczniki i ceramiczna miseczka na drewnianej półce",
    aspect: "4:5",
    caption: "Detal, ręczniki i ceramika",
    brief: "Martwa natura: złożone ręczniki, ceramiczna miseczka, gałązka eukaliptusa. Światło z góry-boku.",
    tone: "sand",
  },
  detailProducts: {
    file: "detail-products.jpg",
    alt: "Szklane flakony kosmetyków bez etykiet na kamiennym blacie",
    aspect: "3:4",
    caption: "Detal, flakony",
    brief: "Szklane flakony bez widocznych marek, refleksy światła na kamieniu. Bez logotypów producentów.",
    tone: "ivory",
  },
  detailTexture: {
    file: "detail-texture.jpg",
    alt: "Faktura kremu rozprowadzonego na jasnym kamieniu",
    aspect: "1:1",
    caption: "Detal, faktura kremu",
    brief: "Makro faktury kremu na trawertynie, kolor kremowy, miękki cień.",
    tone: "blush",
  },

  detailManicureRed: {
    file: "detail-manicure-red.jpg",
    alt: "Dłoń z klasycznym czerwonym manicure na tle jasnej zasłony",
    aspect: "4:5",
    caption: "Detal, czerwony manicure",
    brief: "Zdjęcie dostarczone przez klientkę (480 × 600 px). Docelowo wersja w wyższej rozdzielczości.",
    tone: "blush",
  },

  // ── Praca specjalistów ───────────────────────────────────────────────────
  workSkinAnalysis: {
    file: "work-skin-analysis.jpg",
    alt: "Kosmetolożka oglądająca skórę pacjentki przez lupę z oświetleniem",
    aspect: "4:5",
    caption: "Analiza skóry",
    brief: "Kosmetolożka w jasnym uniformie ogląda skórę pacjentki przez lampę z lupą. Skupienie, spokój, rękawiczki.",
    tone: "sand",
  },
  workTreatment: {
    file: "work-treatment.jpg",
    alt: "Dłonie specjalistki w rękawiczkach podczas zabiegu pielęgnacyjnego twarzy",
    aspect: "3:2",
    caption: "Zabieg pielęgnacyjny",
    brief: "Dłonie specjalistki w rękawiczkach podczas zabiegu na twarz, pacjentka z zamkniętymi oczami, rozluźniona.",
    tone: "blush",
  },
  workNotes: {
    file: "work-notes.jpg",
    alt: "Lekarka zapisująca plan pielęgnacji w notatniku",
    aspect: "4:5",
    caption: "Plan pielęgnacji",
    brief: "Dłoń z piórem nad notatnikiem z planem pielęgnacji, kartka z odręcznymi zapiskami (nieczytelnymi).",
    tone: "ivory",
  },

  // ── Zespół ───────────────────────────────────────────────────────────────
  teamNatalia: {
    file: "team-natalia.jpg",
    alt: "Portret lekarki Natalii Orłowskiej w gabinecie",
    aspect: "3:4",
    caption: "Portret, lekarz",
    brief: "Portret do pasa, jasny uniform lub koszula, tło: ściana gabinetu. Naturalny uśmiech, spojrzenie w obiektyw.",
    tone: "blush",
  },
  teamJulia: {
    file: "team-julia.jpg",
    alt: "Portret kosmetolożki Julii Sadowskiej",
    aspect: "3:4",
    caption: "Portret, kosmetolog",
    brief: "Portret do pasa w tym samym świetle i tle co pozostałe – spójna seria.",
    tone: "sand",
  },
  teamMarta: {
    file: "team-marta.jpg",
    alt: "Portret specjalistki terapii skóry Marty Lis",
    aspect: "3:4",
    caption: "Portret, terapie skóry",
    brief: "Portret do pasa w tym samym świetle i tle co pozostałe – spójna seria.",
    tone: "ivory",
  },
  teamEwa: {
    file: "team-ewa.jpg",
    alt: "Portret koordynatorki pacjentek Ewy Kamińskiej przy recepcji",
    aspect: "3:4",
    caption: "Portret, koordynacja wizyt",
    brief: "Portret przy recepcji, w tym samym świetle co pozostałe portrety.",
    tone: "blush",
  },

  // ── O klinice ────────────────────────────────────────────────────────────
  aboutFacade: {
    file: "about-facade.jpg",
    alt: "Fasada przedwojennej kamienicy w Śródmieściu Warszawy",
    aspect: "4:5",
    caption: "Kamienica, Śródmieście",
    brief: "Fragment jasnej fasady kamienicy z balkonem i sztukaterią, widziany z ulicy, wczesny poranek.",
    tone: "sand",
  },
  aboutLight: {
    file: "about-light.jpg",
    alt: "Smuga słońca na wapiennej ścianie i gałązka w wazonie",
    aspect: "16:9",
    caption: "Światło na ścianie",
    brief: "Abstrakcyjny kadr: smuga słońca na wapiennej ścianie, cień gałązki. Do szerokiego, panoramicznego kadrowania.",
    tone: "blush",
  },

  // ── Zabiegi (jedno zdjęcie na usługę) ────────────────────────────────────
  svcConsultation: {
    file: "service-consultation.jpg",
    alt: "Lekarka omawiająca z pacjentką plan dalszego postępowania",
    aspect: "4:5",
    caption: "Konsultacja lekarska",
    brief: "Lekarka i pacjentka przy stole, lekarka szkicuje coś w notatniku. Ciepłe światło.",
    tone: "blush",
  },
  svcFace: {
    file: "service-face.jpg",
    alt: "Profil kobiety z naturalną, zadbaną skórą twarzy",
    aspect: "4:5",
    caption: "Profil, linia żuchwy",
    brief: "Profil kobiety 40+, linia policzka i żuchwy w miękkim świetle bocznym. Naturalna skóra, bez retuszu „plastikowego”.",
    tone: "sand",
  },
  svcSkinQuality: {
    file: "service-skin-quality.jpg",
    alt: "Zbliżenie na promienną skórę policzka w świetle dziennym",
    aspect: "4:5",
    caption: "Zbliżenie, faktura skóry",
    brief: "Makro skóry policzka z widocznymi porami i delikatnym meszkiem, światło dzienne.",
    tone: "ivory",
  },
  svcCleansing: {
    file: "service-cleansing.jpg",
    alt: "Pianka oczyszczająca w dłoniach nad umywalką z kamienia",
    aspect: "4:5",
    caption: "Oczyszczanie",
    brief: "Dłonie z pianką oczyszczającą nad kamienną umywalką, krople wody.",
    tone: "blush",
  },
  svcCare: {
    file: "service-care.jpg",
    alt: "Pacjentka z zamkniętymi oczami i ręcznikiem na włosach podczas zabiegu pielęgnacyjnego – kosmetolożka nakłada krem na policzek",
    aspect: "1:1",
    caption: "Zabieg pielęgnacyjny",
    brief: "Zdjęcie dostarczone przez klientkę (594 × 596 px, wycięte z kompozycji). Docelowo wersja w wyższej rozdzielczości.",
    tone: "sand",
  },
  svcTherapies: {
    file: "service-therapies.jpg",
    alt: "Kosmetolożka przygotowująca preparaty do terapii na tacy",
    aspect: "4:5",
    caption: "Przygotowanie terapii",
    brief: "Dłonie przygotowujące preparaty w szklanych miseczkach na tacy z trawertynu.",
    tone: "ivory",
  },
  svcPlan: {
    file: "service-plan.jpg",
    alt: "Kosmetolożka i pacjentka przeglądające plan pielęgnacji domowej",
    aspect: "4:5",
    caption: "Plan pielęgnacji",
    brief: "Dwie osoby nad kartą planu pielęgnacji, obok kilka flakonów bez etykiet.",
    tone: "blush",
  },
  svcProblemSkin: {
    file: "service-problem-skin.jpg",
    alt: "Kosmetolożka delikatnie oceniająca skórę pacjentki z niedoskonałościami",
    aspect: "4:5",
    caption: "Skóra problematyczna",
    brief: "Pacjentka z widocznymi niedoskonałościami skóry (prawdziwa skóra, bez retuszu), uważna ocena w świetle lampy.",
    tone: "sand",
  },
  svcRegeneration: {
    file: "service-regeneration.jpg",
    alt: "Maska regenerująca nakładana pędzlem na skórę twarzy",
    aspect: "4:5",
    caption: "Regeneracja",
    brief: "Zbliżenie na pędzel nakładający maskę o kremowej konsystencji, spokojna kompozycja.",
    tone: "ivory",
  },
  svcSkinAdvice: {
    file: "service-skin-advice.jpg",
    alt: "Rozmowa o pielęgnacji przy stole z kosmetykami",
    aspect: "4:5",
    caption: "Rozmowa o pielęgnacji",
    brief: "Kosmetolożka pokazuje pacjentce konsystencję kosmetyku na grzbiecie dłoni.",
    tone: "blush",
  },

  // ── Rezerwacja ───────────────────────────────────────────────────────────
  booking: {
    file: "booking-chair.jpg",
    alt: "Fotel w gabinecie konsultacyjnym w popołudniowym świetle",
    aspect: "3:4",
    caption: "Fotel w gabinecie konsultacyjnym",
    brief: "Pusty fotel w gabinecie konsultacyjnym, popołudniowe światło, poczucie spokoju i czasu.",
    tone: "sand",
  },
} satisfies Record<string, ImageDefinition>;

export type ImageKey = keyof typeof IMAGES;

/** Obraz po sprawdzeniu, czy plik istnieje w `public/`. */
export interface ResolvedImage {
  key: ImageKey;
  /** `null`, gdy pliku nie ma – wtedy renderowana jest plansza zastępcza. */
  src: string | null;
  /** Oczekiwana ścieżka pliku (dla developera, gdy zdjęcia brakuje). */
  expectedPath: string;
  alt: string;
  caption: string;
  tone: PlaceholderTone;
}
