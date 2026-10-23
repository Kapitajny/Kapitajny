import type { ImageKey } from "@/config/images";

/**
 * ★ USŁUGI GABINETU
 *
 * Kolejność na liście = kolejność na stronie głównej i na podstronie /uslugi.
 * Aby usunąć usługę, usuń jej obiekt (i powiązane wiersze w data/pricing.ts).
 * `confirmed: false` oznacza, że właściciel jeszcze nie potwierdził, że gabinet ją świadczy –
 * dopóki choć jedna usługa ma `false`, strona informuje, że zakres usług jest potwierdzany.
 */

export interface Service {
  slug: string;
  title: string;
  /** Jedno zdanie na listę usług na stronie głównej. */
  short: string;
  /** Pełny opis na podstronie /uslugi. */
  description: string;
  /** Z czym zwykle zgłaszają się pacjenci. */
  forWhom: string[];
  /** Jak wygląda wizyta – krótko, bez obietnic efektów. */
  howItWorks: string;
  image: ImageKey;
  confirmed: boolean;
}

export const SERVICES: Service[] = [
  {
    slug: "fizjoterapia-indywidualna",
    title: "Fizjoterapia indywidualna",
    short: "Wizyta jeden na jeden: ocena, plan i terapia dobrana do Twoich potrzeb.",
    description:
      "Spotkanie jeden na jeden z fizjoterapeutą. Zaczynamy od rozmowy i oceny funkcjonalnej, a na jej podstawie planujemy terapię odpowiednio do Twoich potrzeb i możliwości.",
    forWhom: ["ból, którego przyczyny nie znasz", "ograniczona ruchomość", "chęć sprawdzenia, jaka terapia będzie właściwa"],
    howItWorks: "Pracujemy technikami manualnymi i ćwiczeniami. Po wizycie wiesz, co robimy dalej i jakie ćwiczenia wykonywać w domu.",
    image: "serviceIndividual",
    confirmed: false,
  },
  {
    slug: "rehabilitacja-ortopedyczna",
    title: "Rehabilitacja ortopedyczna",
    short: "Powrót do sprawności po urazach i zabiegach, zgodnie z zaleceniami lekarza.",
    description:
      "Pomagamy wrócić do sprawności po urazach i zabiegach. Pracujemy zgodnie z zaleceniami lekarza i w tempie, na które w danym momencie pozwala Twój organizm.",
    forWhom: ["stan po skręceniu, zwichnięciu lub złamaniu", "urazy sportowe", "przeciążenia stawów i ścięgien"],
    howItWorks: "Etapami odbudowujemy zakres ruchu, siłę i kontrolę, aż do czynności, do których chcesz wrócić.",
    image: "serviceOrthopedic",
    confirmed: false,
  },
  {
    slug: "terapia-bolu-plecow-i-karku",
    title: "Terapia bólu pleców i karku",
    short: "Praca z bólem karku i krzyża oraz ćwiczenia, które zabierzesz do domu.",
    description:
      "Pracujemy nad ruchomością kręgosłupa i dolegliwościami w okolicy karku i krzyża. Dostajesz ćwiczenia, które możesz robić w domu i w pracy.",
    forWhom: ["ból karku przy pracy siedzącej", "ból krzyża przy schylaniu lub wstawaniu", "nawracające dolegliwości kręgosłupa"],
    howItWorks: "Szukamy ruchów i pozycji, które zmniejszają ból, a potem stopniowo wracamy do pełnej aktywności.",
    image: "serviceBack",
    confirmed: false,
  },
  {
    slug: "masaz-leczniczy",
    title: "Masaż leczniczy",
    short: "Masaż dobrany po rozmowie i sprawdzeniu przeciwwskazań.",
    description:
      "Masaż dobieramy do Twoich potrzeb po rozmowie i sprawdzeniu przeciwwskazań. Jeśli w Twojej sytuacji masaż nie jest wskazany, zaproponujemy inną formę pracy.",
    forWhom: ["wzmożone napięcie mięśni", "uczucie sztywności po wysiłku lub pracy siedzącej", "uzupełnienie fizjoterapii"],
    howItWorks: "Przed masażem pytamy o zdrowie i przyjmowane leki. Siłę i techniki dopasowujemy na bieżąco do Twojego odczucia.",
    image: "serviceMassage",
    confirmed: false,
  },
  {
    slug: "rehabilitacja-pooperacyjna",
    title: "Rehabilitacja pooperacyjna",
    short: "Rehabilitacja po operacji według zaleceń lekarza prowadzącego.",
    description: "Prowadzimy rehabilitację po operacji według zaleceń lekarza prowadzącego. Tempo ćwiczeń dopasowujemy do etapu gojenia.",
    forWhom: ["stan po artroskopii lub rekonstrukcji więzadła", "stan po endoprotezoplastyce", "stan po operacji kręgosłupa"],
    howItWorks: "Na pierwszą wizytę przynieś kartę informacyjną z leczenia. Plan ustalamy na jej podstawie i aktualizujemy po kontrolach lekarskich.",
    image: "servicePostOp",
    confirmed: false,
  },
  {
    slug: "cwiczenia-usprawniajace",
    title: "Ćwiczenia usprawniające",
    short: "Ruchomość, siła i równowaga potrzebne w codziennych czynnościach.",
    description:
      "Ćwiczenia poprawiające ruchomość, siłę i równowagę. Ćwiczymy to, co sprawia trudność na co dzień, na przykład wstawanie z krzesła czy wchodzenie po schodach.",
    forWhom: ["osłabienie po chorobie lub unieruchomieniu", "problemy z równowagą", "powrót do aktywności po przerwie"],
    howItWorks: "Ćwiczenia dobieramy do Twojego poziomu i stopniowo je utrudniamy. Część z nich wykonujesz samodzielnie między wizytami.",
    image: "serviceExercise",
    confirmed: false,
  },
];

export function getService(slug: unknown): Service | undefined {
  return typeof slug === "string" ? SERVICES.find((s) => s.slug === slug) : undefined;
}
