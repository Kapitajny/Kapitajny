"use client";

import { useEffect, useRef, useState } from "react";
import { localePath, type Locale } from "@/i18n/config";
import { fmt, type Dictionary } from "@/i18n/dictionaries";
import { legalHref } from "@/i18n/routes";
import { estimatePrice, getService, services, type ServiceId } from "@/data/services";
import { sounds, isSoundId } from "@/data/sounds";
import { PRICING_IS_DEMO } from "@/data/pricing";
import { LIMITS, validateBooking, type BookingField, type FieldError } from "@/lib/booking/validation";
import { useSite } from "@/components/providers/SiteProvider";
import { CheckIcon } from "@/components/ui/Icons";
import { Scheduler, useAvailability } from "./Scheduler";
import styles from "./BookingForm.module.css";

type Errors = Partial<Record<BookingField, FieldError>>;
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string } | { kind: "done"; token: string; date: string; time: string; email: string };

interface Props {
  lang: Locale;
  t: Dictionary["booking"];
}

export function BookingForm({ lang, t }: Props) {
  const { intent, sound, setSound } = useSite();
  const [service, setService] = useState<ServiceId>("vocal");
  const [durationMin, setDuration] = useState(getService("vocal").defaultDuration);
  const [slot, setSlot] = useState({ date: "", time: "" });
  const [fields, setFields] = useState({ name: "", email: "", phone: "", message: "", acceptTerms: false, acceptContact: false });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [refreshKey, setRefreshKey] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const { load, retry } = useAvailability(service, durationMin, refreshKey);

  // wypełnienie z innych sekcji (Usługi, Cennik, „najbliższy wolny termin”) – dostosowanie stanu w trakcie renderu
  const [seenNonce, setSeenNonce] = useState(intent.nonce);
  if (intent.nonce !== seenNonce) {
    setSeenNonce(intent.nonce);
    if (intent.service) {
      const s = getService(intent.service);
      setService(s.id);
      setDuration(intent.durationMin && s.durations.includes(intent.durationMin) ? intent.durationMin : s.defaultDuration);
    }
    setSlot({ date: intent.date ?? "", time: intent.time ?? "" });
    if (status.kind === "done") setStatus({ kind: "idle" });
  }

  useEffect(() => {
    if (status.kind === "done") doneRef.current?.focus();
  }, [status.kind]);

  const selectService = (id: ServiceId) => {
    setService(id);
    const s = getService(id);
    if (!s.durations.includes(durationMin)) setDuration(s.defaultDuration);
    setSlot((p) => ({ ...p, time: "" }));
  };

  const set = <K extends keyof typeof fields>(key: K, value: (typeof fields)[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key as BookingField]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const errorText = (field: BookingField): string | undefined => {
    const code = errors[field];
    if (!code) return undefined;
    if (field === "email" && code === "invalid") return t.errors.email;
    if (field === "phone" && code === "invalid") return t.errors.phone;
    if (field === "acceptTerms" || field === "acceptContact") return t.errors.consent;
    if (field === "date" || field === "time") return t.errors.slot;
    return t.errors[code];
  };

  const describedBy = (field: BookingField, hint?: string) => [hint, errors[field] ? `bk-${field}-err` : ""].filter(Boolean).join(" ") || undefined;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const payload = { service, durationMin, ...slot, ...fields, sound, lang };
    const check = validateBooking(payload);
    if (!check.ok) {
      setErrors(check.errors);
      setStatus({ kind: "error", message: t.errors.summary });
      focusFirstError(check.errors);
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, website: honeypot.current?.value ?? "", startedAt }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 201) {
        setStatus({ kind: "done", token: data.manageToken, date: slot.date, time: slot.time, email: check.value.email });
        setRefreshKey((k) => k + 1);
        return;
      }
      if (res.status === 409) {
        setSlot((p) => ({ ...p, time: "" }));
        setRefreshKey((k) => k + 1);
        setStatus({ kind: "error", message: t.errors.slotTaken });
        return;
      }
      if (res.status === 422 && data.fields) {
        setErrors(data.fields);
        setStatus({ kind: "error", message: t.errors.summary });
        focusFirstError(data.fields);
        return;
      }
      setStatus({ kind: "error", message: res.status === 429 ? t.errors.rateLimited : t.errors.server });
    } catch {
      setStatus({ kind: "error", message: t.errors.server });
    }
  }

  function focusFirstError(errs: Errors) {
    const order: BookingField[] = ["service", "durationMin", "date", "time", "name", "email", "phone", "message", "acceptTerms", "acceptContact"];
    const first = order.find((f) => errs[f]);
    if (!first) return;
    requestAnimationFrame(() => {
      const form = formRef.current;
      const firstDay = () => form?.querySelector<HTMLElement>("[data-step='schedule'] button[aria-pressed]:not(:disabled)");
      const el =
        first === "date"
          ? firstDay()
          : first === "time"
            ? (form?.querySelector<HTMLElement>("[data-step='schedule'] input[type='radio']:not(:disabled)") ?? firstDay())
            : form?.querySelector<HTMLElement>(`[name='${first}']`);
      el?.focus();
    });
  }

  const loc = lang === "pl" ? "pl-PL" : "en-GB";
  const prettyDate = (iso: string) => new Intl.DateTimeFormat(loc, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));

  if (status.kind === "done") {
    return (
      <div className={styles.done}>
        <span className={styles.doneIcon} aria-hidden="true">
          <CheckIcon size={28} />
        </span>
        <h3 ref={doneRef} tabIndex={-1} className={styles.doneTitle}>
          {t.success.title}
        </h3>
        <p>{fmt(t.success.text, { date: prettyDate(status.date), time: status.time, email: status.email })}</p>
        <div className={styles.doneActions}>
          <a className="btn btn-primary" href={localePath(lang, `/rezerwacja/${status.token}`)}>
            {t.success.manage}
          </a>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setSlot({ date: "", time: "" });
              setStatus({ kind: "idle" });
            }}
          >
            {t.success.another}
          </button>
        </div>
      </div>
    );
  }

  const svc = getService(service);
  const estimate = estimatePrice(service, durationMin);

  return (
    <form ref={formRef} className={styles.form} onSubmit={submit} noValidate aria-label={t.formLabel}>
      {/* krok 1 – usługa */}
      <fieldset className={styles.step}>
        <legend className={styles.stepHead}>
          <span className={styles.stepNo} aria-hidden="true">
            1
          </span>
          {t.steps.service}
        </legend>
        <div className={styles.chips} role="radiogroup" aria-label={t.service}>
          {services.map((s) => (
            <label key={s.id} className={styles.chip}>
              <input type="radio" name="service" value={s.id} checked={service === s.id} onChange={() => selectService(s.id)} />
              <span>{s.name[lang]}</span>
            </label>
          ))}
        </div>
        <div className={styles.durationRow}>
          <span className={styles.subLabel} id="bk-duration-label">
            {t.duration}
          </span>
          <div className={styles.chips} role="radiogroup" aria-labelledby="bk-duration-label">
            {svc.durations.map((d) => (
              <label key={d} className={`${styles.chip} ${styles.chipSmall}`}>
                <input
                  type="radio"
                  name="durationMin"
                  value={d}
                  checked={durationMin === d}
                  onChange={() => {
                    setDuration(d);
                    setSlot((p) => ({ ...p, time: "" }));
                  }}
                />
                <span className="tabular">{fmt(t.hours, { n: d / 60 })}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* krok 2 i 3 – dzień i godzina */}
      <div className={styles.step}>
        <div className={styles.stepHeads}>
          <p className={styles.stepHead}>
            <span className={styles.stepNo} aria-hidden="true">
              2
            </span>
            {t.steps.day}
          </p>
          <p className={styles.stepHead}>
            <span className={styles.stepNo} aria-hidden="true">
              3
            </span>
            {t.steps.time}
          </p>
        </div>
        <div data-step="schedule">
          <Scheduler
              lang={lang}
              t={t}
              load={load}
              onRetry={retry}
              date={slot.date}
              time={slot.time}
              onChange={(next) => {
                setSlot(next);
                setErrors((e) => ({ ...e, date: undefined, time: undefined }));
              }}
              idPrefix="bk"
              dayError={errors.date ? errorText("date") : undefined}
              timeError={!errors.date && errors.time ? errorText("time") : undefined}
            />
        </div>
      </div>

      {/* krok 4 – dane */}
      <fieldset className={styles.step}>
        <legend className={styles.stepHead}>
          <span className={styles.stepNo} aria-hidden="true">
            4
          </span>
          {t.steps.details}
        </legend>
        <div className={styles.fields}>
          <Field id="name" label={t.fields.name} error={errorText("name")}>
            <input id="bk-name" name="name" type="text" autoComplete="nickname" maxLength={LIMITS.name[1]} required value={fields.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
          </Field>
          <Field id="email" label={t.fields.email} error={errorText("email")}>
            <input id="bk-email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={LIMITS.email} value={fields.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={describedBy("email")} />
          </Field>
          <Field id="phone" label={t.fields.phone} optional={t.fields.optional} error={errorText("phone")}>
            <input id="bk-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={LIMITS.phone[1]} value={fields.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} />
          </Field>
          <Field id="sound" label={t.fields.sound} optional={t.fields.optional}>
            <select id="bk-sound" name="sound" value={sound} onChange={(e) => setSound(isSoundId(e.target.value) ? e.target.value : "")}>
              <option value="">{t.fields.soundNone}</option>
              {sounds.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field id="message" label={t.fields.message} optional={t.fields.optional} error={errorText("message")} wide>
            <textarea id="bk-message" name="message" rows={4} maxLength={LIMITS.message} value={fields.message} onChange={(e) => set("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={describedBy("message", "bk-message-hint")} />
            <span id="bk-message-hint" className={styles.hint}>
              {t.fields.messageHint}
            </span>
          </Field>
        </div>

        {/* pole-pułapka na boty – niewidoczne dla ludzi */}
        <div className={styles.trap} aria-hidden="true">
          <label>
            Website
            <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        <div className={styles.consents}>
          <label className={styles.check}>
            <input type="checkbox" name="acceptTerms" checked={fields.acceptTerms} onChange={(e) => set("acceptTerms", e.target.checked)} aria-invalid={!!errors.acceptTerms} aria-describedby={describedBy("acceptTerms")} required />
            <span>
              {t.consentTermsBefore}
              <a href={legalHref(lang, "booking")} target="_blank" rel="noopener">
                {t.consentTermsLink}
              </a>
              {t.consentTermsMiddle}
              <a href={legalHref(lang, "privacy")} target="_blank" rel="noopener">
                {t.consentPrivacyLink}
              </a>
              {t.consentTermsAfter}
            </span>
          </label>
          {errors.acceptTerms && (
            <p id="bk-acceptTerms-err" className={styles.err}>
              {errorText("acceptTerms")}
            </p>
          )}
          <label className={styles.check}>
            <input type="checkbox" name="acceptContact" checked={fields.acceptContact} onChange={(e) => set("acceptContact", e.target.checked)} aria-invalid={!!errors.acceptContact} aria-describedby={describedBy("acceptContact")} required />
            <span>{t.consentContact}</span>
          </label>
          {errors.acceptContact && (
            <p id="bk-acceptContact-err" className={styles.err}>
              {errorText("acceptContact")}
            </p>
          )}
        </div>
      </fieldset>

      {/* podsumowanie */}
      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>{t.summary}</h3>
        <dl className={styles.summaryList}>
          <div>
            <dt>{t.service}</dt>
            <dd>
              {svc.name[lang]}, {fmt(t.hours, { n: durationMin / 60 })}
            </dd>
          </div>
          <div>
            <dt>{t.summaryDate}</dt>
            <dd>{slot.date && slot.time ? `${prettyDate(slot.date)}, ${slot.time}` : <span className={styles.muted}>{t.summaryEmpty}</span>}</dd>
          </div>
          <div>
            <dt>{t.estimate}</dt>
            <dd className={`${styles.estimate} tabular`}>{estimate} zł</dd>
          </div>
        </dl>
        <p className={styles.note}>{PRICING_IS_DEMO ? t.estimateNote : ""}</p>

        {status.kind === "error" && (
          <p className={styles.formError} role="alert">
            {status.message}
          </p>
        )}
        <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={status.kind === "sending"} aria-busy={status.kind === "sending"}>
          {status.kind === "sending" ? t.submitting : t.submit}
        </button>
      </div>
    </form>
  );
}

function Field({ id, label, optional, error, wide, children }: { id: string; label: string; optional?: string; error?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={`${styles.field} ${wide ? styles.wide : ""}`} data-invalid={!!error || undefined}>
      <label htmlFor={`bk-${id}`} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> ({optional})</span>}
      </label>
      {children}
      {error && (
        <p id={`bk-${id}-err`} className={styles.err}>
          {error}
        </p>
      )}
    </div>
  );
}
