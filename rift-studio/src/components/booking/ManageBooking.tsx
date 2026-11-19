"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { fmt, type Dictionary } from "@/i18n/dictionaries";
import { getService, type ServiceId } from "@/data/services";
import { Scheduler, useAvailability } from "./Scheduler";
import styles from "@/app/[lang]/subpage.module.css";

interface Initial {
  status: "pending" | "confirmed" | "cancelled";
  service: ServiceId;
  durationMin: number;
  startsAt: string;
  endsAt: string;
  name: string;
  canManage: boolean;
}

type Msg = { tone: "ok" | "error"; text: string } | null;

export function ManageBooking({ lang, t, token, initial }: { lang: Locale; t: Dictionary; token: string; initial: Initial }) {
  const m = t.manage;
  const [booking, setBooking] = useState(initial);
  const [mode, setMode] = useState<"view" | "reschedule" | "confirmCancel">("view");
  const [slot, setSlot] = useState({ date: "", time: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loc = lang === "pl" ? "pl-PL" : "en-GB";
  const when = (() => {
    const tz = "Europe/Warsaw";
    const day = new Intl.DateTimeFormat(loc, { timeZone: tz, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(booking.startsAt));
    const time = new Intl.DateTimeFormat(loc, { timeZone: tz, hour: "2-digit", minute: "2-digit" });
    return `${day}, ${time.format(new Date(booking.startsAt))}–${time.format(new Date(booking.endsAt))}`;
  })();

  async function call(body: Record<string, string>) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/bookings/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, ...body }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const cancelled = body.action === "cancel";
        setBooking((b) => ({ ...b, ...data.booking, canManage: !cancelled && b.canManage }));
        setMode("view");
        setSlot({ date: "", time: "" });
        setMsg({ tone: "ok", text: cancelled ? m.cancelled : m.moved });
        return;
      }
      if (data.error === "slot_unavailable") {
        setRefreshKey((k) => k + 1);
        setSlot((s) => ({ ...s, time: "" }));
        setMsg({ tone: "error", text: m.slotTaken });
      } else if (data.error === "too_late") {
        setBooking((b) => ({ ...b, canManage: false }));
        setMsg({ tone: "error", text: m.tooLate });
      } else setMsg({ tone: "error", text: m.error });
    } catch {
      setMsg({ tone: "error", text: m.error });
    } finally {
      setBusy(false);
    }
  }

  const { load, retry } = useAvailability(booking.service, booking.durationMin, refreshKey, token, mode === "reschedule");

  return (
    <div className={styles.panel}>
      <p className={styles.status} data-status={booking.status}>
        {m.status[booking.status]}
      </p>
      <dl className={styles.details}>
        <div>
          <dt>{m.service}</dt>
          <dd>{getService(booking.service).name[lang]}</dd>
        </div>
        <div>
          <dt>{m.date}</dt>
          <dd>{when}</dd>
        </div>
        <div>
          <dt>{m.length}</dt>
          <dd>{fmt(t.booking.hours, { n: booking.durationMin / 60 })}</dd>
        </div>
        <div>
          <dt>{m.name}</dt>
          <dd>{booking.name}</dd>
        </div>
      </dl>

      {msg && (
        <p className={styles.message} data-tone={msg.tone} role={msg.tone === "error" ? "alert" : "status"}>
          {msg.text}
        </p>
      )}

      {booking.status !== "cancelled" && !booking.canManage && !msg && <p className={styles.message}>{m.tooLate}</p>}

      {booking.canManage && mode === "view" && (
        <div className={styles.actions}>
          <button type="button" className="btn btn-primary" onClick={() => setMode("reschedule")}>
            {m.reschedule}
          </button>
          <button type="button" className={`btn ${styles.btnDanger}`} onClick={() => setMode("confirmCancel")}>
            {m.cancel}
          </button>
        </div>
      )}

      {mode === "confirmCancel" && (
        <div className={styles.message} role="alertdialog" aria-label={m.cancel}>
          <p>{m.cancelConfirm}</p>
          <div className={styles.actions} style={{ marginTop: 12 }}>
            <button type="button" className={`btn ${styles.btnDanger}`} disabled={busy} onClick={() => call({ action: "cancel" })} autoFocus>
              {busy ? m.cancelling : m.yesCancel}
            </button>
            <button type="button" className="btn" onClick={() => setMode("view")}>
              {m.keep}
            </button>
          </div>
        </div>
      )}

      {mode === "reschedule" && (
        <form
          className={styles.wide}
          onSubmit={(e) => {
            e.preventDefault();
            if (slot.date && slot.time) void call({ action: "reschedule", date: slot.date, time: slot.time });
          }}
        >
          <h2 className={styles.meta}>{m.rescheduleTitle}</h2>
          <Scheduler lang={lang} t={t.booking} load={load} onRetry={retry} date={slot.date} time={slot.time} onChange={setSlot} idPrefix="mg" />
          <div className={styles.actions}>
            <button type="submit" className="btn btn-primary" disabled={busy || !slot.date || !slot.time}>
              {busy ? m.saving : m.save}
            </button>
            <button type="button" className="btn" onClick={() => setMode("view")}>
              {m.keep}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
