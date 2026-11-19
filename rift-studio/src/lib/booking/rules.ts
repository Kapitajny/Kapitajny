/**
 * ★ Zasady rezerwacji i godziny pracy studia (wartości przykładowe – potwierdź z właścicielem).
 * Wszystkie godziny w strefie Europe/Warsaw.
 */
export const BOOKING_RULES = {
  timeZone: "Europe/Warsaw",
  /** Co ile minut można zacząć sesję. */
  slotStepMinutes: 60,
  /** Najwcześniej tyle godzin od teraz można zarezerwować termin. */
  minLeadHours: 12,
  /** Jak daleko w przód pokazujemy kalendarz. */
  horizonDays: 56,
  /** Przerwa techniczna między sesjami (minuty). */
  bufferMinutes: 0,
  /** Anulowanie i zmiana terminu przez link z e-maila – najpóźniej tyle godzin przed sesją. */
  selfServiceCutoffHours: 24,
} as const;

/** Godziny otwarcia: indeks = dzień tygodnia (0 = niedziela). `null` = zamknięte. */
export const OPENING_HOURS: ({ open: string; close: string } | null)[] = [
  null,
  { open: "10:00", close: "22:00" },
  { open: "10:00", close: "22:00" },
  { open: "10:00", close: "22:00" },
  { open: "10:00", close: "22:00" },
  { open: "10:00", close: "22:00" },
  { open: "11:00", close: "20:00" },
];
