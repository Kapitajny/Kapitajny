import "server-only";

import { getService, type ServiceId } from "@/data/services";
import { BOOKING_RULES } from "@/lib/booking/rules";
import { buildAvailability, isSlotBookable, slotInterval, type Day } from "@/lib/booking/slots";
import { addDays, utcToZoned, zonedToUtc } from "@/lib/booking/time";
import type { BookingInput } from "@/lib/booking/validation";
import { CLIENT_CANCEL_REASON, notifyClient, notifyStudio } from "./emails";
import { createManageToken, hashToken, isTokenShape } from "./security";
import { getStore } from "./store";
import type { Booking } from "./store/types";

/** Logika rezerwacji: jedyne miejsce, które łączy reguły terminów, bazę i powiadomienia. */

/** Powiadomienia nigdy nie unieważniają zapisanej już zmiany – błąd wysyłki tylko logujemy. */
async function settle(tasks: Promise<unknown>[]) {
  for (const r of await Promise.allSettled(tasks)) if (r.status === "rejected") console.error("[notify]", r.reason);
}

export async function getAvailability(service: ServiceId, durationMin: number, from: string, days: number, opts: { excludeBookingId?: string; now?: Date } = {}): Promise<Day[]> {
  const now = opts.now ?? new Date();
  const today = utcToZoned(now).date;
  const start = from < today ? today : from;
  const span = Math.min(days, BOOKING_RULES.horizonDays + 1);
  const busy = await getStore().listBusy(zonedToUtc(start, 0), zonedToUtc(addDays(start, span), 0), opts.excludeBookingId);
  return buildAvailability(start, span, durationMin, busy, now);
}

/** Najbliższy wolny termin – pokazywany w Hero. */
export async function getNextFreeSlot(service: ServiceId = "vocal", now = new Date()) {
  const s = getService(service);
  const days = await getAvailability(service, s.defaultDuration, utcToZoned(now).date, 21, { now });
  for (const day of days) {
    const slot = day.slots.find((x) => x.available);
    if (slot) return { date: day.date, time: slot.time, durationMin: s.defaultDuration };
  }
  return null;
}

export type CreateResult = { ok: true; booking: Booking; manageToken: string } | { ok: false; reason: "slot_unavailable" };

export async function createBooking(input: BookingInput, now = new Date()): Promise<CreateResult> {
  const interval = slotInterval(input.date, input.time, input.durationMin);
  const store = getStore();
  // 1) czy termin w ogóle jest dozwolony (godziny otwarcia, wyprzedzenie, horyzont)?
  const busy = await store.listBusy(new Date(interval.start), new Date(interval.end));
  if (!isSlotBookable(input.date, input.time, input.durationMin, busy, now)) return { ok: false, reason: "slot_unavailable" };

  // 2) zapis atomowy – baza odrzuci kolizję, nawet jeśli ktoś był szybszy o milisekundę
  const { token, hash } = createManageToken();
  const result = await store.create({
    service: input.service,
    durationMin: input.durationMin,
    startsAt: new Date(interval.start).toISOString(),
    endsAt: new Date(interval.end).toISOString(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    message: input.message,
    sound: input.sound,
    lang: input.lang,
    tokenHash: hash,
  });
  if (!result.ok) return { ok: false, reason: "slot_unavailable" };

  await settle([notifyClient("created", result.value, token), notifyStudio("created", result.value)]);
  return { ok: true, booking: result.value, manageToken: token };
}

export async function findByToken(token: string): Promise<Booking | null> {
  if (!isTokenShape(token)) return null;
  return getStore().findByTokenHash(hashToken(token));
}

/** Czy klient może jeszcze sam zmienić / anulować rezerwację? */
export const canSelfManage = (b: Booking, now = new Date()) =>
  b.status !== "cancelled" && Date.parse(b.startsAt) - now.getTime() >= BOOKING_RULES.selfServiceCutoffHours * 3600_000;

export type ManageResult = { ok: true; booking: Booking } | { ok: false; reason: "not_found" | "too_late" | "slot_unavailable" };

export async function cancelByToken(token: string, now = new Date()): Promise<ManageResult> {
  const booking = await findByToken(token);
  if (!booking || booking.status === "cancelled") return { ok: false, reason: "not_found" };
  if (!canSelfManage(booking, now)) return { ok: false, reason: "too_late" };
  const result = await getStore().setStatus(booking.id, "cancelled", CLIENT_CANCEL_REASON);
  if (!result.ok) return { ok: false, reason: "not_found" };
  await settle([notifyClient("cancelled", result.value), notifyStudio("cancelled_by_client", result.value)]);
  return { ok: true, booking: result.value };
}

export async function rescheduleByToken(token: string, date: string, time: string, now = new Date()): Promise<ManageResult> {
  const booking = await findByToken(token);
  if (!booking || booking.status === "cancelled") return { ok: false, reason: "not_found" };
  if (!canSelfManage(booking, now)) return { ok: false, reason: "too_late" };

  const interval = slotInterval(date, time, booking.durationMin);
  const store = getStore();
  const busy = await store.listBusy(new Date(interval.start), new Date(interval.end), booking.id);
  if (!isSlotBookable(date, time, booking.durationMin, busy, now)) return { ok: false, reason: "slot_unavailable" };

  const result = await store.reschedule(booking.id, new Date(interval.start).toISOString(), new Date(interval.end).toISOString());
  if (!result.ok) return { ok: false, reason: result.reason === "conflict" ? "slot_unavailable" : "not_found" };
  await settle([notifyClient("rescheduled", result.value, token), notifyStudio("rescheduled_by_client", result.value)]);
  return { ok: true, booking: result.value };
}

/* ─────────── panel administracyjny ─────────── */

export async function adminSetStatus(id: string, action: "confirm" | "cancel", reason = "") {
  const store = getStore();
  const result = await store.setStatus(id, action === "confirm" ? "confirmed" : "cancelled", reason.slice(0, 300));
  if (result.ok) await settle([notifyClient(action === "confirm" ? "confirmed" : "cancelled", result.value)]);
  return result;
}
