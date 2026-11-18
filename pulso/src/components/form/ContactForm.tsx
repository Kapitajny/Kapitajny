"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { contactForm, site } from "@/config/site";
import { packageById, packages } from "@/config/pricing";
import { services } from "@/data/services";
import {
  applyIntent,
  budgets,
  emptyForm,
  firstInvalidStep,
  goals,
  limits,
  steps,
  submitContact,
  summaryRows,
  summaryText,
  validateStep,
  type ContactFormData,
  type FieldName,
  type FormErrors,
  type ServiceChoice,
  type StepId,
} from "@/lib/contact-form";
import { CONTACT_FORM_ID, getIntent, subscribeIntent, type ContactIntent } from "@/lib/contact-intent";
import { channelStyle } from "@/lib/channels";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { Arrow } from "@/components/ui/ContactLink";
import { Check } from "@/components/ui/Icons";
import { withBasePath } from "@/lib/paths";

type Status = "editing" | "sending" | "sent" | "error-network" | "error-rejected" | "not-configured";
const serverIntent: ContactIntent = { nonce: 0 };

export function ContactForm() {
  const [data, setData] = useState<ContactFormData>(emptyForm);
  const [step, setStep] = useState<StepId>(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [attempted, setAttempted] = useState<Set<StepId>>(new Set());
  const [status, setStatus] = useState<Status>("editing");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const statusRef = useRef<Status>("editing");
  const sendingRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const moved = useRef(false);

  const intent = useSyncExternalStore(subscribeIntent, getIntent, () => serverIntent);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (intent.nonce === 0) return;
    const s = statusRef.current;
    if (s === "sent") {
      // Po wysłaniu nowy wybór z CTA rozpoczyna nowe zgłoszenie (zamiast ginąć przy „Wyślij kolejne”).
      setData(applyIntent(emptyForm, intent));
      setAttempted(new Set());
      setErrors({});
      setStep(1);
      setStatus("editing");
      return;
    }
    setData((d) => applyIntent(d, intent));
    setErrors((e) => ({ ...e, services: undefined }));
    // W trakcie wysyłania stan się nie zmienia: przycisk zostaje zablokowany (brak podwójnych zgłoszeń).
    if (s !== "sending") setStatus("editing");
  }, [intent]);

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    headingRef.current?.focus({ preventScroll: true });
    const top = formRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) formRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step]);

  const update = <K extends FieldName>(key: K, value: ContactFormData[K]) => {
    const next = { ...data, [key]: value };
    setData(next);
    if (attempted.has(step)) setErrors(validateStep(step, next));
    if (status === "error-network" || status === "error-rejected" || status === "not-configured") setStatus("editing");
  };

  const toggleService = (id: ServiceChoice) => {
    const has = data.services.includes(id);
    let next: ServiceChoice[];
    if (id === "unsure") next = has ? [] : ["unsure"];
    else next = has ? data.services.filter((s) => s !== id) : [...data.services.filter((s) => s !== "unsure"), id];
    update("services", next);
  };

  const goTo = (s: StepId) => {
    moved.current = true;
    setErrors({});
    setStep(s);
  };

  const focusFirstError = (e: FormErrors) => {
    const first = Object.keys(e)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
      el?.focus();
    });
  };

  const next = () => {
    const e = validateStep(step, data);
    setAttempted((a) => new Set(a).add(step));
    setErrors(e);
    if (Object.keys(e).length) return focusFirstError(e);
    goTo((step + 1) as StepId);
  };

  const submit = async () => {
    if (sendingRef.current) return;
    const e = validateStep(6, data);
    setAttempted((a) => new Set(a).add(6));
    setErrors(e);
    if (Object.keys(e).length) return focusFirstError(e);
    const invalid = firstInvalidStep(data);
    if (invalid) return goTo(invalid);
    if (!contactForm.endpoint) return setStatus("not-configured");
    sendingRef.current = true;
    setStatus("sending");
    try {
      const res = await submitContact(contactForm.endpoint, data, contactForm.accessKey);
      if (res.ok) {
        setStatus("sent");
        requestAnimationFrame(() => headingRef.current?.focus());
      } else if (res.reason === "not-configured") setStatus("not-configured");
      else setStatus(res.reason === "rejected" ? "error-rejected" : "error-network");
    } finally {
      sendingRef.current = false;
    }
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText(data));
      setCopied(true);
      setCopyFailed(false);
    } catch {
      // Brak dostępu do schowka: pokazujemy podsumowanie do ręcznego skopiowania.
      setCopied(false);
      setCopyFailed(true);
    }
  };

  const reset = () => {
    setData(emptyForm);
    setAttempted(new Set());
    setErrors({});
    setStatus("editing");
    goTo(1);
  };

  const busy = status === "sending";
  const current = steps[step - 1];
  const pkg = packageById(data.package);
  const platformCount = data.services.filter((s) => s !== "unsure").length;

  if (status === "sent") {
    return (
      <div id={CONTACT_FORM_ID} className="scroll-mt-28 rounded-[10px] border-2 border-ink bg-sheet p-6 shadow-(--shadow-sheet) sm:p-8">
        <span className="flight block h-3 w-24" data-state="booked" aria-hidden="true" />
        <h3 ref={headingRef} tabIndex={-1} className="t-h2 mt-6 !text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] outline-none">
          Dziękujemy, {data.name.trim()}. Zgłoszenie dotarło.
        </h3>
        <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-2">
          Odezwiemy się na adres <strong className="font-[640] text-ink">{data.email.trim()}</strong> lub telefonicznie, żeby
          umówić konsultację. Do tego czasu nie musisz niczego przygotowywać.
        </p>
        <button type="button" onClick={reset} className="btn btn-secondary mt-8" data-autofocus="">
          Wyślij kolejne zgłoszenie
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      id={CONTACT_FORM_ID}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (step < 6) next();
        else void submit();
      }}
      className="relative scroll-mt-28 rounded-[10px] border border-rule bg-sheet shadow-(--shadow-sheet)"
      aria-labelledby="formularz-krok"
    >
      {/* Postęp: kroki jako paski planu */}
      <div className="border-b border-rule px-4 pt-4 pb-3 sm:px-7 sm:pt-6">
        <ol className="grid grid-cols-6 gap-1.5" aria-label="Postęp formularza">
          {steps.map((s) => {
            const done = s.id < step;
            const isCurrent = s.id === step;
            return (
              <li key={s.id} aria-current={isCurrent ? "step" : undefined}>
                <button
                  type="button"
                  disabled={!done || busy}
                  onClick={() => goTo(s.id)}
                  className="group flex w-full flex-col gap-2 text-left disabled:cursor-default"
                  aria-label={`Krok ${s.id}: ${s.title}${done ? ", ukończony, wróć do tego kroku" : isCurrent ? ", bieżący" : ""}`}
                >
                  <span
                    className="flight block h-2 transition-colors duration-300"
                    data-state={done || isCurrent ? "booked" : "tentative"}
                    style={{ "--flight-color": done ? "var(--color-ink-3)" : "var(--color-ink)", "--flight-line": "var(--color-field)" } as React.CSSProperties}
                  />
                  <span
                    className={`hidden items-center gap-1 text-xs font-[620] sm:flex ${isCurrent ? "text-ink" : "text-ink-3"} ${done ? "group-hover:text-ink" : ""}`}
                  >
                    {done && <Check className="h-3.5 w-3.5" />}
                    {s.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="tnum mt-3 text-sm text-ink-3 sm:hidden">
          Krok {step} z {steps.length}: <span className="font-[620] text-ink">{current.title}</span>
        </p>
      </div>

      <div className="px-4 py-6 sm:px-7 sm:py-8">
        <h3 id="formularz-krok" ref={headingRef} tabIndex={-1} className="t-h3 outline-none">
          <span className="sr-only">
            Krok {step} z {steps.length}.{" "}
          </span>
          {current.heading}
        </h3>

        <div key={step} className="form-step mt-6">
          {step === 1 && (
            <fieldset aria-describedby={errors.services ? "err-services" : "pomoc-uslugi"}>
              <legend className="sr-only">Wybierz usługi</legend>
              <p id="pomoc-uslugi" className="-mt-2 mb-4 text-[0.9375rem] text-ink-2">
                Możesz zaznaczyć kilka platform.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {services.map((s, i) => {
                  const on = data.services.includes(s.id);
                  return (
                    <ChoiceTile
                      key={s.id}
                      type="checkbox"
                      name="uslugi"
                      checked={on}
                      onChange={() => toggleService(s.id)}
                      autoFocus={i === 0}
                      dataField={i === 0 ? "services" : undefined}
                    >
                      <PlatformIcon id={s.id} className="h-5 w-5 shrink-0" />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="font-[640]">{s.name}</span>
                        <span className="truncate text-sm text-ink-3">{s.where}</span>
                      </span>
                      <span className="flight block h-2.5 w-8 shrink-0" style={channelStyle(s.id)} data-state={on ? "booked" : "tentative"} aria-hidden="true" />
                    </ChoiceTile>
                  );
                })}
                <ChoiceTile type="checkbox" name="uslugi" checked={data.services.includes("unsure")} onChange={() => toggleService("unsure")} className="sm:col-span-2">
                  <span className="flex flex-col">
                    <span className="font-[640]">Nie wiem, która platforma będzie odpowiednia</span>
                    <span className="text-sm text-ink-3">Doradzimy na konsultacji</span>
                  </span>
                </ChoiceTile>
              </div>
              <FieldError id="err-services" msg={errors.services} />

              <div className="mt-5 rounded-md bg-paper-2 px-4 py-3 text-[0.9375rem]">
                {pkg ? (
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <p>
                      Wybrany pakiet: <strong className="font-[680]">{pkg.name}</strong>{" "}
                      <span className="text-ink-2">({pkg.platformsLabel})</span>
                      {platformCount > pkg.platforms.max && (
                        <span className="mt-1 block text-ink-2">
                          Zaznaczone platformy: {platformCount}. Omówimy na konsultacji, który pakiet będzie właściwy.
                        </span>
                      )}
                    </p>
                    <button type="button" className="link-ink min-h-11 text-[0.9375rem] font-[600]" onClick={() => update("package", null)}>
                      Usuń wybór pakietu
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="text-ink-2">Pakiet (opcjonalnie):</span>
                    <select
                      className="field-input !min-h-11 w-full max-w-full !py-2 sm:w-auto"
                      value={data.package ?? ""}
                      onChange={(e) => update("package", (e.target.value || null) as ContactFormData["package"])}
                    >
                      <option value="">jeszcze nie wiem</option>
                      {packages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.platformsLabel})
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset aria-describedby={errors.goal ? "err-goal" : undefined}>
              <legend className="sr-only">Cel reklamy</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {goals.map((g, i) => (
                  <ChoiceTile
                    key={g.id}
                    type="radio"
                    name="cel"
                    checked={data.goal === g.id}
                    onChange={() => update("goal", g.id)}
                    autoFocus={i === 0}
                    dataField={i === 0 ? "goal" : undefined}
                    className={g.id === "other" ? "sm:col-span-2" : ""}
                  >
                    <span className="font-[620]">{g.label}</span>
                  </ChoiceTile>
                ))}
              </div>
              <FieldError id="err-goal" msg={errors.goal} />
              {data.goal === "other" && (
                <TextField
                  label="Jaki to cel?"
                  name="goalOther"
                  value={data.goalOther}
                  onChange={(v) => update("goalOther", v)}
                  error={errors.goalOther}
                  maxLength={limits.short}
                  className="mt-5"
                  placeholder="np. rekrutacja pracowników"
                />
              )}
            </fieldset>
          )}

          {step === 3 && (
            <fieldset aria-describedby={`pomoc-budzet${errors.budget ? " err-budget" : ""}`}>
              <legend className="sr-only">Miesięczny budżet reklamowy</legend>
              <p id="pomoc-budzet" className="-mt-2 mb-4 max-w-[60ch] text-[0.9375rem] text-ink-2">
                Chodzi o pieniądze na same reklamy, płacone bezpośrednio platformom, a nie o opłatę za obsługę. Orientacyjna
                kwota wystarczy.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {budgets.map((b, i) => (
                  <ChoiceTile
                    key={b.id}
                    type="radio"
                    name="budzet"
                    checked={data.budget === b.id}
                    onChange={() => update("budget", b.id)}
                    autoFocus={i === 0}
                    dataField={i === 0 ? "budget" : undefined}
                  >
                    <span className="tnum font-[620]">{b.label}</span>
                  </ChoiceTile>
                ))}
              </div>
              <FieldError id="err-budget" msg={errors.budget} />
            </fieldset>
          )}

          {step === 4 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Nazwa firmy" name="company" value={data.company} onChange={(v) => update("company", v)} error={errors.company} autoComplete="organization" maxLength={limits.short} autoFocus />
              <TextField label="Branża" name="industry" value={data.industry} onChange={(v) => update("industry", v)} error={errors.industry} maxLength={limits.short} placeholder="np. usługi remontowe" />
              <TextField
                label="Adres strony internetowej"
                optional
                name="website"
                value={data.website}
                onChange={(v) => update("website", v)}
                error={errors.website}
                autoComplete="url"
                inputMode="url"
                maxLength={limits.website}
                placeholder="firma.pl"
                className="sm:col-span-2"
              />
            </div>
          )}

          {step === 5 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Imię" name="name" value={data.name} onChange={(v) => update("name", v)} error={errors.name} autoComplete="given-name" maxLength={limits.short} autoFocus />
              <TextField label="Adres e-mail" name="email" type="email" value={data.email} onChange={(v) => update("email", v)} error={errors.email} autoComplete="email" inputMode="email" maxLength={limits.short} />
              <TextField label="Numer telefonu" name="phone" type="tel" value={data.phone} onChange={(v) => update("phone", v)} error={errors.phone} autoComplete="tel" inputMode="tel" maxLength={30} placeholder="600 100 200" />
              <div className="sm:col-span-2">
                <TextField
                  label="Dodatkowa wiadomość"
                  optional
                  name="message"
                  multiline
                  value={data.message}
                  onChange={(v) => update("message", v)}
                  error={errors.message}
                  maxLength={limits.message}
                  placeholder="Co jeszcze warto wiedzieć przed rozmową?"
                />
                <p className="tnum mt-1.5 text-right text-xs text-ink-3" aria-live="off">
                  {data.message.length} / {limits.message}
                </p>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <dl className="divide-y divide-rule border-y border-rule">
                {groupRows(summaryRows(data)).map(([s, rows]) => (
                  <div key={s} className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[1fr_auto]">
                    <div className="grid gap-y-1.5 sm:grid-cols-[11rem_1fr] sm:gap-x-4">
                      {rows.map((r) => (
                        <div key={r.label} className="contents">
                          <dt className="text-sm text-ink-3">{r.label}</dt>
                          <dd className="text-[0.9875rem] font-[560] break-words">{r.value}</dd>
                        </div>
                      ))}
                    </div>
                    <button type="button" disabled={busy} onClick={() => goTo(s)} className="link-ink min-h-11 justify-self-start text-[0.9375rem] font-[600] sm:self-start">
                      Popraw<span className="sr-only">: {steps[s - 1].title}</span>
                    </button>
                  </div>
                ))}
              </dl>

              <label className="mt-6 flex items-start gap-3 text-[0.9375rem] leading-relaxed">
                <input
                  type="checkbox"
                  data-field="consent"
                  data-autofocus=""
                  checked={data.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? "err-consent" : undefined}
                  className="mt-1 h-5 w-5 shrink-0 accent-ink"
                />
                <span className="text-ink-2">
                  Wyrażam zgodę na przetwarzanie moich danych osobowych podanych w formularzu przez {site.fullName} w celu odpowiedzi
                  na zgłoszenie i przygotowania oferty. Zasady przetwarzania opisuje{" "}
                  <a href={withBasePath("/polityka-prywatnosci/")} className="link-ink" target="_blank" rel="noopener">
                    Polityka prywatności
                  </a>
                  .
                </span>
              </label>
              <FieldError id="err-consent" msg={errors.consent} />

              {!contactForm.endpoint && (
                <div className="mt-6 rounded-md border-[1.5px] border-dashed border-field px-4 py-3 text-[0.9375rem] text-ink-2" role="note">
                  <strong className="font-[660] text-ink">Wysyłka formularza nie jest jeszcze włączona.</strong> Po kliknięciu
                  „Wyślij zgłoszenie” odpowiedzi nie zostaną nigdzie przesłane. Pokażemy, jak przekazać je inaczej.
                </div>
              )}
            </div>
          )}
        </div>

        <div aria-live="polite">
          {status === "error-network" && (
            <p className="field-error mt-6 rounded-md bg-[#fdecea] px-4 py-3" role="alert">
              Nie udało się wysłać zgłoszenia. Sprawdź połączenie z internetem i spróbuj ponownie. Twoje odpowiedzi są zachowane.
            </p>
          )}
          {status === "error-rejected" && (
            <div className="mt-6 rounded-md bg-[#fdecea] px-4 py-3" role="alert">
              <p className="field-error">
                Serwer formularza odrzucił zgłoszenie. Spróbuj ponownie za chwilę albo skopiuj podsumowanie. Twoje odpowiedzi są
                zachowane.
              </p>
              <button type="button" className="btn btn-secondary btn-sm mt-3" onClick={copySummary}>
                {copied ? "Skopiowano" : "Skopiuj podsumowanie"}
              </button>
            </div>
          )}
          {copyFailed && (
            <div className="mt-4">
              <label htmlFor="podsumowanie-tekst" className="text-[0.9375rem] font-[620]">
                Podsumowanie do skopiowania
              </label>
              <textarea id="podsumowanie-tekst" readOnly rows={8} className="field-input mt-2 font-[inherit] text-[0.9375rem]" value={summaryText(data)} />
            </div>
          )}
          {status === "not-configured" && (
            <div className="mt-6 rounded-md border-2 border-ink px-4 py-4 text-[0.9375rem]" role="alert">
              <p className="font-[680]">Zgłoszenie nie zostało wysłane: wysyłka formularza nie jest jeszcze skonfigurowana.</p>
              <p className="mt-1 text-ink-2">
                Twoje odpowiedzi są zachowane w formularzu. Możesz skopiować podsumowanie
                {site.contact.email ? " i wysłać je e-mailem." : " i przekazać je nam, gdy dane kontaktowe pojawią się na stronie."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="btn btn-secondary btn-sm" onClick={copySummary}>
                  {copied ? "Skopiowano" : "Skopiuj podsumowanie"}
                </button>
                {site.contact.email && (
                  <a
                    className="btn btn-primary btn-sm"
                    href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Zgłoszenie PULSO")}&body=${encodeURIComponent(summaryText(data))}`}
                  >
                    Wyślij e-mailem
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pole-pułapka na boty: niewidoczne i niedostępne dla ludzi oraz czytników ekranu. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="pole-website2">Nie wypełniaj tego pola</label>
          <input
            id="pole-website2"
            name="website2"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={data.website2}
            onChange={(e) => update("website2", e.target.value)}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-6">
          {step > 1 ? (
            <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => goTo((step - 1) as StepId)}>
              <Arrow className="rotate-180" /> Wstecz
            </button>
          ) : (
            <span className="text-sm text-ink-3">Około 2 minut</span>
          )}
          {step < 6 ? (
            <button type="submit" className="btn btn-primary">
              Dalej <Arrow />
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={status === "sending"} aria-busy={status === "sending"}>
              {status === "sending" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" aria-hidden="true" /> Wysyłanie…
                </>
              ) : (
                <>
                  Wyślij zgłoszenie <Arrow />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function groupRows(rows: ReturnType<typeof summaryRows>): [StepId, typeof rows][] {
  const map = new Map<StepId, typeof rows>();
  rows.forEach((r) => map.set(r.step, [...(map.get(r.step) ?? []), r]));
  return [...map.entries()];
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="field-error mt-2 flex items-start gap-2">
      <svg viewBox="0 0 16 16" className="mt-[0.15em] h-4 w-4 shrink-0" aria-hidden="true" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.5v4.2M8 11h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {msg}
    </p>
  );
}

function ChoiceTile({
  type,
  name,
  checked,
  onChange,
  children,
  className = "",
  autoFocus,
  dataField,
}: {
  type: "checkbox" | "radio";
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  className?: string;
  autoFocus?: boolean;
  dataField?: string;
}) {
  return (
    <label
      className={`relative flex min-h-16 items-center gap-3 rounded-md border-[1.5px] px-4 py-3 transition-[border-color,background-color] duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
        checked ? "border-ink bg-paper" : "border-field bg-sheet hover:border-ink-3"
      } ${className}`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        data-autofocus={autoFocus ? "" : undefined}
        data-field={dataField}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`grid h-5 w-5 shrink-0 place-items-center border-[1.5px] transition-colors ${type === "radio" ? "rounded-full" : "rounded-[4px]"} ${
          checked ? "border-ink bg-ink text-paper" : "border-field bg-sheet"
        }`}
      >
        {checked && (type === "radio" ? <span className="h-2 w-2 rounded-full bg-paper" /> : <Check className="h-3.5 w-3.5" />)}
      </span>
      {children}
    </label>
  );
}

function TextField({
  label,
  name,
  value,
  onChange,
  error,
  optional,
  multiline,
  className = "",
  autoFocus,
  ...rest
}: {
  label: string;
  name: FieldName;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  optional?: boolean;
  multiline?: boolean;
  className?: string;
  autoFocus?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "url" | "text";
  maxLength?: number;
  placeholder?: string;
}) {
  const id = `pole-${name}`;
  const common = {
    id,
    name,
    value,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-blad` : undefined,
    "aria-required": !optional,
    "data-field": name,
    "data-autofocus": autoFocus ? "" : undefined,
    className: "field-input",
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  };
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-[0.9375rem] font-[620]">
        {label}
        {optional && <span className="text-sm font-[480] text-ink-3">opcjonalnie</span>}
      </label>
      {multiline ? <textarea rows={4} {...common} {...rest} className="field-input resize-y" /> : <input type={rest.type ?? "text"} {...common} {...rest} />}
      <FieldError id={`${id}-blad`} msg={error} />
    </div>
  );
}
