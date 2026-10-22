import { typesetDeep } from "@/lib/typography";

export type LayerId = "ludzie" | "urzadzenia" | "siec" | "dane";

export const infrastructureLayers: { id: LayerId; name: string; detail: string }[] = typesetDeep([
  { id: "ludzie", name: "Ludzie i konta", detail: "tożsamości, uprawnienia, MFA" },
  { id: "urzadzenia", name: "Urządzenia i poczta", detail: "laptopy, telefony, skrzynki" },
  { id: "siec", name: "Sieć i serwery", detail: "biuro, VPN, serwery, chmura" },
  { id: "dane", name: "Dane i kopie", detail: "pliki, bazy, kopie zapasowe" },
]);

export type ServiceSlug = "obsluga-it" | "cyberbezpieczenstwo" | "chmura-i-infrastruktura";

export type Faq = { question: string; answer: string };

export type ServicePillar = {
  slug: ServiceSlug;
  href: `/uslugi/${ServiceSlug}`;
  name: string;
  englishName: string;
  summary: string;
  /** Warstwy przekroju infrastruktury, za które odpowiada filar, z krótką notatką. */
  layers: Partial<Record<LayerId, string>>;
  problems: string[];
  scope: { title: string; text: string }[];
  benefits: string[];
  delivery: { title: string; text: string }[];
  faq: Faq[];
};

export const services: ServicePillar[] = typesetDeep<ServicePillar[]>([
  {
    slug: "obsluga-it",
    href: "/uslugi/obsluga-it",
    name: "Obsługa IT",
    englishName: "IT Managed Services",
    summary:
      "Administracja komputerów, serwerów i kont, monitoring oraz wsparcie użytkowników. Jeden kanał zgłoszeń i jasny podział odpowiedzialności.",
    layers: {
      ludzie: "konta, wdrożenia i odejścia pracowników",
      urzadzenia: "aktualizacje, standard instalacji, wsparcie",
      siec: "monitoring dostępności i zasobów",
    },
    problems: [
      "Komputery, drukarki i konta konfiguruje „ktoś, kto się zna”, a wiedza o środowisku jest w jednej głowie.",
      "O awarii dowiadujesz się dopiero wtedy, gdy ktoś nie może pracować.",
      "Nie wiadomo, które urządzenia mają aktualny system, a które licencje i domeny wkrótce wygasną.",
      "Nowa osoba czeka na dostępy kilka dni, a ta, która odeszła, zachowuje je tygodniami.",
    ],
    scope: [
      {
        title: "Administracja stacji i serwerów",
        text: "Aktualizacje systemów i aplikacji, jeden standard konfiguracji nowych komputerów, zarządzanie urządzeniami zdalnie.",
      },
      {
        title: "Monitoring",
        text: "Dostępność usług, miejsce na dyskach, stan kopii zapasowych, wygasające certyfikaty i domeny.",
      },
      {
        title: "Wsparcie użytkowników",
        text: "Pomoc zdalna i na miejscu, zgłoszenia przyjmowane jednym kanałem i rozpatrywane według ustalonych priorytetów.",
      },
      {
        title: "Konta i dostępy",
        text: "Wdrażanie i wyłączanie kont pracowników, Microsoft 365 lub Google Workspace, uprawnienia do folderów i aplikacji.",
      },
      {
        title: "Dokumentacja środowiska",
        text: "Inwentaryzacja sprzętu, licencji, kont i dostawców, aktualizowana przy każdej zmianie.",
      },
    ],
    benefits: [
      "Wiesz, kto odpowiada za każdy element środowiska i do kogo zgłosić problem.",
      "Część usterek wychwytuje monitoring, zanim odczują je pracownicy.",
      "Dokumentacja środowiska należy do Ciebie i zostaje u Ciebie również po zakończeniu współpracy.",
      "Zakres prac jest zapisany w umowie, więc nie negocjujesz każdej interwencji osobno.",
    ],
    delivery: [
      { title: "Przegląd środowiska", text: "Spisujemy urządzenia, konta, licencje i dostawców. Wskazujemy, co wymaga pilnej uwagi." },
      { title: "Zasady współpracy", text: "Ustalamy kanał zgłoszeń, priorytety, godziny wsparcia i osoby kontaktowe po obu stronach." },
      { title: "Przejęcie administracji", text: "Wdrażamy monitoring i narzędzia zdalnego zarządzania, porządkujemy konfigurację." },
      { title: "Raporty i przeglądy", text: "Co miesiąc dostajesz zestawienie zgłoszeń i zmian, co kwartał omawiamy plan na kolejne miesiące." },
    ],
    faq: [
      {
        question: "Czy trzeba mieć serwer, żeby skorzystać z obsługi IT?",
        answer:
          "Nie. Wiele firm pracuje wyłącznie na laptopach i usługach chmurowych. Wtedy administrujemy urządzeniami, kontami i usługami, z których firma faktycznie korzysta.",
      },
      {
        question: "Jak zgłasza się problemy?",
        answer:
          "Jednym kanałem ustalonym na starcie współpracy, najczęściej przez e-mail lub system zgłoszeń. Każde zgłoszenie dostaje priorytet, a czas reakcji dla każdego priorytetu zapisujemy w umowie.",
      },
      {
        question: "Mamy własnego informatyka. Czy to ma sens?",
        answer:
          "Tak, w modelu współdzielonym. Możemy przejąć wybrane obszary, na przykład monitoring i kopie zapasowe, albo zapewnić zastępstwo i drugą parę oczu przy większych zmianach.",
      },
    ],
  },
  {
    slug: "cyberbezpieczenstwo",
    href: "/uslugi/cyberbezpieczenstwo",
    name: "Cyberbezpieczeństwo",
    englishName: "Cybersecurity",
    summary:
      "Audyty, analiza ryzyka, utwardzanie konfiguracji i testy bezpieczeństwa wykonywane wyłącznie za pisemną zgodą właściciela systemu.",
    layers: {
      ludzie: "uprawnienia, MFA, odporność na phishing",
      urzadzenia: "utwardzanie systemów, SPF, DKIM, DMARC",
      siec: "segmentacja, dostęp zdalny, ekspozycja usług",
      dane: "kto ma dostęp do danych klientów",
    },
    problems: [
      "Nie wiesz, które konta mają uprawnienia administratora ani kto ma dostęp do danych klientów.",
      "Do skrzynek trafia coraz lepiej przygotowany phishing, a domena firmy nie ma poprawnie ustawionych SPF, DKIM i DMARC.",
      "Klient lub ubezpieczyciel pyta o zabezpieczenia, a firma nie ma dokumentu, który można pokazać.",
      "Konfiguracja systemów i usług chmurowych pozostała domyślna od dnia instalacji.",
    ],
    scope: [
      {
        title: "Audyt bezpieczeństwa",
        text: "Przegląd konfiguracji, kont i uprawnień, poczty, urządzeń, dostępu zdalnego i kopii zapasowych.",
      },
      {
        title: "Analiza ryzyka",
        text: "Co może się wydarzyć, jak bardzo zaszkodzi firmie i od czego zacząć – z uzasadnieniem każdego priorytetu.",
      },
      {
        title: "Hardening",
        text: "Utwardzanie systemów, usług chmurowych i sieci w oparciu o uznane wytyczne, takie jak CIS Benchmarks.",
      },
      {
        title: "Testy bezpieczeństwa",
        text: "Wyłącznie w uzgodnionym zakresie i oknie czasowym, za pisemną zgodą osoby uprawnionej do dysponowania systemem.",
      },
      {
        title: "Doradztwo i szkolenia",
        text: "Polityki dostępu, procedura reagowania na incydent, szkolenia z rozpoznawania phishingu dla pracowników.",
      },
    ],
    benefits: [
      "Lista ryzyk z priorytetami zamiast ogólnego poczucia zagrożenia.",
      "Raport zrozumiały dla zarządu i techniczny załącznik dla osoby odpowiedzialnej za IT.",
      "Poprawki wdrożone i sprawdzone, a nie tylko opisane w dokumencie.",
      "Dokumentacja, którą możesz pokazać klientowi, audytorowi lub ubezpieczycielowi.",
    ],
    delivery: [
      { title: "Zakres i zgoda", text: "Spisujemy, co badamy, w jakim terminie i jakimi metodami. Bez podpisanej zgody nie zaczynamy testów." },
      { title: "Przegląd i testy", text: "Zbieramy informacje, sprawdzamy konfigurację i wykonujemy uzgodnione testy." },
      { title: "Analiza i raport", text: "Każde ustalenie opisujemy z oceną ryzyka, dowodem i rekomendacją." },
      { title: "Naprawa", text: "Wdrażamy poprawki samodzielnie lub wspieramy Twój zespół albo dostawcę." },
      { title: "Weryfikacja", text: "Sprawdzamy, czy poprawki działają, i zamykamy ustalenia w raporcie." },
    ],
    faq: [
      {
        question: "Czy audyt zakłóci pracę firmy?",
        answer:
          "Przegląd konfiguracji nie wpływa na codzienną pracę. Testy, które mogą obciążyć systemy, planujemy w uzgodnionym oknie czasowym i z osobą kontaktową po Twojej stronie.",
      },
      {
        question: "Czy wykonujecie testy penetracyjne?",
        answer:
          "Tak, w ograniczonym i uzgodnionym zakresie, wyłącznie za pisemną zgodą osoby uprawnionej do dysponowania systemem. Systemów podmiotów trzecich, na przykład dostawcy hostingu, nie testujemy bez ich zgody.",
      },
      {
        question: "Czy po audycie firma będzie zgodna z RODO lub NIS2?",
        answer:
          "Audyt techniczny pomaga spełnić wymagania dotyczące zabezpieczeń, ale nie zastępuje oceny prawnej. Wskazujemy obszary techniczne do poprawy i możemy współpracować z Twoim doradcą prawnym.",
      },
    ],
  },
  {
    slug: "chmura-i-infrastruktura",
    href: "/uslugi/chmura-i-infrastruktura",
    name: "Chmura i infrastruktura",
    englishName: "Cloud & Infrastructure",
    summary:
      "Projekt i utrzymanie środowisk chmurowych i hybrydowych, kopie zapasowe, ciągłość działania i porządkowanie kosztów.",
    layers: {
      siec: "architektura, migracje, infrastruktura jako kod",
      dane: "kopie 3-2-1, test odtworzenia, plan ciągłości",
    },
    problems: [
      "Kopie zapasowe niby są, ale nikt nie sprawdził, czy da się z nich odtworzyć dane.",
      "Serwer w biurze dobiega końca życia, a migracja wydaje się zbyt ryzykowna.",
      "Rachunki za chmurę rosną, a nikt nie wie, które zasoby są jeszcze potrzebne.",
      "Awaria jednego elementu zatrzymuje pracę całej firmy.",
    ],
    scope: [
      {
        title: "Kopie zapasowe 3-2-1",
        text: "Trzy kopie, dwa rodzaje nośników, jedna poza firmą – w tym kopia odporna na usunięcie i regularny test odtworzenia.",
      },
      {
        title: "Plan ciągłości działania",
        text: "Akceptowalna utrata danych i czas przywrócenia ustalone z Tobą, procedury odtwarzania opisane krok po kroku.",
      },
      {
        title: "Migracje",
        text: "Z serwera lokalnego do chmury lub środowiska hybrydowego – etapami i z planem wycofania.",
      },
      {
        title: "Infrastruktura jako kod",
        text: "Środowiska opisane w repozytorium, dzięki czemu można je odtworzyć i przejrzeć każdą zmianę.",
      },
      {
        title: "Przegląd kosztów",
        text: "Inwentaryzacja zasobów, dopasowanie rozmiarów i przypisanie kosztów do konkretnych usług.",
      },
    ],
    benefits: [
      "Wiesz, ile danych możesz stracić i jak długo potrwa przywrócenie, bo zostało to sprawdzone testem.",
      "Migracja przebiega etapami, z możliwością powrotu do poprzedniego stanu.",
      "Środowisko jest udokumentowane i odtwarzalne, niezależne od jednej osoby.",
      "Każda pozycja na rachunku za chmurę ma właściciela i uzasadnienie.",
    ],
    delivery: [
      { title: "Inwentaryzacja", text: "Ustalamy, jakie dane i systemy ma firma, gdzie są i które są krytyczne." },
      { title: "Projekt", text: "Przygotowujemy architekturę, plan kopii i harmonogram migracji wraz z planem wycofania." },
      { title: "Wdrożenie etapami", text: "Przenosimy i konfigurujemy usługi partiami, z kontrolą po każdym etapie." },
      { title: "Test odtworzenia", text: "Odtwarzamy wybrane dane i systemy z kopii, a wynik zapisujemy w protokole." },
      { title: "Utrzymanie", text: "Monitorujemy kopie i zasoby, powtarzamy testy odtworzenia według harmonogramu." },
    ],
    faq: [
      {
        question: "Z jakimi platformami pracujecie?",
        answer:
          "Dobór zależy od tego, z czego firma już korzysta i jakie ma wymagania. Projektujemy środowiska w Microsoft 365, Google Workspace, Azure i AWS oraz rozwiązania hybrydowe. Nie jesteśmy związani z jednym dostawcą.",
      },
      {
        question: "Mamy pliki w OneDrive lub Dropboxie. Czy to nie wystarczy?",
        answer:
          "Synchronizacja nie jest kopią zapasową. Usunięcie lub zaszyfrowanie pliku na komputerze zostaje przeniesione do chmury. Kopia zapasowa musi być niezależna od źródła i mieć historię wersji.",
      },
      {
        question: "Czy migracja oznacza przestój?",
        answer:
          "Zwykle tylko krótkie, zaplanowane okna przełączenia. Migrację dzielimy na etapy, a dla każdego mamy plan wycofania, gdyby coś poszło niezgodnie z założeniami.",
      },
    ],
  },
]);

export const additionalServices: { name: string; text: string }[] = typesetDeep([
  {
    name: "Wdrożenia",
    text: "Jednorazowe projekty: uruchomienie Microsoft 365 lub Google Workspace, sieć Wi-Fi w nowym biurze, wymiana sprzętu.",
  },
  {
    name: "Konsultacje",
    text: "Druga opinia przed zakupem, przegląd oferty innego dostawcy, pomoc w przygotowaniu zapytania ofertowego.",
  },
  {
    name: "Szkolenia",
    text: "Rozpoznawanie phishingu, bezpieczna praca zdalna i zasady obchodzenia się z danymi klientów – dla zespołu i dla kadry zarządzającej.",
  },
]);

export function getService(slug: ServiceSlug): ServicePillar {
  const service = services.find((item) => item.slug === slug);
  if (!service) throw new Error(`Nieznana usługa: ${slug}`);
  return service;
}
