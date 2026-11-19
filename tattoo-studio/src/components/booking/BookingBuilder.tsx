"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BUDGET_OPTIONS,
  PLACEMENT_OPTIONS,
  SIDE_OPTIONS,
  SIZE_OPTIONS,
  STYLE_OPTIONS,
  TIME_OPTIONS,
  type StyleId,
} from "@/config/booking";
import { workById, workSrc } from "@/config/work";
import {
  EMPTY_BOOKING,
  LIMITS,
  STEP_FIELDS,
  addDays,
  labelOf,
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

const STEPS = [
  {
    short: "Your Details",
    title: "LET'S GET TO KNOW YOU.",
    description: "Start by sharing your contact details so we can get back to you about your tattoo project.",
  },
  { short: "Tattoo Concept", title: "TELL US YOUR STORY.", description: "Every tattoo starts with an idea. Tell us what you have in mind." },
  {
    short: "Style & Placement",
    title: "DEFINE YOUR STYLE.",
    description: "Choose the artistic direction and placement that best match your vision.",
  },
  {
    short: "Size & Budget",
    title: "LET'S TALK ABOUT THE DETAILS.",
    description: "Size, budget and timing help us prepare a realistic plan for your project.",
  },
  {
    short: "Reference Images",
    title: "SHOW US YOUR INSPIRATION.",
    description: "Share images, sketches or visual references that help us understand your vision.",
  },
  { short: "Final Review", title: "YOUR PROJECT, YOUR VISION.", description: "Check your answers before sending. You can edit any part." },
];

const DRAFT_KEY = "tattoo-booking-draft-v1";

type SubmitState = { status: "idle" } | { status: "submitting" } | { status: "error"; message: string } | { status: "success"; reference: string };

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

export function BookingBuilder({ prefill, deliveryConfigured, turnstileSiteKey, contact }: BookingBuilderProps) {
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
      goTo(STEPS.length - 1);
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
    for (let i = 0; i < STEPS.length; i++) {
      const found = validateBooking(data, STEP_FIELDS[i]);
      if (Object.keys(found).length) {
        setErrors(found);
        if (i !== step) goTo(i);
        else focusFirstError(found);
        return;
      }
    }
    if (images.some((img) => img.status !== "ready")) {
      setSubmit({ status: "error", message: "Your images are still being prepared. Wait a moment and try again." });
      return;
    }
    if (turnstileSiteKey && !turnstileToken) {
      setSubmit({ status: "error", message: "Please complete the verification above the submit button." });
      return;
    }

    setSubmit({ status: "submitting" });
    const form = new FormData();
    form.append("data", JSON.stringify(data));
    form.append(
      "meta",
      JSON.stringify({ submissionId: submissionId.current, startedAt: startedAt.current, website: honeypot, turnstileToken }),
    );
    images.forEach((img, index) => img.blob && form.append("references", img.blob, `reference-${index + 1}.jpg`));

    try {
      const response = await fetch("/api/booking", { method: "POST", body: form });
      const body = (await response.json().catch(() => null)) as
        | { ok?: boolean; reference?: string; error?: { code: string; message: string; fieldErrors?: FieldErrors } }
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
      setSubmit({
        status: "error",
        message: body?.error?.message ?? `The server couldn't accept your request (error ${response.status}). Please try again.`,
      });
    } catch {
      setSubmit({ status: "error", message: "We couldn't reach the server. Check your connection and try again — your answers are saved." });
    }
  }

  if (submit.status === "success") {
    return (
      <div ref={topRef} className="scroll-mt-4">
        <SuccessScreen reference={submit.reference} headingRef={headingRef} />
      </div>
    );
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const today = todayInWarsaw();

  return (
    <div ref={topRef} className="scroll-mt-4">
      {!deliveryConfigured && (
        <div role="note" className="mb-10 border border-sumi/25 bg-kinari/60 px-5 py-4 font-gothic text-sm leading-relaxed">
          <strong className="font-medium">Online booking isn&apos;t active yet.</strong> You can explore the form, but submissions are
          not being received until the studio connects its inbox. {contact.email || contact.phone ? "Please contact the studio directly: " : ""}
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
        </div>
      )}

      <Progress step={step} visited={visited} onSelect={(i) => (i < step ? goTo(i) : validateStep(step) && goTo(i))} />

      {restored && step === 0 && (
        <p className="mt-6 font-gothic text-sm text-nezumi" role="status">
          We restored the answers you started earlier.{" "}
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
            Start over
          </button>
        </p>
      )}

      <div className="relative mt-8 border border-sumi/15 bg-washi/80 shadow-[0_30px_60px_-45px_rgba(26,22,18,0.6)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 overflow-hidden text-sumi/15" aria-hidden="true">
          <Pattern kind="asanoha" strokeWidth={0.8} scale={0.5} />
        </div>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (isLast) onSubmit();
            else next();
          }}
          className="px-5 pb-6 pt-10 sm:px-10 sm:pb-10 sm:pt-12 lg:px-14"
          aria-labelledby="step-title"
        >
          <div key={step} className={direction === "forward" ? "step-in-forward" : "step-in-back"}>
            <p className="font-gothic text-xs tabular-nums text-nezumi">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 id="step-title" ref={headingRef} tabIndex={-1} className="display display-md mt-3 outline-none">
              {current.title}
            </h2>
            <p className="mt-4 max-w-[36rem] font-mincho text-lg leading-relaxed text-nezumi">{current.description}</p>

            <div className="mt-10">
              {step === 0 && (
                <div className="grid gap-7 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <TextField
                      name="fullName"
                      label="Full Name"
                      autoComplete="name"
                      value={data.fullName}
                      onChange={(v) => update("fullName", v)}
                      onBlur={() => blurValidate("fullName")}
                      error={errors.fullName}
                      maxLength={LIMITS.fullName.max}
                    />
                  </div>
                  <TextField
                    name="email"
                    label="Email Address"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(v) => update("email", v)}
                    onBlur={() => blurValidate("email")}
                    error={errors.email}
                    maxLength={LIMITS.email.max}
                  />
                  <TextField
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    optional={data.contactMethod !== "phone"}
                    hint="Include the country code if you're outside Poland."
                    value={data.phone}
                    onChange={(v) => update("phone", v)}
                    onBlur={() => blurValidate("phone")}
                    error={errors.phone}
                    maxLength={30}
                  />
                  <div className="sm:col-span-2">
                    <ChoiceGroup
                      name="contactMethod"
                      legend="Preferred Contact Method"
                      options={[
                        { id: "email", label: "Email" },
                        { id: "phone", label: "Phone" },
                      ]}
                      value={data.contactMethod}
                      onChange={(v) => update("contactMethod", v)}
                      error={errors.contactMethod}
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
                    label="Tattoo Description"
                    hint={`At least ${LIMITS.description.min} characters.`}
                    placeholder="Describe your idea, inspiration, symbolism or the story behind your tattoo."
                    value={data.description}
                    onChange={(v) => update("description", v)}
                    onBlur={() => blurValidate("description")}
                    error={errors.description}
                    maxLength={LIMITS.description.max}
                    rows={7}
                  />
                  <TextArea
                    name="meaning"
                    label="What does this tattoo mean to you?"
                    optional
                    value={data.meaning}
                    onChange={(v) => update("meaning", v)}
                    error={errors.meaning}
                    maxLength={LIMITS.meaning.max}
                    rows={4}
                  />
                  <div className="grid gap-8 sm:grid-cols-2">
                    <ChoiceGroup
                      name="firstTattoo"
                      legend="Is this your first tattoo?"
                      options={[
                        { id: "yes", label: "Yes" },
                        { id: "no", label: "No" },
                      ]}
                      value={data.firstTattoo}
                      onChange={(v) => update("firstTattoo", v)}
                      error={errors.firstTattoo}
                    />
                    <ChoiceGroup
                      name="designType"
                      legend="Is this a completely new design or an existing concept?"
                      options={[
                        { id: "new", label: "New Design" },
                        { id: "existing", label: "Existing Concept" },
                      ]}
                      value={data.designType}
                      onChange={(v) => update("designType", v)}
                      error={errors.designType}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-12">
                  <fieldset aria-describedby={errors.styles ? "field-styles-error" : "styles-hint"}>
                    <legend className="font-gothic text-sm font-medium">Tattoo Style</legend>
                    <p id="styles-hint" className="mt-1 font-gothic text-xs text-nezumi">
                      Choose one or more.
                    </p>
                    <div id="field-styles" tabIndex={-1} className="mt-4 grid grid-cols-2 gap-3 outline-none lg:grid-cols-4">
                      {STYLE_OPTIONS.map((option) => {
                        const checked = data.styles.includes(option.id);
                        const work = option.image ? workById(option.image) : null;
                        return (
                          <label key={option.id} className="group relative cursor-pointer">
                            <input
                              type="checkbox"
                              name="styles"
                              value={option.id}
                              checked={checked}
                              onChange={() => toggleStyle(option.id)}
                              className="peer sr-only"
                            />
                            <span
                              className={`flex h-full flex-col overflow-hidden rounded-[2px] border transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sumi ${
                                checked ? "border-sumi bg-sumi text-washi" : errors.styles ? "border-bengara/70" : "border-sumi/20 hover:border-sumi/55"
                              }`}
                            >
                              <span className="relative block aspect-[4/3] overflow-hidden bg-sumi-2">
                                {work ? (
                                  <Image src={workSrc(work)} alt="" fill sizes="(min-width: 1024px) 14vw, 44vw" className="object-cover" />
                                ) : (
                                  <span className="absolute inset-0 text-washi/15">
                                    <Pattern kind={option.id === "other" ? "kumiko" : "seigaiha"} bg="var(--color-sumi-2)" scale={0.8} />
                                  </span>
                                )}
                                <span
                                  aria-hidden="true"
                                  className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-[2px] border transition-colors ${
                                    checked ? "border-washi bg-washi text-sumi" : "border-washi/70 bg-sumi/30 text-transparent"
                                  }`}
                                >
                                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                                    <path d="m3 8.5 3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                  </svg>
                                </span>
                              </span>
                              <span className="block px-3.5 py-3">
                                <span className="block font-gothic text-sm font-medium leading-snug">{option.label}</span>
                                <span className={`mt-1 block font-gothic text-xs leading-snug ${checked ? "text-usuzumi" : "text-nezumi"}`}>
                                  {option.hint}
                                </span>
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <ErrorText id="field-styles-error">{errors.styles}</ErrorText>
                  </fieldset>

                  <div className="grid gap-10 lg:grid-cols-[1fr_13rem]">
                    <div className="space-y-8">
                      <ChoiceGroup
                        name="placement"
                        legend="Body Placement"
                        options={PLACEMENT_OPTIONS}
                        value={data.placement}
                        onChange={(v) => update("placement", v)}
                        error={errors.placement}
                        columns="grid-cols-2 sm:grid-cols-3"
                        size="sm"
                      />
                      {data.placement === "other" && (
                        <TextField
                          name="placementNote"
                          label="Describe the placement"
                          optional
                          value={data.placementNote}
                          onChange={(v) => update("placementNote", v)}
                          error={errors.placementNote}
                          maxLength={LIMITS.placementNote.max}
                        />
                      )}
                      <ChoiceGroup
                        name="side"
                        legend="Side of the body"
                        options={SIDE_OPTIONS}
                        value={data.side}
                        onChange={(v) => update("side", v)}
                        error={errors.side}
                        columns="grid-cols-2 sm:grid-cols-4"
                        size="sm"
                      />
                    </div>
                    <div className="hidden border-l border-sumi/15 pl-8 lg:block">
                      <BodyMap placement={data.placement} side={data.side} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10">
                  <ChoiceGroup
                    name="size"
                    legend="Tattoo Size"
                    options={SIZE_OPTIONS}
                    value={data.size}
                    onChange={(v) => update("size", v)}
                    error={errors.size}
                    columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  />
                  <ChoiceGroup
                    name="budget"
                    legend="Estimated Budget"
                    hint="An approximate range helps us plan the design. It isn't a price quote."
                    options={BUDGET_OPTIONS}
                    value={data.budget}
                    onChange={(v) => update("budget", v)}
                    error={errors.budget}
                    columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  />
                  <div className="grid gap-8 border-t border-sumi/15 pt-8 sm:grid-cols-2">
                    <TextField
                      name="preferredDate"
                      label="Preferred Appointment Date"
                      type="date"
                      optional
                      hint="A preference only. We'll confirm availability with you."
                      min={today}
                      max={addDays(today, LIMITS.maxDaysAhead)}
                      value={data.preferredDate}
                      onChange={(v) => update("preferredDate", v)}
                      onBlur={() => blurValidate("preferredDate")}
                      error={errors.preferredDate}
                    />
                    <ChoiceGroup
                      name="preferredTime"
                      legend="Preferred time of day"
                      options={TIME_OPTIONS}
                      value={data.preferredTime}
                      onChange={(v) => update("preferredTime", v)}
                      error={errors.preferredTime}
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
                  errors={errors}
                  onEdit={editStep}
                  onConsent={(field, value) => update(field, value)}
                  turnstile={
                    turnstileSiteKey ? <Turnstile siteKey={turnstileSiteKey} onToken={setTurnstileToken} /> : null
                  }
                />
              )}
            </div>
          </div>

          {/* Pułapka na boty — niewidoczna dla ludzi i czytników ekranu. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="booking-website">Leave this field empty</label>
            <input
              id="booking-website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>

          {submit.status === "error" && (
            <p role="alert" className="mt-8 border-l-2 border-bengara bg-bengara/[0.06] px-4 py-3 font-gothic text-sm leading-relaxed text-bengara">
              {submit.message}
            </p>
          )}

          <div className="sticky bottom-0 z-10 -mx-5 mt-10 flex items-center gap-3 border-t border-sumi/15 bg-washi/95 px-5 py-4 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-8 sm:backdrop-blur-none">
            {step > 0 ? (
              <button type="button" onClick={() => goTo(step - 1)} className="btn btn-line min-w-[3.25rem] px-4 sm:px-6">
                <ArrowIcon direction="left" className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Previous</span>
              </button>
            ) : (
              <Link href="/" className="btn btn-line hidden px-6 sm:inline-flex">
                Cancel
              </Link>
            )}
            <div className="ml-auto flex flex-1 justify-end gap-3 sm:flex-none">
              {isLast ? (
                <button
                  type="submit"
                  disabled={!deliveryConfigured || submit.status === "submitting"}
                  aria-describedby={!deliveryConfigured ? "submit-disabled" : undefined}
                  className="btn btn-ink w-full sm:w-auto"
                >
                  {submit.status === "submitting" ? "Submitting…" : "SUBMIT YOUR PROJECT"}
                </button>
              ) : (
                <button type="submit" className="btn btn-ink w-full sm:w-auto">
                  {returnToReview ? "Save & back to review" : "Continue"}
                  <ArrowIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          {isLast && !deliveryConfigured && (
            <p id="submit-disabled" className="mt-3 text-right font-gothic text-xs text-nezumi">
              Submitting is disabled until the studio connects online booking.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function Progress({ step, visited, onSelect }: { step: number; visited: number; onSelect: (index: number) => void }) {
  const percent = ((step + 1) / STEPS.length) * 100;
  return (
    <nav aria-label="Booking steps">
      <div className="flex items-baseline justify-between font-gothic text-sm sm:hidden">
        <span>
          Step {step + 1} of {STEPS.length}: {STEPS[step].short}
        </span>
      </div>
      <div className="mt-3 h-[3px] w-full bg-sumi/12 sm:hidden" aria-hidden="true">
        <div className="h-full bg-sumi transition-[width] duration-700 ease-[var(--ease-ink)]" style={{ width: `${percent}%` }} />
      </div>

      <ol className="hidden grid-cols-6 gap-2 sm:grid">
        {STEPS.map((s, index) => {
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
                <span className="block h-[3px] w-full overflow-hidden bg-sumi/12">
                  <span
                    className={`block h-full bg-sumi transition-[width] duration-700 ease-[var(--ease-ink)] ${
                      index <= step ? "w-full" : "w-0"
                    }`}
                  />
                </span>
                <span
                  className={`mt-3 block font-gothic text-xs transition-colors ${
                    state === "current" ? "text-sumi" : state === "done" ? "text-nezumi group-enabled:group-hover:text-sumi" : "text-nezumi/60"
                  }`}
                >
                  <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
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

function ReviewGroup({ title, step, onEdit, children }: { title: string; step: number; onEdit: (step: number) => void; children: ReactNode }) {
  return (
    <section className="border-t border-sumi/15 py-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-mincho text-xl">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="min-h-11 rounded-[2px] border border-sumi/20 px-4 font-gothic text-xs tracking-[0.08em] hover:border-sumi"
          aria-label={`Edit ${title}`}
        >
          Edit
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
  errors,
  onEdit,
  onConsent,
  turnstile,
}: {
  data: BookingData;
  images: UploadedImage[];
  errors: FieldErrors;
  onEdit: (step: number) => void;
  onConsent: (field: "privacyAccepted" | "accuracyConfirmed", value: boolean) => void;
  turnstile: ReactNode;
}) {
  const formattedDate = data.preferredDate
    ? new Date(`${data.preferredDate}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "No preference";
  return (
    <div>
      <ReviewGroup title="Personal Details" step={0} onEdit={onEdit}>
        <Row label="Full name" value={data.fullName} />
        <Row label="Email" value={data.email} />
        <Row label="Phone" value={data.phone} />
        <Row label="Preferred contact" value={data.contactMethod === "phone" ? "Phone" : "Email"} />
      </ReviewGroup>
      <ReviewGroup title="Tattoo Concept" step={1} onEdit={onEdit}>
        <Row label="Description" value={data.description} />
        <Row label="Meaning" value={data.meaning} />
        <Row label="First tattoo" value={data.firstTattoo === "yes" ? "Yes" : data.firstTattoo === "no" ? "No" : ""} />
        <Row label="Design" value={data.designType === "new" ? "New Design" : data.designType === "existing" ? "Existing Concept" : ""} />
      </ReviewGroup>
      <ReviewGroup title="Style & Placement" step={2} onEdit={onEdit}>
        <Row label="Style" value={data.styles.map((s) => labelOf(STYLE_OPTIONS, s)).join(", ")} />
        <Row
          label="Placement"
          value={data.placement ? labelOf(PLACEMENT_OPTIONS, data.placement) + (data.placementNote ? ` (${data.placementNote})` : "") : ""}
        />
        <Row label="Side" value={data.side ? labelOf(SIDE_OPTIONS, data.side) : ""} />
      </ReviewGroup>
      <ReviewGroup title="Size & Budget" step={3} onEdit={onEdit}>
        <Row label="Size" value={data.size ? labelOf(SIZE_OPTIONS, data.size) : ""} />
        <Row label="Budget" value={data.budget ? labelOf(BUDGET_OPTIONS, data.budget) : ""} />
        <Row label="Preferred date" value={`${formattedDate}${data.preferredDate ? `, ${labelOf(TIME_OPTIONS, data.preferredTime).toLowerCase()}` : ""}`} />
      </ReviewGroup>
      <ReviewGroup title="Reference Images" step={4} onEdit={onEdit}>
        <Row
          label="Attached"
          value={
            images.length ? (
              <span className="flex flex-wrap gap-2">
                {images.map((img, i) =>
                  img.url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- lokalny podgląd (blob:)
                    <img key={img.id} src={img.url} alt={`Reference image ${i + 1}`} className="h-16 w-16 object-cover" />
                  ) : (
                    <span key={img.id} className="flex h-16 w-16 items-center justify-center bg-washi-2 text-2xs">
                      …
                    </span>
                  ),
                )}
              </span>
            ) : (
              "No images"
            )
          }
        />
      </ReviewGroup>

      <div className="space-y-5 border-t border-sumi/15 pt-8">
        <CheckboxField
          name="privacyAccepted"
          checked={data.privacyAccepted}
          onChange={(v) => onConsent("privacyAccepted", v)}
          error={errors.privacyAccepted}
        >
          I have read the{" "}
          <Link href="/polityka-prywatnosci" target="_blank" className="ink-link">
            Privacy Policy (Polityka prywatności)
          </Link>{" "}
          and understand how my details will be used to respond to this request.
        </CheckboxField>
        <CheckboxField
          name="accuracyConfirmed"
          checked={data.accuracyConfirmed}
          onChange={(v) => onConsent("accuracyConfirmed", v)}
          error={errors.accuracyConfirmed}
        >
          I confirm that the information I have provided is correct.
        </CheckboxField>
        {turnstile}
      </div>
    </div>
  );
}

function SuccessScreen({ reference, headingRef }: { reference: string; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <div className="on-dark relative overflow-hidden bg-sumi px-6 py-20 text-washi sm:px-14 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 text-washi/[0.1] [mask-image:linear-gradient(to_top,black,transparent)]">
        <Pattern kind="seigaiha" bg="var(--color-sumi)" />
      </div>
      <div className="relative max-w-[44rem]">
        <h2 ref={headingRef} tabIndex={-1} className="display display-lg outline-none">
          THANK YOU FOR SHARING YOUR VISION.
        </h2>
        <p className="mt-8 font-mincho text-lg leading-[1.85] text-washi/85">
          Your tattoo project has been submitted successfully. Our team will review your request and get back to you as soon as possible.
        </p>
        <p className="mt-6 font-gothic text-sm text-usuzumi">
          Your reference number: <strong className="font-medium tracking-[0.12em] text-washi">{reference}</strong>
        </p>
        <p className="mt-6 border-l-2 border-washi/30 pl-4 font-gothic text-sm leading-relaxed text-washi/80">
          Submitting this request doesn&apos;t confirm an appointment. We&apos;ll contact you to agree on the details and a date.
        </p>
        <Link href="/" className="btn btn-paper mt-12">
          <ArrowIcon direction="left" className="h-4 w-4" />
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
