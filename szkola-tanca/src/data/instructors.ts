import type { PhotoKey } from "@/config/photos";

/**
 * Instruktorzy – POSTACIE FIKCYJNE na potrzeby projektu demonstracyjnego.
 * Imiona, doświadczenie i opisy należy zastąpić prawdziwymi danymi zespołu.
 */
export interface Instructor {
  id: string;
  name: string;
  specialization: string;
  styleIds: string[];
  experience: string;
  approach: string;
  photo: PhotoKey;
}

export const INSTRUCTORS: Instructor[] = [
  {
    id: "hana",
    name: "Hana Morawska",
    specialization: "Taniec współczesny · balet dla dorosłych",
    styleIds: ["wspolczesny", "balet"],
    experience:
      "Kilkanaście lat na scenie i w pracy z grupami dorosłych. Łączy technikę klasyczną z improwizacją i pracą w parterze.",
    approach: "Najpierw oddech i ciężar ciała, potem kroki. Technika przychodzi, kiedy przestajemy się spinać.",
    photo: "instructorHana",
  },
  {
    id: "daniel",
    name: "Daniel Asante",
    specialization: "Hip-hop · choreografia",
    styleIds: ["hip-hop"],
    experience: "Tańczy od nastoletnich lat, prowadzi grupy od podstawowych po zaawansowane i przygotowuje układy na pokazy studia.",
    approach: "Każdy ma swój groove. Moim zadaniem jest pomóc go znaleźć, a nie przerobić Cię na kopię kogoś innego.",
    photo: "instructorDaniel",
  },
  {
    id: "kai",
    name: "Kai Nowicki",
    specialization: "Pierwsze kroki · hip-hop od podstaw",
    styleIds: ["pierwsze-kroki", "hip-hop"],
    experience: "Specjalizuje się w pracy z osobami, które dopiero zaczynają. Prowadzi zajęcia „Pierwsze kroki” i grupy hip-hopu od podstaw.",
    approach: "Pomyłka to część nauki, nie powód do wstydu. Powtarzamy tyle razy, ile trzeba – i śmiejemy się po drodze.",
    photo: "instructorKai",
  },
  {
    id: "lena",
    name: "Lena Sobczak",
    specialization: "High heels · pierwsze kroki",
    styleIds: ["high-heels", "pierwsze-kroki"],
    experience: "Uczy choreografii na obcasach i zajęć dla początkujących. Zwraca szczególną uwagę na bezpieczną technikę i stabilność.",
    approach: "Pewność siebie to umiejętność, którą da się wytrenować. Zaczynamy od stabilnego kroku, efekt przychodzi sam.",
    photo: "instructorLena",
  },
];

export function getInstructor(id: string): Instructor | undefined {
  return INSTRUCTORS.find((instructor) => instructor.id === id);
}
