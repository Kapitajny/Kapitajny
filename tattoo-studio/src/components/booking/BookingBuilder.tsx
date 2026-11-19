"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { BUDGET_IDS, PLACEMENT_IDS, SIDE_IDS, SIZE_IDS, STYLE_OPTIONS, TIME_IDS, type StyleId } from "@/config/booking";
import { workById, workSrc } from "@/config/work";
import { INTL_LOCALE } from "@/i18n/config";
import { LocalizedLink } from "@/i18n/LocalizedLink";
import { useI18n } from "@/i18n/I18nProvider";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  EMPTY_BOOKING,
  LIMITS,
  STEP_FIELDS,
  addDays,
  todayInWarsaw,
  validateBooking,
  type BookingData,
  type BookingField,
  type FieldErrors,
} from "@/lib/booking/schema";
import { ArrowIcon } from "@/components/ui/Icons";
import { Pattern } from "@/components/ui/Pattern";
import { BodyMap } from "./BodyMap";
import { ChoiceGroup, CheckboxField, ErrorText, TextArea, TextField } from "./fields";
import { ImageUploader, type UploadedImage } from "./ImageUploader";
import { Turnstile } from "./Turnstile";

const DRAFT_KEY = "tattoo-booking-draft-v1";
const STEP_COUNT = 6;

type ServerErrorCode = Exclude<keyof Dictionary["booking"]["serverErrors"], "unknown"> | "unknown";
type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; code: ServerErrorCode; httpStatus?: number }
  | { status: "success"; reference: string };

export interface BookingBuilderProps {
  prefill: Partial<BookingData>;
  deliveryConfigured: boolean;
  turnstileSiteKey: string | null;
  contact: { email: string; phone: string };
}

function withoutKey(errors: FieldErrors, field: BookingField): FieldErrors {
  const next = { ...errors };
  delete next[field];
  return next;
}

function readDraft(): Partial<BookingData> | null {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<BookingData>) : null;
  } catch {
    return null;
  }
}

function writeDraft(data: BookingData | null) {
  try {
    if (data) {
      // Zgód nie zapisujemy — użytkownik potwierdza je przy każdym wysłaniu.
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, privacyAccepted: undefined, accuracyConfirmed: undefined }));
    } else window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Brak dostępu do sessionStorage (tryb prywatny) — formularz działa dalej, bez zapisu szkicu.
  }
}

/**
 * Kreator zgłoszenia (6 kroków). Wszystkie teksty pochodzą ze słowników — zmiana języka
 * nie odmontowuje komponentu, więc wpisane dane i dodane zdjęcia zostają nietknięte.
 */
export function BookingBuilder({ prefill, deliveryConfigured, turnstileSiteKey, contact }: BookingBuilderProps) {
  const { t, lang } = useI18n();
  const b = t.booking;
  const [data, setData] = useState<BookingData>({ ...EMPTY_BOOKING, ...prefill });
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [returnToReview, setReturnToReview] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [restored, setRestored] = useState(false);

  const startedAt = useRef(0);
  const submissionId = useRef("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const stepChanged = useRef(false);
  const hydrated = useRef(false);

  /** Treść błędu pola w bieżącym języku (walidacja zwraca kody). */
  const fieldError = (field: BookingField): string | undefined => {
    const code = errors[field];
    if (!code) return undefined;
    return (b.errors[field] as Record<string, string>)[code];
  };

  // Przywrócenie szkicu po odświeżeniu strony (dane z kalkulatora mają pierwszeństwo).
  useEffect(() => {
    startedAt.current = Date.now();
    submissionId.current = crypto.randomUUID();
    const draft = readDraft();
    if (draft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- jednorazowe wczytanie szkicu z sessionStorage po hydratacji
      setData((current) => ({ ...current, ...draft, ...prefill, privacyAccepted: false, accuracyConfirmed: false }));
      setRestored(true);
    }
    hydrated.current = true;
  }, [prefill]);

  useEffect(() => {
    if (hydrated.current && submit.status !== "success") writeDraft(data);
  }, [data, submit.status]);

  useEffect(() => {
    if (!stepChanged.current) return;
    stepChanged.current = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, submit.status]);

  function update<K extends BookingField>(field: K, value: BookingData[K]) {
    setData((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => withoutKey(current, field));
  }

  /** Walidacja pola po opuszczeniu go — tylko jeśli już coś wpisano. */
  function blurValidate(field: BookingField) {
    const value = data[field];
    if (typeof value === "string" && value.trim() === "") return;
    const result = validateBooking(data, [field]);
    setErrors((current) => (result[field] ? { ...current, [field]: result[field] } : withoutKey(current, field)));
  }

  function focusFirstError(found: FieldErrors) {
    const first = STEP_FIELDS.flat().find((f) => found[f]);
    if (!first) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(`field-${first}`);
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }

  function goTo(target: number) {
    stepChanged.current = true;
    setDirection(target > step ? "forward" : "back");
    setStep(target);
    setVisited((v) => Math.max(v, target));
  }

  function validateStep(index: number): boolean {
    const found = validateBooking(data, STEP_FIELDS[index]);
    setErrors((current) => {
      const next = { ...current };
      for (const f of STEP_FIELDS[index]) delete next[f];
      return { ...next, ...found };
    });
    if (Object.keys(found).length) {
      focusFirstError(found);
      return false;
    }
    return true;
  }

  function next() {
    if (!validateStep(step)) return;
    if (returnToReview) {
      setReturnToReview(false);
      goTo(STEP_COUNT - 1);
    } else goTo(step + 1);
  }

  function editStep(index: number) {
    setReturnToReview(true);
    goTo(index);
  }

  function toggleStyle(style: StyleId) {
    const current = data.styles;
    let nextStyles: StyleId[];
    if (current.includes(style)) nextStyles = current.filter((s) => s !== style);
    else if (style === "other") nextStyles = ["other"];
    else nextStyles = [...current.filter((s) => s !== "other"), style];
    update("styles", nextStyles);
  }

  async function onSubmit() {
    if (!deliveryConfigured) return;
    for (let i = 0; i < STEP_COUNT; i++) {
      const found = validateBooking(data, STEP_FIELDS[i]);
      if (Object.keys(found).length) {
        setErrors(found);
        if (i !== step) goTo(i);
        else focusFirstError(found);
        return;
      }
    }
    if (images.some((img) => img.status !== "ready")) return setSubmit({ status: "error", code: "imagesPending" });
    if (turnstileSiteKey && !turnstileToken) return setSubmit({ status: "error", code: "verificationMissing" });

    setSubmit({ status: "submitting" });
    const form = new FormData();
    form.append("data", JSON.stringify(data));
    form.append("meta", JSON.stringify({ submissionId: submissionId.current, startedAt: startedAt.current, website: honeypot, turnstileToken, lang }));
    images.forEach((img, index) => img.blob && form.append("references", img.blob, `reference-${index + 1}.jpg`));

    try {
      const response = await fetch("/api/booking", { method: "POST", body: form });
      const body = (await response.json().catch(() => null)) as
        | { ok?: boolean; reference?: string; error?: { code: string; fieldErrors?: FieldErrors } }
        | null;

      if (response.ok && body?.ok && body.reference) {
        writeDraft(null);
        stepChanged.current = true;
        setSubmit({ status: "success", reference: body.reference });
        return;
      }

      if (body?.error?.fieldErrors) {
        const fieldErrors = body.error.fieldErrors;
        setErrors(fieldErrors);
        const stepWithError = STEP_FIELDS.findIndex((fields) => fields.some((f) => fieldErrors[f]));
        if (stepWithError >= 0 && stepWithError !== step) goTo(stepWithError);
        else focusFirstError(fieldErrors);
      }
      const code = body?.error?.code;
      setSubmit({
        status: "error",
        code: code && code !== "unknown" && code in b.serverErrors ? (code as ServerErrorCode) : "unknown",
        httpStatus: response.status,
      });
    } catch {
      setSubmit({ status: "error", code: "network" });
    }
  }

  if (submit.status === "success") {
    return (
      <div ref={topRef} className="scroll-mt-4">
        <SuccessScreen reference={submit.reference} headingRef={headingRef} />
      </div>
    );
  }

  const current = b.steps[step];
  const isLast = step === STEP_COUNT - 1;
  const today = todayInWarsaw();
  const opt = b.options;
  let serverMessage: string | null = null;
  if (submit.status === "error") {
    serverMessage = submit.code === "unknown" ? b.serverErrors.unknown(submit.httpStatus ?? 0) : b.serverErrors[submit.code];
  }

  return (
    <div ref={topRef} className="scroll-mt-4">
      {!deliveryConfigured && (
        <div role="note" className="mb-10 rounded-2xl border border-sumi/20 bg-kinari/70 px-5 py-4 font-gothic text-sm leading-relaxed">
          <strong className="font-medium">{b.notConfigured.title}</strong> {b.notConfigured.text}{" "}
          {(contact.email || contact.phone) && (
            <>
              {b.notConfigured.contact}{" "}
              {contact.email && (
                <a className="ink-link" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              )}
              {contact.email && contact.phone ? ", " : ""}
              {contact.phone && (
                <a className="ink-link" href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                  {contact.phone}
                </a>
              )}
            </>
          )}
        </div>
      )}

      <Progress step={step} visited={visited} onSelect={(i) => (i < step ? goTo(i) : validateStep(step) && goTo(i))} />

      {restored && step === 0 && (
        <p className="mt-6 font-gothic text-sm text-nezumi" role="status">
          {b.restored}{" "}
          <button
            type="button"
            className="ink-link text-sumi"
            onClick={() => {
              setData({ ...EMPTY_BOOKING, ...prefill });
              setErrors({});
              setRestored(false);
              writeDraft(null);
            }}
          >
            {b.startOver}
          </button>
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="relative overflow-hidden rounded-3xl border border-sumi/12 bg-washi/85 shadow-[0_30px_60px_-45px_rgba(20,17,14,0.6)] lg:col-span-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 overflow-hidden text-kin/60" aria-hidden="true">
            <Pattern kind="asanoha" strokeWidth={0.8} scale={0.5} />
          </div>
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (isLast) onSubmit();
              else next();
            }}
            className="px-5 pb-6 pt-10 sm:px-10 sm:pb-10 sm:pt-12"
            aria-labelledby="step-title"
          >
            <div key={step} className={direction === "forward" ? "step-in-forward" : "step-in-back"}>
              <p className="flex items-center gap-3 font-gothic text-xs tabular-nums text-nezumi">
                <span aria-hidden="true" className="h-px w-8 bg-kin" />
                {b.progress.stepOf(step + 1, STEP_COUNT)}
              </p>
              <h2 id="step-title" ref={headingRef} tabIndex={-1} className="display display-md mt-4 outline-none">
                {current.title}
              </h2>
              <p className="lead mt-4 text-nezumi">{current.description}</p>

              <div className="mt-10">
                {step === 0 && (
                  <div className="grid gap-7 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <TextField
                        name="fullName"
                        label={b.fields.fullName}
                        autoComplete="name"
                        value={data.fullName}
                        onChange={(v) => update("fullName", v)}
                        onBlur={() => blurValidate("fullName")}
                        error={fieldError("fullName")}
                        maxLength={LIMITS.fullName.max}
                      />
                    </div>
                    <TextField
                      name="email"
                      label={b.fields.email}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={data.email}
                      onChange={(v) => update("email", v)}
                      onBlur={() => blurValidate("email")}
                      error={fieldError("email")}
                      maxLength={LIMITS.email.max}
                    />
                    <TextField
                      name="phone"
                      label={b.fields.phone}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      optional={data.contactMethod !== "phone"}
                      hint={b.fields.phoneHint}
                      value={data.phone}
                      onChange={(v) => update("phone", v)}
                      onBlur={() => blurValidate("phone")}
                      error={fieldError("phone")}
                      maxLength={30}
                    />
                    <div className="sm:col-span-2">
                      <ChoiceGroup
                        name="contactMethod"
                        legend={b.fields.contactMethod}
                        options={[
                          { id: "email", label: b.fields.contactEmail },
                          { id: "phone", label: b.fields.contactPhone },
                        ]}
                        value={data.contactMethod}
                        onChange={(v) => update("contactMethod", v)}
                        error={fieldError("contactMethod")}
                        columns="grid-cols-2 sm:max-w-sm"
                        size="sm"
                      />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-8">
                    <TextArea
                      name="description"
                      label={b.fields.description}
                      hint={b.fields.descriptionHint}
                      placeholder={b.fields.descriptionPlaceholder}
                      value={data.description}
                      onChange={(v) => update("description", v)}
                      onBlur={() => blurValidate("description")}
                      error={fieldError("description")}
                      maxLength={LIMITS.description.max}
                      rows={7}
                    />
                    <TextArea
                      name="meaning"
                      label={b.fields.meaning}
                      optional
                      value={data.meaning}
                      onChange={(v) => update("meaning", v)}
                      error={fieldError("meaning")}
                      maxLength={LIMITS.meaning.max}
                      rows={4}
                    />
                    <div className="grid gap-8 sm:grid-cols-2">
                      <ChoiceGroup
                        name="firstTattoo"
                        legend={b.fields.firstTattoo}
                        options={[
                          { id: "yes", label: b.fields.yes },
                          { id: "no", label: b.fields.no },
                        ]}
                        value={data.firstTattoo}
                        onChange={(v) => update("firstTattoo", v)}
                        error={fieldError("firstTattoo")}
                      />
                      <ChoiceGroup
                        name="designType"
                        legend={b.fields.designType}
                        options={[
                          { id: "new", label: b.fields.designNew },
                          { id: "existing", label: b.fields.designExisting },
                        ]}
                        value={data.designType}
                        onChange={(v) => update("designType", v)}
                        error={fieldError("designType")}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-12">
                    <fieldset aria-describedby={errors.styles ? "field-styles-error" : "styles-hint"}>
                      <legend className="font-gothic text-sm font-medium">{b.fields.styles}</legend>
                      <p id="styles-hint" className="mt-1 font-gothic text-xs text-nezumi">
                        {b.fields.stylesHint}
                      </p>
                      <div id="field-styles" tabIndex={-1} className="mt-4 grid grid-cols-2 gap-3 outline-none md:grid-cols-3 xl:grid-cols-4">
                        {STYLE_OPTIONS.map((option) => {
                          const checked = data.styles.includes(option.id);
                          const work = option.image ? workById(option.image) : null;
                          const label = opt.styles[option.id];
                          return (
                            <label key={option.id} className="group relative cursor-pointer">
                              <input type="checkbox" name="styles" value={option.id} checked={checked} onChange={() => toggleStyle(option.id)} className="peer sr-only" />
                              <span
                                className={`flex h-full flex-col overflow-hidden rounded-2xl border transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sumi ${
                                  checked ? "border-sumi bg-sumi text-washi" : errors.styles ? "border-bengara/70" : "border-sumi/15 hover:border-sumi/55"
                                }`}
                              >
                                <span className="relative block aspect-[4/3] overflow-hidden bg-sumi-2">
                                  {work ? (
                                    <Image src={workSrc(work)} alt="" fill sizes="(min-width: 1280px) 12vw, (min-width: 768px) 20vw, 44vw" className="object-cover" />
                                  ) : (
                                    <span className="absolute inset-0 text-washi/15">
                                      <Pattern kind={option.id === "other" ? "kumiko" : "seigaiha"} bg="var(--color-sumi-2)" scale={0.8} />
                                    </span>
                                  )}
                                  <span
                                    aria-hidden="true"
                                    className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                                      checked ? "border-washi bg-washi text-sumi" : "border-washi/70 bg-sumi/30 text-transparent"
                                    }`}
                                  >
                                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                                      <path d="m3 8.5 3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                  </span>
                                </span>
                                <span className="block px-3.5 py-3">
                                  <span className="block font-gothic text-sm font-medium leading-snug">{label.label}</span>
                                  <span className={`mt-1 block font-gothic text-xs leading-snug ${checked ? "text-usuzumi" : "text-nezumi"}`}>{label.hint}</span>
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      <ErrorText id="field-styles-error">{fieldError("styles")}</ErrorText>
                    </fieldset>

                    <div className="grid gap-10 md:grid-cols-[1fr_11rem] lg:grid-cols-1">
                      <div className="space-y-8">
                        <ChoiceGroup
                          name="placement"
                          legend={b.fields.placement}
                          options={PLACEMENT_IDS.map((id) => ({ id, label: opt.placements[id] }))}
                          value={data.placement}
                          onChange={(v) => update("placement", v)}
                          error={fieldError("placement")}
                          columns="grid-cols-2 sm:grid-cols-3"
                          size="sm"
                        />
                        {data.placement === "other" && (
                          <TextField
                            name="placementNote"
                            label={b.fields.placementNote}
                            optional
                            value={data.placementNote}
                            onChange={(v) => update("placementNote", v)}
                            error={fieldError("placementNote")}
                            maxLength={LIMITS.placementNote.max}
                          />
                        )}
                        <ChoiceGroup
                          name="side"
                          legend={b.fields.side}
                          options={SIDE_IDS.map((id) => ({ id, label: opt.sides[id] }))}
                          value={data.side}
                          onChange={(v) => update("side", v)}
                          error={fieldError("side")}
                          columns="grid-cols-2 sm:grid-cols-4"
                          size="sm"
                        />
                      </div>
                      <div className="hidden border-l border-sumi/12 pl-6 md:block lg:hidden">
                        <BodyMap placement={data.placement} side={data.side} />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-10">
                    <ChoiceGroup
                      name="size"
                      legend={b.fields.size}
                      options={SIZE_IDS.map((id) => ({ id, label: opt.sizes[id].label, detail: opt.sizes[id].detail }))}
                      value={data.size}
                      onChange={(v) => update("size", v)}
                      error={fieldError("size")}
                      columns="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    />
                    <ChoiceGroup
                      name="budget"
                      legend={b.fields.budget}
                      hint={b.fields.budgetHint}
                      options={BUDGET_IDS.map((id) => ({ id, label: opt.budgets[id] }))}
                      value={data.budget}
                      onChange={(v) => update("budget", v)}
                      error={fieldError("budget")}
                      columns="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    />
                    <div className="grid gap-8 border-t border-sumi/12 pt-8 sm:grid-cols-2">
                      <TextField
                        name="preferredDate"
                        label={b.fields.preferredDate}
                        type="date"
                        optional
                        hint={b.fields.preferredDateHint}
                        min={today}
                        max={addDays(today, LIMITS.maxDaysAhead)}
                        value={data.preferredDate}
                        onChange={(v) => update("preferredDate", v)}
                        onBlur={() => blurValidate("preferredDate")}
                        error={fieldError("preferredDate")}
                      />
                      <ChoiceGroup
                        name="preferredTime"
                        legend={b.fields.preferredTime}
                        options={TIME_IDS.map((id) => ({ id, label: opt.times[id] }))}
                        value={data.preferredTime}
                        onChange={(v) => update("preferredTime", v)}
                        error={fieldError("preferredTime")}
                        columns="grid-cols-2"
                        size="sm"
                      />
                    </div>
                  </div>
                )}

                {step === 4 && <ImageUploader images={images} onChange={setImages} />}

                {step === 5 && (
                  <Review
                    data={data}
                    images={images}
                    fieldError={fieldError}
                    onEdit={editStep}
                    onConsent={(field, value) => update(field, value)}
                    turnstile={turnstileSiteKey ? <Turnstile siteKey={turnstileSiteKey} language={lang} onToken={setTurnstileToken} /> : null}
                  />
                )}
              </div>
            </div>

            {/* Pułapka na boty — niewidoczna dla ludzi i czytników ekranu. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="booking-website">{b.honeypot}</label>
              <input id="booking-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
            </div>

            {serverMessage && (
              <p role="alert" className="mt-8 rounded-xl border-l-2 border-bengara bg-bengara/[0.06] px-4 py-3 font-gothic text-sm leading-relaxed text-bengara">
                {serverMessage}
              </p>
            )}

            <div className="sticky bottom-0 z-10 -mx-5 mt-10 flex items-center gap-3 border-t border-sumi/12 bg-washi/95 px-5 py-4 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-8 sm:backdrop-blur-none">
              {step > 0 ? (
                <button type="button" onClick={() => goTo(step - 1)} className="btn btn-line min-w-[3.25rem] px-4 sm:px-6">
                  <ArrowIcon direction="left" className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only">{b.actions.previous}</span>
                </button>
              ) : (
                <LocalizedLink route="home" className="btn btn-line hidden px-6 sm:inline-flex">
                  {b.actions.cancel}
                </LocalizedLink>
              )}
              <div className="ml-auto flex flex-1 justify-end gap-3 sm:flex-none">
                {isLast ? (
                  <button
                    type="submit"
                    disabled={!deliveryConfigured || submit.status === "submitting"}
                    aria-describedby={!deliveryConfigured ? "submit-disabled" : undefined}
                    className="btn btn-ink w-full sm:w-auto"
                  >
                    {submit.status === "submitting" ? b.actions.submitting : b.actions.submit}
                  </button>
                ) : (
                  <button type="submit" className="btn btn-ink w-full sm:w-auto">
                    {returnToReview ? b.actions.saveAndReview : b.actions.continue}
                    <ArrowIcon className="btn-arrow h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            {isLast && !deliveryConfigured && (
              <p id="submit-disabled" className="mt-3 text-right font-gothic text-xs text-nezumi">
                {b.notConfigured.submitDisabled}
              </p>
            )}
          </form>
        </div>

        <ProjectSummary data={data} images={images} />
      </div>
    </div>
  );
}

function Progress({ step, visited, onSelect }: { step: number; visited: number; onSelect: (index: number) => void }) {
  const { t } = useI18n();
  const b = t.booking;
  const percent = ((step + 1) / STEP_COUNT) * 100;
  return (
    <nav aria-label={b.progress.label}>
      <p className="font-gothic text-sm sm:hidden">
        {b.progress.stepOf(step + 1, STEP_COUNT)}: {b.steps[step].short}
      </p>
      <div className="mt-3 h-[3px] w-full rounded-full bg-sumi/12 sm:hidden" aria-hidden="true">
        <div className="h-full rounded-full bg-sumi transition-[width] duration-700 ease-[var(--ease-ink)]" style={{ width: `${percent}%` }} />
      </div>

      <ol className="hidden grid-cols-6 gap-2 sm:grid">
        {b.steps.map((s, index) => {
          const state = index === step ? "current" : index <= visited ? "done" : "todo";
          const reachable = index <= visited && index !== step;
          return (
            <li key={s.short}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onSelect(index)}
                aria-current={state === "current" ? "step" : undefined}
                className="group w-full text-left disabled:cursor-default"
              >
                <span className="block h-[3px] w-full overflow-hidden rounded-full bg-sumi/12">
                  <span className={`block h-full rounded-full bg-sumi transition-[width] duration-700 ease-[var(--ease-ink)] ${index <= step ? "w-full" : "w-0"}`} />
                </span>
                <span
                  className={`mt-3 block font-gothic text-xs transition-colors ${
                    state === "current" ? "text-sumi" : state === "done" ? "text-nezumi group-enabled:group-hover:text-sumi" : "text-nezumi/80"
                  }`}
                >
                  <span className="tabular-nums text-kin-deep">{String(index + 1).padStart(2, "0")}</span>
                  <span className="ml-2">{s.short}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Panel „Twój projekt” — podgląd wyborów na żywo (duże ekrany; na telefonie służy temu ostatni krok). */
function ProjectSummary({ data, images }: { data: BookingData; images: UploadedImage[] }) {
  const { t } = useI18n();
  const b = t.booking;
  const rows: [string, string][] = [];
  if (data.styles.length > 0) rows.push([b.review.labels.styles, data.styles.map((s) => b.options.styles[s].label).join(", ")]);
  if (data.placement) rows.push([b.review.labels.placement, b.options.placements[data.placement] + (data.side ? `, ${b.options.sides[data.side].toLowerCase()}` : "")]);
  if (data.size) rows.push([b.review.labels.size, b.options.sizes[data.size].label]);
  if (data.budget) rows.push([b.review.labels.budget, b.options.budgets[data.budget]]);

  return (
    <aside aria-label={b.summary.title} className="hidden lg:col-span-4 lg:block">
      <div className="on-dark sticky top-8 overflow-hidden rounded-3xl bg-graphite p-8 text-washi">
        <p className="font-mincho text-xl">{b.summary.title}</p>
        <span aria-hidden="true" className="kin-rule mt-5 block" />
        <div className="mt-6 flex justify-center">
          <BodyMap placement={data.placement} side={data.side} tone="dark" caption={false} />
        </div>
        {rows.length === 0 ? (
          <p className="mt-6 font-gothic text-sm text-usuzumi">{b.summary.empty}</p>
        ) : (
          <dl className="mt-6 space-y-3 font-gothic text-sm">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-usuzumi">{label}</dt>
                <dd className="mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        {images.length > 0 && (
          <div className="mt-6">
            <p className="font-gothic text-xs text-usuzumi">{b.summary.images(images.length)}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((img) =>
                img.url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- lokalny podgląd (blob:)
                  <img key={img.id} src={img.url} alt="" className="h-12 w-12 rounded-md object-cover" />
                ) : (
                  <span key={img.id} className="h-12 w-12 rounded-md bg-graphite-2" />
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function ReviewGroup({ title, step, onEdit, children }: { title: string; step: number; onEdit: (step: number) => void; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <section className="border-t border-sumi/12 py-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-mincho text-xl">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="min-h-11 rounded-full border border-sumi/20 px-4 font-gothic text-xs tracking-[0.04em] hover:border-sumi"
          aria-label={t.booking.review.editGroup(title)}
        >
          {t.booking.review.edit}
        </button>
      </div>
      <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-[11rem_1fr]">{children}</dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <>
      <dt className="font-gothic text-xs text-nezumi sm:pt-0.5">{label}</dt>
      <dd className="whitespace-pre-line break-words font-gothic text-sm">{value || "—"}</dd>
    </>
  );
}

function Review({
  data,
  images,
  fieldError,
  onEdit,
  onConsent,
  turnstile,
}: {
  data: BookingData;
  images: UploadedImage[];
  fieldError: (field: BookingField) => string | undefined;
  onEdit: (step: number) => void;
  onConsent: (field: "privacyAccepted" | "accuracyConfirmed", value: boolean) => void;
  turnstile: ReactNode;
}) {
  const { t, lang } = useI18n();
  const b = t.booking;
  const l = b.review.labels;
  const g = b.review.groups;
  const formattedDate = data.preferredDate
    ? new Date(`${data.preferredDate}T12:00:00Z`).toLocaleDateString(INTL_LOCALE[lang], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    : b.review.noPreference;
  return (
    <div>
      <ReviewGroup title={g[0]} step={0} onEdit={onEdit}>
        <Row label={l.fullName} value={data.fullName} />
        <Row label={l.email} value={data.email} />
        <Row label={l.phone} value={data.phone} />
        <Row label={l.contactMethod} value={data.contactMethod === "phone" ? b.fields.contactPhone : b.fields.contactEmail} />
      </ReviewGroup>
      <ReviewGroup title={g[1]} step={1} onEdit={onEdit}>
        <Row label={l.description} value={data.description} />
        <Row label={l.meaning} value={data.meaning} />
        <Row label={l.firstTattoo} value={data.firstTattoo === "yes" ? b.fields.yes : data.firstTattoo === "no" ? b.fields.no : ""} />
        <Row label={l.design} value={data.designType === "new" ? b.fields.designNew : data.designType === "existing" ? b.fields.designExisting : ""} />
      </ReviewGroup>
      <ReviewGroup title={g[2]} step={2} onEdit={onEdit}>
        <Row label={l.styles} value={data.styles.map((s) => b.options.styles[s].label).join(", ")} />
        <Row label={l.placement} value={data.placement ? b.options.placements[data.placement] + (data.placementNote ? ` (${data.placementNote})` : "") : ""} />
        <Row label={l.side} value={data.side ? b.options.sides[data.side] : ""} />
      </ReviewGroup>
      <ReviewGroup title={g[3]} step={3} onEdit={onEdit}>
        <Row label={l.size} value={data.size ? b.options.sizes[data.size].label : ""} />
        <Row label={l.budget} value={data.budget ? b.options.budgets[data.budget] : ""} />
        <Row label={l.date} value={`${formattedDate}${data.preferredDate ? `, ${b.options.times[data.preferredTime].toLowerCase()}` : ""}`} />
      </ReviewGroup>
      <ReviewGroup title={g[4]} step={4} onEdit={onEdit}>
        <Row
          label={l.images}
          value={
            images.length ? (
              <span className="flex flex-wrap gap-2">
                {images.map((img, i) =>
                  img.url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- lokalny podgląd (blob:)
                    <img key={img.id} src={img.url} alt={b.upload.imageAlt(i + 1, img.name)} className="h-16 w-16 rounded-md object-cover" />
                  ) : (
                    <span key={img.id} className="flex h-16 w-16 items-center justify-center rounded-md bg-washi-2 text-2xs">
                      …
                    </span>
                  ),
                )}
              </span>
            ) : (
              b.review.noImages
            )
          }
        />
      </ReviewGroup>

      <div className="space-y-5 border-t border-sumi/12 pt-8">
        <CheckboxField name="privacyAccepted" checked={data.privacyAccepted} onChange={(v) => onConsent("privacyAccepted", v)} error={fieldError("privacyAccepted")}>
          {b.review.privacyBefore}
          <LocalizedLink route="privacy" target="_blank" className="ink-link">
            {b.review.privacyLink}
          </LocalizedLink>
          {b.review.privacyAfter}
        </CheckboxField>
        <CheckboxField name="accuracyConfirmed" checked={data.accuracyConfirmed} onChange={(v) => onConsent("accuracyConfirmed", v)} error={fieldError("accuracyConfirmed")}>
          {b.review.accuracy}
        </CheckboxField>
        {turnstile}
      </div>
    </div>
  );
}

function SuccessScreen({ reference, headingRef }: { reference: string; headingRef: RefObject<HTMLHeadingElement | null> }) {
  const { t } = useI18n();
  const s = t.booking.success;
  return (
    <div className="on-dark relative overflow-hidden rounded-3xl bg-sumi px-6 py-20 text-washi sm:px-14 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 text-washi/[0.1] [mask-image:linear-gradient(to_top,black,transparent)]">
        <Pattern kind="seigaiha" bg="var(--color-sumi)" />
      </div>
      <div className="relative max-w-[44rem]">
        <span aria-hidden="true" className="mb-10 block h-px w-16 bg-kin" />
        <h2 ref={headingRef} tabIndex={-1} className="display display-lg outline-none">
          {s.title}
        </h2>
        <p className="lead mt-8 text-washi/85">{s.text}</p>
        <p className="mt-6 font-gothic text-sm text-usuzumi">
          {s.reference} <strong className="font-medium tracking-[0.12em] text-washi">{reference}</strong>
        </p>
        <p className="mt-6 border-l-2 border-kin/60 pl-4 font-gothic text-sm leading-relaxed text-washi/80">{s.note}</p>
        <LocalizedLink route="home" className="btn btn-paper mt-12">
          <ArrowIcon direction="left" className="h-4 w-4" />
          {s.back}
        </LocalizedLink>
      </div>
    </div>
  );
}
