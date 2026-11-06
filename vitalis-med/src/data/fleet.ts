export type AmbulanceType = "T" | "S" | "P";

export interface FleetCategory {
  type: AmbulanceType;
  name: string;
  /** ★ Liczba pojazdów – założenie projektu demonstracyjnego. */
  count: number;
  summary: string;
  description: string;
  equipment: string[];
  crew: string;
  image: { src: string; alt: string; width: number; height: number };
}

export const fleet: FleetCategory[] = [
  {
    type: "T",
    name: "Ambulanse typu T",
    count: 4,
    summary: "Transport sanitarny pacjentów, przewozy planowe oraz transport niewymagający specjalistycznego zespołu ratownictwa.",
    description:
      "Pojazdy transportu sanitarnego przeznaczone do planowych przewozów pacjentów: na badania, zabiegi, wizyty, między placówkami oraz do domu po hospitalizacji.",
    equipment: ["Nosze główne z systemem mocowań", "Krzesełko kardiologiczne", "Tlenoterapia", "Zestaw pierwszej pomocy i AED"],
    crew: "Zespół transportowy przeszkolony w zakresie kwalifikowanej pierwszej pomocy lub z udziałem ratownika medycznego – zależnie od zlecenia.",
    image: { src: "/images/flota/ambulans-typ-t.webp", alt: "Biały ambulans transportu sanitarnego z oznaczeniem T", width: 640, height: 480 },
  },
  {
    type: "S",
    name: "Ambulanse typu S",
    count: 5,
    summary: "Ambulanse specjalistyczne z wyposażeniem do zaawansowanych medycznych czynności ratunkowych, zgodnie z właściwymi wymaganiami.",
    description:
      "Pojazdy dla zespołów specjalistycznych, w których skład wchodzi lekarz systemu. Wykorzystywane przy transporcie pacjentów w stanie wymagającym zaawansowanych czynności ratunkowych.",
    equipment: ["Respirator transportowy", "Defibrylator z monitorem i stymulacją", "Pompy infuzyjne", "Ssak elektryczny i zestaw do udrażniania dróg oddechowych"],
    crew: "Zespół specjalistyczny: co najmniej trzy osoby uprawnione do wykonywania medycznych czynności ratunkowych, w tym lekarz systemu.",
    image: { src: "/images/flota/flota-sprinter-s.webp", alt: "Żółty ambulans specjalistyczny Mercedes-Benz Sprinter z oznaczeniem S", width: 554, height: 554 },
  },
  {
    type: "P",
    name: "Ambulanse typu P",
    count: 11,
    summary: "Ambulanse podstawowe przeznaczone do realizacji świadczeń ratownictwa medycznego w zakresie odpowiednim dla zespołów podstawowych.",
    description:
      "Najliczniejsza grupa naszej floty. Pojazdy dla zespołów podstawowych, wyposażone zgodnie z wymaganiami dla ambulansów ratunkowych.",
    equipment: ["Defibrylator z monitorem", "Urządzenie do mechanicznej kompresji klatki piersiowej", "Tlenoterapia i zestaw do wentylacji", "Deska ortopedyczna, kołnierze i materac próżniowy"],
    crew: "Zespół podstawowy: co najmniej dwie osoby uprawnione do wykonywania medycznych czynności ratunkowych, w tym ratownik medyczny lub pielęgniarka systemu.",
    image: { src: "/images/flota/flota-crafter.webp", alt: "Ambulans Volkswagen Crafter z włączonymi sygnałami świetlnymi przed bazą", width: 678, height: 452 },
  },
];

export const fleetTotal = fleet.reduce((sum, c) => sum + c.count, 0);

/** Galeria pojazdów na podstronie „Nasza flota”. Zastąp zdjęciami własnych pojazdów. */
export const fleetGallery = [
  { src: "/images/flota/baner-ambulans.webp", alt: "Ambulans Fiat Ducato w barwach ratownictwa medycznego", width: 677, height: 453 },
  { src: "/images/flota/flota-master-s.webp", alt: "Ambulans Renault Master z oznaczeniem S", width: 300, height: 200 },
];
