import type { Location } from "@/data/locations";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Aktualny dzień i minuta w strefie Europe/Warsaw (niezależnie od strefy urządzenia). */
export function warsawNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Warsaw",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: get("weekday"), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export interface OpenState {
  open: boolean;
  label: string;
}

/** Status lokalu: „Otwarte do 22:00” albo „Zamknięte, otwieramy jutro o 11:00”. */
export function openState(loc: Location, date = new Date()): OpenState {
  const { day, minutes } = warsawNow(date);
  const today = loc.hours.find((h) => h.days.includes(day));
  if (today && minutes >= toMin(today.opens) && minutes < toMin(today.closes)) {
    return { open: true, label: `Otwarte do ${today.closes}` };
  }
  if (today && minutes < toMin(today.opens)) {
    return { open: false, label: `Zamknięte, otwieramy dziś o ${today.opens}` };
  }
  const next = DAYS[(DAYS.indexOf(day) + 1) % 7];
  const tomorrow = loc.hours.find((h) => h.days.includes(next));
  return { open: false, label: tomorrow ? `Zamknięte, otwieramy jutro o ${tomorrow.opens}` : "Zamknięte" };
}
