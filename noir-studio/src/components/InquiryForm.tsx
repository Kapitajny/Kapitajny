"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { SESSION_TYPES, type SessionType } from "@/data/services";
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
export function InquiryForm({ enabled, email }: { enabled: boolean; email: string | null }) {
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
    const found = validateInquiry(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }

    // Bez podłączonej skrzynki nie wysyłamy żądania – od razu mówimy, że wiadomość nie wyszła.
    if (!enabled) {
      setStatus({ kind: "not-configured", message: "This demo form is not connected to the studio inbox yet, so your inquiry was not sent." });
      requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
        setStatus({ kind: "error", message: data.error?.message ?? "Your inquiry could not be sent. Try again in a few minutes." });
      }
    } catch {
      setStatus({ kind: "error", message: "No connection. Check your internet connection and try again." });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  const mailto = email
    ? `mailto:${email}?subject=${encodeURIComponent(`Inquiry: ${SESSION_TYPES.find((type) => type.value === values.session)?.label ?? "photography"}`)}&body=${encodeURIComponent(
        `${values.message}\n\nName: ${values.name}\nPreferred date: ${values.date || "flexible"}`,
      )}`
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
          <label htmlFor={`${id}-name`}>Full name</label>
          <input {...field("name")} type="text" autoComplete="name" required onChange={(event) => update("name", event.target.value)} />
          {error("name")}
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-email`}>Email address</label>
          <input {...field("email")} type="email" autoComplete="email" inputMode="email" required onChange={(event) => update("email", event.target.value)} />
          {error("email")}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${id}-session`}>Type of session</label>
          <select {...field("session")} required onChange={(event) => update("session", event.target.value)}>
            <option value="" disabled>
              Choose a session
            </option>
            {SESSION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {error("session")}
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-date`}>
            Preferred date <span className={styles.optional}>(optional)</span>
          </label>
          <input {...field("date")} type="date" min={today} onChange={(event) => update("date", event.target.value)} />
          {error("date")}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-message`}>Message</label>
        <textarea
          {...field("message")}
          rows={5}
          required
          placeholder="Where, who, and what the photographs are for."
          onChange={(event) => update("message", event.target.value)}
        />
        {error("message")}
      </div>

      <div className={styles.actions}>
        <button type="submit" className="button button--light" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending inquiry…" : "Send inquiry"}
        </button>
        {!enabled && (
          <p id={`${id}-demo`} className={styles.demoNote}>
            Demo version: this form is not connected to the studio inbox yet, so inquiries are not delivered.
          </p>
        )}
      </div>

      <div ref={statusRef} tabIndex={-1} className={styles.status} role="status">
        {status.kind === "sent" && <p>Inquiry sent. We reply to every message within two working days.</p>}
        {status.kind === "not-configured" && (
          <p>
            {status.message}{" "}
            {mailto ? (
              <a className="text-link" href={mailto}>
                Send it by email instead
              </a>
            ) : (
              "Your text is still in the form, so nothing is lost."
            )}
          </p>
        )}
        {status.kind === "error" && <p>{status.message}</p>}
      </div>
    </form>
  );
}
