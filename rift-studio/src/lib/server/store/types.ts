import type { Locale } from "@/i18n/config";
import type { ServiceId } from "@/data/services";
import type { Interval } from "@/lib/booking/slots";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  status: BookingStatus;
  service: ServiceId;
  durationMin: number;
  /** ISO 8601 (UTC) */
  startsAt: string;
  endsAt: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  sound: string;
  lang: Locale;
  createdAt: string;
  updatedAt: string;
  cancelReason: string | null;
}

export type NewBooking = Omit<Booking, "id" | "status" | "createdAt" | "updatedAt" | "cancelReason"> & { tokenHash: string };

export interface Block {
  id: string;
  startsAt: string;
  endsAt: string;
  note: string;
}

export type WriteResult<T> = { ok: true; value: T } | { ok: false; reason: "conflict" | "not_found" };

/**
 * Repozytorium rezerwacji. Każda implementacja MUSI atomowo odrzucać nakładające się
 * aktywne rezerwacje (pending/confirmed) i blokady – to jest ochrona przed podwójną rezerwacją.
 */
export interface BookingStore {
  /** Zajęte przedziały (aktywne rezerwacje + blokady) przecinające [from, to). */
  listBusy(from: Date, to: Date, excludeBookingId?: string): Promise<Interval[]>;
  create(input: NewBooking): Promise<WriteResult<Booking>>;
  findByTokenHash(tokenHash: string): Promise<Booking | null>;
  findById(id: string): Promise<Booking | null>;
  /** Zmiana terminu – status wraca do `pending` (studio potwierdza ponownie). */
  reschedule(id: string, startsAt: string, endsAt: string): Promise<WriteResult<Booking>>;
  setStatus(id: string, status: BookingStatus, reason?: string): Promise<WriteResult<Booking>>;
  list(filter: { from?: Date; status?: BookingStatus }): Promise<Booking[]>;
  listBlocks(from: Date): Promise<Block[]>;
  addBlock(startsAt: string, endsAt: string, note: string): Promise<Block>;
  removeBlock(id: string): Promise<boolean>;
}
