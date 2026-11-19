import "server-only";

import type { Block, Booking, BookingStatus, BookingStore, NewBooking, WriteResult } from "./types";

/**
 * Repozytorium Supabase (PostgREST przez `fetch`, bez dodatkowych zależności).
 * Wymaga migracji `supabase/migrations/0001_bookings.sql` i klucza service_role
 * (używanego WYŁĄCZNIE po stronie serwera).
 */

type Row = Record<string, unknown>;

const toBooking = (r: Row): Booking => ({
  id: String(r.id),
  status: r.status as BookingStatus,
  service: r.service as Booking["service"],
  durationMin: Number(r.duration_min),
  startsAt: new Date(String(r.starts_at)).toISOString(),
  endsAt: new Date(String(r.ends_at)).toISOString(),
  name: String(r.name),
  email: String(r.email),
  phone: String(r.phone ?? ""),
  message: String(r.message ?? ""),
  sound: String(r.sound ?? ""),
  lang: r.lang === "en" ? "en" : "pl",
  createdAt: String(r.created_at),
  updatedAt: String(r.updated_at),
  cancelReason: r.cancel_reason == null ? null : String(r.cancel_reason),
});

const toBlock = (r: Row): Block => ({
  id: String(r.id),
  startsAt: new Date(String(r.starts_at)).toISOString(),
  endsAt: new Date(String(r.ends_at)).toISOString(),
  note: String(r.note ?? ""),
});

class SupabaseError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`Supabase ${status}: ${body.slice(0, 300)}`);
  }
  get isSlotConflict() {
    return this.body.includes("slot_unavailable") || this.body.includes("23P01");
  }
  get isNotFound() {
    return this.body.includes('"P0002"') || this.body.includes("not_found");
  }
}

export class SupabaseStore implements BookingStore {
  constructor(
    private url: string,
    private key: string,
  ) {
    if (!url || !key) throw new Error("Brak SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY.");
  }

  private async request<T>(path: string, init: RequestInit & { prefer?: string } = {}): Promise<T> {
    const res = await fetch(`${this.url}/rest/v1/${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        apikey: this.key,
        Authorization: `Bearer ${this.key}`,
        "Content-Type": "application/json",
        ...(init.prefer ? { Prefer: init.prefer } : {}),
      },
    });
    const text = await res.text();
    if (!res.ok) throw new SupabaseError(res.status, text);
    return (text ? JSON.parse(text) : null) as T;
  }

  async listBusy(from: Date, to: Date, excludeBookingId?: string) {
    const range = `starts_at=lt.${encodeURIComponent(to.toISOString())}&ends_at=gt.${encodeURIComponent(from.toISOString())}`;
    const exclude = excludeBookingId ? `&id=neq.${excludeBookingId}` : "";
    const [bookings, blocks] = await Promise.all([
      this.request<Row[]>(`bookings?select=starts_at,ends_at&status=neq.cancelled&${range}${exclude}`),
      this.request<Row[]>(`booking_blocks?select=starts_at,ends_at&${range}`),
    ]);
    return [...bookings, ...blocks].map((r) => ({ start: Date.parse(String(r.starts_at)), end: Date.parse(String(r.ends_at)) }));
  }

  async create(input: NewBooking): Promise<WriteResult<Booking>> {
    try {
      const row = await this.request<Row>("rpc/create_booking", {
        method: "POST",
        body: JSON.stringify({
          p_service: input.service,
          p_duration_min: input.durationMin,
          p_starts_at: input.startsAt,
          p_ends_at: input.endsAt,
          p_name: input.name,
          p_email: input.email,
          p_phone: input.phone,
          p_message: input.message,
          p_sound: input.sound,
          p_lang: input.lang,
          p_token_hash: input.tokenHash,
        }),
      });
      return { ok: true, value: toBooking(row) };
    } catch (error) {
      if (error instanceof SupabaseError && error.isSlotConflict) return { ok: false, reason: "conflict" };
      throw error;
    }
  }

  private async one(filter: string) {
    const rows = await this.request<Row[]>(`bookings?select=*&${filter}&limit=1`);
    return rows[0] ? toBooking(rows[0]) : null;
  }

  findByTokenHash(tokenHash: string) {
    return this.one(`token_hash=eq.${encodeURIComponent(tokenHash)}`);
  }

  findById(id: string) {
    return this.one(`id=eq.${encodeURIComponent(id)}`);
  }

  async reschedule(id: string, startsAt: string, endsAt: string): Promise<WriteResult<Booking>> {
    try {
      const row = await this.request<Row>("rpc/reschedule_booking", {
        method: "POST",
        body: JSON.stringify({ p_id: id, p_starts_at: startsAt, p_ends_at: endsAt }),
      });
      return { ok: true, value: toBooking(row) };
    } catch (error) {
      if (error instanceof SupabaseError && error.isSlotConflict) return { ok: false, reason: "conflict" };
      if (error instanceof SupabaseError && error.isNotFound) return { ok: false, reason: "not_found" };
      throw error;
    }
  }

  async setStatus(id: string, status: BookingStatus, reason?: string): Promise<WriteResult<Booking>> {
    try {
      const rows = await this.request<Row[]>(`bookings?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        prefer: "return=representation",
        body: JSON.stringify({ status, cancel_reason: status === "cancelled" ? (reason ?? "") : null, updated_at: new Date().toISOString() }),
      });
      return rows[0] ? { ok: true, value: toBooking(rows[0]) } : { ok: false, reason: "not_found" };
    } catch (error) {
      if (error instanceof SupabaseError && error.isSlotConflict) return { ok: false, reason: "conflict" };
      throw error;
    }
  }

  async list(filter: { from?: Date; status?: BookingStatus }) {
    const from = encodeURIComponent((filter.from ?? new Date(0)).toISOString());
    const status = filter.status ? `&status=eq.${filter.status}` : "";
    return (await this.request<Row[]>(`bookings?select=*&ends_at=gt.${from}${status}&order=starts_at.asc&limit=500`)).map(toBooking);
  }

  async listBlocks(from: Date) {
    return (await this.request<Row[]>(`booking_blocks?select=*&ends_at=gt.${encodeURIComponent(from.toISOString())}&order=starts_at.asc`)).map(toBlock);
  }

  async addBlock(startsAt: string, endsAt: string, note: string) {
    const rows = await this.request<Row[]>("booking_blocks", {
      method: "POST",
      prefer: "return=representation",
      body: JSON.stringify({ starts_at: startsAt, ends_at: endsAt, note }),
    });
    return toBlock(rows[0]);
  }

  async removeBlock(id: string) {
    const rows = await this.request<Row[]>(`booking_blocks?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", prefer: "return=representation" });
    return rows.length > 0;
  }
}
