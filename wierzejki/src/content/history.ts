/**
 * KRONIKA FIRMY
 *
 * Tylko wydarzenia, które mają źródło. Daty z lat 1991–2008 pochodzą z zakładki „Historia”
 * dotychczasowej witryny wierzejki.pl. Wpis z 11.09.2012 istnieje w kronice firmy, ale jego treści
 * nie udało się odczytać – nie pokazujemy go, dopóki firma go nie uzupełni.
 */

export interface HistoryEvent {
  id: string;
  year: number;
  /** Pełna data w formacie do wyświetlenia, jeśli jest znana. */
  date?: string;
  title: string;
  text: string;
  source: string;
}

export const history: HistoryEvent[] = [
  {
    id: "zalozenie",
    year: 1991,
    date: "26 grudnia 1991",
    title: "Początek w Wierzejkach",
    text: "Bracia Jan i Marek Zdanowscy zakładają Zakład Mięsny „Wierzejki” w rodzinnej miejscowości, od której firma bierze nazwę.",
    source: "Kronika na dotychczasowej stronie firmy",
  },
  {
    id: "pludy-rozbior",
    year: 2004,
    date: "10 września 2004",
    title: "Nowy zakład w Płudach",
    text: "Kończy się pierwszy etap budowy nowego zakładu w Płudach – budynek rozbioru mięsa.",
    source: "Kronika na dotychczasowej stronie firmy",
  },
  {
    id: "pludy-przetworstwo",
    year: 2005,
    date: "1 czerwca 2005",
    title: "Budynek przetwórstwa",
    text: "Drugi etap rozbudowy: oddanie budynku, w którym powstają wędliny i wyroby gotowe.",
    source: "Kronika na dotychczasowej stronie firmy",
  },
  {
    id: "pludy-rzeznia",
    year: 2008,
    date: "17 kwietnia 2008",
    title: "Rzeźnia trzody i bydła",
    text: "Trzeci etap: ukończenie budynku rzeźni. Od tej chwili ubój, rozbiór i przetwórstwo odbywają się w jednym zakładzie.",
    source: "Kronika na dotychczasowej stronie firmy",
  },
];

/** Wyróżnienia z dotychczasowej strony i profilu firmy. Lata podajemy tylko tam, gdzie są w źródle. */
export const recognitions = [
  { title: "Mistrz Agro-Ligi", year: null as number | null, source: "Dotychczasowa strona firmy" },
  {
    title: "Laureat Ogólnopolskiego Finału konkursu „Polski Producent Żywności”",
    year: null as number | null,
    source: "Dotychczasowa strona firmy",
  },
  { title: "Gazele Biznesu", year: 2006 as number | null, source: "Profil firmy w serwisie branżowym (opis przygotowany przez firmę)" },
  { title: "Orzeł Agrobiznesu", year: 2006 as number | null, source: "Profil firmy w serwisie branżowym (opis przygotowany przez firmę)" },
];
