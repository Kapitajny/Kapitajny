"use client";

import { useToday } from "@/lib/use-today";
import { useEffect, useState } from "react";
import { jetskiTitle, STATUS_LABELS, type Jetski } from "@/lib/rental";
import { addDays, formatDateLong, formatTime, fromLocal } from "@/lib/time";
import type { AdminBooking, Block, Settings } from "./types";
import { PanelHeader, useApi } from "./ui";

const START_H = 7;
const END_H = 23;
const SPAN = (END_H - START_H) * 60;

/** Oś dnia: wiersz na każdy skuter, rezerwacje, bufory przygotowania i blokady. */
export function CalendarView({ jetskis }: { jetskis: Jetski[] }) {
  const api = useApi();
  const today = useToday();
  const [date, setDate] = useState(today);
  const [data, setData] = useState<{ date: string; bookings: AdminBooking[]; blocks: Block[] } | null>(null);
  const [prep, setPrep] = useState(15);

  useEffect(() => {
    const from = fromLocal(date, 0);
    const to = fromLocal(addDays(date, 1), 0);
    void Promise.all([api<{ bookings: AdminBooking[] }>(`/api/admin/bookings?from=${from}&to=${to}`), api<{ blocks: Block[] }>("/api/admin/blocks")]).then(([b, k]) => {
      if (b.data && k.data) setData({ date, bookings: b.data.bookings.filter((x) => x.status === "pending" || x.status === "confirmed"), blocks: k.data.blocks });
    });
  }, [api, date]);
  useEffect(() => {
    void api<{ settings: Settings }>("/api/admin/settings").then((r) => r.data && setPrep(Number(r.data.settings.prep_minutes) || 0));
  }, [api]);

  const dayStart = fromLocal(date, START_H * 60);
  const pos = (ms: number) => Math.min(100, Math.max(0, ((ms - dayStart) / 60_000 / SPAN) * 100));
  const rows = jetskis.filter((j) => j.active);

  return (
    <div>
      <PanelHeader
        title="Kalendarz"
        description="Widok dnia dla całej floty. Jasny pasek za rezerwacją to czas przygotowania skutera."
        actions={
          <>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDate(addDays(date, -1))}>
              ‹ Poprzedni dzień
            </button>
            <label htmlFor="cal-date" className="sr-only">
              Data
            </label>
            <input id="cal-date" type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} className="field min-h-[2.6rem] w-auto py-1.5" />
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDate(addDays(date, 1))}>
              Następny dzień ›
            </button>
          </>
        }
      />
      <p className="mb-4 font-display text-3xl font-extrabold uppercase">{formatDateLong(date)}</p>
      <div className="overflow-x-auto bg-white p-4" role="region" aria-label="Oś dnia" tabIndex={0}>
        <div className="min-w-[56rem]">
          <div className="tabular relative ml-40 h-6 text-xs text-muted">
            {Array.from({ length: END_H - START_H + 1 }, (_, i) => (
              <span key={i} className="absolute -translate-x-1/2" style={{ left: `${(i / (END_H - START_H)) * 100}%` }}>
                {String(START_H + i).padStart(2, "0")}
              </span>
            ))}
          </div>
          {rows.map((j) => {
            const items = data?.date === date ? data.bookings.filter((b) => b.jetskiId === j.id) : [];
            const blocks = data?.date === date ? data.blocks.filter((b) => (b.jetskiId === null || b.jetskiId === j.id) && b.start < dayStart + SPAN * 60_000 && b.end > dayStart) : [];
            return (
              <div key={j.id} className="flex items-stretch border-t border-line">
                <div className="w-40 shrink-0 py-3 pr-3 font-semibold">{jetskiTitle(j)}</div>
                <div className="relative h-14 flex-1 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_calc(100%/16-1px),#eef1f3_calc(100%/16-1px),#eef1f3_calc(100%/16))]">
                  {blocks.map((k) => (
                    <div
                      key={k.id}
                      className="absolute inset-y-1 bg-[repeating-linear-gradient(45deg,#c5ccd1_0,#c5ccd1_6px,#e4e8eb_6px,#e4e8eb_12px)] px-2 text-xs font-semibold leading-[3rem]"
                      style={{ left: `${pos(k.start)}%`, width: `${pos(k.end) - pos(k.start)}%` }}
                      title={k.reason ?? "Blokada"}
                    >
                      <span className="truncate">{k.reason ?? "Blokada"}</span>
                    </div>
                  ))}
                  {items.map((b) => (
                    <div key={b.id}>
                      <div className="absolute inset-y-1 bg-[#ddf3f4]" style={{ left: `${pos(b.end)}%`, width: `${pos(b.end + prep * 60_000) - pos(b.end)}%` }} aria-hidden="true" />
                      <div
                        className={`absolute inset-y-1 overflow-hidden px-2 py-1 text-xs leading-tight text-white ${b.status === "pending" ? "bg-[#8a5a00]" : "bg-graphite"}`}
                        style={{ left: `${pos(b.start)}%`, width: `${Math.max(1, pos(b.end) - pos(b.start))}%` }}
                        title={`${b.number} ${b.customerName ?? ""}`}
                      >
                        <span className="block truncate font-semibold">
                          {formatTime(b.start)}–{formatTime(b.end)}
                        </span>
                        <span className="block truncate">
                          {b.customerName ?? "—"} · {STATUS_LABELS[b.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-5 text-sm text-muted">
        <li className="flex items-center gap-2">
          <span className="h-3 w-5 bg-graphite" /> Potwierdzona
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-5 bg-[#8a5a00]" /> Wstępna
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-5 bg-[#ddf3f4]" /> Przygotowanie ({prep} min)
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-5 bg-[repeating-linear-gradient(45deg,#c5ccd1_0,#c5ccd1_3px,#e4e8eb_3px,#e4e8eb_6px)]" /> Blokada
        </li>
      </ul>
    </div>
  );
}
