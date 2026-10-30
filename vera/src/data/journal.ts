import type { ImageKey } from "@/config/images";

/** Artykuły magazynu. Treści edukacyjne konceptu – do weryfikacji przez specjalistów studia. */

export interface JournalBlock {
  type: "p" | "h2" | "list" | "quote";
  text?: string;
  items?: string[];
}

export interface JournalEntry {
  slug: string;
  title: string;
  excerpt: string;
  topic: string;
  /** Data ISO. */
  date: string;
  readingMinutes: number;
  author: string;
  image: ImageKey;
  body: JournalBlock[];
}

export const journal: JournalEntry[] = [
  {
    slug: "pierwsza-konsultacja-czego-sie-spodziewac",
    title: "Pierwsza konsultacja – czego się spodziewać",
    excerpt: "Godzina, lustro i sporo pytań. Podpowiadamy, jak wygląda wizyta i co warto ze sobą zabrać.",
    topic: "W studiu",
    date: "2026-10-14",
    readingMinutes: 4,
    author: "Adam Lis",
    image: "consultation",
    body: [
      { type: "p", text: "Większość osób przychodzi na pierwszą konsultację ze zdjęciem, nazwą zabiegu albo z niepokojem. Każdy z tych punktów wyjścia jest dobry. Żaden nie jest decyzją." },
      { type: "h2", text: "Zaczynamy od Ciebie, nie od zabiegu" },
      { type: "p", text: "Pierwsza część wizyty to rozmowa: co chcesz zmienić, czego już próbowałaś lub próbowałeś, czego używasz w domu i co powinniśmy wiedzieć o Twoim zdrowiu. Nie ma złych odpowiedzi i na tym etapie niczego nie rezerwujemy." },
      { type: "h2", text: "Potem przyglądamy się z bliska" },
      { type: "p", text: "Oceniamy skórę w świetle dziennym, czasem w powiększeniu. Patrzymy na teksturę, koloryt, nawilżenie i na to, jak twarz pracuje podczas mówienia. Za Twoją zgodą robimy zdjęcia porównawcze do dokumentacji." },
      { type: "h2", text: "Co zabrać" },
      {
        type: "list",
        items: ["Listę kosmetyków, których używasz, albo ich zdjęcia", "Leki lub suplementy przyjmowane na stałe", "Informacje o wcześniejszych zabiegach – jakich, kiedy i gdzie"],
      },
      { type: "h2", text: "Z czym wychodzisz" },
      { type: "p", text: "Z pisemnym planem, który obejmuje możliwości, terminy i koszty. Czasem plan to trzy miesiące pielęgnacji domowej przed czymkolwiek innym. Czasem skierowanie do lekarza. Czasem zabieg. Decydujesz Ty, we własnym tempie." },
    ],
  },
  {
    slug: "filtr-spf-zima",
    title: "Filtr SPF zimą nie jest opcjonalny",
    excerpt: "Krótsze dni nie wyłączają promieniowania UV. Dlaczego przed każdym peelingiem pytamy o SPF – nawet w styczniu.",
    topic: "Pielęgnacja",
    date: "2026-09-30",
    readingMinutes: 3,
    author: "Julia Sowa",
    image: "spf",
    body: [
      { type: "p", text: "Jesień i zima to czas, kiedy planujemy najwięcej peelingów i serii mikroigłowania. To także czas, kiedy wiele osób po cichu rezygnuje z filtra. Jedno z drugim się nie łączy." },
      { type: "h2", text: "Promieniowanie UV nie ma zimowej przerwy" },
      { type: "p", text: "Promieniowanie UVA, które przyczynia się do przebarwień i starzenia skóry, występuje przez cały rok i przenika przez chmury oraz szyby. Po peelingu odnowiona skóra jest na nie bardziej wrażliwa." },
      { type: "h2", text: "Rutyna, której się utrzymasz" },
      {
        type: "list",
        items: ["Nakładaj krem z szerokim spektrum ochrony każdego ranka jako ostatni krok pielęgnacji", "Wybierz konsystencję, którą lubisz – to jej naprawdę będziesz używać", "Ponawiaj aplikację, gdy dłużej przebywasz na zewnątrz, zwłaszcza na śniegu"],
      },
      { type: "quote", text: "Najlepszy filtr to ten, który z przyjemnością nakładasz każdego dnia." },
      { type: "p", text: "Jeśli jesteś w trakcie serii zabiegów, zapytamy o SPF na każdej wizycie. To nie formalność – to część zabiegu." },
    ],
  },
  {
    slug: "nawilzenie-a-natluszczenie",
    title: "Nawilżona czy natłuszczona? Ta różnica ma znaczenie",
    excerpt: "Dwa słowa używane zamiennie – i dwie różne rzeczy, których może potrzebować Twoja skóra.",
    topic: "Pielęgnacja",
    date: "2026-09-09",
    readingMinutes: 5,
    author: "Adam Lis",
    image: "hydration",
    body: [
      { type: "p", text: "Skórze odwodnionej brakuje wody. Skórze suchej brakuje lipidów. Mogą wyglądać podobnie – ściągnięte, matowe, lekko szorstkie – ale potrzebują nieco innej pielęgnacji." },
      { type: "h2", text: "Oznaki odwodnienia" },
      { type: "p", text: "Drobne zmarszczki widoczne po delikatnym przesunięciu skóry, uczucie ściągnięcia po myciu, makijaż, który „siedzi” na powierzchni. Odwodniona może być każda skóra, także tłusta." },
      { type: "h2", text: "Co pomaga" },
      {
        type: "list",
        items: ["Humektanty, takie jak gliceryna czy kwas hialuronowy, które przyciągają wodę", "Krem z emolientami, który tę wodę zatrzymuje", "Łagodny preparat myjący, który nie wysusza skóry"],
      },
      { type: "h2", text: "Kiedy do nas przyjść" },
      { type: "p", text: "Jeśli mimo regularnej pielęgnacji skóra wciąż jest ściągnięta i nieprzyjemna, konsultacja pomoże ustalić przyczynę. Czasem odpowiedzią jest zabieg; częściej – prostsza pielęgnacja." },
    ],
  },
];

export function getEntry(slug: string) {
  return journal.find((e) => e.slug === slug);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}
