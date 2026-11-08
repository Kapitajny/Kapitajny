"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { SESSION_TYPES, type SessionType } from "@/data/services";
import { format, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/pl";
import { isSessionType, todayInWarsaw, validateInquiry, type InquiryErrors, type InquiryField, type InquiryInput } from "@/lib/inquiry";
import { SESSION_EVENT } from "./inquiry-events";
import styles from "./InquiryForm.module.css";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "not-configured"; message: string }
  | { kind: "error"; message: string };

const EMPTY: InquiryInput = { name: "", email: "", session: "", date: "", message: "" };
const FIELD_ORDER: InquiryField[] = ["name", "email", "session", "date", "message"];

/**
 * Formularz zapytania. Wysyła dane do `/api/inquiry`; gdy studio nie podłączyło skrzynki
 * (brak INQUIRY_WEBHOOK_URL), mówi o tym wprost – niczego nie udaje.
 */
export function InquiryForm({ enabled, email, locale, t }: { enabled: boolean; email: string | null; locale: Locale; t: Dictionary["form"] }) {
  const [values, setValues] = useState<InquiryInput>(EMPTY);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [today, setToday] = useState<string | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    // Minimalna data liczona w przeglądarce (strona jest statyczna).
    const timer = window.setTimeout(() => setToday(todayInWarsaw()), 0);
    const pick = (session: SessionType) => {
      setValues((current) => ({ ...current, session }));
      setErrors((current) => ({ ...current, session: undefined }));
    };
    const fromUrl = new URLSearchParams(window.location.search).get("session");
    if (isSessionType(fromUrl)) window.setTimeout(() => pick(fromUrl), 0);
    const onSession = (event: Event) => pick((event as CustomEvent<SessionType>).detail);
    window.addEventListener(SESSION_EVENT, onSession);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(SESSION_EVENT, onSession);
    };
  }, []);

  const update = (field: InquiryField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    if (status.kind !== "idle" && status.kind !== "sending") setStatus({ kind: "idle" });
  };

  const focusFirstError = (found: InquiryErrors) => {
    const first = FIELD_ORDER.find((field) => found[field]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateInquiry(values, t.errors);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }

    // Bez podłączonej skrzynki nie wysyłamy żądania – od razu mówimy, że wiadomość nie wyszła.
    if (!enabled) {
      setStatus({ kind: "not-configured", message: t.notConfigured });
      requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Site-Lang": locale },
        body: JSON.stringify({ ...values, lang: locale }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: { code?: string; message?: string; fields?: InquiryErrors } };
      if (response.ok) {
        setStatus({ kind: "sent" });
        setValues(EMPTY);
      } else if (data.error?.code === "NOT_CONFIGURED") {
        setStatus({ kind: "not-configured", message: data.error.message ?? "" });
      } else if (data.error?.fields) {
        setErrors(data.error.fields);
        setStatus({ kind: "idle" });
        focusFirstError(data.error.fields);
        return;
      } else {
        setStatus({ kind: "error", message: data.error?.message ?? t.api.deliveryFailed });
      }
    } catch {
      setStatus({ kind: "error", message: t.offline });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  const mailto = email
    ? `mailto:${email}?subject=${encodeURIComponent(
        format(t.mail.subject, { session: values.session ? t.sessionTypes[values.session] : t.mail.fallbackSession }),
      )}&body=${encodeURIComponent(`${values.message}\n\n${t.mail.name}: ${values.name}\n${t.mail.date}: ${values.date || t.mail.flexible}`)}`
    : null;

  const field = (name: InquiryField) => ({
    id: `${id}-${name}`,
    name,
    value: values[name],
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });

  const error = (name: InquiryField) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className={styles.error}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} className={styles.form} noValidate onSubmit={onSubmit} aria-describedby={enabled ? undefined : `${id}-demo`}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${id}-name`}>{t.name}</label>
          <input {...field("name")} type="text" autoComplete="name" required onChange={(event) => update("name", event.target.value)} />
          {error("name")}
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-email`}>{t.email}</label>
          <input {...field("email")} type="email" autoComplete="email" inputMode="email" required onChange={(event) => update("email", event.target.value)} />
          {error("email")}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${id}-session`}>{t.session}</label>
          <select {...field("session")} required onChange={(event) => update("session", event.target.value)}>
            <option value="" disabled>
              {t.sessionPlaceholder}
            </option>
            {SESSION_TYPES.map((type) => (
              <option key={type} value={type}>
                {t.sessionTypes[type]}
              </option>
            ))}
          </select>
          {error("session")}
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-date`}>
            {t.date} <span className={styles.optional}>{t.optional}</span>
          </label>
          <input {...field("date")} type="date" min={today} onChange={(event) => update("date", event.target.value)} />
          {error("date")}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-message`}>{t.message}</label>
        <textarea
          {...field("message")}
          rows={5}
          required
          placeholder={t.messagePlaceholder}
          onChange={(event) => update("message", event.target.value)}
        />
        {error("message")}
      </div>

      <div className={styles.actions}>
        <button type="submit" className="button button--light" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? t.sending : t.submit}
        </button>
        {!enabled && (
          <p id={`${id}-demo`} className={styles.demoNote}>
            {t.demoNote}
          </p>
        )}
      </div>

      <div ref={statusRef} tabIndex={-1} className={styles.status} role="status">
        {status.kind === "sent" && <p>{t.sent}</p>}
        {status.kind === "not-configured" && (
          <p>
            {status.message}{" "}
            {mailto ? (
              <a className="text-link" href={mailto}>
                {t.sendByEmail}
              </a>
            ) : (
              t.keptText
            )}
          </p>
        )}
        {status.kind === "error" && <p>{status.message}</p>}
      </div>
    </form>
  );
}
