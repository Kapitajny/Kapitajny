"use client";

import { useToday } from "@/lib/use-today";
import { useEffect, useState } from "react";
import { DURATIONS, formatPrice, STATUS_LABELS, type Jetski } from "@/lib/rental";
import { addDays, formatDateTime, formatTime, fromLocal, toLocal } from "@/lib/time";
import type { TabId } from "./AdminApp";
import { STATUS_TONE, type AdminBooking, type Settings } from "./types";
import { Notice, PanelHeader, Pill, useApi } from "./ui";

export function Dashboard({ jetskis, go }: { jetskis: Jetski[]; go: (t: TabId) => void }) {
  const api = useApi();
  const [bookings, setBookings] = useState<AdminBooking[] | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const today = useToday();

  useEffect(() => {
    const from = fromLocal(today, 0);
    const to = fromLocal(addDays(today, 8), 0);
    void api<{ bookings: AdminBooking[] }>(`/api/admin/bookings?from=${from}&to=${to}`).then((r) => r.data && setBookings(r.data.bookings));
    void api<{ settings: Settings }>("/api/admin/settings").then((r) => r.data && setSettings(r.data.settings));
  }, [api, today]);

  const active = jetskis.filter((j) => j.active);
  const todo: { text: string; tab: TabId }[] = [];
  const review = jetskis.filter((j) => j.needsReview);
  if (review.length) todo.push({ text: `${review.length} skuter(y) mają dane do potwierdzenia (parametry, uprawnienia, opis).`, tab: "flota" });
  const noPrices = active.filter((j) => DURATIONS.every((d) => j.prices[d] == null));
  if (noPrices.length) todo.push({ text: `${noPrices.length} skuter(y) bez cennika – nie da się ich zarezerwować online.`, tab: "ceny" });
  const noDeposit = active.filter((j) => j.depositGr == null);
  if (noDeposit.length) todo.push({ text: `${noDeposit.length} skuter(y) bez ustalonej kaucji.`, tab: "ceny" });
  if (settings && settings.hours_confirmed !== "1") todo.push({ text: "Godziny otwarcia są przykładowe – potwierdź je lub zmień.", tab: "godziny" });
  if (settings && !settings.contact_phone) todo.push({ text: "Brak numeru telefonu na stronie.", tab: "ustawienia" });
  if (settings && settings.no_license_mode === "hidden") todo.push({ text: "Sekcja „bez patentu” jest w trybie informacyjnym. Wybierz tryb, gdy zweryfikujesz przepisy.", tab: "ustawienia" });

  const upcoming = (bookings ?? []).filter((b) => b.status === "pending" || b.status === "confirmed");
  const todays = upcoming.filter((b) => toLocal(b.start).date === today);
  const pending = upcoming.filter((b) => b.status === "pending");

  return (
    <div>
      <PanelHeader title="Pulpit" description="Dzisiejsze wynajmy, rezerwacje do potwierdzenia i rzeczy do uzupełnienia." />
      <dl className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
        {[
          ["Dziś", todays.length],
          ["Do potwierdzenia", pending.length],
          ["Najbliższe 7 dni", upcoming.length],
          ["Aktywne skutery", active.length],
        ].map(([k, v]) => (
          <div key={k} className="bg-white p-5">
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="tabular font-display text-5xl font-extrabold leading-none">{bookings ? v : "…"}</dd>
          </div>
        ))}
      </dl>

      {todo.length > 0 && (
        <section className="mt-10">
          <h2 className="font-sans text-xl font-bold normal-case tracking-normal">Do uzupełnienia</h2>
          <ul className="mt-3 grid gap-2">
            {todo.map((t) => (
              <li key={t.text}>
                <button type="button" onClick={() => go(t.tab)} className="flex w-full items-center justify-between gap-4 border-l-4 border-warn bg-white px-4 py-3 text-left hover:bg-sand">
                  <span>{t.text}</span>
                  <span className="shrink-0 font-semibold text-turq-ink">Przejdź</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-sans text-xl font-bold normal-case tracking-normal">Dziś na wodzie</h2>
        {!bookings ? (
          <p className="mt-3 text-muted">Ładowanie…</p>
        ) : todays.length === 0 ? (
          <div className="mt-3">
            <Notice>Na dziś nie ma rezerwacji.</Notice>
          </div>
        ) : (
          <ul className="mt-3 grid gap-2">
            {todays.map((b) => (
              <li key={b.id} className="grid gap-2 bg-white p-4 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center">
                <span className="tabular font-display text-3xl font-bold">{formatTime(b.start)}</span>
                <span>
                  <b>{b.jetskiName}</b> do {formatTime(b.end)} · {b.customerName ?? "klient usunięty"} {b.customerPhone && <a className="link" href={`tel:${b.customerPhone}`}>{b.customerPhone}</a>}
                </span>
                <Pill tone={STATUS_TONE[b.status]}>{STATUS_LABELS[b.status]}</Pill>
              </li>
            ))}
          </ul>
        )}
      </section>

      {pending.length > 0 && (
        <section className="mt-10">
          <h2 className="font-sans text-xl font-bold normal-case tracking-normal">Czekają na potwierdzenie</h2>
          <ul className="mt-3 grid gap-2">
            {pending.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 bg-white p-4">
                <span>
                  <b className="tabular">{b.number}</b> · {formatDateTime(b.start)} · {b.jetskiName} · {formatPrice(b.priceGr)}
                </span>
                <button type="button" className="btn btn-sm" onClick={() => go("rezerwacje")}>
                  Otwórz rezerwacje
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
