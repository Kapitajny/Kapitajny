"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { useStudio } from "@/components/schedule/StudioProvider";
import { Alert, Check, Info } from "@/components/ui/Icons";
import { LEVEL_IDS, LEVELS } from "@/data/levels";
import { DAYS, SCHEDULE } from "@/data/schedule";
import { STYLES } from "@/data/styles";
import { MESSAGE_MAX_LENGTH, validateTrialForm, type FieldErrors, type TrialField, type TrialFormValues } from "@/lib/validation";

const EMPTY: TrialFormValues = { name: "", email: "", style: "", level: "", day: "", message: "", privacy: false };
const FIELD_ORDER: TrialField[] = ["name", "email", "style", "level", "day", "message", "privacy"];
const CLASS_DAYS = DAYS.filter((day) => SCHEDULE.some((entry) => entry.day === day.id));

export function TrialForm() {
  const ids = useId();
  const fieldId = (field: TrialField) => `${ids}-${field}`;
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const { prefill } = useStudio();

  const [values, setValues] = useState<TrialFormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<TrialField>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [sentName, setSentName] = useState<string | null>(null);
  const [appliedNonce, setAppliedNonce] = useState<number | null>(null);

  // Dane przekazane z innych sekcji (grafik, zajęcia, wydarzenia) – nakładamy je na formularz,
  // zachowując już wpisane imię i e-mail.
  if (prefill && prefill.nonce !== appliedNonce) {
    setAppliedNonce(prefill.nonce);
    setSentName(null);
    setValues((current) => ({
      ...current,
      style: prefill.style ?? current.style,
      level: prefill.level ?? current.level,
      day: prefill.day ?? current.day,
      message: prefill.message ?? current.message,
    }));
  }

  const update = <K extends TrialField>(field: K, value: TrialFormValues[K]) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Po pierwszej próbie wysłania błędy aktualizują się na bieżąco.
    if (submitted) setErrors(validateTrialForm(next));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateTrialForm(values);
    setErrors(nextErrors);
    setSubmitted(true);
    if (Object.keys(nextErrors).length > 0) {
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    // Tryb demonstracyjny: nic nie jest wysyłane ani zapisywane.
    setSentName(values.name.trim());
    setValues(EMPTY);
    setErrors({});
    setSubmitted(false);
    setShowSummary(false);
    requestAnimationFrame(() => successRef.current?.focus());
  };

  const errorList = FIELD_ORDER.filter((field) => errors[field]);
  const describedBy = (field: TrialField, hint?: string) => [hint, errors[field] ? `${fieldId(field)}-error` : null].filter(Boolean).join(" ") || undefined;

  const fieldError = (field: TrialField) =>
    errors[field] ? (
      <p id={`${fieldId(field)}-error`} className="field-error">
        <Alert size={16} className="mt-0.5 shrink-0" />
        {errors[field]}
      </p>
    ) : null;

  return (
    <section id="zapis" aria-labelledby="zapis-title" className="band section-y bg-blush">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="zapis-title" className="h2 text-wine" tabIndex={-1} data-section-focus>
            Zapisz się na pierwsze zajęcia
          </h2>
          <p className="lead prose-measure mt-6">Zostaw kilka informacji – odezwiemy się z propozycją terminu i odpowiemy na pytania.</p>
          <ul className="mt-8 space-y-3">
            {["Lekcja próbna kosztuje 25 zł (cena przykładowa)", "Nie musisz od razu kupować karnetu", "Możesz zmienić grupę po pierwszych zajęciach"].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check size={18} className="mt-1 shrink-0 text-wine" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex gap-3 rounded-2xl bg-ivory/70 p-5 text-[0.95rem]">
            <Info size={20} className="mt-0.5 shrink-0 text-wine" />
            <p>
              <strong>Formularz demonstracyjny.</strong> Strona nie jest połączona z systemem zapisów – dane nie są nigdzie wysyłane ani zapisywane, a
              rezerwacja nie zostanie utworzona.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          {sentName !== null ? (
            <div ref={successRef} tabIndex={-1} role="status" className="rounded-[1.75rem] bg-ivory p-8 sm:p-12">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-wine text-ivory">
                <Check size={24} />
              </span>
              <h3 className="h2 mt-6 text-[2.6rem]">Dziękujemy, {sentName}!</h3>
              <p className="mt-4 max-w-[52ch]">
                Formularz został poprawnie wypełniony. Ponieważ to wersja demonstracyjna, <strong>zgłoszenie nie zostało wysłane</strong> i nie
                utworzyliśmy rezerwacji. Po podłączeniu formularza do systemu zapisów w tym miejscu pojawi się potwierdzenie z dalszymi krokami.
              </p>
              <p className="mt-4 max-w-[52ch]">Aby naprawdę umówić się na zajęcia, skontaktuj się ze studiem telefonicznie lub mailowo.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" className="btn btn-primary" onClick={() => setSentName(null)}>
                  Wypełnij formularz ponownie
                </button>
                <a href="#kontakt" className="btn btn-secondary">
                  Dane kontaktowe
                </a>
              </div>
            </div>
          ) : (
            <form ref={formRef} noValidate onSubmit={onSubmit} className="rounded-[1.75rem] bg-ivory p-6 sm:p-10" aria-describedby={`${ids}-required`}>
              {showSummary && errorList.length > 0 && (
                <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-8 rounded-2xl border-2 border-wine p-5">
                  <p className="flex items-center gap-2 font-semibold text-wine">
                    <Alert size={18} /> Popraw {errorList.length === 1 ? "jedno pole" : `${errorList.length} ${errorList.length < 5 ? "pola" : "pól"}`}, aby wysłać formularz:
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-6 text-[0.95rem]">
                    {errorList.map((field) => (
                      <li key={field}>
                        <a href={`#${fieldId(field)}`} className="link">
                          {errors[field]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p id={`${ids}-required`} className="mb-6 text-sm">
                Pola oznaczone <span aria-hidden="true">*</span>
                <span className="sr-only">gwiazdką</span> są wymagane.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor={fieldId("name")} className="field-label">
                    Imię <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={fieldId("name")}
                    className="field-input"
                    autoComplete="given-name"
                    value={values.name}
                    onChange={(event) => update("name", event.target.value)}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={describedBy("name")}
                    aria-required="true"
                  />
                  {fieldError("name")}
                </div>
                <div>
                  <label htmlFor={fieldId("email")} className="field-label">
                    E-mail <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={fieldId("email")}
                    type="email"
                    inputMode="email"
                    className="field-input"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => update("email", event.target.value)}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={describedBy("email")}
                    aria-required="true"
                  />
                  {fieldError("email")}
                </div>
                <div>
                  <label htmlFor={fieldId("style")} className="field-label">
                    Preferowany styl <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id={fieldId("style")}
                    className="field-input"
                    value={values.style}
                    onChange={(event) => update("style", event.target.value)}
                    aria-invalid={errors.style ? true : undefined}
                    aria-describedby={describedBy("style")}
                    aria-required="true"
                  >
                    <option value="">Wybierz styl</option>
                    {STYLES.map((style) => (
                      <option key={style.id} value={style.id}>
                        {style.name}
                      </option>
                    ))}
                    <option value="nie-wiem">Jeszcze nie wiem – pomóżcie mi wybrać</option>
                  </select>
                  {fieldError("style")}
                </div>
                <div>
                  <label htmlFor={fieldId("level")} className="field-label">
                    Poziom zaawansowania <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id={fieldId("level")}
                    className="field-input"
                    value={values.level}
                    onChange={(event) => update("level", event.target.value)}
                    aria-invalid={errors.level ? true : undefined}
                    aria-describedby={describedBy("level", `${fieldId("level")}-hint`)}
                    aria-required="true"
                  >
                    <option value="">Wybierz poziom</option>
                    {LEVEL_IDS.map((level) => (
                      <option key={level} value={level}>
                        {LEVELS[level].label}
                      </option>
                    ))}
                  </select>
                  <p id={`${fieldId("level")}-hint`} className="field-hint mt-1">
                    Nie masz pewności? Wybierz „Od zera” – zawsze możesz zmienić grupę.
                  </p>
                  {fieldError("level")}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={fieldId("day")} className="field-label">
                    Preferowany dzień <span className="font-normal">(opcjonalnie)</span>
                  </label>
                  <select id={fieldId("day")} className="field-input" value={values.day} onChange={(event) => update("day", event.target.value)}>
                    <option value="">Dowolny dzień</option>
                    {CLASS_DAYS.map((day) => (
                      <option key={day.id} value={String(day.id)}>
                        {day.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={fieldId("message")} className="field-label">
                    Wiadomość <span className="font-normal">(opcjonalnie)</span>
                  </label>
                  <textarea
                    id={fieldId("message")}
                    className="field-input"
                    rows={4}
                    value={values.message}
                    onChange={(event) => update("message", event.target.value)}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={describedBy("message", `${fieldId("message")}-hint`)}
                    placeholder="Np. tańczyłam kiedyś jazz, mam kontuzję kolana, wolę zajęcia rano…"
                  />
                  <p id={`${fieldId("message")}-hint`} className="field-hint mt-1 text-right">
                    {values.message.length} / {MESSAGE_MAX_LENGTH} znaków
                  </p>
                  {fieldError("message")}
                </div>
              </div>

              <div className="mt-8 border-t rule pt-6">
                <div className="flex items-start gap-3">
                  <input
                    id={fieldId("privacy")}
                    type="checkbox"
                    className="checkbox"
                    checked={values.privacy}
                    onChange={(event) => update("privacy", event.target.checked)}
                    aria-invalid={errors.privacy ? true : undefined}
                    aria-describedby={describedBy("privacy")}
                    aria-required="true"
                  />
                  <label htmlFor={fieldId("privacy")} className="text-[0.95rem] leading-relaxed">
                    Zapoznałam/zapoznałem się z{" "}
                    <Link href="/polityka-prywatnosci" className="link" target="_blank">
                      informacją o przetwarzaniu danych
                      <span className="sr-only"> (otwiera się w nowej karcie)</span>
                    </Link>
                    . Rozumiem, że w wersji demonstracyjnej dane nie są nigdzie przesyłane. <span aria-hidden="true">*</span>
                  </label>
                </div>
                {fieldError("privacy")}
              </div>

              <button type="submit" className="btn btn-primary mt-8 w-full sm:w-auto">
                Wyślij zgłoszenie (demo)
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
