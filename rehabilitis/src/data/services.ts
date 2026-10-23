import type { ImageKey } from "@/config/images";

/**
 * ★ USŁUGI GABINETU
 *
 * Kolejność na liście = kolejność na stronie. Aby usunąć usługę, usuń jej obiekt.
 * `confirmed: false` oznacza, że właściciel jeszcze nie potwierdził, że gabinet ją świadczy –
 * dopóki choć jedna usługa ma `false`, nad listą widnieje informacja, że zakres oferty jest
 * do potwierdzenia. Po weryfikacji ustaw `confirmed: true` (albo usuń usługę).
 *
 * `image` (klucz z config/images.ts) – zdjęcie pokazywane w pasku zdjęć pod listą usług.
 */

export interface Service {
  slug: string;
  title: string;
  summary: string;
  /** Krótkie elementy usługi wyświetlane pod opisem. */
  includes: string[];
  image?: ImageKey;
  confirmed: boolean;
}

export const SERVICES: Service[] = [
  {
    slug: "fizjoterapia-indywidualna",
    title: "Fizjoterapia indywidualna",
    summary:
      "Spotkanie jeden na jeden z fizjoterapeutą. Zaczynamy od konsultacji i oceny funkcjonalnej, a na jej podstawie planujemy terapię odpowiednio do Twoich potrzeb i możliwości.",
    includes: ["Konsultacja", "Ocena funkcjonalna", "Plan terapii"],
    confirmed: false,
  },
  {
    slug: "rehabilitacja-ortopedyczna",
    title: "Rehabilitacja ortopedyczna",
    summary:
      "Pomagamy wrócić do sprawności po urazach i zabiegach. Pracujemy zgodnie z zaleceniami lekarza i w tempie, na które w danym momencie pozwala Twój organizm.",
    includes: ["Rehabilitacja po urazach", "Praca nad zakresem ruchu", "Stopniowanie obciążeń"],
    image: "serviceOrthopedic",
    confirmed: false,
  },
  {
    slug: "terapia-bolu-plecow-i-karku",
    title: "Terapia bólu pleców i karku",
    summary:
      "Pracujemy nad ruchomością kręgosłupa i dolegliwościami w okolicy karku i krzyża. Dostajesz ćwiczenia, które możesz robić w domu.",
    includes: ["Odcinek szyjny i lędźwiowy", "Ruchomość i funkcja", "Ćwiczenia do domu"],
    image: "serviceBack",
    confirmed: false,
  },
  {
    slug: "masaz-leczniczy",
    title: "Masaż leczniczy",
    summary:
      "Masaż dobieramy do Twoich potrzeb po rozmowie i sprawdzeniu przeciwwskazań. Jeśli w Twojej sytuacji masaż nie jest wskazany, zaproponujemy inną formę pracy.",
    includes: ["Wywiad przed zabiegiem", "Dobór techniki", "Wskazania i przeciwwskazania"],
    confirmed: false,
  },
  {
    slug: "rehabilitacja-pooperacyjna",
    title: "Rehabilitacja pooperacyjna",
    summary:
      "Prowadzimy rehabilitację po operacji według zaleceń lekarza prowadzącego. Tempo ćwiczeń dopasowujemy do etapu gojenia.",
    includes: ["Zgodnie z zaleceniami lekarza", "Indywidualny plan", "Kontrola postępów"],
    confirmed: false,
  },
  {
    slug: "cwiczenia-usprawniajace",
    title: "Ćwiczenia usprawniające",
    summary:
      "Ćwiczenia poprawiające ruchomość, siłę i równowagę. Ćwiczymy to, co sprawia trudność na co dzień, na przykład wstawanie z krzesła czy wchodzenie po schodach.",
    includes: ["Ruchomość i siła", "Równowaga", "Codzienne czynności"],
    image: "serviceExercise",
    confirmed: false,
  },
];

export function getService(slug: unknown): Service | undefined {
  return typeof slug === "string" ? SERVICES.find((s) => s.slug === slug) : undefined;
}
