import { typesetDeep } from "@/lib/typography";
import type { ServiceSlug } from "./services";
import type { CaseArea, CaseSector } from "./taxonomy";

export { caseAreas, caseSectors, filterCases, type CaseArea, type CaseFilterState, type CaseSector } from "./taxonomy";

/** Schemat przepływu: kolumny etapów połączone opisanymi przejściami. */
export type FlowDiagram = {
  title: string;
  description: string;
  columns: { label: string; nodes: { name: string; detail?: string; emphasis?: boolean }[] }[];
  /** Opis przejścia między kolumną i a i+1 – długość o jeden mniejsza niż liczba kolumn. */
  links: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  area: CaseArea;
  sector: CaseSector;
  profile: string;
  duration: string;
  context: string[];
  problems: string[];
  assumptions: string[];
  analysis: {
    intro: string;
    options: { name: string; pros: string; cons: string; chosen: boolean }[];
    conclusion: string;
  };
  diagram: FlowDiagram;
  scope: { stage: string; tasks: string[] }[];
  criteria: { criterion: string; verification: string }[];
  services: ServiceSlug[];
};

export const caseStudies: CaseStudy[] = typesetDeep<CaseStudy[]>([
  {
    slug: "dostepy-i-poczta-biura-rachunkowego",
    title: "Uporządkowanie dostępów i poczty w biurze rachunkowym",
    summary:
      "Biuro przetwarza dane finansowe kilkuset klientów. Celem było ograniczenie ryzyka przejęcia skrzynek i nieuprawnionego dostępu do dokumentów bez zatrzymywania pracy w okresie rozliczeń.",
    area: "bezpieczenstwo",
    sector: "uslugi",
    profile: "Fikcyjne biuro rachunkowe, 18 osób, praca hybrydowa, Microsoft 365",
    duration: "Założony czas realizacji: 6 tygodni",
    context: [
      "Biuro obsługuje klientów w siedzibie i zdalnie. Dokumenty krążą pocztą elektroniczną i przez współdzielone foldery w OneDrive. Konta przez lata zakładał jeden z pracowników, a część osób pracuje na prywatnych laptopach.",
      "Bezpośrednim impulsem była wiadomość, w której ktoś podszył się pod biuro i poprosił klienta o przelew na nowy numer rachunku. Klient zadzwonił z pytaniem, zanim zapłacił.",
    ],
    problems: [
      "Pięć kont z uprawnieniami administratora globalnego, w tym konto dawnego współpracownika.",
      "Uwierzytelnianie wieloskładnikowe włączone tylko dla dwóch osób.",
      "Domena bez rekordu DMARC, więc łatwo podszyć się pod biuro w korespondencji z klientami.",
      "Foldery klientów udostępnione linkami dostępnymi dla każdego, kto zna adres.",
    ],
    assumptions: [
      "Zmiany nie mogą zatrzymać pracy w ostatnim tygodniu miesiąca, gdy trwają rozliczenia.",
      "Biuro zostaje przy Microsoft 365 Business Premium i nie kupuje nowych narzędzi, jeśli posiadana licencja ma potrzebną funkcję.",
      "Każdy pracownik dostaje instrukcję i krótkie szkolenie przed włączeniem drugiego składnika logowania.",
    ],
    analysis: {
      intro:
        "Najwięcej ryzyka wynikało z tożsamości: przejęte hasło do skrzynki daje dostęp do poczty, plików i korespondencji z klientami. Dlatego prace zaczynają się od kont, a dopiero potem obejmują pocztę i udostępnienia.",
      options: [
        {
          name: "Kody SMS jako drugi składnik",
          pros: "Nie wymagają instalowania aplikacji.",
          cons: "Podatne na przejęcie numeru telefonu i przechwycenie kodu.",
          chosen: false,
        },
        {
          name: "Aplikacja uwierzytelniająca z dopasowaniem numeru",
          pros: "Bez dodatkowych kosztów, odporna na przypadkowe zatwierdzenie logowania.",
          cons: "Wymaga telefonu służbowego lub zgody na aplikację na prywatnym.",
          chosen: true,
        },
        {
          name: "Klucze sprzętowe FIDO2",
          pros: "Najwyższa odporność na phishing.",
          cons: "Koszt i logistyka dla całego zespołu.",
          chosen: true,
        },
      ],
      conclusion:
        "Aplikacja uwierzytelniająca obejmuje wszystkich pracowników, a klucze sprzętowe – dwa osobne konta administracyjne. DMARC wdrażany jest etapami: najpierw tryb monitorowania i analiza raportów, potem kwarantanna, na końcu odrzucanie.",
    },
    diagram: {
      title: "Logowanie i dostęp do danych po zmianach",
      description:
        "Pracownicy logują się z drugim składnikiem, a zasady dostępu warunkowego dopuszczają do danych klientów tylko zarządzane urządzenia. Konta administracyjne są oddzielone od kont codziennej pracy.",
      columns: [
        {
          label: "Kto",
          nodes: [
            { name: "Pracownicy biura", detail: "konta do codziennej pracy" },
            { name: "Administratorzy", detail: "dwa osobne konta, bez skrzynek" },
          ],
        },
        {
          label: "Logowanie",
          nodes: [
            { name: "Drugi składnik", detail: "aplikacja lub klucz FIDO2", emphasis: true },
            { name: "Dostęp warunkowy", detail: "blokada starszych protokołów", emphasis: true },
          ],
        },
        {
          label: "Urządzenie",
          nodes: [
            { name: "Laptop zarządzany", detail: "pełny dostęp" },
            { name: "Urządzenie prywatne", detail: "tylko przeglądarka, bez pobierania" },
          ],
        },
        {
          label: "Zasoby",
          nodes: [
            { name: "Poczta", detail: "SPF, DKIM, DMARC" },
            { name: "Foldery klientów", detail: "udostępnienia imienne" },
          ],
        },
      ],
      links: ["hasło", "weryfikacja", "dostęp wg zasad"],
    },
    scope: [
      { stage: "Inwentaryzacja", tasks: ["Przegląd kont, ról i licencji", "Raport udostępnień plików", "Analiza rekordów DNS domeny"] },
      {
        stage: "Tożsamość",
        tasks: ["Osobne konta administracyjne z kluczami FIDO2", "Drugi składnik dla wszystkich użytkowników", "Zasady dostępu warunkowego"],
      },
      { stage: "Poczta", tasks: ["SPF i DKIM", "DMARC etapami z analizą raportów", "Oznaczanie wiadomości od nadawców zewnętrznych"] },
      { stage: "Dane", tasks: ["Zamiana linków anonimowych na udostępnienia imienne", "Domyślne zasady udostępniania dla nowych folderów"] },
      { stage: "Ludzie", tasks: ["Szkolenie z rozpoznawania phishingu", "Procedura zgłaszania podejrzanych wiadomości", "Procedura wyłączania kont odchodzących osób"] },
    ],
    criteria: [
      { criterion: "Każde konto użytkownika loguje się z drugim składnikiem.", verification: "Raport metod uwierzytelniania w panelu administracyjnym." },
      { criterion: "Konta administracyjne są osobne i nie służą do codziennej pracy.", verification: "Przegląd ról i historii logowań." },
      {
        criterion: "DMARC odrzuca podszyte wiadomości, a legalna korespondencja dochodzi.",
        verification: "Raporty zbiorcze DMARC z okresu obserwacji przed przejściem na odrzucanie.",
      },
      { criterion: "Foldery klientów nie mają udostępnień anonimowych.", verification: "Ponowny raport udostępnień po zakończeniu prac." },
      { criterion: "Konto osoby odchodzącej jest wyłączane w dniu odejścia.", verification: "Przeprowadzenie procedury na koncie testowym." },
    ],
    services: ["cyberbezpieczenstwo", "obsluga-it"],
  },
  {
    slug: "modernizacja-sklepu-internetowego",
    title: "Modernizacja infrastruktury sklepu internetowego",
    summary:
      "Sklep działał na jednym serwerze, który obsługiwał aplikację, bazę i zadania nocne. Projekt zakładał przeniesienie na środowisko odporne na awarię jednego elementu i sezonowe szczyty ruchu.",
    area: "infrastruktura",
    sector: "ecommerce",
    profile: "Fikcyjny sklep z wyposażeniem wnętrz, wyraźne szczyty sprzedaży w sezonie",
    duration: "Założony czas realizacji: 10 tygodni",
    context: [
      "Aplikacja sklepu, baza danych i zadania generujące raporty pracują na jednym serwerze wirtualnym. Nowe wersje wgrywane są ręcznie przez połączenie SSH, a kopia bazy zapisuje się na tym samym serwerze.",
      "Właściciel planuje kampanię przed sezonem świątecznym i obawia się, że strona nie wytrzyma ruchu.",
    ],
    problems: [
      "Awaria lub aktualizacja jedynego serwera wyłącza sprzedaż.",
      "W szczytach ruchu strona zwalnia, a generowanie raportów blokuje bazę obsługującą zamówienia.",
      "Kopia bazy leży na tym samym serwerze co baza.",
      "Brak środowiska testowego, więc zmiany sprawdzane są na sklepie produkcyjnym.",
    ],
    assumptions: [
      "Sklep zostaje przy obecnej aplikacji – projekt nie obejmuje zmiany platformy sprzedażowej.",
      "Przełączenie odbywa się w nocy, z planem powrotu na stary serwer.",
      "Koszt infrastruktury ma być przewidywalny i rozdzielony na środowisko produkcyjne i testowe.",
    ],
    analysis: {
      intro:
        "Porównano trzy kierunki pod kątem odporności na awarie, pracy potrzebnej przy utrzymaniu i dopasowania do skali sklepu oraz kompetencji jego zespołu.",
      options: [
        {
          name: "Większy serwer wirtualny",
          pros: "Szybkie wdrożenie i niski koszt zmiany.",
          cons: "Nadal jeden punkt awarii i ręczne wdrożenia.",
          chosen: false,
        },
        {
          name: "Usługi zarządzane w chmurze",
          pros: "Dwie instancje aplikacji, baza zarządzana z repliką, kopie poza kontem produkcyjnym.",
          cons: "Wymaga opisania środowiska w kodzie i zmiany sposobu wdrażania.",
          chosen: true,
        },
        {
          name: "Klaster Kubernetes",
          pros: "Duża elastyczność i skalowanie.",
          cons: "Nadmiarowa złożoność przy tej skali i bez zespołu, który go utrzyma.",
          chosen: false,
        },
      ],
      conclusion:
        "Wybrano usługi zarządzane: dwie instancje aplikacji w różnych strefach dostępności za load balancerem, zarządzaną bazę danych z repliką tylko do odczytu na potrzeby raportów oraz CDN z zaporą aplikacyjną. Całe środowisko jest opisane jako kod.",
    },
    diagram: {
      title: "Architektura docelowa sklepu",
      description:
        "Ruch klientów przechodzi przez CDN i zaporę aplikacyjną do load balancera, który rozdziela go między dwie instancje aplikacji. Zamówienia trafiają do bazy głównej, raporty czytają z repliki, a kopie zapisywane są na osobnym koncie.",
      columns: [
        { label: "Ruch", nodes: [{ name: "Klienci sklepu", detail: "przeglądarka, aplikacja mobilna" }] },
        {
          label: "Brzeg sieci",
          nodes: [
            { name: "CDN", detail: "pamięć podręczna plików statycznych" },
            { name: "Zapora aplikacyjna", detail: "filtrowanie złośliwych żądań", emphasis: true },
          ],
        },
        {
          label: "Aplikacja",
          nodes: [
            { name: "Load balancer", detail: "kontrola stanu instancji" },
            { name: "Aplikacja × 2", detail: "dwie strefy dostępności", emphasis: true },
          ],
        },
        {
          label: "Dane",
          nodes: [
            { name: "Baza główna", detail: "zamówienia i koszyki", emphasis: true },
            { name: "Replika", detail: "raporty, tylko odczyt" },
            { name: "Kopie bazy", detail: "osobne konto, blokada usunięcia" },
          ],
        },
      ],
      links: ["HTTPS", "przefiltrowane żądania", "zapis i odczyt"],
    },
    scope: [
      { stage: "Projekt", tasks: ["Architektura docelowa i szacunek kosztów", "Plan migracji z planem wycofania"] },
      { stage: "Infrastruktura jako kod", tasks: ["Opis środowisk produkcyjnego i testowego w repozytorium", "Przegląd zmian przed wdrożeniem"] },
      { stage: "Wdrożenia", tasks: ["Automatyczny proces wdrożeń z możliwością powrotu do poprzedniej wersji", "Środowisko testowe odwzorowujące produkcję"] },
      { stage: "Migracja", tasks: ["Replikacja bazy przed przełączeniem", "Przełączenie w nocnym oknie", "Obserwacja po przełączeniu"] },
      { stage: "Eksploatacja", tasks: ["Monitoring i powiadomienia", "Test obciążeniowy przed sezonem", "Test odtworzenia bazy z kopii"] },
    ],
    criteria: [
      { criterion: "Aktualizacja jednej instancji aplikacji nie przerywa sprzedaży.", verification: "Wdrożenie testowe w ciągu dnia z monitoringiem dostępności." },
      { criterion: "Raporty nie obciążają bazy obsługującej zamówienia.", verification: "Metryki bazy głównej podczas generowania raportów z repliki." },
      { criterion: "Środowisko można odtworzyć z repozytorium.", verification: "Postawienie kopii środowiska testowego od zera." },
      { criterion: "Baza jest odtwarzalna z kopii na osobnym koncie.", verification: "Test odtworzenia z zapisanym czasem trwania." },
      { criterion: "Sklep obsługuje ruch wyższy niż ostatni szczyt sprzedaży.", verification: "Raport z testu obciążeniowego: czasy odpowiedzi i odsetek błędów." },
    ],
    services: ["chmura-i-infrastruktura"],
  },
  {
    slug: "kopie-zapasowe-pracowni-projektowej",
    title: "Kopie zapasowe i odtwarzanie danych w pracowni projektowej",
    summary:
      "Kopia projektów zależała od jednego dysku USB i jednej osoby. Celem było środowisko kopii, które przetrwa awarię, kradzież i atak ransomware, oraz sprawdzona procedura odtworzenia.",
    area: "kopie",
    sector: "uslugi",
    profile: "Fikcyjna pracownia architektoniczna, 25 osób, kilka terabajtów projektów",
    duration: "Założony czas realizacji: 5 tygodni",
    context: [
      "Projekty przechowywane są na serwerze plików w biurze. Raz w tygodniu jeden z pracowników kopiuje dane na dysk USB i zabiera go do domu – o ile o tym pamięta.",
      "Poczta i część dokumentów znajdują się w Microsoft 365. Zespół zakładał, że dostawca usługi chroni je przed każdą utratą.",
    ],
    problems: [
      "Kopia zależy od jednej osoby i jednego dysku.",
      "Nikt nigdy nie próbował odtworzyć danych z kopii.",
      "Ransomware szyfrujący serwer plików zaszyfrowałby również podłączony dysk kopii.",
      "Poczta i pliki w Microsoft 365 nie mają kopii niezależnej od usługi.",
    ],
    assumptions: [
      "Akceptowalna utrata danych projektowych: najwyżej godzina pracy. Czas przywrócenia pracy zespołu: do jednego dnia roboczego. Wartości ustalone z właścicielami pracowni.",
      "Kopie muszą przetrwać utratę biura oraz atak, w którym przestępca przejmuje konto administratora serwera plików.",
      "Odtworzenie pojedynczego pliku ma być możliwe bez udziału administratora, według krótkiej instrukcji.",
    ],
    analysis: {
      intro:
        "Projekt opiera się na zasadzie 3-2-1: trzy kopie danych, na dwóch rodzajach nośników, z czego jedna poza firmą. Kluczowe pytanie dotyczyło kopii poza biurem.",
      options: [
        {
          name: "Drugi serwer plików w domu wspólnika",
          pros: "Jednorazowy koszt sprzętu, szybkie odtworzenie po przywiezieniu.",
          cons: "Zależność od domowego łącza i zasilania, ten sam administrator.",
          chosen: false,
        },
        {
          name: "Magazyn w chmurze z blokadą usunięcia",
          pros: "Kopie, których nie da się skasować przed upływem okresu przechowywania, osobne poświadczenia.",
          cons: "Pełne odtworzenie kilku terabajtów trwa dłużej i zależy od łącza.",
          chosen: true,
        },
      ],
      conclusion:
        "Szybkie odtwarzanie zapewniają migawki i kopia lokalna, a odporność na ransomware i utratę biura – magazyn w chmurze z blokadą usunięcia na osobnym koncie. Dłuższy czas pełnego odtworzenia z chmury mieści się w założonym dniu roboczym, co potwierdza test.",
    },
    diagram: {
      title: "Kopie w modelu 3-2-1 i test odtworzenia",
      description:
        "Dane z serwera plików, Microsoft 365 i laptopów trafiają do kopii lokalnej z migawkami, a stamtąd w postaci zaszyfrowanej do magazynu w chmurze z blokadą usunięcia. Co kwartał wybrane dane są odtwarzane, a wynik trafia do protokołu.",
      columns: [
        {
          label: "Źródła",
          nodes: [
            { name: "Serwer plików", detail: "projekty, migawki co godzinę" },
            { name: "Microsoft 365", detail: "poczta, OneDrive, SharePoint" },
            { name: "Laptopy", detail: "foldery robocze" },
          ],
        },
        {
          label: "Kopia lokalna",
          nodes: [{ name: "Urządzenie kopii", detail: "osobna szafa, osobne konto", emphasis: true }],
        },
        {
          label: "Kopia poza firmą",
          nodes: [{ name: "Magazyn w chmurze", detail: "blokada usunięcia na 30 dni", emphasis: true }],
        },
        {
          label: "Kontrola",
          nodes: [
            { name: "Test odtworzenia", detail: "co kwartał, z protokołem" },
            { name: "Powiadomienia", detail: "o nieudanym zadaniu kopii" },
          ],
        },
      ],
      links: ["co noc", "replikacja szyfrowana", "weryfikacja"],
    },
    scope: [
      { stage: "Analiza", tasks: ["Klasyfikacja danych i ustalenie priorytetów odtwarzania", "Uzgodnienie akceptowalnej utraty danych i czasu przywrócenia"] },
      { stage: "Kopie", tasks: ["Migawki tylko do odczytu na serwerze plików", "Urządzenie kopii lokalnej z osobnymi poświadczeniami", "Kopia Microsoft 365 niezależna od usługi"] },
      { stage: "Poza firmą", tasks: ["Magazyn w chmurze z blokadą usunięcia", "Szyfrowanie po stronie pracowni", "Dostęp chroniony drugim składnikiem"] },
      { stage: "Procedury", tasks: ["Instrukcja odtworzenia pliku dla pracowników", "Procedura pełnego odtworzenia dla administratora", "Kwartalny harmonogram testów"] },
    ],
    criteria: [
      { criterion: "Pracownik odtwarza usunięty plik samodzielnie.", verification: "Test z osobą spoza IT, według instrukcji." },
      { criterion: "Pełny projekt odtwarza się z chmury w założonym czasie.", verification: "Test odtworzenia z pomiarem czasu i wpisem do protokołu." },
      {
        criterion: "Kopii w chmurze nie da się usunąć z konta używanego do jej zapisu.",
        verification: "Kontrolowana próba usunięcia w ramach testu.",
      },
      { criterion: "Nieudane zadanie kopii powoduje powiadomienie tego samego dnia.", verification: "Symulacja błędu zadania kopii." },
    ],
    services: ["chmura-i-infrastruktura"],
  },
  {
    slug: "standard-stanowisk-w-przychodni",
    title: "Standard stanowisk i obsługa zmian kadrowych w przychodni",
    summary:
      "Każdy komputer był skonfigurowany inaczej, a dostępy zakładano doraźnie. Projekt wprowadza jeden standard stanowiska, szyfrowanie dysków i powtarzalną procedurę dla nowych i odchodzących osób.",
    area: "obsluga-it",
    sector: "zdrowie",
    profile: "Fikcyjna przychodnia, rejestracja i trzy gabinety, 30 stanowisk",
    duration: "Założony czas realizacji: 8 tygodni",
    context: [
      "Komputery kupowano w różnych latach i konfigurowano ręcznie. Personel zmienia się często, a konta w poczcie i systemie gabinetowym zakłada ta osoba, która akurat ma czas.",
      "W gabinetach przetwarzane są dane o stanie zdrowia, więc utrata lub kradzież laptopa jest szczególnie poważnym zdarzeniem.",
    ],
    problems: [
      "Każde stanowisko skonfigurowane jest inaczej, więc awaria oznacza godziny ręcznej pracy.",
      "Część komputerów nie ma szyfrowania dysku.",
      "Nie ma listy, kto ma dostęp do czego, a konta osób, które odeszły, pozostają aktywne.",
      "Zgłoszenia trafiają telefonicznie do różnych osób i giną.",
    ],
    assumptions: [
      "System gabinetowy dostarcza zewnętrzny dostawca. Projekt go nie zmienia, ale uzgadnia z dostawcą zasady nadawania dostępów.",
      "Wymiana i konfiguracja stanowisk odbywa się poza godzinami przyjęć.",
      "Rejestracja ma zapasowe stanowisko gotowe do pracy w kilka minut.",
    ],
    analysis: {
      intro: "Rozważono dwa sposoby utrzymania jednolitej konfiguracji stanowisk przy częstych zmianach personelu.",
      options: [
        {
          name: "Ręcznie przygotowany obraz dysku",
          pros: "Znany sposób pracy, brak nowych narzędzi.",
          cons: "Obraz szybko się starzeje, a każda zmiana wymaga ponownego przygotowania stanowisk.",
          chosen: false,
        },
        {
          name: "Zarządzanie urządzeniami z chmury",
          pros: "Konfiguracja według ról stosowana automatycznie, raport zgodności, zdalne blokowanie.",
          cons: "Jednorazowa praca przy przygotowaniu profili i rejestracji urządzeń.",
          chosen: true,
        },
      ],
      conclusion:
        "Stanowiska są przygotowywane automatycznie według trzech profili: rejestracja, gabinet i administracja. Uprawnienia nadawane są przez grupy przypisane do ról, a procedura zmian kadrowych ma jedną listę kontrolną.",
    },
    diagram: {
      title: "Zmiana kadrowa od zgłoszenia do gotowego stanowiska",
      description:
        "Kierownik zgłasza nową osobę, odejście lub zmianę roli. Zgłoszenie przechodzi przez listę kontrolną, na jej podstawie konto dostaje grupy uprawnień przypisane do roli, a urządzenie konfiguruje się automatycznie z profilu.",
      columns: [
        { label: "Zdarzenie", nodes: [{ name: "Zgłoszenie kierownika", detail: "nowa osoba, odejście, zmiana roli" }] },
        {
          label: "Proces",
          nodes: [
            { name: "Lista kontrolna", detail: "jedna dla każdej zmiany", emphasis: true },
            { name: "Rejestr zgłoszeń", detail: "numer, właściciel, status" },
          ],
        },
        {
          label: "Tożsamość",
          nodes: [
            { name: "Konto i grupy ról", detail: "rejestracja, gabinet, administracja", emphasis: true },
            { name: "Drugi składnik", detail: "przy pierwszym logowaniu" },
          ],
        },
        {
          label: "Stanowisko",
          nodes: [
            { name: "Profil urządzenia", detail: "szyfrowanie, aktualizacje, aplikacje" },
            { name: "Stanowisko zapasowe", detail: "rejestracja" },
          ],
        },
      ],
      links: ["zgłoszenie", "akceptacja", "konfiguracja"],
    },
    scope: [
      { stage: "Inwentaryzacja", tasks: ["Spis stanowisk, kont i dostępów", "Uzgodnienie zasad z dostawcą systemu gabinetowego"] },
      { stage: "Standard", tasks: ["Profile stanowisk dla trzech ról", "Szyfrowanie dysków", "Aktualizacje w dwóch grupach: testowej i pozostałej"] },
      { stage: "Dostępy", tasks: ["Grupy uprawnień przypisane do ról", "Lista kontrolna zmian kadrowych", "Przegląd dostępów co kwartał"] },
      { stage: "Wsparcie", tasks: ["Jeden kanał zgłoszeń z rejestrem", "Zapasowe stanowisko w rejestracji", "Instrukcje dla personelu"] },
    ],
    criteria: [
      { criterion: "Nowe stanowisko jest gotowe do pracy bez ręcznej konfiguracji.", verification: "Przygotowanie komputera testowego od zera." },
      { criterion: "Wszystkie dyski są zaszyfrowane.", verification: "Raport zgodności z systemu zarządzania urządzeniami." },
      { criterion: "Konto osoby odchodzącej jest wyłączane w dniu odejścia.", verification: "Przeprowadzenie procedury na koncie testowym." },
      { criterion: "Każde zgłoszenie ma numer, właściciela i status.", verification: "Przegląd rejestru po pierwszym miesiącu." },
    ],
    services: ["obsluga-it", "cyberbezpieczenstwo"],
  },
]);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((item) => item.slug === slug);
}
