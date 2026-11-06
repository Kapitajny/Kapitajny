/**
 * ★ Informacje o świadczeniach NFZ.
 *
 * UWAGA: zakres umowy poniżej jest PRZYKŁADOWY. Przed publikacją wpisz zakresy wynikające z faktycznie
 * zawartej umowy z NFZ (rodzaj świadczeń, oddział wojewódzki, okres obowiązywania) albo usuń sekcję.
 */

export const nfzContract = {
  /** Oddział Wojewódzki NFZ – do uzupełnienia. */
  branch: null as string | null,
  /** Okres obowiązywania umowy – do uzupełnienia. */
  period: null as string | null,
  /** Przykładowe zakresy świadczeń – zastąp zakresem faktycznej umowy. */
  scopes: [
    {
      title: "Transport sanitarny w ramach podstawowej opieki zdrowotnej",
      text: "Przejazdy pacjentów na podstawie zlecenia lekarza ubezpieczenia zdrowotnego, w przypadkach określonych w przepisach.",
    },
    {
      title: "Transport sanitarny na zlecenie podmiotów leczniczych",
      text: "Przewozy realizowane na podstawie umów z placówkami, które udzielają świadczeń finansowanych przez NFZ.",
    },
  ],
};

export const nfzRules = [
  {
    title: "Podstawą jest zlecenie lekarza",
    text: "Bezpłatny lub częściowo odpłatny transport sanitarny przysługuje na podstawie zlecenia lekarza ubezpieczenia zdrowotnego, w przypadkach określonych w ustawie o świadczeniach opieki zdrowotnej finansowanych ze środków publicznych.",
  },
  {
    title: "Tylko w zakresie zawartej umowy",
    text: "Świadczenia finansowane przez NFZ realizujemy wyłącznie w zakresie, na obszarze i w okresie wynikającym z umowy z Funduszem.",
  },
  {
    title: "Weryfikujemy uprawnienia",
    text: "Przed przejazdem sprawdzamy zlecenie oraz prawo pacjenta do świadczeń. Prosimy o przygotowanie dokumentu tożsamości.",
  },
  {
    title: "Ratownictwo medyczne – tylko 112 i 999",
    text: "Zespoły ratownictwa medycznego w systemie Państwowego Ratownictwa Medycznego są wysyłane wyłącznie przez dyspozytora medycznego. Nie można ich zamówić przez naszą stronę.",
  },
];

export const nfzVsPrivate = {
  nfz: [
    "Finansowane ze środków publicznych – bez opłat lub z częściową odpłatnością określoną w przepisach",
    "Wymagane zlecenie lekarza ubezpieczenia zdrowotnego",
    "Realizowane wyłącznie w zakresie zawartej umowy z NFZ",
    "Termin ustalany zgodnie z zasadami umowy",
  ],
  private: [
    "Płatne według cennika lub indywidualnej wyceny",
    "Bez skierowania – zamówienie telefoniczne lub przez formularz",
    "Dowolna trasa, także międzymiastowa i międzynarodowa",
    "Termin dopasowany do potrzeb pacjenta",
  ],
};

export const nfzFaq = [
  {
    q: "Czy każdy transport medyczny jest bezpłatny w ramach NFZ?",
    a: "Nie. Finansowanie z NFZ obejmuje wyłącznie przypadki określone w przepisach i w umowie z Funduszem – zawsze na podstawie zlecenia lekarza. Pozostałe przejazdy są usługami komercyjnymi, płatnymi według cennika. O sposobie rozliczenia informujemy przed realizacją przejazdu.",
  },
  {
    q: "Skąd mam wiedzieć, czy przysługuje mi bezpłatny transport?",
    a: "O potrzebie transportu sanitarnego decyduje lekarz ubezpieczenia zdrowotnego, który wystawia zlecenie. Jeśli masz zlecenie, zadzwoń do naszej dyspozytorni – sprawdzimy, czy przejazd mieści się w zakresie naszej umowy.",
  },
  {
    q: "Czy mogę dopłacić do transportu w ramach NFZ, aby przyspieszyć termin?",
    a: "Świadczenia finansowane przez NFZ realizujemy na zasadach wynikających z umowy. Jeśli zależy Ci na innym terminie lub trasie, możesz zamówić przejazd jako usługę komercyjną – wtedy obowiązuje cennik usług prywatnych.",
  },
  {
    q: "Gdzie mogę sprawdzić umowy zawarte z NFZ?",
    a: "Informacje o umowach z Narodowym Funduszem Zdrowia publikuje NFZ w serwisie „Informator o zawartych umowach”.",
  },
];

export const NFZ_INFORMATOR_URL = "https://aplikacje.nfz.gov.pl/umowy/";
