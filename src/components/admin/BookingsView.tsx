"use client";

import { useCallback, useEffect, useState } from "react";
import { BOOKING_STATUSES, durationLabel, formatPrice, STATUS_LABELS, type BookingStatus } from "@/lib/rental";
import { formatDateTime, formatTime, fromLocal, toLocal } from "@/lib/time";
import { STATUS_TONE, type AdminBooking } from "./types";
import { Notice, PanelHeader, Pill, useApi, useFlash } from "./ui";

type Range = "upcoming" | "past" | "all";

export function BookingsView() {
  const api = useApi();
  const [range, setRange] = useState<Range>("upcoming");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState<AdminBooking[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [flash, show] = useFlash();

  const load = useCallback(async () => {
    const todayStart = fromLocal(toLocal(Date.now()).date, 0);
    const params = new URLSearchParams();
    if (range === "upcoming") params.set("from", String(todayStart));
    if (range === "past") params.set("to", String(todayStart));
    if (status) params.set("status", status);
    if (query.trim()) params.set("q", query.trim());
    const r = await api<{ bookings: AdminBooking[] }>(`/api/admin/bookings?${params}`);
    if (r.data) setBookings(range === "past" ? [...r.data.bookings].reverse() : r.data.bookings);
  }, [api, range, status, query]);

  useEffect(() => {
    const t = window.setTimeout(load, 200);
    return () => window.clearTimeout(t);
  }, [load]);

  async function patch(id: string, body: { status?: BookingStatus; adminNote?: string }) {
    const r = await api<{ booking: AdminBooking }>(`/api/admin/bookings/${id}`, { method: "PATCH", json: body });
    if (r.data) {
      setBookings((list) => list?.map((b) => (b.id === id ? r.data!.booking : b)) ?? null);
      show("success", body.status ? `Status zmieniony na „${STATUS_LABELS[body.status]}”.` : "Notatka zapisana.");
    } else show("error", r.error?.message ?? "Nie udało się zapisać.");
  }

  return (
    <div>
      <PanelHeader title="Rezerwacje" description="Zmieniaj statusy, dodawaj notatki i kontaktuj się z klientami." />
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div role="group" aria-label="Zakres" className="flex">
          {(
            [
              ["upcoming", "Nadchodzące"],
              ["past", "Minione"],
              ["all", "Wszystkie"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" aria-pressed={range === id} onClick={() => setRange(id)} className={`min-h-11 px-4 font-semibold ${range === id ? "bg-graphite text-white" : "bg-white shadow-[inset_0_0_0_1px_var(--color-control)]"}`}>
              {label}
            </button>
          ))}
        </div>
        <div>
          <label htmlFor="bk-status" className="sr-only">
            Status
          </label>
          <select id="bk-status" value={status} onChange={(e) => setStatus(e.target.value)} className="field min-h-11 w-auto py-2">
            <option value="">Wszystkie statusy</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-56 flex-1">
          <label htmlFor="bk-q" className="sr-only">
            Szukaj
          </label>
          <input id="bk-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Numer, nazwisko, e-mail lub telefon" className="field min-h-11 py-2" />
        </div>
      </div>
      {flash && <div className="mb-4">{flash}</div>}
      {!bookings ? (
        <p className="text-muted">Ładowanie…</p>
      ) : bookings.length === 0 ? (
        <Notice>Brak rezerwacji dla wybranych filtrów.</Notice>
      ) : (
        <ul className="grid gap-2">
          {bookings.map((b) => (
            <li key={b.id} className="bg-white">
              <div className="grid gap-3 p-4 md:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)_12rem] md:items-center">
                <div>
                  <p className="tabular font-semibold">{toLocal(b.start).date.split("-").reverse().join(".")}</p>
                  <p className="tabular text-muted">
                    {formatTime(b.start)}–{formatTime(b.end)} ({durationLabel(b.duration)})
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{b.jetskiName}</p>
                  <p className="tabular text-sm text-muted">
                    {b.number} · {formatPrice(b.priceGr)} · kaucja {formatPrice(b.depositGr)}
                  </p>
                </div>
                <div className="min-w-0 text-sm">
                  <p className="font-semibold">{b.customerName ?? "Dane klienta usunięte"}</p>
                  {b.customerPhone && (
                    <a className="link" href={`tel:${b.customerPhone}`}>
                      {b.customerPhone}
                    </a>
                  )}
                  {b.customerEmail && (
                    <a className="link ml-3 break-all" href={`mailto:${b.customerEmail}`}>
                      {b.customerEmail}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 md:justify-end">
                  <label htmlFor={`st-${b.id}`} className="sr-only">
                    Status rezerwacji {b.number}
                  </label>
                  <select id={`st-${b.id}`} value={b.status} onChange={(e) => patch(b.id, { status: e.target.value as BookingStatus })} className="field min-h-10 w-auto py-1.5 text-[0.95rem]">
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <button type="button" aria-expanded={open === b.id} onClick={() => setOpen(open === b.id ? null : b.id)} className="min-h-10 px-2 font-semibold text-turq-ink">
                    {open === b.id ? "Zwiń" : "Więcej"}
                  </button>
                </div>
              </div>
              {open === b.id && (
                <div className="grid gap-4 border-t border-line p-4 md:grid-cols-2">
                  <div className="text-sm">
                    <p>
                      <Pill tone={STATUS_TONE[b.status]}>{STATUS_LABELS[b.status]}</Pill>
                    </p>
                    <p className="mt-2 text-muted">Utworzona: {formatDateTime(b.createdAt)}</p>
                    {b.cancelledBy && <p className="text-muted">Anulował(a): {b.cancelledBy === "customer" ? "klient" : "obsługa"}</p>}
                    <p className="mt-2 font-semibold">Uwagi klienta</p>
                    <p className="whitespace-pre-line text-muted">{b.customerNote || "—"}</p>
                  </div>
                  <NoteEditor initial={b.adminNote ?? ""} onSave={(v) => patch(b.id, { adminNote: v })} id={b.id} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NoteEditor({ id, initial, onSave }: { id: string; initial: string; onSave: (v: string) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <div>
      <label htmlFor={`note-${id}`} className="field-label">
        Notatka obsługi (widoczna tylko w panelu)
      </label>
      <textarea id={`note-${id}`} rows={3} value={value} onChange={(e) => setValue(e.target.value)} className="field" />
      <button type="button" className="btn btn-sm mt-2" onClick={() => onSave(value)} disabled={value === initial}>
        Zapisz notatkę
      </button>
    </div>
  );
}
