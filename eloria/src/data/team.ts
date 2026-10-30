import type { ImageKey } from "@/config/images";

/**
 * ZESPÓŁ – OSOBY FIKCYJNE
 * Imiona, role i opisy są przykładowe (projekt demonstracyjny). Przed publikacją podmień je na dane
 * prawdziwego zespołu. Nie podajemy numerów prawa wykonywania zawodu ani certyfikatów,
 * których nie da się zweryfikować – po uzupełnieniu warto dodać numer PWZ lekarza.
 */

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  image: ImageKey;
  /** Krótki opis – na stronie głównej. */
  short: string;
  bio: string[];
  focus: string[];
}

export const team: TeamMember[] = [
  {
    slug: "natalia-orlowska",
    name: "lek. Natalia Orłowska",
    role: "Lekarz, kierownik medyczny",
    image: "teamNatalia",
    short: "Prowadzi konsultacje i zabiegi lekarskie. Odpowiada za standardy medyczne kliniki.",
    bio: [
      "Natalia prowadzi konsultacje i zabiegi z zakresu medycyny estetycznej. W pracy z pacjentkami najwięcej uwagi poświęca rozmowie poprzedzającej zabieg – temu, co jest dla nich naturalne i ważne.",
      "Odpowiada za procedury medyczne w ÉLORIA: kwalifikację do zabiegów, dokumentację i współpracę z kosmetologami przy terapiach łączonych.",
    ],
    focus: ["konsultacje medycyny estetycznej", "zabiegi na twarz", "kondycja skóry"],
  },
  {
    slug: "julia-sadowska",
    name: "Julia Sadowska",
    role: "Kosmetolog",
    image: "teamJulia",
    short: "Oczyszczanie, zabiegi pielęgnacyjne i plany pielęgnacji, które da się utrzymać na co dzień.",
    bio: [
      "Julia zajmuje się zabiegami pielęgnacyjnymi i oczyszczaniem skóry. Lubi porządkować domową pielęgnację tak, by była prosta i konsekwentna.",
      "Przygotowuje indywidualne plany pielęgnacji i prowadzi pacjentki w seriach zabiegów kosmetologicznych.",
    ],
    focus: ["oczyszczanie skóry", "zabiegi pielęgnacyjne", "plany pielęgnacji"],
  },
  {
    slug: "marta-lis",
    name: "Marta Lis",
    role: "Kosmetolog, terapie skóry",
    image: "teamMarta",
    short: "Skóra problematyczna i wrażliwa. Pracuje etapami, w kontakcie z lekarzem.",
    bio: [
      "Marta specjalizuje się w pracy ze skórą problematyczną, wrażliwą i osłabioną po zabiegach. Terapie planuje etapami i dokumentuje postępy.",
      "Gdy zmiany skórne wymagają diagnostyki, kieruje pacjentki na konsultację lekarską i współpracuje z lekarzem przy dalszym planie.",
    ],
    focus: ["skóra problematyczna", "zabiegi regeneracyjne", "terapie kosmetologiczne"],
  },
  {
    slug: "ewa-kaminska",
    name: "Ewa Kamińska",
    role: "Koordynatorka pacjentek",
    image: "teamEwa",
    short: "Pierwszy kontakt z kliniką: terminy, przygotowanie do wizyty, odpowiedzi na pytania.",
    bio: [
      "Ewa odpowiada za kontakt z pacjentkami – od pierwszego telefonu, przez dobór terminu, po przypomnienie o przygotowaniu do zabiegu.",
      "Jeśli nie wiesz, od której konsultacji zacząć, Ewa pomoże wybrać odpowiednią osobę z zespołu.",
    ],
    focus: ["umawianie wizyt", "przygotowanie do konsultacji", "kontakt po zabiegu"],
  },
];
