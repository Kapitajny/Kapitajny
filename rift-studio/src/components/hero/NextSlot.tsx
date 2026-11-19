"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { fmt, type Dictionary } from "@/i18n/dictionaries";
import { useSite } from "@/components/providers/SiteProvider";
import styles from "./NextSlot.module.css";

type State = { kind: "loading" } | { kind: "none" } | { kind: "error" } | { kind: "ok"; date: string; time: string; durationMin: number };

/** Najbliższy wolny termin – prawdziwe dane z kalendarza rezerwacji. */
export function NextSlot({ lang, t }: { lang: Locale; t: Dictionary["hero"] }) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const { requestBooking } = useSite();

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/availability/next", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { slot: { date: string; time: string; durationMin: number } | null }) => setState(d.slot ? { kind: "ok", ...d.slot } : { kind: "none" }))
      .catch((e) => {
        if (!ctrl.signal.aborted) setState({ kind: "error" });
        return e;
      });
    return () => ctrl.abort();
  }, []);

  const loc = lang === "pl" ? "pl-PL" : "en-GB";
  const day =
    state.kind === "ok"
      ? new Intl.DateTimeFormat(loc, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${state.date}T12:00:00Z`))
      : "";

  return (
    <div className={styles.card} aria-live="polite" aria-busy={state.kind === "loading"}>
      <p className={styles.label}>
        <span className={`${styles.dot} ${state.kind === "ok" ? styles.dotOn : ""}`} aria-hidden="true" />
        {t.nextSlot}
      </p>
      {state.kind === "ok" ? (
        <>
          <p className={styles.value}>
            <span className={styles.day}>{day}</span>
            <span className={`${styles.time} tabular`}>{state.time}</span>
          </p>
          <p className={styles.sub}>{fmt(t.nextSlotService, { hours: state.durationMin / 60 })}</p>
          <button
            type="button"
            className={`btn btn-small ${styles.cta}`}
            onClick={() => requestBooking({ service: "vocal", durationMin: state.durationMin, date: state.date, time: state.time })}
          >
            {t.nextSlotCta}
          </button>
        </>
      ) : (
        <p className={styles.sub}>{state.kind === "loading" ? t.nextSlotLoading : state.kind === "none" ? t.nextSlotNone : t.nextSlotError}</p>
      )}
    </div>
  );
}
