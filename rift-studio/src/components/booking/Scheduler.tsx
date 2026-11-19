"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import { fmt, type Dictionary } from "@/i18n/dictionaries";
import type { ServiceId } from "@/data/services";
import type { Day } from "@/lib/booking/slots";
import { ChevronIcon } from "@/components/ui/Icons";
import styles from "./Scheduler.module.css";

type Load = { kind: "loading" } | { kind: "error" } | { kind: "ok"; days: Day[] };

/** Pobiera wolne terminy z API. `refreshKey` wymusza ponowne pobranie (np. po kolizji). */
export function useAvailability(service: ServiceId, durationMin: number, refreshKey: number, token?: string, enabled = true) {
  const [retry, setRetry] = useState(0);
  const key = `${service}|${durationMin}|${refreshKey}|${retry}|${token ?? ""}`;
  const [result, setResult] = useState<{ key: string; load: Load } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const ctrl = new AbortController();
    fetch(`/api/availability?service=${service}&duration=${durationMin}&days=57`, {
      signal: ctrl.signal,
      cache: "no-store",
      headers: token ? { "x-manage-token": token } : undefined,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { days: Day[] }) => setResult({ key, load: { kind: "ok", days: d.days } }))
      .catch(() => {
        if (!ctrl.signal.aborted) setResult({ key, load: { kind: "error" } });
      });
    return () => ctrl.abort();
  }, [key, service, durationMin, token, enabled]);

  // wynik innego zapytania (np. poprzedniej usługi) traktujemy jak ładowanie
  const load: Load = result?.key === key ? result.load : { kind: "loading" };
  return { load, retry: useCallback(() => setRetry((n) => n + 1), []) };
}

interface Props {
  lang: Locale;
  t: Dictionary["booking"];
  load: Load;
  onRetry: () => void;
  date: string;
  time: string;
  onChange: (next: { date: string; time: string }) => void;
  /** Prefiks identyfikatorów (dwa harmonogramy na jednej stronie). */
  idPrefix: string;
  dayError?: string;
  timeError?: string;
}

const monthKey = (date: string) => date.slice(0, 7);

/** Kalendarz dni z miernikiem dostępności + siatka godzin. Zajęte terminy są zablokowane. */
export function Scheduler({ lang, t, load, onRetry, date, time, onChange, idPrefix, dayError, timeError }: Props) {
  const loc = lang === "pl" ? "pl-PL" : "en-GB";
  const days = useMemo(() => (load.kind === "ok" ? load.days : []), [load]);
  const byDate = useMemo(() => new Map(days.map((d) => [d.date, d])), [days]);
  const months = useMemo(() => [...new Set(days.map((d) => monthKey(d.date)))], [days]);
  const [month, setMonth] = useState<string>("");

  const activeMonth = months.includes(month) ? month : date && months.includes(monthKey(date)) ? monthKey(date) : (months[0] ?? "");
  // pokaż miesiąc wybranego dnia (np. po wypełnieniu z „najbliższego terminu”)
  const [seenDate, setSeenDate] = useState(date);
  if (date !== seenDate) {
    setSeenDate(date);
    if (date) setMonth(monthKey(date));
  }

  const monthIndex = months.indexOf(activeMonth);
  const selectedDay = date ? byDate.get(date) : undefined;
  const freeCount = (d: Day) => d.slots.filter((s) => s.available).length;

  const cells = useMemo(() => {
    if (!activeMonth) return [];
    const [y, m] = activeMonth.split("-").map(Number);
    const first = new Date(Date.UTC(y, m - 1, 1));
    const lead = (first.getUTCDay() + 6) % 7; // poniedziałek = 0
    const count = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: count }, (_, i) => `${activeMonth}-${String(i + 1).padStart(2, "0")}`),
    ];
  }, [activeMonth]);

  const monthLabel = activeMonth
    ? new Intl.DateTimeFormat(loc, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${activeMonth}-15T12:00:00Z`))
    : "";
  const dayLabel = (iso: string) => new Intl.DateTimeFormat(loc, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));

  if (load.kind === "loading") {
    return (
      <p className={styles.status} role="status">
        <span className={styles.spinner} aria-hidden="true" />
        {t.loading}
      </p>
    );
  }
  if (load.kind === "error") {
    return (
      <div className={styles.status} role="alert">
        {t.loadError}
        <button type="button" className="btn btn-small" onClick={onRetry}>
          {t.retry}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.scheduler}>
      <fieldset className={styles.calendar} aria-describedby={dayError ? `${idPrefix}-day-err` : undefined}>
        <legend className="sr-only">{t.calendarLabel}</legend>
        <div className={styles.monthBar}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setMonth(months[monthIndex - 1])}
            disabled={monthIndex <= 0}
            aria-label={t.prevMonth}
          >
            <ChevronIcon size={18} style={{ transform: "rotate(180deg)" }} />
          </button>
          <p className={styles.month} aria-live="polite">
            {monthLabel}
          </p>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setMonth(months[monthIndex + 1])}
            disabled={monthIndex >= months.length - 1}
            aria-label={t.nextMonth}
          >
            <ChevronIcon size={18} />
          </button>
        </div>

        <div className={styles.weekdays} aria-hidden="true">
          {t.weekdays.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className={styles.days}>
          {cells.map((iso, i) => {
            if (!iso) return <span key={`pad-${i}`} />;
            const d = byDate.get(iso);
            const free = d ? freeCount(d) : 0;
            const total = d?.slots.length ?? 0;
            const disabled = !d || d.closed || free === 0;
            const state = !d ? "" : d.closed ? t.dayClosed : free === 0 ? t.dayFull : fmt(t.dayFree, { n: free });
            return (
              <button
                key={iso}
                type="button"
                className={styles.day}
                disabled={disabled}
                aria-pressed={date === iso}
                aria-label={`${dayLabel(iso)}${state ? `, ${state}` : ""}`}
                data-out={!d || undefined}
                onClick={() => onChange({ date: iso, time: "" })}
              >
                <span className={`${styles.dayNum} tabular`}>{Number(iso.slice(8))}</span>
                {d && !d.closed && (
                  <span className={styles.meter} aria-hidden="true">
                    <span style={{ transform: `scaleX(${total ? free / total : 0})` }} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {dayError && (
          <p id={`${idPrefix}-day-err`} className={styles.err}>
            {dayError}
          </p>
        )}
      </fieldset>

      <fieldset className={styles.times} aria-describedby={timeError ? `${idPrefix}-time-err` : undefined}>
        <legend className={styles.timesLegend}>
          {t.time}
          {selectedDay && <span className={styles.timesDay}>{dayLabel(selectedDay.date)}</span>}
        </legend>
        {!selectedDay ? (
          <p className={styles.hint}>{t.pickDayFirst}</p>
        ) : freeCount(selectedDay) === 0 ? (
          <p className={styles.hint}>{t.noSlots}</p>
        ) : (
          <div className={styles.slots}>
            {selectedDay.slots.map((s) => (
              <label key={s.time} className={styles.slot} data-busy={!s.available || undefined}>
                <input type="radio" name={`${idPrefix}-time`} value={s.time} checked={time === s.time} disabled={!s.available} onChange={() => onChange({ date, time: s.time })} />
                <span className="tabular">{s.time}</span>
                {!s.available && <span className="sr-only">, {t.slotTaken}</span>}
              </label>
            ))}
          </div>
        )}
        <p className={styles.legend} aria-hidden="true">
          <span className={styles.legendFree} /> {t.legendFree}
          <span className={styles.legendBusy} /> {t.legendBusy}
        </p>
        {timeError && (
          <p id={`${idPrefix}-time-err`} className={styles.err}>
            {timeError}
          </p>
        )}
      </fieldset>
    </div>
  );
}
