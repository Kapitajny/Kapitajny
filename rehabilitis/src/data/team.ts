/**
 * ★ FIZJOTERAPEUTA / ZESPÓŁ
 *
 * Wpisz wyłącznie potwierdzone informacje. Pola `null` są wyświetlane jako „do uzupełnienia”.
 * Zdjęcie: wgraj plik `public/images/rehab/fizjoterapeuta-portret.jpg` (patrz config/images.ts).
 * Kolejne osoby dodasz, kopiując obiekt (dla każdej osoby dodaj osobny klucz zdjęcia).
 */

export interface TeamMember {
  name: string | null;
  role: string;
  education: string | null;
  /** Kwalifikacje, specjalizacje, ukończone kursy – tylko potwierdzone. */
  qualifications: string[] | null;
  experience: string | null;
  /** Numer prawa wykonywania zawodu fizjoterapeuty (PWZFz), jeśli ma być publikowany. */
  licenseNumber: string | null;
}

export const TEAM: TeamMember[] = [
  {
    name: null,
    role: "Fizjoterapeuta",
    education: null,
    qualifications: null,
    experience: null,
    licenseNumber: null,
  },
];
