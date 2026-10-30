"use client";

import { useRef, useState } from "react";
import { requestConsultation } from "@/app/actions";
import { categories, treatments } from "@/data/treatments";
import { bookingSteps, channels, days, formToObject, LIMITS, NOT_SURE, times, todayInPoland, validateBooking, type Area } from "@/lib/validation";
import { Consent, ErrorText, Honeypot, Input, NotConnected, Submit, TextArea, aria } from "./fields";
import { useFormFlow } from "./useFormFlow";

const stepNames = ["Treatment", "Timing", "Your details"];

const areas: { value: Area; label: string; hint: string }[] = [
  ...categories.map((c) => ({ value: c.slug as Area, label: c.name, hint: c.performedBy })),
  { value: NOT_SURE, label: "I'm not sure yet", hint: "We'll suggest a consultation" },
];

function Group({ legend, name, hint, error, children }: { legend: string; name: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <fieldset aria-describedby={aria(name, error, Boolean(hint))["aria-describedby"]}>
      <legend className="label">{legend}</legend>
      {hint && (
        <span id={`${name}-hint`} className="hint">
          {hint}
        </span>
      )}
      <div className="mt-3">{children}</div>
      <ErrorText name={name} error={error} />
    </fieldset>
  );
}

/**
 * Consultation request in three steps. Each step is checked before moving on; the last step shows a summary.
 * Without JavaScript all steps are shown at once and the form posts normally.
 */
export function BookingForm({ initialTreatment }: { initialTreatment?: string }) {
  const preset = treatments.find((t) => t.slug === initialTreatment);
  const [step, setStep] = useState(0);
  const [area, setArea] = useState<Area | "">(preset?.category ?? "");
  const [treatment, setTreatment] = useState(preset?.slug ?? "");
  const [summary, setSummary] = useState<string[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { state, pending, errors, formRef, formAction, submit, onBlur, onInput, clear, check } = useFormFlow(requestConsultation, (input) => validateBooking(input));

  // A server-side error on an earlier step brings that step back.
  const [seen, setSeen] = useState(state);
  if (seen !== state) {
    setSeen(state);
    if (state.status === "invalid") {
      const first = bookingSteps.findIndex((fields) => fields.some((f) => state.errors[f]));
      if (first >= 0) setStep(first);
    }
  }

  const go = (to: number) => {
    setStep(to);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const next = () => {
    if (!check(bookingSteps[step])) return;
    if (step === 1 && formRef.current) {
      const v = formToObject(new FormData(formRef.current));
      const picked = (v.days as string[] | undefined) ?? [];
      setSummary([
        area === NOT_SURE ? "Not sure yet – please advise" : (categories.find((c) => c.slug === area)?.name ?? ""),
        treatment ? (treatments.find((t) => t.slug === treatment)?.name ?? "") : "Treatment to be agreed",
        picked.length ? picked.map((d) => days.find((x) => x.value === d)?.full).join(", ") : "Any day",
        times.find((t) => t.value === v.time)?.label ?? "Any time",
      ]);
    }
    go(step + 1);
  };

  if (state.status === "sent") {
    return (
      <div role="status" className="border-t-2 border-burgundy pt-10">
        <p className="display-md">Request sent</p>
        <p className="mt-5 max-w-lg text-stone">{state.message}</p>
      </div>
    );
  }

  const available = area && area !== NOT_SURE ? treatments.filter((t) => t.category === area) : treatments;
  const stepClass = (i: number) => `step space-y-9 ${i === step ? "" : "js-hidden"}`;

  return (
    <form
      ref={(el) => {
        formRef.current = el;
        el?.setAttribute("data-enhanced", "");
      }}
      action={formAction}
      onSubmit={(e) => (step < 2 ? (e.preventDefault(), next()) : submit(e))}
      onBlur={onBlur}
      onInput={onInput}
      noValidate
      className="stepper relative"
    >
      <Honeypot />
      <div className="js-only">
        <ol className="grid grid-cols-3 gap-2" aria-label="Progress">
          {stepNames.map((name, i) => (
            <li key={name} aria-current={i === step ? "step" : undefined} className="text-xs">
              <span className={`block h-0.5 transition-colors duration-500 ${i <= step ? "bg-burgundy" : "bg-black/15"}`} />
              <span className={`mt-3 block ${i === step ? "font-medium text-black" : "text-stone"}`}>
                <span className="kicker">{String(i + 1).padStart(2, "0")}</span> {name}
              </span>
            </li>
          ))}
        </ol>
        <h2 ref={headingRef} tabIndex={-1} className="mt-12 font-display text-[clamp(2rem,3.4vw,3rem)] leading-none outline-none">
          {["What brings you to VÉRA?", "When suits you?", "How can we reach you?"][step]}
          <span className="sr-only">
            {" "}
            – step {step + 1} of 3
          </span>
        </h2>
      </div>

      <div className="mt-10">
        <section className={stepClass(0)} aria-label="Step 1: Treatment">
          <Group legend="Area" name="area" error={errors.area}>
            <div className="grid gap-2 sm:grid-cols-2">
              {areas.map((a) => (
                <label key={a.value} className="tile">
                  <input
                    type="radio"
                    name="area"
                    value={a.value}
                    checked={area === a.value}
                    onChange={() => {
                      setArea(a.value);
                      clear("area");
                      if (treatment && a.value !== NOT_SURE && treatments.find((t) => t.slug === treatment)?.category !== a.value) setTreatment("");
                    }}
                    {...aria("area", errors.area)}
                  />
                  <span>
                    <span className="text-sm font-medium">{a.label}</span>
                    <span className="tile-hint text-xs text-stone">{a.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </Group>

          <div>
            <label htmlFor="treatment" className="label">
              Treatment <span className="font-normal text-stone">(optional)</span>
            </label>
            <span id="treatment-hint" className="hint">
              Not sure? Leave it – we&apos;ll choose together at the consultation.
            </span>
            <select
              id="treatment"
              name="treatment"
              value={treatment}
              onChange={(e) => {
                setTreatment(e.target.value);
                const t = treatments.find((x) => x.slug === e.target.value);
                if (t && area !== NOT_SURE) setArea(t.category);
                clear("treatment");
              }}
              className="input"
              {...aria("treatment", errors.treatment, true)}
            >
              <option value="">To be agreed at the consultation</option>
              {categories
                .filter((c) => !area || area === NOT_SURE || c.slug === area)
                .map((c) => (
                  <optgroup key={c.slug} label={c.name}>
                    {available
                      .filter((t) => t.category === c.slug)
                      .map((t) => (
                        <option key={t.slug} value={t.slug}>
                          {t.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
            </select>
            <ErrorText name="treatment" error={errors.treatment} />
          </div>

          <Group legend="Is this your first visit to VÉRA?" name="firstVisit" error={errors.firstVisit}>
            <div className="flex flex-wrap gap-x-8 gap-y-3" onChange={() => clear("firstVisit")}>
              {[
                ["yes", "Yes, first visit"],
                ["no", "No, I've been before"],
              ].map(([value, label]) => (
                <label key={value} className="flex cursor-pointer items-center gap-3 text-sm">
                  <input type="radio" name="firstVisit" value={value} className="check rounded-full" />
                  {label}
                </label>
              ))}
            </div>
          </Group>
        </section>

        <section className={stepClass(1)} aria-label="Step 2: Timing">
          <Group legend="Preferred days" name="days" hint="Tick all that work for you. None ticked means any day." error={errors.days}>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {days.map((d) => (
                <label key={d.value} className="tile text-center">
                  <input type="checkbox" name="days" value={d.value} aria-label={d.full} />
                  <span aria-hidden="true" className="items-center text-sm">
                    {d.label}
                  </span>
                </label>
              ))}
            </div>
          </Group>
          <Group legend="Time of day" name="time" error={errors.time}>
            <div className="grid gap-2 sm:grid-cols-4">
              {times.map((t) => (
                <label key={t.value} className="tile">
                  <input type="radio" name="time" value={t.value} defaultChecked={t.value === "any"} />
                  <span>
                    <span className="text-sm font-medium">{t.label}</span>
                    {t.hint && <span className="tile-hint text-xs text-stone">{t.hint}</span>}
                  </span>
                </label>
              ))}
            </div>
          </Group>
          <Input name="earliest" type="date" label="Earliest date" optional min={todayInPoland()} hint="We'll offer the first free slot from this day." error={errors.earliest} className="max-w-xs" />
        </section>

        <section className={stepClass(2)} aria-label="Step 3: Your details">
          {summary.length > 0 && (
            <div className="js-only border border-black/15 bg-white/50 p-5">
              <p className="kicker text-rose-deep">Your request so far</p>
              <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                {summary.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <button type="button" onClick={() => go(0)} className="underline-draw mt-4 text-sm font-medium">
                Change
              </button>
            </div>
          )}
          <Input name="name" label="Full name" autoComplete="name" required maxLength={LIMITS.name} error={errors.name} />
          <div className="grid gap-7 sm:grid-cols-2">
            <Input name="phone" type="tel" label="Phone" autoComplete="tel" required error={errors.phone} />
            <Input name="email" type="email" label="E-mail" autoComplete="email" required maxLength={LIMITS.email} error={errors.email} />
          </div>
          <Group legend="How should we contact you?" name="contactBy" error={errors.contactBy}>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {channels.map((c) => (
                <label key={c.value} className="flex cursor-pointer items-center gap-3 text-sm">
                  <input type="radio" name="contactBy" value={c.value} defaultChecked={c.value === "phone"} className="check rounded-full" />
                  {c.label}
                </label>
              ))}
            </div>
          </Group>
          <TextArea
            name="notes"
            label="Anything we should know?"
            optional
            rows={4}
            maxLength={LIMITS.notes}
            hint="E.g. the best time to call. Please don't include health details – we'll discuss them in person."
            error={errors.notes}
          />
          <Consent error={errors.consent} onChange={() => clear("consent")} />
        </section>
      </div>

      <div aria-live="polite" className="mt-8">
        {state.status === "error" && <p className="error">{state.message}</p>}
        {state.status === "not_configured" && <NotConnected what="Your request" />}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-black/15 pt-8">
        <button type="button" onClick={() => go(step - 1)} className={`js-only underline-draw text-sm font-medium ${step === 0 ? "invisible" : ""}`}>
          Back
        </button>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-xs text-stone">Sending this form is not a booking – the studio confirms your visit.</p>
          {step < 2 ? (
            <button type="button" onClick={next} className="js-only cta cta-burgundy">
              Continue
            </button>
          ) : null}
          <span className={step < 2 ? "js-hidden" : ""}>
            <Submit pending={pending} label="Send request" />
          </span>
        </div>
      </div>
    </form>
  );
}
