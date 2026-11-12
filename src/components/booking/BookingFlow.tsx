"use client";

import { useToday } from "@/lib/use-today";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { DURATIONS, durationLabel, durationLabelLong, formatPrice, hasAnyPrice, jetskiTitle, type Duration, type Jetski, type Slot } from "@/lib/rental";
import { addDays, formatDateLong, fromLocal, toLocal, toMinutes, toTime, WEEKDAYS_SHORT } from "@/lib/time";
import { validateContact } from "@/lib/validation";
import { CheckIcon } from "@/components/ui/Icons";
import { LICENSE_LABEL } from "@/components/home/FleetRail";

interface Props {
  jetskis: Jetski[];
  rules: { cancelFreeHours: number; horizonDays: number };
  initialJetski: string | null;
  initialDuration: number | null;
}

const monthFormatter = new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric", timeZone: "UTC" });

function newKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
}

export function BookingFlow({ jetskis, rules, initialJetski, initialDuration }: Props) {
  const router = useRouter();
  const bookable = jetskis.filter(hasAnyPrice);
  const [jetskiId, setJetskiId] = useState<string | null>(
    initialJetski && bookable.some((j) => j.id === initialJetski) ? initialJetski : bookable.length === 1 ? bookable[0].id : null,
  );
  const jetski = jetskis.find((j) => j.id === jetskiId) ?? null;
  const [duration, setDuration] = useState<Duration | null>(() => {
    const j = jetskis.find((x) => x.id === initialJetski);
    return j && initialDuration && (DURATIONS as readonly number[]).includes(initialDuration) && j.prices[initialDuration as Duration] != null
      ? (initialDuration as Duration)
      : null;
  });
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const today = useToday();
  const [month, setMonth] = useState(today.slice(0, 7));
  const [openDays, setOpenDays] = useState<{ key: string; days: Set<string> } | null>(null);
  const [slots, setSlots] = useState<{ key: string; slots: Slot[] } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const keyRef = useRef<string>(newKey());

  const daysKey = jetskiId && duration ? `${jetskiId}|${duration}|${month}` : null;
  const slotsKey = jetskiId && duration && date ? `${jetskiId}|${duration}|${date}` : null;

  // dni z wolnymi terminami w widocznym miesiącu
  useEffect(() => {
    if (!daysKey || !jetskiId || !duration) return;
    const first = `${month}-01`;
    const from = first < today ? today : first;
    const ctrl = new AbortController();
    fetch(`/api/availability?jetski=${encodeURIComponent(jetskiId)}&duration=${duration}&from=${from}&days=42`, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { days: string[] }) => setOpenDays({ key: daysKey, days: new Set(d.days) }))
      .catch((e) => e.name !== "AbortError" && setLoadError("Nie udało się pobrać kalendarza. Odśwież stronę."));
    return () => ctrl.abort();
  }, [daysKey, jetskiId, duration, month, today]);

  // godziny w wybranym dniu
  useEffect(() => {
    if (!slotsKey || !jetskiId || !duration || !date) return;
    const ctrl = new AbortController();
    fetch(`/api/availability?jetski=${encodeURIComponent(jetskiId)}&duration=${duration}&date=${date}`, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { slots: Slot[] }) => setSlots({ key: slotsKey, slots: d.slots }))
      .catch((e) => e.name !== "AbortError" && setLoadError("Nie udało się sprawdzić dostępności. Spróbuj ponownie."));
    return () => ctrl.abort();
  }, [slotsKey, jetskiId, duration, date]);

  const daySet = openDays?.key === daysKey ? openDays.days : null;
  const daySlots = slots?.key === slotsKey ? slots.slots : null;

  const resetFrom = (step: "jetski" | "duration" | "date") => {
    if (step === "jetski" || step === "duration") setDate(null);
    setTime(null);
    setFormError(null);
    keyRef.current = newKey();
  };

  const price = jetski && duration ? jetski.prices[duration] : null;
  const startMs = date && time ? fromLocal(date, toMinutes(time)) : null;
  const endMs = startMs != null && duration ? startMs + duration * 60_000 : null;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!jetski || !duration || !date || !time) {
      setFormError("Wybierz skuter, czas, datę i godzinę.");
      return;
    }
    const form = new FormData(e.currentTarget);
    const payload = {
      jetskiId: jetski.id,
      duration,
      date,
      time,
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      note: form.get("note"),
      acceptTerms: form.get("acceptTerms") === "on",
      acceptRules: form.get("acceptRules") === "on",
      idempotencyKey: keyRef.current,
    };
    const local = validateContact(payload);
    const localErrors: Record<string, string> = { ...(local.errors as Record<string, string>) };
    if (!payload.acceptTerms) localErrors.acceptTerms = "Aby zarezerwować, zaakceptuj regulamin wypożyczalni.";
    if (!payload.acceptRules) localErrors.acceptRules = "Potwierdź, że znasz zasady wynajmu i wymagania dla wybranego skutera.";
    setErrors(localErrors);
    if (Object.keys(localErrors).length) {
      setFormError("Popraw zaznaczone pola.");
      document.getElementById(`b-${Object.keys(localErrors)[0]}`)?.focus();
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.booking) {
        router.push(`/rezerwacja/potwierdzenie?nr=${encodeURIComponent(data.booking.number)}&t=${encodeURIComponent(data.booking.token)}&nowa=1`);
        return;
      }
      setErrors(data?.error?.fields ?? {});
      setFormError(data?.error?.message ?? "Nie udało się zarezerwować. Spróbuj ponownie.");
      if (res.status === 409) {
        keyRef.current = newKey();
        setTime(null);
        setSlots(null);
      }
    } catch {
      setFormError("Brak połączenia. Sprawdź internet i spróbuj ponownie – Twoje dane zostały w formularzu.");
    } finally {
      setSubmitting(false);
    }
  }

  if (bookable.length === 0) {
    return (
      <div className="border-t-2 border-graphite pt-8">
        <p className="font-display text-4xl font-extrabold uppercase">Rezerwacje online wkrótce</p>
        <p className="mt-3 max-w-xl text-lg text-muted">Cennik sezonu jest w przygotowaniu, więc nie przyjmujemy jeszcze rezerwacji przez stronę. Napisz do nas, a odpowiemy z terminami.</p>
        <Link href="/#kontakt" className="btn mt-6">
          Napisz do nas
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      onInput={(e) => {
        const key = (e.target as HTMLElement).id?.replace(/^b-/, "");
        if (key && errors[key])
          setErrors((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
      }}
      noValidate
      className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start lg:gap-14">
      <div className="grid gap-14">
        {/* 1. Skuter */}
        <Step n={1} title="Wybierz skuter" done={!!jetski}>
          <div role="radiogroup" aria-label="Skuter" className="grid gap-3 sm:grid-cols-2">
            {jetskis.map((j) => {
              const disabled = !hasAnyPrice(j);
              const selected = j.id === jetskiId;
              const from = DURATIONS.find((d) => j.prices[d] != null);
              return (
                <button
                  key={j.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={disabled}
                  onClick={() => {
                    setJetskiId(j.id);
                    if (duration && j.prices[duration] == null) setDuration(null);
                    resetFrom("jetski");
                  }}
                  className={`grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-4 p-2 pr-4 text-left transition-shadow disabled:cursor-not-allowed disabled:opacity-50 ${
                    selected ? "bg-graphite text-white" : "bg-white shadow-[inset_0_0_0_1.5px_var(--color-control)] hover:shadow-[inset_0_0_0_1.5px_var(--color-graphite)]"
                  }`}
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-sand">
                    {j.image && <Image src={j.image} alt="" fill sizes="88px" className="object-cover" unoptimized={j.image.startsWith("/media/")} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl font-extrabold uppercase leading-none">{jetskiTitle(j)}</span>
                    <span className={`mt-1 block text-sm ${selected ? "text-white/70" : "text-muted"}`}>
                      {LICENSE_LABEL[j.license]}
                      {" · "}
                      {disabled ? "cena wkrótce" : `od ${formatPrice(j.prices[from!])}`}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {jetski?.licenseNote && <p className="mt-4 border-l-4 border-turq py-1 pl-4 text-muted">{jetski.licenseNote}</p>}
        </Step>

        {/* 2. Czas */}
        <Step n={2} title="Określ czas wynajmu" done={!!duration} locked={!jetski}>
          <div role="radiogroup" aria-label="Czas wynajmu" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DURATIONS.map((d) => {
              const p = jetski?.prices[d] ?? null;
              const selected = d === duration;
              return (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={!jetski || p == null}
                  onClick={() => {
                    setDuration(d);
                    resetFrom("duration");
                  }}
                  className={`px-3 py-3 text-left disabled:cursor-not-allowed disabled:opacity-40 ${
                    selected ? "bg-graphite text-white" : "bg-white shadow-[inset_0_0_0_1.5px_var(--color-control)] hover:shadow-[inset_0_0_0_1.5px_var(--color-graphite)]"
                  }`}
                >
                  <span className="block font-display text-3xl font-extrabold leading-none">{durationLabel(d)}</span>
                  <span className={`tabular mt-1 block text-sm ${selected ? "text-white/75" : "text-muted"}`}>{p == null ? "brak ceny" : formatPrice(p)}</span>
                </button>
              );
            })}
          </div>
        </Step>

        {/* 3. Data */}
        <Step n={3} title="Wybierz datę" done={!!date} locked={!duration}>
          <Calendar
            month={month}
            onMonth={setMonth}
            today={today}
            maxDate={addDays(today, rules.horizonDays)}
            available={daySet}
            selected={date}
            disabled={!duration}
            onSelect={(d) => {
              setDate(d);
              resetFrom("date");
            }}
          />
        </Step>

        {/* 4. Godzina */}
        <Step n={4} title="Wybierz godzinę rozpoczęcia" done={!!time} locked={!date}>
          {date && !daySlots && <p className="text-muted">Sprawdzam wolne terminy…</p>}
          {date && daySlots && daySlots.length === 0 && <p className="text-muted">W tym dniu nie ma terminów dla wybranego czasu. Wybierz inny dzień.</p>}
          {daySlots && daySlots.length > 0 && (
            <>
              <div role="radiogroup" aria-label="Godzina rozpoczęcia" className="tabular grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
                {daySlots.map((s) => (
                  <button
                    key={s.time}
                    type="button"
                    role="radio"
                    aria-checked={time === s.time}
                    disabled={!s.available}
                    onClick={() => {
                      setTime(s.time);
                      setFormError(null);
                    }}
                    className={`min-h-12 font-semibold disabled:cursor-not-allowed disabled:text-mist disabled:line-through disabled:shadow-none ${
                      time === s.time ? "bg-turq text-graphite" : "bg-white shadow-[inset_0_0_0_1.5px_var(--color-control)] hover:shadow-[inset_0_0_0_1.5px_var(--color-graphite)]"
                    }`}
                  >
                    {s.time}
                    {!s.available && <span className="sr-only"> (zajęte)</span>}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted">Przekreślone godziny są zajęte. Między wynajmami przygotowujemy skuter dla kolejnej osoby.</p>
            </>
          )}
          {!date && <p className="text-muted">Najpierw wybierz datę.</p>}
        </Step>

        {/* 5. Dane */}
        <Step n={5} title="Twoje dane" done={false} locked={!time}>
          <fieldset disabled={!time} className="grid gap-5 disabled:opacity-60">
            <legend className="sr-only">Dane kontaktowe</legend>
            <Field id="b-name" label="Imię i nazwisko" error={errors.name}>
              <input id="b-name" name="name" autoComplete="name" className="field" aria-invalid={!!errors.name} aria-describedby={errors.name ? "b-name-err" : undefined} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="b-email" label="E-mail" error={errors.email}>
                <input id="b-email" name="email" type="email" autoComplete="email" className="field" aria-invalid={!!errors.email} aria-describedby={errors.email ? "b-email-err" : undefined} />
              </Field>
              <Field id="b-phone" label="Telefon" error={errors.phone}>
                <input id="b-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" className="field" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "b-phone-err" : undefined} />
              </Field>
            </div>
            <Field id="b-note" label="Uwagi (opcjonalnie)">
              <textarea id="b-note" name="note" rows={3} maxLength={600} className="field" placeholder="Np. płyniemy we dwoje, pierwszy raz na skuterze" />
            </Field>

            <div className="grid gap-4 border-t border-line pt-5">
              <label className="flex items-start gap-3">
                <input id="b-acceptTerms" type="checkbox" name="acceptTerms" className="check" aria-invalid={!!errors.acceptTerms} aria-describedby={errors.acceptTerms ? "b-acceptTerms-err" : undefined} />
                <span>
                  Akceptuję{" "}
                  <Link href="/regulamin" target="_blank" className="link font-semibold">
                    regulamin wypożyczalni
                  </Link>{" "}
                  i zapoznałem/am się z{" "}
                  <Link href="/polityka-prywatnosci" target="_blank" className="link font-semibold">
                    polityką prywatności
                  </Link>
                  .
                </span>
              </label>
              {errors.acceptTerms && (
                <p id="b-acceptTerms-err" className="field-error -mt-2">
                  {errors.acceptTerms}
                </p>
              )}
              <label className="flex items-start gap-3">
                <input id="b-acceptRules" type="checkbox" name="acceptRules" className="check" aria-invalid={!!errors.acceptRules} aria-describedby={errors.acceptRules ? "b-acceptRules-err" : undefined} />
                <span>
                  Znam{" "}
                  <Link href="/zasady-wynajmu" target="_blank" className="link font-semibold">
                    zasady wynajmu
                  </Link>{" "}
                  i spełniam wymagania dla wybranego skutera{jetski?.license === "required" ? ", w tym posiadam wymagany patent" : ""}. Wiem, że kaucję wpłacam na miejscu.
                </span>
              </label>
              {errors.acceptRules && (
                <p id="b-acceptRules-err" className="field-error -mt-2">
                  {errors.acceptRules}
                </p>
              )}
            </div>
          </fieldset>
        </Step>
      </div>

      {/* Podsumowanie */}
      <aside aria-label="Podsumowanie rezerwacji" className="on-dark bg-navy p-6 text-white lg:sticky lg:top-24">
        <h2 className="font-display text-4xl font-extrabold uppercase">Podsumowanie</h2>
        <span className="wake mt-3 w-[85%]" aria-hidden="true" />
        <dl className="mt-6 grid gap-3 text-[0.98rem]">
          <Row label="Skuter" value={jetski ? jetskiTitle(jetski) : "—"} />
          <Row label="Czas" value={duration ? durationLabelLong(duration) : "—"} />
          <Row label="Data" value={date ? formatDateLong(date) : "—"} />
          <Row label="Start" value={time ?? "—"} />
          <Row
            label="Zwrot"
            value={
              endMs != null && date
                ? `${toTime(toLocal(endMs).minutes)}${toLocal(endMs).date !== date ? `, ${formatDateLong(toLocal(endMs).date)}` : ""}`
                : "—"
            }
          />
        </dl>
        <dl className="mt-6 grid gap-3 border-t border-slate-line pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-white/70">Cena wynajmu</dt>
            <dd className="tabular font-display text-4xl font-extrabold leading-none">{formatPrice(price)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-white/70">Kaucja zwrotna</dt>
            <dd className="tabular font-display text-2xl font-bold leading-none">{jetski ? formatPrice(jetski.depositGr) : "—"}</dd>
          </div>
        </dl>
        <p className="mt-5 text-sm text-white/65">
          Płatność i kaucja na miejscu, przed wypłynięciem. Rezerwacja jest wstępna, dopóki nie potwierdzimy jej telefonicznie lub e-mailem. Bezpłatne anulowanie do{" "}
          {rules.cancelFreeHours} h przed startem.
        </p>
        {formError && (
          <p role="alert" className="mt-5 border-l-4 border-[#ff9a92] bg-slate px-4 py-3">
            {formError}
          </p>
        )}
        {loadError && (
          <p role="alert" className="mt-5 border-l-4 border-[#ff9a92] bg-slate px-4 py-3">
            {loadError}
          </p>
        )}
        <button type="submit" className="btn btn-primary mt-6 w-full" disabled={submitting || !time}>
          {submitting ? "Rezerwuję…" : "Potwierdź rezerwację"}
        </button>
      </aside>
    </form>
  );
}

function Step({ n, title, done, locked = false, children }: { n: number; title: string; done: boolean; locked?: boolean; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${n}`} className={locked ? "opacity-55" : undefined}>
      <div className="mb-5 flex items-center gap-4">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-xl font-extrabold ${done ? "bg-turq text-graphite" : "bg-graphite text-white"}`} aria-hidden="true">
          {done ? <CheckIcon size={20} /> : n}
        </span>
        <h2 id={`step-${n}`} className="font-display text-3xl font-extrabold uppercase leading-none md:text-4xl">
          <span className="sr-only">Krok {n}: </span>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-white/70">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}

function Calendar({
  month,
  onMonth,
  today,
  maxDate,
  available,
  selected,
  disabled,
  onSelect,
}: {
  month: string;
  onMonth: (m: string) => void;
  today: string;
  maxDate: string;
  available: Set<string> | null;
  selected: string | null;
  disabled: boolean;
  onSelect: (d: string) => void;
}) {
  const cells = useMemo(() => {
    const first = `${month}-01`;
    const weekday = (new Date(`${first}T12:00:00Z`).getUTCDay() + 6) % 7; // pon = 0
    const out: (string | null)[] = Array.from({ length: weekday }, () => null);
    for (let d = first; d.startsWith(month); d = addDays(d, 1)) out.push(d);
    return out;
  }, [month]);
  const shift = (n: number) => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(Date.UTC(y, m - 1 + n, 1));
    onMonth(d.toISOString().slice(0, 7));
  };
  const canPrev = month > today.slice(0, 7);
  const canNext = month < maxDate.slice(0, 7);

  return (
    <div className={`max-w-xl ${disabled ? "pointer-events-none" : ""}`}>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} disabled={!canPrev || disabled} className="min-h-11 px-3 font-semibold disabled:opacity-30" aria-label="Poprzedni miesiąc">
          ‹ Wstecz
        </button>
        <p className="font-display text-2xl font-extrabold uppercase" aria-live="polite">
          {monthFormatter.format(new Date(`${month}-01T12:00:00Z`))}
        </p>
        <button type="button" onClick={() => shift(1)} disabled={!canNext || disabled} className="min-h-11 px-3 font-semibold disabled:opacity-30" aria-label="Następny miesiąc">
          Dalej ›
        </button>
      </div>
      <div className="tabular grid grid-cols-7 gap-1 text-center" aria-label="Kalendarz">
        {[1, 2, 3, 4, 5, 6, 0].map((d) => (
          <div key={d} className="py-2 text-sm font-semibold text-muted" aria-hidden="true">
            {WEEKDAYS_SHORT[d]}
          </div>
        ))}
        {cells.map((d, i) =>
          d ? (
            <button
              key={d}
              type="button"
              disabled={disabled || !available?.has(d)}
              aria-pressed={selected === d}
              aria-label={`${formatDateLong(d)}${available?.has(d) ? "" : " – brak wolnych terminów"}`}
              onClick={() => onSelect(d)}
              className={`aspect-square min-h-11 text-lg font-semibold disabled:cursor-not-allowed disabled:font-normal disabled:text-mist ${
                selected === d ? "bg-graphite text-white" : available?.has(d) ? "bg-white shadow-[inset_0_0_0_1.5px_var(--color-control)] hover:shadow-[inset_0_0_0_1.5px_var(--color-graphite)]" : ""
              } ${d === today ? "underline decoration-turq decoration-2 underline-offset-4" : ""}`}
            >
              {Number(d.slice(8))}
            </button>
          ) : (
            <div key={`e${i}`} />
          ),
        )}
      </div>
      {!disabled && available === null && <p className="mt-3 text-sm text-muted">Sprawdzam dostępność…</p>}
      {!disabled && available && available.size === 0 && <p className="mt-3 text-sm text-muted">W tym miesiącu brak wolnych terminów dla wybranego czasu. Sprawdź kolejny miesiąc.</p>}
    </div>
  );
}
