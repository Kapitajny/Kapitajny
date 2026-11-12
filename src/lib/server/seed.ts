import "server-only";

import type { DatabaseSync } from "node:sqlite";

/**
 * Dane startowe, wstawiane tylko do pustej bazy.
 *
 * Flota: modele rozpoznane na zdjęciach dostarczonych przez właściciela. Są oznaczone
 * `needs_review = 1` – parametry, kaucje i wymagane uprawnienia celowo NIE są wpisane.
 * Ceny: właściciel podał cenę wynajmu na całą dobę (24 h) – 1500 zł brutto. Pozostałe czasy
 * uzupełnia administrator w panelu (/panel → Ceny i kaucje). Wszystkie ceny są cenami brutto.
 *
 * Godziny otwarcia i ustawienia rezerwacji to wartości przykładowe do potwierdzenia w panelu.
 */

const FLEET = [
  { id: "yamaha-gp1800r", manufacturer: "Yamaha", model: "GP1800R", image: "/images/kilwater/yamaha-gp1800r-brzeg.jpg", alt: "Niebiesko-biały skuter Yamaha GP1800R zacumowany na płytkiej wodzie przy brzegu" },
  { id: "yamaha-fx", manufacturer: "Yamaha", model: "FX", image: "/images/kilwater/yamaha-fx.jpg", alt: "Skuter Yamaha FX w ślizgu, za nim fala rozbryzgu" },
  { id: "yamaha-vx", manufacturer: "Yamaha", model: "VX", image: "/images/kilwater/yamaha-vx.jpg", alt: "Kierowca na biało-niebieskim skuterze Yamaha VX na zielonej wodzie" },
  { id: "sea-doo-spark", manufacturer: "Sea-Doo", model: "Spark", image: "/images/kilwater/sea-doo-spark.jpg", alt: "Kierowca w kamizelce na turkusowym skuterze Sea-Doo Spark w zakręcie" },
];

/** Ceny startowe w groszach brutto, według czasu wynajmu w minutach. */
export const SEED_PRICES: Record<number, number> = { 1440: 150_000 };

export const DEFAULT_SETTINGS: Record<string, string> = {
  prep_minutes: "15",
  lead_minutes: "60",
  slot_step_minutes: "30",
  horizon_days: "120",
  cancel_free_hours: "24",
  no_license_mode: "hidden",
  instructor_note: "",
  extra_fees: "",
  deposit_rules: "",
  rental_rules: "",
  contact_phone: "",
  contact_email: "",
  parking_info: "",
  min_age: "",
  hours_confirmed: "0",
};

export function seedDatabase(db: DatabaseSync): void {
  const insertSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) insertSetting.run(key, value);

  const hours = db.prepare("SELECT COUNT(*) AS n FROM opening_hours").get() as { n: number };
  if (hours.n === 0) {
    const insert = db.prepare("INSERT INTO opening_hours (weekday, open, close) VALUES (?, ?, ?)");
    for (let d = 0; d < 7; d++) insert.run(d, "10:00", "20:00");
  }

  const fleet = db.prepare("SELECT COUNT(*) AS n FROM jetskis").get() as { n: number };
  if (fleet.n === 0 && process.env.SEED_FLEET !== "false") {
    const now = Date.now();
    const insert = db.prepare(
      `INSERT INTO jetskis (id, manufacturer, model, name, image, image_alt, license, active, needs_review, sort, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'unknown', 1, 1, ?, ?, ?)`,
    );
    const price = db.prepare("INSERT INTO prices (jetski_id, duration_min, price_gr) VALUES (?, ?, ?)");
    FLEET.forEach((j, i) => {
      insert.run(j.id, j.manufacturer, j.model, `${j.manufacturer} ${j.model}`, j.image, j.alt, i, now, now);
      for (const [duration, gr] of Object.entries(SEED_PRICES)) price.run(j.id, Number(duration), gr);
    });
  }
}
