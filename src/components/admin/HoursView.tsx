"use client";

import { useEffect, useState } from "react";
import type { OpeningDay } from "@/lib/rental";
import { WEEKDAYS } from "@/lib/time";
import { Notice, PanelHeader, useApi, useFlash } from "./ui";

const ORDER = [1, 2, 3, 4, 5, 6, 0];

export function HoursView() {
  const api = useApi();
  const [days, setDays] = useState<(OpeningDay & { closed: boolean })[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, show] = useFlash();

  useEffect(() => {
    void api<{ hours: OpeningDay[] }>("/api/admin/hours").then((r) => r.data && setDays(r.data.hours.map((h) => ({ ...h, closed: !h.open }))));
  }, [api]);

  const update = (weekday: number, patch: Partial<OpeningDay & { closed: boolean }>) => setDays((d) => d?.map((x) => (x.weekday === weekday ? { ...x, ...patch } : x)) ?? null);

  async function save() {
    if (!days) return;
    const r = await api<{ hours: OpeningDay[] }>("/api/admin/hours", {
      method: "PUT",
      json: { hours: days.map((d) => ({ weekday: d.weekday, closed: d.closed, open: d.closed ? null : d.open || "10:00", close: d.closed ? null : d.close || "20:00" })) },
    });
    if (r.ok) {
      setError(null);
      show("success", "Godziny otwarcia zapisane i widoczne na stronie.");
    } else setError(r.error?.message ?? "Nie udało się zapisać.");
  }

  return (
    <div>
      <PanelHeader title="Godziny otwarcia" description="Rezerwacje online zaczynają się i kończą w tych godzinach. Wynajem na 12 i 24 h musi mieć zwrot w godzinach otwarcia." />
      {!days ? (
        <p className="text-muted">Ładowanie…</p>
      ) : (
        <div className="max-w-2xl bg-white p-4">
          <ul className="grid gap-1">
            {ORDER.map((wd) => {
              const d = days.find((x) => x.weekday === wd)!;
              return (
                <li key={wd} className="grid grid-cols-[8rem_auto_1fr] items-center gap-4 border-b border-line py-3 last:border-0">
                  <span className="font-semibold">{WEEKDAYS[wd]}</span>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={d.closed} onChange={(e) => update(wd, { closed: e.target.checked })} className="check mt-0" />
                    Zamknięte
                  </label>
                  <div className={`flex items-center gap-2 ${d.closed ? "opacity-40" : ""}`}>
                    <label htmlFor={`h-o-${wd}`} className="sr-only">
                      Otwarcie, {WEEKDAYS[wd]}
                    </label>
                    <input id={`h-o-${wd}`} type="time" value={d.open ?? ""} disabled={d.closed} onChange={(e) => update(wd, { open: e.target.value })} className="field min-h-10 w-auto py-1.5" />
                    <span aria-hidden="true">–</span>
                    <label htmlFor={`h-c-${wd}`} className="sr-only">
                      Zamknięcie, {WEEKDAYS[wd]}
                    </label>
                    <input id={`h-c-${wd}`} type="time" value={d.close ?? ""} disabled={d.closed} onChange={(e) => update(wd, { close: e.target.value })} className="field min-h-10 w-auto py-1.5" />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 grid gap-3">
            {error && <Notice tone="error">{error}</Notice>}
            {flash}
            <div>
              <button type="button" className="btn btn-sm" onClick={save}>
                Zapisz godziny
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
