import type { ImageKey } from "@/config/images";
import type { CategorySlug } from "./treatments";

/**
 * Zespół pokazany na stronie. To osoby fikcyjne na potrzeby konceptu – imiona, role i biogramy
 * trzeba zastąpić danymi prawdziwego zespołu, a ewentualne kwalifikacje dodać wyłącznie
 * na podstawie dokumentów dostarczonych przez pracowników.
 */

export interface Specialist {
  slug: string;
  name: string;
  role: string;
  image: ImageKey;
  /** Krótka linijka na stronę główną. */
  short: string;
  bio: string[];
  areas: CategorySlug[];
  /** Własnymi słowami – zdanie o tym, jak pracuje. */
  quote: string;
}

export const specialists: Specialist[] = [
  {
    slug: "helena-mroz",
    name: "Helena Mróz",
    role: "Lekarz medycyny estetycznej",
    image: "specialistPhysician",
    short: "Prowadzi każdy zabieg medycyny estetycznej – od pierwszego wywiadu po wizytę kontrolną.",
    bio: [
      "Helena wykonuje wszystkie zabiegi medycyny estetycznej w VÉRA. Każdą nową współpracę zaczyna od wywiadu medycznego i szczerej rozmowy o oczekiwaniach.",
      "Pracuje stopniowo: małe zmiany, oceniane wspólnie, zamiast jednej dużej.",
    ],
    areas: ["medycyna-estetyczna", "konsultacja-skory"],
    quote: "Najlepszy efekt to taki, którego znajomi nie potrafią nazwać – mówią po prostu, że dobrze wyglądasz.",
  },
  {
    slug: "julia-sowa",
    name: "Julia Sowa",
    role: "Kosmetolog",
    image: "specialistCosmetologist",
    short: "Projektuje nasze zabiegi na twarz i rytuały dłoni oraz plany pielęgnacji domowej.",
    bio: [
      "Julia odpowiada w studiu za kosmetologię profesjonalną: zabiegi na twarz, masaż i pielęgnację dłoni.",
      "Uważa, że to, co dzieje się w domu między wizytami, jest równie ważne jak sama wizyta – dlatego jej zalecenia są na tyle krótkie, by dało się ich trzymać.",
    ],
    areas: ["kosmetologia", "zabiegi-na-skore"],
    quote: "Trzy dobre produkty używane codziennie dają więcej niż dziesięć używanych od czasu do czasu.",
  },
  {
    slug: "adam-lis",
    name: "Adam Lis",
    role: "Specjalista ds. skóry",
    image: "specialistSkin",
    short: "Prowadzi konsultacje skóry i planuje serie peelingów oraz mikroigłowania.",
    bio: [
      "Większość nowych klientów najpierw poznaje Adama – podczas konsultacji skóry. Planuje serie peelingów i mikroigłowania i dopasowuje je do pór roku.",
      "To on najczęściej proponuje, żeby poczekać albo zrobić mniej.",
    ],
    areas: ["konsultacja-skory", "zabiegi-na-skore"],
    quote: "Plan jest dobry tylko wtedy, gdy ma sens i w lutym, i w lipcu.",
  },
];
