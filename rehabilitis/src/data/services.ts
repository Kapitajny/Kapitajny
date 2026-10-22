import type { ImageKey } from "@/config/images";

/**
 * ★ USŁUGI GABINETU
 *
 * Kolejność na liście = kolejność na stronie. Aby usunąć usługę, usuń jej obiekt.
 * `confirmed: false` oznacza, że właściciel jeszcze nie potwierdził, że gabinet ją świadczy –
 * dopóki choć jedna usługa ma `false`, nad listą widnieje informacja, że zakres oferty jest
 * do potwierdzenia. Po weryfikacji ustaw `confirmed: true` (albo usuń usługę).
 *
 * Wizualizacja: `image` (klucz z config/images.ts) albo `motif` – spokojny detal graficzny.
 */

export type ServiceMotif = "assessment" | "massage" | "recovery";

export interface Service {
  slug: string;
  title: string;
  summary: string;
  /** Krótkie elementy usługi wyświetlane pod opisem. */
  includes: string[];
  image?: ImageKey;
  motif?: ServiceMotif;
  confirmed: boolean;
}

export const SERVICES: Service[] = [
  {
    slug: "fizjoterapia-indywidualna",
    title: "Fizjoterapia indywidualna",
    summary:
      "Spotkanie jeden na jeden z fizjoterapeutą. Zaczynamy od konsultacji i oceny funkcjonalnej, a na jej podstawie planujemy terapię odpowiednio do Twoich potrzeb i możliwości.",
    includes: ["Konsultacja", "Ocena funkcjonalna", "Plan terapii"],
    motif: "assessment",
    confirmed: false,
  },
  {
    slug: "rehabilitacja-ortopedyczna",
    title: "Rehabilitacja ortopedyczna",
    summary:
      "Wsparcie w odzyskiwaniu sprawności po urazach i zabiegach – prowadzone zgodnie z zaleceniami medycznymi oraz z uwzględnieniem tego, na co w danym momencie pozwala Twój organizm.",
    includes: ["Rehabilitacja po urazach", "Praca nad zakresem ruchu", "Stopniowanie obciążeń"],
    image: "serviceOrthopedic",
    confirmed: false,
  },
  {
    slug: "terapia-bolu-plecow-i-karku",
    title: "Terapia bólu pleców i karku",
    summary:
      "Indywidualna praca nad ruchomością, funkcją i dolegliwościami układu mięśniowo-szkieletowego w obrębie kręgosłupa, z ćwiczeniami, które możesz kontynuować w domu.",
    includes: ["Odcinek szyjny i lędźwiowy", "Ruchomość i funkcja", "Ćwiczenia do domu"],
    image: "serviceBack",
    confirmed: false,
  },
  {
    slug: "masaz-leczniczy",
    title: "Masaż leczniczy",
    summary:
      "Masaż dobierany do potrzeb pacjenta – zawsze po rozmowie i uwzględnieniu wskazań oraz przeciwwskazań. Jeśli masaż nie jest w danej sytuacji wskazany, zaproponujemy inną formę pracy.",
    includes: ["Wywiad przed zabiegiem", "Dobór techniki", "Wskazania i przeciwwskazania"],
    motif: "massage",
    confirmed: false,
  },
  {
    slug: "rehabilitacja-pooperacyjna",
    title: "Rehabilitacja pooperacyjna",
    summary:
      "Wsparcie procesu powrotu do sprawności po operacji – według zaleceń lekarza prowadzącego i indywidualnego planu rehabilitacji, z tempem dopasowanym do etapu gojenia.",
    includes: ["Zgodnie z zaleceniami lekarza", "Indywidualny plan", "Kontrola postępów"],
    motif: "recovery",
    confirmed: false,
  },
  {
    slug: "cwiczenia-usprawniajace",
    title: "Ćwiczenia usprawniające",
    summary:
      "Ćwiczenia ukierunkowane na poprawę ruchomości, siły, równowagi i swobody w codziennych czynnościach – od wstawania z krzesła po wchodzenie po schodach.",
    includes: ["Ruchomość i siła", "Równowaga", "Codzienne czynności"],
    image: "serviceExercise",
    confirmed: false,
  },
];

export function getService(slug: unknown): Service | undefined {
  return typeof slug === "string" ? SERVICES.find((s) => s.slug === slug) : undefined;
}
