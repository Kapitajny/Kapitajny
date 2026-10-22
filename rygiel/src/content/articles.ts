import type { ServiceSlug } from "./services";
import type { ArticleCategory } from "./taxonomy";

export { articleCategories, filterArticles, type ArticleCategory } from "./taxonomy";

/** Bloki treści. Tekst może zawierać [link](/adres), **pogrubienie** i `kod`. */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "code"; label: string; code: string }
  | { type: "table"; caption: string; head: string[]; rows: string[][] };

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  published: string;
  updated: string;
  lead: string;
  sections: { id: string; heading: string; blocks: ArticleBlock[] }[];
  related: string[];
  services: ServiceSlug[];
};

export const articles: Article[] = [
  {
    slug: "podstawy-cyberbezpieczenstwa-w-malej-firmie",
    title: "Podstawy cyberbezpieczeństwa w małej firmie: od czego zacząć",
    description:
      "Siedem kroków, które w małej firmie dają najwięcej bezpieczeństwa przy najmniejszym nakładzie: inwentaryzacja, aktualizacje, drugi składnik logowania, kopie, uprawnienia, poczta i plan na incydent.",
    category: "podstawy",
    published: "2026-10-22",
    updated: "2026-10-22",
    lead:
      "Mała firma rzadko jest celem wyrafinowanego ataku. Znacznie częściej pada ofiarą masowej kampanii, która wykorzystuje słabe hasło, brak aktualizacji albo nieuwagę pracownika. Dobra wiadomość: przed większością takich zdarzeń chroni kilka podstawowych, dobrze wdrożonych zabezpieczeń.",
    sections: [
      {
        id: "dlaczego-podstawy",
        heading: "Dlaczego warto zacząć od podstaw",
        blocks: [
          {
            type: "p",
            text: "Przestępcy działają jak każdy inny biznes: szukają najtańszej drogi do zysku. Automatycznie sprawdzają tysiące firm pod kątem znanych podatności, wycieków haseł i niezabezpieczonych usług. Firma, która zamknie te najprostsze drogi, przestaje być łatwym celem.",
          },
          {
            type: "p",
            text: "Dlatego zanim kupisz kolejne narzędzie, sprawdź, czy masz pod kontrolą rzeczy opisane poniżej. Podobną kolejność proponują uznane zestawy zabezpieczeń, na przykład **CIS Critical Security Controls** w podstawowej grupie wdrożeniowej IG1, przeznaczonej właśnie dla mniejszych organizacji.",
          },
        ],
      },
      {
        id: "inwentaryzacja",
        heading: "1. Wiedz, co masz",
        blocks: [
          {
            type: "p",
            text: "Nie da się chronić czegoś, o czym nie wiadomo. Spisz urządzenia (komputery, telefony, serwery, drukarki, router), konta w usługach chmurowych, dane, które przetwarzasz, oraz dostawców, którzy mają dostęp do Twoich systemów.",
          },
          {
            type: "p",
            text: "Na początek wystarczy arkusz kalkulacyjny. Ważne, żeby był aktualizowany przy każdym zakupie, zatrudnieniu i odejściu pracownika.",
          },
        ],
      },
      {
        id: "aktualizacje",
        heading: "2. Aktualizuj systemy i aplikacje",
        blocks: [
          {
            type: "p",
            text: "Większość ataków wykorzystuje podatności, dla których poprawki są dostępne od dawna. Włącz automatyczne aktualizacje systemów i przeglądarek, a dla serwerów i urządzeń sieciowych ustal stały termin instalacji poprawek.",
          },
          {
            type: "callout",
            title: "Sprzęt bez wsparcia",
            text: "Urządzenie, dla którego producent nie wydaje już poprawek bezpieczeństwa, trzeba zaplanować do wymiany. Dotyczy to także starych routerów i serwerów plików.",
          },
        ],
      },
      {
        id: "mfa",
        heading: "3. Włącz drugi składnik logowania",
        blocks: [
          {
            type: "p",
            text: "Hasła wyciekają: z innych serwisów, przez phishing, przez złośliwe oprogramowanie. Drugi składnik logowania (MFA) sprawia, że samo hasło nie wystarczy do przejęcia konta. Zacznij od poczty, usług w chmurze, bankowości i kont administracyjnych.",
          },
          {
            type: "p",
            text: "Najlepiej sprawdzają się aplikacje uwierzytelniające z dopasowaniem numeru oraz klucze sprzętowe FIDO2. Kody SMS są lepsze niż nic, ale podatne na przechwycenie. Więcej o porządkowaniu kont piszemy w artykule o [zarządzaniu dostępami](/baza-wiedzy/zarzadzanie-dostepami-w-firmie).",
          },
        ],
      },
      {
        id: "kopie",
        heading: "4. Rób kopie i sprawdzaj, czy da się je odtworzyć",
        blocks: [
          {
            type: "p",
            text: "Kopia zapasowa to ostatnia linia obrony przed ransomware, awarią i pomyłką. Musi być niezależna od danych źródłowych i chroniona przed usunięciem przez osobę, która przejęła Twoje konto. Kopia, z której nikt nigdy nie odtworzył danych, jest tylko nadzieją.",
          },
          {
            type: "p",
            text: "Praktyczny sposób planowania kopii opisujemy w artykule [Kopie zapasowe 3-2-1 w praktyce](/baza-wiedzy/kopie-zapasowe-3-2-1-w-praktyce).",
          },
        ],
      },
      {
        id: "uprawnienia",
        heading: "5. Ogranicz uprawnienia",
        blocks: [
          {
            type: "ul",
            items: [
              "Pracownicy nie powinni na co dzień pracować na kontach z uprawnieniami administratora.",
              "Każdy ma własne konto – konta współdzielone utrudniają ustalenie, kto co zrobił.",
              "Dostęp do danych klientów mają tylko osoby, które ich potrzebują.",
              "Konta osób, które odeszły, są wyłączane w dniu odejścia.",
            ],
          },
        ],
      },
      {
        id: "poczta",
        heading: "6. Zabezpiecz pocztę",
        blocks: [
          {
            type: "p",
            text: "Poczta to główna droga ataku na małe firmy. Skonfiguruj rekordy SPF, DKIM i DMARC dla swojej domeny, włącz filtrowanie załączników i oznaczanie wiadomości od nadawców zewnętrznych. Szczegóły znajdziesz w artykule [SPF, DKIM i DMARC](/baza-wiedzy/spf-dkim-dmarc-bezpieczenstwo-poczty).",
          },
          {
            type: "p",
            text: "Równie ważne jest przygotowanie ludzi – o tym, jak to zrobić bez straszenia, piszemy w tekście o [phishingu w małej firmie](/baza-wiedzy/phishing-w-malej-firmie).",
          },
        ],
      },
      {
        id: "incydent",
        heading: "7. Przygotuj plan na incydent",
        blocks: [
          {
            type: "p",
            text: "Plan nie musi być długi. Wystarczy jedna strona, która odpowiada na pytania: kogo powiadomić, jak odłączyć zainfekowane urządzenie, gdzie są kopie i kto może je odtworzyć, kiedy zgłosić incydent do CERT Polska lub organu nadzorczego.",
          },
          {
            type: "callout",
            title: "Gdzie zgłosić incydent",
            text: "Incydenty bezpieczeństwa można zgłaszać do CERT Polska przez stronę [incydent.cert.pl](https://incydent.cert.pl). Jeśli doszło do naruszenia ochrony danych osobowych, sprawdź też obowiązek zgłoszenia do Prezesa UODO – co do zasady w ciągu 72 godzin od stwierdzenia naruszenia.",
          },
        ],
      },
      {
        id: "podsumowanie",
        heading: "Od czego zacząć jutro",
        blocks: [
          {
            type: "ol",
            items: [
              "Włącz drugi składnik logowania do poczty dla wszystkich kont.",
              "Sprawdź, kiedy ostatnio ktoś odtworzył dane z kopii.",
              "Spisz konta z uprawnieniami administratora i usuń zbędne.",
            ],
          },
          {
            type: "p",
            text: "Jeśli chcesz, żeby ktoś przeszedł z Tobą przez wszystkie punkty, zacznij od [przeglądu bezpieczeństwa](/uslugi/cyberbezpieczenstwo).",
          },
        ],
      },
    ],
    related: ["zarzadzanie-dostepami-w-firmie", "kopie-zapasowe-3-2-1-w-praktyce", "phishing-w-malej-firmie"],
    services: ["cyberbezpieczenstwo", "obsluga-it"],
  },
  {
    slug: "kopie-zapasowe-3-2-1-w-praktyce",
    title: "Kopie zapasowe 3-2-1 w praktyce: jak zaplanować kopie, które naprawdę działają",
    description:
      "Jak zaplanować kopie zapasowe w firmie: zasada 3-2-1, RPO i RTO, ochrona przed ransomware, kopia Microsoft 365 i test odtworzenia, bez którego kopia jest tylko założeniem.",
    category: "kopie",
    published: "2026-10-22",
    updated: "2026-10-22",
    lead:
      "Prawie każda firma ma jakąś kopię zapasową. Znacznie mniej firm wie, ile danych straci po awarii, jak długo potrwa ich odtworzenie i czy kopia przetrwa atak, w którym przestępca przejmie konto administratora. Ten artykuł pokazuje, jak zaplanować kopie, które odpowiadają na te pytania.",
    sections: [
      {
        id: "zasada-3-2-1",
        heading: "Zasada 3-2-1",
        blocks: [
          {
            type: "p",
            text: "Zasada 3-2-1 mówi, że dane powinny istnieć w **trzech kopiach**, na **dwóch różnych rodzajach nośników**, z czego **jedna kopia znajduje się poza firmą**. Dzięki temu awaria jednego urządzenia, pożar w biurze czy kradzież sprzętu nie oznaczają utraty danych.",
          },
          {
            type: "p",
            text: "Często spotkasz też rozszerzenie 3-2-1-1-0: jedna kopia jest odizolowana lub niezmienna (nie da się jej usunąć ani nadpisać), a weryfikacja kopii kończy się zerem błędów.",
          },
        ],
      },
      {
        id: "rpo-rto",
        heading: "Zacznij od dwóch pytań: RPO i RTO",
        blocks: [
          {
            type: "p",
            text: "Zanim wybierzesz narzędzie, ustal dla każdego ważnego systemu dwie wartości:",
          },
          {
            type: "ul",
            items: [
              "**RPO** (Recovery Point Objective) – ile danych możesz stracić. Jeśli kopia powstaje raz na dobę, w najgorszym razie tracisz pracę z całego dnia.",
              "**RTO** (Recovery Time Objective) – jak długo możesz czekać na powrót do pracy. Obejmuje to wykrycie problemu, decyzję, odtworzenie i sprawdzenie danych.",
            ],
          },
          {
            type: "p",
            text: "Te wartości różnią się między systemami. System sprzedaży może wymagać RPO liczonego w minutach, a archiwum dokumentów – w dniach. Od nich zależy częstotliwość kopii, ich rodzaj i koszt.",
          },
        ],
      },
      {
        id: "ransomware",
        heading: "Kopie a ransomware",
        blocks: [
          {
            type: "p",
            text: "Współczesne ataki ransomware celowo szukają kopii zapasowych i próbują je usunąć przed zaszyfrowaniem danych. Kopia na dysku stale podłączonym do serwera albo w zasobie sieciowym dostępnym z tego samego konta zostanie zniszczona razem z danymi.",
          },
          {
            type: "ul",
            items: [
              "Przechowuj przynajmniej jedną kopię w magazynie z blokadą usunięcia (immutable storage) na określony czas.",
              "Używaj osobnych poświadczeń do systemu kopii – innych niż konta domenowe i administracyjne.",
              "Chroń dostęp do konsoli kopii drugim składnikiem logowania.",
              "Monitoruj nietypowe zdarzenia: masowe usuwanie, skrócenie okresu przechowywania, wyłączenie zadań.",
            ],
          },
        ],
      },
      {
        id: "chmura",
        heading: "Microsoft 365 i Google Workspace też potrzebują kopii",
        blocks: [
          {
            type: "p",
            text: "Dostawcy usług chmurowych dbają o dostępność swoich systemów, ale odpowiedzialność za dane spoczywa na Tobie. Kosz i historia wersji mają ograniczony czas przechowywania, a usunięcie danych przez przejęte konto lub pomyłkę administratora zostanie wykonane zgodnie z poleceniem.",
          },
          {
            type: "callout",
            title: "Synchronizacja to nie kopia",
            text: "OneDrive, Dropbox czy Dysk Google synchronizują pliki. Jeśli plik zostanie usunięty lub zaszyfrowany na komputerze, ta zmiana trafi także do chmury. Kopia zapasowa musi być niezależna od źródła i mieć własną historię wersji.",
          },
        ],
      },
      {
        id: "test-odtworzenia",
        heading: "Test odtworzenia: jedyny dowód, że kopia działa",
        blocks: [
          {
            type: "p",
            text: "Zielona ikonka przy zadaniu kopii oznacza tylko, że zadanie się zakończyło. Nie mówi, czy dane są kompletne, czy da się je odczytać i ile potrwa odtworzenie. Dlatego test odtworzenia powinien być regularnym, zaplanowanym zadaniem.",
          },
          {
            type: "ol",
            items: [
              "Wybierz zakres: pojedynczy plik, folder projektu, skrzynkę pocztową, cały serwer.",
              "Odtwórz dane w miejscu, które nie nadpisze danych produkcyjnych.",
              "Sprawdź z użytkownikiem, czy dane są kompletne i da się z nimi pracować.",
              "Zapisz w protokole datę, zakres, czas trwania i napotkane problemy.",
              "Porównaj czas odtworzenia z założonym RTO i popraw plan, jeśli się nie mieści.",
            ],
          },
          {
            type: "table",
            caption: "Przykładowy harmonogram testów odtworzenia",
            head: ["Zakres testu", "Częstotliwość", "Kto wykonuje"],
            rows: [
              ["Pojedyncze pliki i foldery", "co miesiąc", "administrator lub przeszkolony pracownik"],
              ["Skrzynka pocztowa", "co kwartał", "administrator"],
              ["Pełny serwer lub system", "co pół roku i po dużych zmianach", "administrator z udziałem właściciela systemu"],
            ],
          },
        ],
      },
      {
        id: "lista-kontrolna",
        heading: "Lista kontrolna",
        blocks: [
          {
            type: "ul",
            items: [
              "Wiem, jakie dane mamy i gdzie się znajdują.",
              "Dla ważnych systemów mamy ustalone RPO i RTO.",
              "Jedna kopia jest poza firmą i nie da się jej usunąć z konta używanego na co dzień.",
              "Poczta i pliki w chmurze mają kopię niezależną od dostawcy.",
              "Nieudane zadanie kopii generuje powiadomienie, które ktoś czyta.",
              "Ostatni test odtworzenia ma protokół i odbył się w ciągu ostatniego kwartału.",
            ],
          },
          {
            type: "p",
            text: "Przykład zastosowania tych zasad znajdziesz w realizacji [Kopie zapasowe i odtwarzanie danych w pracowni projektowej](/realizacje/kopie-zapasowe-pracowni-projektowej). Jeśli chcesz zaprojektować kopie w swojej firmie, zobacz zakres usługi [Chmura i infrastruktura](/uslugi/chmura-i-infrastruktura).",
          },
        ],
      },
    ],
    related: ["podstawy-cyberbezpieczenstwa-w-malej-firmie", "zarzadzanie-dostepami-w-firmie"],
    services: ["chmura-i-infrastruktura"],
  },
  {
    slug: "spf-dkim-dmarc-bezpieczenstwo-poczty",
    title: "SPF, DKIM i DMARC: jak chronić domenę firmy przed podszywaniem",
    description:
      "Jak działają rekordy SPF, DKIM i DMARC, jak wdrożyć je etapami bez blokowania legalnej poczty i jakie inne ustawienia skrzynek chronią firmę przed oszustwami e-mailowymi.",
    category: "poczta",
    published: "2026-10-22",
    updated: "2026-10-22",
    lead:
      "Bez odpowiedniej konfiguracji każdy może wysłać wiadomość, która w polu nadawcy pokazuje adres Twojej firmy. Przestępcy wykorzystują to, by podszyć się pod Ciebie w korespondencji z klientami, na przykład z prośbą o przelew na nowy numer rachunku. Trzy rekordy DNS – SPF, DKIM i DMARC – pozwalają serwerom odbiorców odróżnić prawdziwe wiadomości od podrobionych.",
    sections: [
      {
        id: "jak-to-dziala",
        heading: "Jak działają te trzy mechanizmy",
        blocks: [
          {
            type: "table",
            caption: "Porównanie SPF, DKIM i DMARC",
            head: ["Mechanizm", "Co sprawdza", "Gdzie się go konfiguruje"],
            rows: [
              ["SPF", "Czy serwer, który wysłał wiadomość, jest uprawniony do wysyłki w imieniu domeny.", "Rekord TXT w DNS domeny"],
              ["DKIM", "Czy wiadomość ma ważny podpis kryptograficzny domeny i nie została zmieniona po drodze.", "Klucz w usłudze pocztowej, klucz publiczny w DNS"],
              ["DMARC", "Czy domena z pola „Od” zgadza się z wynikiem SPF lub DKIM i co zrobić, gdy się nie zgadza.", "Rekord TXT _dmarc w DNS domeny"],
            ],
          },
          {
            type: "p",
            text: "SPF i DKIM same w sobie nie chronią pola nadawcy widocznego dla odbiorcy. Dopiero DMARC wymaga, żeby domena z tego pola była zgodna z domeną zweryfikowaną przez SPF lub DKIM, i mówi serwerom odbiorców, co zrobić z wiadomością, która tej kontroli nie przejdzie.",
          },
        ],
      },
      {
        id: "spf",
        heading: "SPF: lista uprawnionych nadawców",
        blocks: [
          {
            type: "p",
            text: "Rekord SPF wymienia serwery i usługi, które mogą wysyłać pocztę z Twojej domeny. Pamiętaj nie tylko o głównej usłudze pocztowej, ale też o systemie do faktur, narzędziu do newsletterów czy sklepie internetowym.",
          },
          {
            type: "code",
            label: "Przykładowy rekord SPF dla domeny korzystającej z Microsoft 365",
            code: "example.com.  TXT  \"v=spf1 include:spf.protection.outlook.com -all\"",
          },
          {
            type: "ul",
            items: [
              "Domena może mieć tylko jeden rekord SPF. Kilka rekordów powoduje błąd weryfikacji.",
              "SPF ma limit 10 zapytań DNS. Każde `include` zużywa część tego limitu.",
              "Końcówka `-all` oznacza odrzucanie nieuprawnionych nadawców, a `~all` – oznaczanie ich jako podejrzanych.",
            ],
          },
        ],
      },
      {
        id: "dkim",
        heading: "DKIM: podpis każdej wiadomości",
        blocks: [
          {
            type: "p",
            text: "DKIM włącza się w panelu usługi pocztowej, która generuje parę kluczy. Klucz publiczny publikujesz w DNS jako rekord pod wskazanym selektorem. Każda usługa wysyłająca pocztę w Twoim imieniu powinna podpisywać wiadomości własnym kluczem DKIM dla Twojej domeny.",
          },
          {
            type: "p",
            text: "Używaj kluczy o długości co najmniej 2048 bitów i co jakiś czas je zmieniaj. Większość usług robi to automatycznie, jeśli skonfigurujesz rekordy CNAME wskazane przez dostawcę.",
          },
        ],
      },
      {
        id: "dmarc",
        heading: "DMARC: wdrażaj etapami",
        blocks: [
          {
            type: "p",
            text: "Najczęstszy błąd to od razu ustawienie polityki odrzucania. Jeśli zapomnisz o którymś systemie wysyłającym pocztę, legalne wiadomości przestaną docierać. Bezpieczniej jest przejść trzy etapy:",
          },
          {
            type: "ol",
            items: [
              "**Monitorowanie** – polityka `p=none` i adres do raportów. Przez kilka tygodni zbierasz informacje, kto wysyła pocztę z Twojej domeny.",
              "**Kwarantanna** – polityka `p=quarantine`. Wiadomości, które nie przejdą weryfikacji, trafiają do spamu.",
              "**Odrzucanie** – polityka `p=reject`. Podrobione wiadomości są odrzucane przez serwery odbiorców.",
            ],
          },
          {
            type: "code",
            label: "Rekord DMARC na etapie monitorowania",
            code: "_dmarc.example.com.  TXT  \"v=DMARC1; p=none; rua=mailto:dmarc-raporty@example.com\"",
          },
          {
            type: "callout",
            title: "Raporty zbiorcze",
            text: "Raporty DMARC przychodzą jako pliki XML i trudno je czytać ręcznie. Warto skorzystać z narzędzia, które je agreguje i pokazuje źródła poczty w czytelnej formie.",
          },
          {
            type: "p",
            text: "Od 2024 roku Google i Yahoo wymagają od nadawców wysyłających duże ilości wiadomości poprawnie skonfigurowanych SPF, DKIM i DMARC. Nawet jeśli Twoja firma wysyła mniej, poprawna konfiguracja poprawia dostarczalność poczty.",
          },
        ],
      },
      {
        id: "skrzynki",
        heading: "Co jeszcze warto ustawić w skrzynkach",
        blocks: [
          {
            type: "ul",
            items: [
              "Drugi składnik logowania dla wszystkich kont pocztowych.",
              "Blokadę automatycznego przekazywania poczty na adresy zewnętrzne – przestępcy po przejęciu skrzynki często ustawiają takie reguły.",
              "Oznaczanie wiadomości od nadawców spoza organizacji.",
              "Wyłączenie starszych protokołów logowania, które nie obsługują drugiego składnika.",
            ],
          },
          {
            type: "p",
            text: "Techniczne zabezpieczenia nie zastąpią czujności ludzi. Jak przygotować zespół, opisujemy w artykule [Phishing w małej firmie](/baza-wiedzy/phishing-w-malej-firmie). Przykład wdrożenia DMARC etapami znajdziesz w realizacji [Uporządkowanie dostępów i poczty w biurze rachunkowym](/realizacje/dostepy-i-poczta-biura-rachunkowego).",
          },
        ],
      },
    ],
    related: ["phishing-w-malej-firmie", "podstawy-cyberbezpieczenstwa-w-malej-firmie"],
    services: ["cyberbezpieczenstwo"],
  },
  {
    slug: "zarzadzanie-dostepami-w-firmie",
    title: "Zarządzanie dostępami: kto w firmie powinien mieć dostęp do czego",
    description:
      "Jak uporządkować konta i uprawnienia w małej i średniej firmie: zasada najmniejszych uprawnień, osobne konta administracyjne, procedura dla nowych i odchodzących pracowników oraz regularny przegląd dostępów.",
    category: "dostepy",
    published: "2026-10-22",
    updated: "2026-10-22",
    lead:
      "W wielu firmach uprawnienia rosną latami: ktoś potrzebował dostępu do jednego folderu, dostał do całego dysku, zmienił dział, a stare uprawnienia zostały. Po kilku latach nikt nie wie, kto ma dostęp do czego. Uporządkowanie tego nie wymaga drogich narzędzi, tylko kilku zasad i konsekwencji.",
    sections: [
      {
        id: "najmniejsze-uprawnienia",
        heading: "Zasada najmniejszych uprawnień",
        blocks: [
          {
            type: "p",
            text: "Każda osoba i każdy system powinny mieć dostęp wyłącznie do tego, czego potrzebują do wykonywania pracy. Dzięki temu przejęcie jednego konta nie otwiera przestępcy drogi do wszystkich danych firmy, a pomyłka pracownika ma ograniczone skutki.",
          },
          {
            type: "p",
            text: "W praktyce najłatwiej nadawać uprawnienia przez **grupy przypisane do ról** (na przykład „księgowość”, „sprzedaż”, „zarząd”), a nie bezpośrednio poszczególnym osobom. Zmiana roli to wtedy zmiana grupy, a nie ręczne przeglądanie dziesiątek folderów.",
          },
        ],
      },
      {
        id: "konta-administracyjne",
        heading: "Osobne konta administracyjne",
        blocks: [
          {
            type: "p",
            text: "Konto, którym czytasz pocztę i przeglądasz internet, nie powinno mieć uprawnień administratora. Jeśli otworzysz złośliwy załącznik, działa on z uprawnieniami konta, na którym pracujesz.",
          },
          {
            type: "ul",
            items: [
              "Administratorzy mają dwa konta: do codziennej pracy i do zadań administracyjnych.",
              "Konta administracyjne nie mają skrzynek pocztowych i nie służą do przeglądania internetu.",
              "Konta administracyjne chroni drugi składnik odporny na phishing, najlepiej klucz sprzętowy FIDO2.",
              "Liczba kont z najwyższymi uprawnieniami jest jak najmniejsza – zwykle wystarczą dwa, z czego jedno awaryjne.",
            ],
          },
        ],
      },
      {
        id: "cykl-zycia",
        heading: "Nowa osoba, zmiana roli, odejście",
        blocks: [
          {
            type: "p",
            text: "Większość problemów z dostępami bierze się z trzech momentów: przyjścia nowej osoby, zmiany roli i odejścia z firmy. Dla każdego z nich warto mieć krótką listę kontrolną.",
          },
          {
            type: "h3",
            text: "Nowa osoba",
          },
          {
            type: "ul",
            items: [
              "Kierownik zgłasza potrzebę z wyprzedzeniem i wskazuje rolę.",
              "Konto dostaje grupy przypisane do roli – nic ponadto.",
              "Drugi składnik logowania jest konfigurowany przy pierwszym logowaniu.",
            ],
          },
          {
            type: "h3",
            text: "Zmiana roli",
          },
          {
            type: "ul",
            items: ["Nowe uprawnienia są dodawane, a stare – odbierane w tym samym kroku.", "Kierownik potwierdza zakres nowej roli."],
          },
          {
            type: "h3",
            text: "Odejście",
          },
          {
            type: "ul",
            items: [
              "Konto jest blokowane w dniu zakończenia współpracy, a aktywne sesje – unieważniane.",
              "Poczta zostaje przekazana wskazanej osobie lub zarchiwizowana zgodnie z zasadami firmy.",
              "Hasła do kont współdzielonych, które znała ta osoba, są zmieniane.",
              "Sprzęt firmowy wraca i jest czyszczony przed kolejnym użyciem.",
            ],
          },
        ],
      },
      {
        id: "hasla",
        heading: "Hasła i menedżer haseł",
        blocks: [
          {
            type: "p",
            text: "Długie, unikalne hasło do każdej usługi to podstawa, ale nikt nie zapamięta kilkudziesięciu takich haseł. Firmowy menedżer haseł rozwiązuje ten problem i pozwala bezpiecznie udostępniać dane logowania do kont, których nie da się przypisać jednej osobie.",
          },
          {
            type: "callout",
            title: "Konta współdzielone",
            text: "Jeśli usługa na to pozwala, zamiast jednego wspólnego konta utwórz konta imienne. Gdy konto współdzielone jest konieczne, trzymaj hasło w menedżerze haseł i zmieniaj je po odejściu każdej osoby, która je znała.",
          },
        ],
      },
      {
        id: "przeglad",
        heading: "Regularny przegląd dostępów",
        blocks: [
          {
            type: "p",
            text: "Raz na kwartał przejrzyj z kierownikami listę osób z dostępem do najważniejszych danych i systemów. Szukaj kont nieaktywnych, uprawnień, które zostały po zmianie roli, oraz aplikacji zewnętrznych z dostępem do poczty i plików.",
          },
          {
            type: "p",
            text: "Przykład wdrożenia tych zasad opisujemy w realizacjach [Standard stanowisk w przychodni](/realizacje/standard-stanowisk-w-przychodni) oraz [Uporządkowanie dostępów i poczty w biurze rachunkowym](/realizacje/dostepy-i-poczta-biura-rachunkowego). Jeśli chcesz uporządkować dostępy w swojej firmie, zobacz zakres usługi [Obsługa IT](/uslugi/obsluga-it).",
          },
        ],
      },
    ],
    related: ["podstawy-cyberbezpieczenstwa-w-malej-firmie", "phishing-w-malej-firmie"],
    services: ["obsluga-it", "cyberbezpieczenstwo"],
  },
  {
    slug: "phishing-w-malej-firmie",
    title: "Phishing w małej firmie: jak rozpoznać atak i przygotować zespół",
    description:
      "Najczęstsze scenariusze phishingu wymierzonego w firmy, sygnały ostrzegawcze, procedura weryfikacji płatności i sposób zgłaszania podejrzanych wiadomości – bez straszenia pracowników.",
    category: "phishing",
    published: "2026-10-22",
    updated: "2026-10-22",
    lead:
      "Phishing to wiadomość, która podszywa się pod kogoś zaufanego, żeby nakłonić odbiorcę do kliknięcia, podania hasła lub wykonania przelewu. W małej firmie skutki jednego udanego ataku mogą być poważne: przejęta skrzynka, zaszyfrowane dane albo pieniądze wysłane na rachunek przestępcy. Dobra wiadomość jest taka, że przygotowany zespół i kilka prostych procedur znacząco zmniejszają to ryzyko.",
    sections: [
      {
        id: "scenariusze",
        heading: "Najczęstsze scenariusze",
        blocks: [
          {
            type: "ul",
            items: [
              "**Fałszywa zmiana numeru rachunku** – wiadomość od „kontrahenta” z informacją o nowym numerze konta do płatności.",
              "**Polecenie od „szefa”** – pilna prośba o przelew lub zakup kart podarunkowych, najczęściej wysłana, gdy przełożony jest na urlopie.",
              "**Fałszywe logowanie** – link do strony udającej Microsoft 365, Google lub bank, który ma przechwycić hasło i kod drugiego składnika.",
              "**Zaległa faktura lub przesyłka** – załącznik lub link, który instaluje złośliwe oprogramowanie.",
              "**SMS i telefon** – wiadomość o dopłacie do przesyłki albo rozmowa z „działem bezpieczeństwa banku”.",
            ],
          },
        ],
      },
      {
        id: "sygnaly",
        heading: "Sygnały ostrzegawcze",
        blocks: [
          {
            type: "p",
            text: "Nie każdy phishing ma błędy językowe – coraz częściej wiadomości są poprawnie napisane i dopasowane do odbiorcy. Lepiej uczyć zespół rozpoznawania sytuacji niż wyglądu wiadomości.",
          },
          {
            type: "ul",
            items: [
              "Presja czasu: „pilne”, „do końca dnia”, „konto zostanie zablokowane”.",
              "Prośba o zmianę sposobu działania: nowy rachunek, inny kanał kontaktu, pominięcie zwykłej procedury.",
              "Prośba o zachowanie poufności wobec współpracowników.",
              "Adres nadawcy lub domena linku różniące się od oczekiwanych, czasem jedną literą.",
              "Strona logowania, na którą trafiasz z linku w wiadomości, a nie przez zakładkę lub wpisanie adresu.",
            ],
          },
        ],
      },
      {
        id: "platnosci",
        heading: "Procedura weryfikacji płatności",
        blocks: [
          {
            type: "p",
            text: "Najskuteczniejsza ochrona przed oszustwami na zmianę rachunku nie jest techniczna. To prosta zasada, której przestrzegają wszyscy:",
          },
          {
            type: "callout",
            title: "Zasada dla zespołu",
            text: "Każdą zmianę numeru rachunku lub nietypowe polecenie przelewu potwierdzamy telefonicznie, dzwoniąc na numer znany z wcześniejszej współpracy – nigdy na numer podany w tej samej wiadomości.",
          },
          {
            type: "p",
            text: "Warto też ustalić, że przelewy powyżej określonej kwoty wymagają akceptacji drugiej osoby. To utrudnia działanie przestępcom i chroni pracownika przed presją.",
          },
        ],
      },
      {
        id: "przygotowanie-zespolu",
        heading: "Jak przygotować zespół",
        blocks: [
          {
            type: "ol",
            items: [
              "Krótkie szkolenie oparte na prawdziwych przykładach z Twojej branży, a nie na ogólnych slajdach.",
              "Jasny sposób zgłaszania podejrzanych wiadomości – jeden przycisk lub jeden adres.",
              "Szybka odpowiedź na zgłoszenie, żeby zespół widział, że zgłaszanie ma sens.",
              "Kultura bez obwiniania: osoba, która kliknęła i od razu to zgłosiła, pomogła firmie.",
              "Przypomnienia co kilka miesięcy, na przykład przy okazji nowej, aktualnej kampanii.",
            ],
          },
          {
            type: "p",
            text: "Symulowane kampanie phishingowe mogą pomóc w nauce, ale tylko wtedy, gdy służą edukacji, a nie wytykaniu błędów. Zawsze uzgadniaj je z zarządem i informuj zespół, że firma prowadzi takie ćwiczenia.",
          },
        ],
      },
      {
        id: "po-kliknieciu",
        heading: "Co zrobić po kliknięciu",
        blocks: [
          {
            type: "ol",
            items: [
              "Nie panikuj i nie usuwaj wiadomości – będzie potrzebna do analizy.",
              "Jeśli hasło zostało wpisane na podejrzanej stronie, od razu zmień je z innego, zaufanego urządzenia i poinformuj osobę odpowiedzialną za IT.",
              "Jeśli załącznik został otwarty, odłącz komputer od sieci, ale go nie wyłączaj.",
              "Zgłoś zdarzenie zgodnie z procedurą firmy.",
            ],
          },
          {
            type: "callout",
            title: "Zgłaszanie do CERT Polska",
            text: "Podejrzane strony i incydenty można zgłaszać przez [incydent.cert.pl](https://incydent.cert.pl), a podejrzane SMS-y przesyłać bezpłatnie na numer 8080.",
          },
        ],
      },
      {
        id: "technika",
        heading: "Zabezpieczenia techniczne, które pomagają",
        blocks: [
          {
            type: "p",
            text: "Ludzie popełniają błędy, dlatego zabezpieczenia techniczne powinny ograniczać skutki kliknięcia. Najważniejsze to drugi składnik logowania odporny na phishing, poprawnie skonfigurowane [SPF, DKIM i DMARC](/baza-wiedzy/spf-dkim-dmarc-bezpieczenstwo-poczty), filtrowanie poczty oraz [ograniczone uprawnienia kont](/baza-wiedzy/zarzadzanie-dostepami-w-firmie).",
          },
          {
            type: "p",
            text: "Szkolenia z rozpoznawania phishingu prowadzimy w ramach usługi [Cyberbezpieczeństwo](/uslugi/cyberbezpieczenstwo).",
          },
        ],
      },
    ],
    related: ["spf-dkim-dmarc-bezpieczenstwo-poczty", "zarzadzanie-dostepami-w-firmie"],
    services: ["cyberbezpieczenstwo"],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

/** Szacowany czas czytania przy tempie 200 słów na minutę. */
export function readingMinutes(article: Article): number {
  const text = [
    article.lead,
    ...article.sections.flatMap((section) => [
      section.heading,
      ...section.blocks.flatMap((block) => {
        switch (block.type) {
          case "ul":
          case "ol":
            return block.items;
          case "callout":
            return [block.title, block.text];
          case "code":
            return [block.label];
          case "table":
            return [...block.head, ...block.rows.flat()];
          default:
            return [block.text];
        }
      }),
    ]),
  ].join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
