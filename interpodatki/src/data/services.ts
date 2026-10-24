import type { FaqItem } from "@/components/ui/Faq";
import { defaultCalculatorInput, type CalculatorInput } from "@/lib/pricing/calculator";

export type ServicePageData = {
  path: string;
  navLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  lede: string;
  exampleLabel: string;
  example: CalculatorInput;
  audience: { title: string; text: string }[];
  scope: { title: string; items: string[] }[];
  outOfScope: string[];
  prepare: string[];
  faq: FaqItem[];
  articles: string[];
};

export const services: Record<"jdg" | "spolki" | "doradztwo" | "kadry", ServicePageData> = {
  jdg: {
    path: "/ksiegowosc-jdg",
    navLabel: "Księgowość dla JDG",
    title: "Księgowość dla jednoosobowej działalności",
    metaTitle: "Księgowość dla JDG i freelancerów",
    metaDescription:
      "Obsługa księgowa jednoosobowych działalności: ewidencja dokumentów, rozliczenia VAT, bieżący kontakt z biurem. Sprawdź szacunkowy abonament od 700 zł (demo).",
    lede: "Prowadzisz firmę sam i nie chcesz poświęcać wieczorów na faktury. Zajmiemy się ewidencją i bieżącymi rozliczeniami, a Ty dostaniesz jasną informację, ile i kiedy zapłacić.",
    exampleLabel: "JDG, 35 dokumentów, rozliczenia VAT",
    example: { ...defaultCalculatorInput, businessType: "jdg", legalForm: "jdg", services: ["ksiegowosc", "vat"], documents: 35 },
    audience: [
      { title: "Freelancerzy i usługi B2B", text: "Programiści, projektanci, konsultanci – kilka faktur sprzedażowych i stałe koszty." },
      { title: "Mała działalność usługowa", text: "Gabinety, pracownie i firmy usługowe z powtarzalnymi kosztami." },
      { title: "Handel na niewielką skalę", text: "Sprzedaż stacjonarna lub online z umiarkowaną liczbą transakcji." },
    ],
    scope: [
      {
        title: "Ewidencja i rozliczenia",
        items: [
          "Ewidencja przychodów i kosztów w formie właściwej dla wybranej formy opodatkowania",
          "Przygotowanie rozliczeń podatkowych w uzgodnionym zakresie",
          "Rozliczenia VAT, jeśli dotyczą Twojej działalności",
          "Informacja o kwotach do zapłaty",
        ],
      },
      {
        title: "Kontakt i porządek w dokumentach",
        items: [
          "Stały opiekun i ustalony kanał kontaktu",
          "Kontrola kompletności przekazanych dokumentów",
          "Przypomnienia o brakujących dokumentach",
          "Krótkie podsumowanie miesiąca na życzenie",
        ],
      },
    ],
    outOfScope: [
      "Analizy podatkowe i opinie w sprawach nietypowych – to zakres doradztwa podatkowego",
      "Reprezentacja przed organami – wymaga odrębnego pełnomocnictwa i ustaleń",
      "Prowadzenie spraw prywatnych niezwiązanych z działalnością",
    ],
    prepare: [
      "Dane rejestrowe firmy i informację o wybranej formie opodatkowania",
      "Dokumenty sprzedaży i zakupu za bieżący okres",
      "Dostęp do wyciągów z rachunku firmowego",
      "Informację o środkach trwałych i leasingach, jeśli występują",
    ],
    faq: [
      {
        q: "Czy pomożecie wybrać formę opodatkowania?",
        a: "Możemy przygotować porównanie na podstawie Twoich danych. Wybór formy opodatkowania zależy od indywidualnej sytuacji i aktualnych przepisów, dlatego w złożonych przypadkach rekomendujemy konsultację z doradcą podatkowym.",
      },
      {
        q: "Ile dokumentów obejmuje abonament?",
        a: "W kalkulatorze cena bazowa dla JDG obejmuje do 20 dokumentów miesięcznie. Każdy kolejny dokument jest doliczany według malejącej stawki – im więcej dokumentów, tym niższy koszt jednostkowy.",
      },
      {
        q: "Czy mogę przejść z innego biura w trakcie roku?",
        a: "Zwykle tak. Zmianę biura warto zaplanować tak, aby przejęcie dokumentacji nastąpiło po zamknięciu pełnego miesiąca. Szczegóły ustalamy indywidualnie.",
      },
    ],
    articles: ["jak-przygotowac-firme-do-wspolpracy", "jdg-a-spolka-z-oo"],
  },

  spolki: {
    path: "/ksiegowosc-spolki",
    navLabel: "Księgowość dla spółek",
    title: "Pełna księgowość dla spółek",
    metaTitle: "Księgowość dla spółek z o.o. i spółek osobowych",
    metaDescription:
      "Pełna księgowość spółek: księgi rachunkowe, zamknięcia miesięcy, współpraca przy sprawozdawczości i raportowanie dla zarządu. Szacunkowy abonament w kalkulatorze (demo).",
    lede: "Spółka wymaga pełnych ksiąg, regularnych zamknięć i dokumentacji dla wspólników. Uporządkujemy te procesy i przygotujemy zestawienia, na podstawie których zarząd podejmuje decyzje.",
    exampleLabel: "Spółka z o.o., 80 dokumentów, VAT, 5 pracowników",
    example: {
      ...defaultCalculatorInput,
      businessType: "spzoo",
      legalForm: "spzoo",
      services: ["ksiegowosc", "vat", "kadry"],
      documents: 80,
      employees: 5,
      scale: "mala",
    },
    audience: [
      { title: "Spółki z o.o.", text: "Od nowo założonych spółek po firmy z rozbudowaną strukturą kosztów." },
      { title: "Spółki osobowe", text: "Jawne, partnerskie i komandytowe – z uwzględnieniem rozliczeń wspólników." },
      { title: "Spółki akcyjne i PSA", text: "Wyższe wymagania sprawozdawcze – zakres ustalamy indywidualnie." },
    ],
    scope: [
      {
        title: "Księgi i zamknięcia",
        items: [
          "Prowadzenie ksiąg rachunkowych zgodnie z przyjętą polityką rachunkowości",
          "Miesięczne zamknięcia i uzgodnienia sald",
          "Ewidencja środków trwałych i rozliczenia międzyokresowe",
          "Rozliczenia podatkowe w uzgodnionym zakresie",
        ],
      },
      {
        title: "Raportowanie i wsparcie zarządu",
        items: [
          "Okresowe zestawienia przychodów, kosztów i wyniku",
          "Współpraca przy przygotowaniu dokumentów rocznych",
          "Współpraca z audytorem, jeśli spółka podlega badaniu",
          "Raportowanie zarządcze w ustalonym formacie (opcjonalnie)",
        ],
      },
    ],
    outOfScope: [
      "Obsługa prawna spółki, w tym przygotowanie uchwał – wymaga kancelarii prawnej",
      "Badanie sprawozdania finansowego – wykonuje je niezależny biegły rewident",
      "Doradztwo podatkowe przy restrukturyzacjach – zakres wyceniany osobno",
    ],
    prepare: [
      "Umowę spółki i dane rejestrowe",
      "Politykę rachunkowości lub informację o jej braku",
      "Bilans otwarcia albo dokumentację od poprzedniego biura",
      "Listę rachunków bankowych, umów leasingu i kredytów",
    ],
    faq: [
      {
        q: "Czy przygotujecie politykę rachunkowości?",
        a: "Możemy przygotować projekt dokumentu dopasowany do działalności spółki. Ostateczną wersję zatwierdza zarząd spółki.",
      },
      {
        q: "Czym różni się cena dla spółki od cennika JDG?",
        a: "Pełna księgowość wymaga więcej pracy przy każdym dokumencie, zamknięciach i dokumentach rocznych. Dlatego cena bazowa dla spółki z o.o. w kalkulatorze jest wyższa i obejmuje 30 dokumentów miesięcznie.",
      },
      {
        q: "Czy możecie raportować bezpośrednio do zarządu lub wspólników?",
        a: "Tak, zestawienia można przekazywać wskazanym osobom. Zakres i format raportów ustalamy przy podpisaniu umowy.",
      },
    ],
    articles: ["jdg-a-spolka-z-oo", "co-wplywa-na-cene-ksiegowosci"],
  },

  doradztwo: {
    path: "/doradztwo-podatkowe",
    navLabel: "Obsługa podatkowa",
    title: "Obsługa podatkowa i doradztwo",
    metaTitle: "Obsługa podatkowa i doradztwo podatkowe dla firm",
    metaDescription:
      "Wsparcie podatkowe dla przedsiębiorców: konsultacje, analiza sytuacji podatkowej i przygotowanie do decyzji biznesowych. Doradztwo świadczy uprawniony doradca. Projekt demo.",
    lede: "Niektóre decyzje wymagają więcej niż poprawnego zaksięgowania dokumentu. W takich sytuacjach potrzebna jest analiza uprawnionego doradcy podatkowego – oddzielamy ją od bieżącej księgowości.",
    exampleLabel: "Spółka z o.o. z księgowością i stałym doradztwem",
    example: {
      ...defaultCalculatorInput,
      businessType: "spzoo",
      legalForm: "spzoo",
      services: ["ksiegowosc", "vat", "doradztwo"],
      documents: 60,
      scale: "mala",
      complexity: "podwyzszona",
    },
    audience: [
      { title: "Planowane zmiany w firmie", text: "Zmiana formy prawnej, nowy model sprzedaży, wejście na nowy rynek." },
      { title: "Transakcje nietypowe", text: "Umowy z kontrahentami zagranicznymi, sprzedaż majątku, nowe źródła przychodu." },
      { title: "Wątpliwości interpretacyjne", text: "Sytuacje, w których przepisy można rozumieć na różne sposoby." },
    ],
    scope: [
      {
        title: "Bieżąca obsługa podatkowa",
        items: [
          "Rozliczenia podatkowe przygotowywane w ramach obsługi księgowej",
          "Odpowiedzi na pytania o skutki podatkowe typowych operacji",
          "Sygnalizowanie sytuacji wymagających analizy doradcy",
        ],
      },
      {
        title: "Doradztwo podatkowe (uprawniony doradca)",
        items: [
          "Analiza konkretnej sytuacji podatkowej i rekomendacja",
          "Pisemne opinie w uzgodnionym zakresie",
          "Wsparcie przy przygotowaniu wniosków i pism",
          "Udział w spotkaniach przy planowanych decyzjach",
        ],
      },
    ],
    outOfScope: [
      "Gwarancja określonego rozstrzygnięcia przez organ podatkowy",
      "Działania mające na celu sztuczne unikanie opodatkowania",
      "Doradztwo bez dostępu do pełnych informacji o sytuacji firmy",
    ],
    prepare: [
      "Opis sytuacji lub planowanej transakcji",
      "Dokumenty, których dotyczy pytanie (umowy, faktury, korespondencja)",
      "Informację o terminie, w którym potrzebna jest decyzja",
    ],
    faq: [
      {
        q: "Kto świadczy doradztwo podatkowe?",
        a: "Doradztwo podatkowe może świadczyć wyłącznie osoba posiadająca wymagane uprawnienia. W tym projekcie demonstracyjnym nie wskazujemy konkretnych osób ani numerów wpisu – w wersji produkcyjnej należy je podać zgodnie ze stanem faktycznym.",
      },
      {
        q: "Dlaczego doradztwo jest osobną pozycją w kalkulatorze?",
        a: "Bo to inna usługa niż bieżąca księgowość: wymaga indywidualnej analizy, a jej zakres trudno ująć w stałym abonamencie. Kwota w kalkulatorze to orientacyjny koszt stałej gotowości – ostateczna wycena zależy od zakresu.",
      },
      {
        q: "Czy treści w bazie wiedzy zastępują poradę?",
        a: "Nie. Artykuły mają charakter ogólny i edukacyjny. Przepisy podatkowe się zmieniają – przed podjęciem decyzji sprawdź aktualne regulacje i skonsultuj się z uprawnionym specjalistą.",
      },
    ],
    articles: ["kiedy-potrzebne-doradztwo-podatkowe", "co-wplywa-na-cene-ksiegowosci"],
  },

  kadry: {
    path: "/kadry-place",
    navLabel: "Kadry i płace",
    title: "Kadry i płace",
    metaTitle: "Obsługa kadrowo-płacowa firm",
    metaDescription:
      "Listy płac, dokumentacja pracownicza i rozliczenia związane z zatrudnieniem. Koszt zależny od liczby pracowników – sprawdź w kalkulatorze abonamentu (demo).",
    lede: "Zatrudnianie ludzi oznacza listy płac, umowy i dokumentację, której nie można odłożyć na później. Przejmiemy te obowiązki w zakresie określonym umową.",
    exampleLabel: "Spółka z o.o., 15 pracowników, 6 dokumentów kadrowych",
    example: {
      ...defaultCalculatorInput,
      businessType: "spzoo",
      legalForm: "spzoo",
      services: ["ksiegowosc", "kadry"],
      documents: 50,
      employees: 15,
      hrDocuments: 6,
      scale: "mala",
    },
    audience: [
      { title: "Pierwsi pracownicy", text: "Firmy, które dopiero zaczynają zatrudniać i chcą zrobić to poprawnie od początku." },
      { title: "Zespoły kilkunastoosobowe", text: "Regularne listy płac, urlopy, zmiany w umowach." },
      { title: "Różne formy zatrudnienia", text: "Umowy o pracę i umowy cywilnoprawne w jednej obsłudze." },
    ],
    scope: [
      {
        title: "Płace",
        items: [
          "Przygotowanie list płac i rozliczeń wynagrodzeń",
          "Rozliczenia składek i zaliczek związanych z zatrudnieniem w uzgodnionym zakresie",
          "Informacje o kwotach do przelewu dla pracowników i instytucji",
        ],
      },
      {
        title: "Kadry",
        items: [
          "Przygotowanie umów, aneksów i świadectw na podstawie Twoich decyzji",
          "Prowadzenie dokumentacji pracowniczej",
          "Ewidencja urlopów i nieobecności",
          "Zaświadczenia na prośbę pracowników",
        ],
      },
    ],
    outOfScope: [
      "Rekrutacja i decyzje personalne",
      "Reprezentacja w sporach pracowniczych – wymaga prawnika",
      "Bezpieczeństwo i higiena pracy – odrębna usługa specjalistyczna",
    ],
    prepare: [
      "Listę pracowników z rodzajem umów",
      "Regulaminy wynagradzania i pracy, jeśli obowiązują",
      "Dokumentację od poprzedniego biura lub działu kadr",
    ],
    faq: [
      {
        q: "Jak liczony jest koszt kadr i płac?",
        a: "W kalkulatorze: stała opłata za obsługę kadr oraz kwota za każdego pracownika. Dodatkowo liczona jest liczba dokumentów kadrowych w miesiącu, np. nowych umów czy zaświadczeń.",
      },
      {
        q: "Czy obsługujecie także umowy cywilnoprawne?",
        a: "Tak, w kalkulatorze wliczaj je do liczby pracowników. Zakres obsługi dla różnych form zatrudnienia określa umowa.",
      },
      {
        q: "Kto podejmuje decyzje kadrowe?",
        a: "Zawsze pracodawca. Biuro przygotowuje dokumenty i rozliczenia na podstawie przekazanych decyzji i informacji.",
      },
    ],
    articles: ["jak-przygotowac-dokumenty-do-rozliczenia", "co-wplywa-na-cene-ksiegowosci"],
  },
};
