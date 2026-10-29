/**
 * MORELOWA – treści strony rodzinnej piekarni i cukierni.
 *
 * Marka, historia, osoby i adresy są fikcyjne (projekt demonstracyjny portfolio ComputerIT).
 * Nie dodawaj tu prawdziwych numerów telefonu, godzin otwarcia ani linków do map,
 * dopóki nie zostaną potwierdzone.
 */

export const morelowa = {
  name: "Morelowa",
  fullName: "Rodzinna Piekarnia & Cukiernia Morelowa",
  tagline: "Od 1991 roku. Z serca, z tradycji, z najlepszych składników.",
  description:
    "Rodzinna piekarnia i cukiernia Morelowa – od 1991 roku w Grodzisku Mazowieckim, od 2010 roku także w Warszawie. Chleb na zakwasie, codzienne pieczywo, torty i desery przygotowywane ręcznie.",
  demoNotice: "Projekt demonstracyjny — fikcyjna marka stworzona na potrzeby portfolio ComputerIT",
} as const;

export const morelowaNav = [
  { href: "#start", label: "Strona główna" },
  { href: "#historia", label: "Nasza historia" },
  { href: "#pieczywo", label: "Pieczywo" },
  { href: "#cukiernia", label: "Cukiernia" },
  { href: "#lokale", label: "Nasze lokale" },
  { href: "#kontakt", label: "Kontakt" },
] as const;

export const pillars = [
  {
    title: "Rzemiosło",
    lead: "Staranność i doświadczenie",
    text: "Ciasto formujemy ręcznie, a zakwas dokarmiamy każdego dnia. Doświadczenie piekarzy i cukierników jest dla nas ważniejsze niż pośpiech – dlatego niektóre bochenki dojrzewają przez całą noc.",
  },
  {
    title: "Składniki",
    lead: "Świadomy dobór surowców",
    text: "Mąkę, masło, jaja i owoce wybieramy uważnie, sprawdzając ich jakość i pochodzenie. Krótka lista składników jest dla nas punktem wyjścia, a nie hasłem na opakowaniu.",
  },
  {
    title: "Rodzina",
    lead: "Wartości przekazywane dalej",
    text: "Receptury, zwyczaje i sposób pracy przechodzą u nas z pokolenia na pokolenie. Za ladą wciąż spotkasz członków rodziny, którzy pamiętają, po jaki chleb przychodzisz najczęściej.",
  },
] as const;

export const breads = [
  {
    name: "Chleby na zakwasie",
    text: "Żytnie i pszenno-żytnie, z chrupiącą skórką i wilgotnym miąższem. Długa fermentacja nadaje im głęboki, lekko kwaskowy smak.",
  },
  {
    name: "Tradycyjne chleby pszenne i żytnie",
    text: "Codzienne bochenki o prostym składzie – do śniadania, kanapek i rodzinnego obiadu.",
  },
  {
    name: "Świeże bułki i bagietki",
    text: "Wypiekane od świtu, z cienką, chrupiącą skórką. Najlepsze jeszcze ciepłe, prosto z pieca.",
  },
  {
    name: "Drożdżówki i wypieki sezonowe",
    text: "Z kruszonką, serem i owocami sezonu – od rabarbaru wiosną po śliwki jesienią. Latem obowiązkowo z morelą.",
  },
] as const;

export const pastries = [
  {
    name: "Torty na zamówienie",
    text: "Na urodziny, chrzciny, wesele czy rocznicę. Smak, wielkość i dekorację ustalamy osobiście, przy ladzie w jednym z naszych lokali – tak, jak robimy to od lat.",
  },
  {
    name: "Ciasta i desery",
    text: "Sernik, szarlotka i makowiec obok tart owocowych, monoporcji i ręcznie wykańczanych deserów. Część receptur pamięta pierwsze lata piekarni, inne powstały w ostatnim sezonie.",
  },
] as const;

export const timeline = [
  {
    year: "1991",
    title: "Pierwszy wypiek",
    text: "W Grodzisku Mazowieckim rozpoczyna działalność niewielka rodzinna piekarnia. Wszystko zaczyna się od pasji do pieczywa i marzenia o miejscu, do którego klienci będą wracać każdego ranka.",
  },
  {
    year: "2000",
    title: "Smak, który łączy",
    text: "Rodzinna firma rozwija ofertę o nowe rodzaje pieczywa i domowe wypieki cukiernicze. Zespół nadal stawia na rzemieślniczą pracę i bliskie relacje z klientami.",
  },
  {
    year: "2010",
    title: "Nowy rozdział w Warszawie",
    text: "Po latach rozwoju rodzina otwiera drugi lokal w Warszawie. Marka pozostaje wierna swoim korzeniom, a jednocześnie dociera do nowych klientów.",
  },
  {
    year: "2021",
    title: "Tradycja w nowym pokoleniu",
    text: "Kolejne pokolenie rodziny rozwija ofertę cukierniczą i unowocześnia sposób prezentowania marki, zachowując rodzinny charakter firmy.",
  },
] as const;

export interface BakeryLocation {
  id: string;
  number: string;
  city: string;
  since: string;
  street: string;
  postalCode: string;
  description: string;
  /** Co wyróżnia lokal – treść rozwijana przyciskiem „Zobacz lokal”. */
  details: readonly string[];
}

export const bakeryLocations: readonly BakeryLocation[] = [
  {
    id: "grodzisk",
    number: "01",
    city: "Grodzisk Mazowiecki",
    since: "od 1991",
    street: "ul. Morelowa 12",
    postalCode: "05-825 Grodzisk Mazowiecki",
    description: "Tutaj wszystko się zaczęło. Nasz pierwszy lokal pozostaje sercem rodzinnej tradycji.",
    details: [
      "Piekarnia z ladą, przy której codziennie rano pojawia się pełny wybór pieczywa.",
      "Tutaj powstają chleby na zakwasie dla obu lokali.",
      "Zamówienia tortów omawiamy osobiście, przy ladzie.",
    ],
  },
  {
    id: "warszawa",
    number: "02",
    city: "Warszawa",
    since: "od 2010",
    street: "ul. Piekarska 8",
    postalCode: "00-000 Warszawa",
    description: "Drugi rozdział naszej historii, otwarty w 2010 roku.",
    details: [
      "Większa witryna cukiernicza z tortami, tartami i monoporcjami.",
      "Kilka stolików na kawę i kawałek ciasta na miejscu.",
      "Pieczywo dowożone każdego ranka z Grodziska.",
    ],
  },
];

/** Rytm pracy piekarni – od nocnej fermentacji do popołudniowych wypieków (koncepcja 2). */
export const bakeryRhythm = [
  { time: "Noc", text: "Zakwas dojrzewa powoli, a ciasto na chleby żytnie odpoczywa w dzieżach." },
  { time: "Przed świtem", text: "Rozpalamy piec, formujemy bochenki ręcznie i nacinamy je tuż przed wypiekiem." },
  { time: "Ranek", text: "Pierwsze chleby, bułki i bagietki trafiają na półki jeszcze ciepłe." },
  { time: "W ciągu dnia", text: "Powstają drożdżówki, ciasta i wypieki sezonowe – w rytmie tego, co akurat dojrzewa." },
] as const;
