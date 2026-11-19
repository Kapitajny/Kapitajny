"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getService, type ServiceId } from "@/data/services";
import { isSoundId, sounds } from "@/data/sounds";
import page from "@/app/[lang]/subpage.module.css";
import styles from "./Admin.module.css";

type Status = "pending" | "confirmed" | "cancelled";
interface Booking {
  id: string;
  status: Status;
  service: ServiceId;
  durationMin: number;
  startsAt: string;
  endsAt: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  sound: string;
  lang: Locale;
  cancelReason: string | null;
}
interface Block {
  id: string;
  startsAt: string;
  endsAt: string;
  note: string;
}

export function AdminLogin({ t }: { t: Dictionary["admin"] }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }).catch(() => null);
    setBusy(false);
    if (res?.ok) window.location.reload();
    else setError(res?.status === 429 ? t.rateLimited : t.invalidPassword);
  }

  return (
    <form className={`${page.panel} ${styles.login}`} onSubmit={submit}>
      <label className={styles.field}>
        <span>{t.password}</span>
        <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!error} aria-describedby={error ? "admin-err" : undefined} />
      </label>
      {error && (
        <p id="admin-err" className={page.message} data-tone="error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? t.loggingIn : t.login}
      </button>
    </form>
  );
}

export function AdminDashboard({ lang, t }: { lang: Locale; t: Dictionary }) {
  const a = t.admin;
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [filter, setFilter] = useState<"" | Status>("");
  const [error, setError] = useState("");
  const [block, setBlock] = useState({ date: "", from: "10:00", to: "22:00", note: "" });

  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/admin/bookings", { cache: "no-store", signal: ctrl.signal })
      .then(async (res) => {
        if (res.status === 401) return window.location.reload();
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        setBookings(data.bookings);
        setBlocks(data.blocks);
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setError(a.error);
      });
    return () => ctrl.abort();
  }, [version, a.error]);

  async function mutate(url: string, method: string, body: unknown) {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    setError(res?.ok ? "" : res?.status === 409 ? a.conflict : a.error);
    refresh();
  }

  const loc = lang === "pl" ? "pl-PL" : "en-GB";
  const fmtRange = (s: string, e: string) => {
    const d = new Intl.DateTimeFormat(loc, { timeZone: "Europe/Warsaw", weekday: "short", day: "2-digit", month: "2-digit" }).format(new Date(s));
    const h = new Intl.DateTimeFormat(loc, { timeZone: "Europe/Warsaw", hour: "2-digit", minute: "2-digit" });
    return `${d} ${h.format(new Date(s))}–${h.format(new Date(e))}`;
  };
  const visible = bookings ? (filter ? bookings.filter((b) => b.status === filter) : bookings) : [];

  return (
    <div className={styles.dash}>
      <div className={styles.toolbar}>
        <label className={styles.field}>
          <span>{a.filter}</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value as "" | Status)}>
            <option value="">{a.all}</option>
            {(["pending", "confirmed", "cancelled"] as const).map((s) => (
              <option key={s} value={s}>
                {t.manage.status[s]}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn-small" onClick={refresh}>
          {a.refresh}
        </button>
        <button
          type="button"
          className="btn btn-small"
          onClick={async () => {
            await fetch("/api/admin/session", { method: "DELETE" });
            window.location.reload();
          }}
        >
          {a.logout}
        </button>
      </div>

      {error && (
        <p className={page.message} data-tone="error" role="alert">
          {error}
        </p>
      )}

      <section aria-labelledby="adm-bookings">
        <h2 id="adm-bookings" className={styles.h2}>
          {a.bookings} {bookings && <span className="tabular">({visible.length})</span>}
        </h2>
        {!bookings ? (
          <p className={page.meta} role="status">
            {a.loading}
          </p>
        ) : visible.length === 0 ? (
          <p className={page.meta}>{a.empty}</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{a.when}</th>
                  <th scope="col">{a.client}</th>
                  <th scope="col">{a.service}</th>
                  <th scope="col">{a.statusCol}</th>
                  <th scope="col">{a.actions}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((b) => (
                  <tr key={b.id}>
                    <td className="tabular">{fmtRange(b.startsAt, b.endsAt)}</td>
                    <td>
                      <strong>{b.name}</strong>
                      <br />
                      <a href={`mailto:${b.email}`}>{b.email}</a>
                      {b.phone && (
                        <>
                          <br />
                          <a href={`tel:${b.phone.replace(/\s/g, "")}`}>{b.phone}</a>
                        </>
                      )}
                      {b.message && <p className={styles.msg}>{b.message}</p>}
                    </td>
                    <td>
                      {getService(b.service).name[lang]}
                      {isSoundId(b.sound) && <span className={styles.tag}>{sounds.find((s) => s.id === b.sound)?.name}</span>}
                    </td>
                    <td>
                      <span className={page.status} data-status={b.status}>
                        {t.manage.status[b.status]}
                      </span>
                      {b.cancelReason && <p className={styles.msg}>{b.cancelReason}</p>}
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        {b.status !== "confirmed" && (
                          <button type="button" className="btn btn-small btn-primary" onClick={() => void mutate("/api/admin/bookings", "PATCH", { id: b.id, action: "confirm" })}>
                            {a.confirm}
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button
                            type="button"
                            className={`btn btn-small ${page.btnDanger}`}
                            onClick={() => {
                              const reason = window.prompt(a.reasonPrompt);
                              if (reason !== null) void mutate("/api/admin/bookings", "PATCH", { id: b.id, action: "cancel", reason });
                            }}
                          >
                            {a.cancel}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="adm-blocks" className={page.panel}>
        <h2 id="adm-blocks" className={styles.h2}>
          {a.blocks}
        </h2>
        <p className={page.meta}>{a.blocksLead}</p>
        <form
          className={styles.blockForm}
          onSubmit={(e) => {
            e.preventDefault();
            void mutate("/api/admin/blocks", "POST", block).then(() => setBlock((b) => ({ ...b, note: "" })));
          }}
        >
          <label className={styles.field}>
            <span>{a.date}</span>
            <input type="date" required value={block.date} onChange={(e) => setBlock({ ...block, date: e.target.value })} />
          </label>
          <label className={styles.field}>
            <span>{a.from}</span>
            <input type="time" required step={1800} value={block.from} onChange={(e) => setBlock({ ...block, from: e.target.value })} />
          </label>
          <label className={styles.field}>
            <span>{a.to}</span>
            <input type="time" required step={1800} value={block.to} onChange={(e) => setBlock({ ...block, to: e.target.value })} />
          </label>
          <label className={`${styles.field} ${styles.grow}`}>
            <span>{a.note}</span>
            <input type="text" maxLength={200} value={block.note} onChange={(e) => setBlock({ ...block, note: e.target.value })} />
          </label>
          <button type="submit" className="btn btn-primary btn-small">
            {a.addBlock}
          </button>
        </form>
        {blocks.length === 0 ? (
          <p className={page.meta}>{a.noBlocks}</p>
        ) : (
          <ul role="list" className={styles.blocks}>
            {blocks.map((b) => (
              <li key={b.id}>
                <span className="tabular">{fmtRange(b.startsAt, b.endsAt)}</span>
                <span className={styles.msg}>{b.note}</span>
                <button type="button" className="btn btn-small" onClick={() => void mutate("/api/admin/blocks", "DELETE", { id: b.id })} aria-label={`${a.remove}: ${fmtRange(b.startsAt, b.endsAt)}`}>
                  {a.remove}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
