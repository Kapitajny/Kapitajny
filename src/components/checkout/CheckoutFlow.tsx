"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { LOCATIONS, formatHours, getLocation } from "@/data/locations";
import { getProduct } from "@/data/menu";
import { formatPrice } from "@/lib/pricing";
import { formatPickup, getHoursForDate, getPickupDays, getPickupSlots } from "@/lib/pickup";
import { validateEmail, validateName, type CheckoutField } from "@/lib/validation";
import { useCart } from "@/components/cart/CartProvider";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { AlertIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, InfoIcon, TrashIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { clearAttempt, getAttemptKey } from "./checkout-attempt";
import { OrderLines } from "./OrderLines";
import { useWarsawNow } from "./useWarsawNow";

type PaymentsMode = "test" | "live" | "unconfigured";
type Step = "details" | "summary";
type FieldErrors = Partial<Record<CheckoutField, string>>;

const CONTACT_KEY = "noir-checkout-contact";

function readContact(): { name?: string; email?: string } {
  if (typeof window === "undefined") return {};
  try {
    return (JSON.parse(window.sessionStorage.getItem(CONTACT_KEY) ?? "null") as { name?: string; email?: string } | null) ?? {};
  } catch {
    return {};
  }
}

export function CheckoutFlow({ paymentsMode }: { paymentsMode: PaymentsMode }) {
  const cart = useCart();
  const now = useWarsawNow();
  const [step, setStep] = useState<Step>("details");
  const [pickupDate, setPickupDate] = useState<string | null>(null);
  const [pickupTime, setPickupTime] = useState<string | null>(null);
  // Dane kontaktowe pamiętamy tylko w bieżącej karcie (sessionStorage) – na wypadek powrotu ze Stripe.
  // Formularz renderuje się dopiero po wczytaniu koszyka w przeglądarce, więc odczyt w inicjalizatorze jest bezpieczny.
  const [name, setName] = useState(() => readContact().name ?? "");
  const [email, setEmail] = useState(() => readContact().email ?? "");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const location = getLocation(cart.locationId);
  const days = useMemo(() => (now ? getPickupDays(now) : []), [now]);
  // Domyślnie dziś; jeśli na dziś nie ma już wolnych godzin w wybranym lokalu – jutro.
  const todayHasSlots = !!(now && location && days[0] && getPickupSlots(location, days[0].date, now).length > 0);
  const activeDate = pickupDate ?? (location && !todayHasSlots ? days[1]?.date : days[0]?.date) ?? null;
  const slots = useMemo(() => (now && location && activeDate ? getPickupSlots(location, activeDate, now) : []), [now, location, activeDate]);
  const timeStillValid = pickupTime !== null && slots.includes(pickupTime);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(CONTACT_KEY, JSON.stringify({ name, email }));
    } catch {}
  }, [name, email]);

  const goTo = (next: Step) => {
    setStep(next);
    setFormError(null);
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      headingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const validateDetails = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!location) next.location = "Wybierz lokal, w którym odbierzesz zamówienie.";
    if (!activeDate || !timeStillValid) next.pickup = "Wybierz godzinę odbioru.";
    const nameError = validateName(name);
    if (nameError) next.name = nameError;
    const emailError = validateEmail(email);
    if (emailError) next.email = emailError;
    return next;
  };

  const toSummary = (event: React.FormEvent) => {
    event.preventDefault();
    const next = validateDetails();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = (["location", "pickup", "name", "email"] as const).find((f) => next[f]);
      document.getElementById(`field-${first}`)?.focus();
      return;
    }
    goTo("summary");
  };

  const pay = async () => {
    const next = validateDetails();
    if (!acceptTerms) next.acceptTerms = "Zaakceptuj regulamin, aby przejść do płatności.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      if (next.acceptTerms && Object.keys(next).length === 1) return;
      goTo("details");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    const payload = {
      items: cart.lines.map((l) => ({ productId: l.productId, options: l.options, quantity: l.quantity })),
      locationId: location!.id,
      pickup: { date: activeDate, time: pickupTime },
      customer: { name: name.trim(), email: email.trim() },
      acceptTerms: true,
    };
    const fingerprint = JSON.stringify(payload);

    const send = async (forceNewKey: boolean) => {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, idempotencyKey: getAttemptKey(fingerprint, forceNewKey) }),
      });
      const data = await response.json().catch(() => ({}));
      return { response, data };
    };

    try {
      let { response, data } = await send(false);
      // Poprzednia próba została anulowana/wygasła albo treść się zmieniła – zaczynamy nową.
      if (response.status === 409 && ["ATTEMPT_CLOSED", "PAYLOAD_MISMATCH"].includes(data?.error?.code)) {
        ({ response, data } = await send(true));
      }

      if (response.ok && typeof data.url === "string") {
        window.location.assign(data.url);
        return; // zostawiamy stan „przekierowanie…”
      }

      const code = data?.error?.code;
      const field = data?.error?.field as CheckoutField | undefined;
      const message = data?.error?.message ?? "Nie udało się rozpocząć płatności. Spróbuj ponownie.";
      if (code === "ALREADY_PAID") {
        clearAttempt();
        setFormError("To zamówienie zostało już opłacone. Jeśli chcesz zamówić ponownie, odśwież stronę.");
      } else if (field && field !== "acceptTerms" && field !== "idempotencyKey") {
        setErrors({ [field]: message });
        goTo("details");
        setFormError(message);
      } else {
        setFormError(message);
      }
    } catch {
      setFormError("Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.");
    }
    setSubmitting(false);
  };

  /* ---------------------------------------------------------------------------------------------- */

  if (!cart.hydrated) {
    return <CheckoutSkeleton />;
  }

  if (cart.lines.length === 0) {
    return (
      <div className="container-x py-24 text-center lg:py-32">
        <p className="eyebrow">Zamówienie</p>
        <h1 className="mt-5 text-[clamp(2.4rem,1.5rem+3vw,4rem)]">Twój koszyk jest pusty</h1>
        <p className="mx-auto mt-5 max-w-md text-muted">Wybierz kawę z menu, dopasuj ją do siebie i wróć tutaj, aby wybrać lokal oraz godzinę odbioru.</p>
        <Link href="/#menu" className="btn btn-primary mt-10">
          Przejdź do menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x pb-24 pt-10 lg:pb-32 lg:pt-14">
      <Link href="/#menu" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-roast">
        <ArrowLeftIcon size={16} /> Wróć do menu
      </Link>

      <ol className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm" aria-label="Etapy zamówienia">
        {[
          { id: "details", label: "Odbiór i dane" },
          { id: "summary", label: "Podsumowanie" },
          { id: "payment", label: "Płatność" },
        ].map((s, i) => {
          const current = s.id === step;
          const done = step === "summary" && s.id === "details";
          return (
            <li key={s.id} className={`flex items-center gap-2 ${current ? "text-roast" : "text-muted"}`} aria-current={current ? "step" : undefined}>
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs tabular-nums ${
                  current ? "border-roast bg-roast text-paper" : done ? "border-roast text-roast" : "border-oat"
                }`}
              >
                {done ? <CheckIcon size={14} /> : i + 1}
              </span>
              {s.label}
            </li>
          );
        })}
      </ol>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          {step === "details" ? (
            <form onSubmit={toSummary} noValidate>
              <h1 ref={headingRef} tabIndex={-1} className="scroll-mt-28 text-[clamp(2.4rem,1.5rem+3vw,4rem)] outline-none">
                Odbiór i dane
              </h1>
              {formError && <FormAlert message={formError} />}

              {/* Lokal */}
              <fieldset className="mt-10">
                <legend className="font-serif text-2xl text-roast">Gdzie odbierzesz kawę?</legend>
                <div
                  id="field-location"
                  tabIndex={-1}
                  className="mt-5 grid gap-3 outline-none sm:grid-cols-3"
                  aria-describedby={errors.location ? "error-location" : undefined}
                >
                  {LOCATIONS.map((l) => {
                    const checked = l.id === location?.id;
                    const hours = activeDate ? getHoursForDate(l, activeDate) : l.hours.weekdays;
                    return (
                      <label
                        key={l.id}
                        className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-espresso ${
                          checked ? "border-roast bg-paper shadow-[var(--shadow-soft)]" : "border-oat hover:border-espresso"
                        }`}
                      >
                        <input
                          type="radio"
                          name="location"
                          value={l.id}
                          checked={checked}
                          onChange={() => {
                            cart.setLocation(l.id);
                            setErrors((e) => ({ ...e, location: undefined }));
                          }}
                          className="sr-only"
                        />
                        <span className="flex items-center justify-between">
                          <span className="font-serif text-xl text-roast">{l.district}</span>
                          {checked && <CheckIcon size={18} className="text-roast" />}
                        </span>
                        <span className="mt-1 text-sm text-muted">{l.street}</span>
                        <span className="mt-2 text-xs text-muted tabular-nums">
                          {activeDate === now?.date ? "Dziś" : "Tego dnia"} {formatHours(hours)}
                        </span>
                        {!l.verified && <span className="mt-2 text-[0.68rem] uppercase tracking-wider text-latte">adres demonstracyjny</span>}
                      </label>
                    );
                  })}
                </div>
                {errors.location && <FieldError id="error-location">{errors.location}</FieldError>}
              </fieldset>

              {/* Godzina */}
              <fieldset className="mt-12">
                <legend className="font-serif text-2xl text-roast">Kiedy?</legend>
                <div className="mt-5 inline-flex rounded-full border border-oat p-1" role="radiogroup" aria-label="Dzień odbioru">
                  {days.map((d) => {
                    const active = d.date === activeDate;
                    return (
                      <button
                        key={d.date}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setPickupDate(d.date);
                          setPickupTime(null);
                        }}
                        className={`rounded-full px-5 py-2 text-sm transition-colors ${active ? "bg-roast text-paper" : "text-roast hover:bg-sand"}`}
                      >
                        {d.label} <span className={active ? "text-paper/70" : "text-muted"}>· {d.dateLabel}</span>
                      </button>
                    );
                  })}
                </div>

                <div id="field-pickup" tabIndex={-1} className="mt-5 outline-none" aria-describedby={errors.pickup ? "error-pickup" : undefined}>
                  {!location ? (
                    <p className="text-sm text-muted">Najpierw wybierz lokal – pokażemy dostępne godziny odbioru.</p>
                  ) : slots.length === 0 ? (
                    <p className="rounded-xl bg-sand px-4 py-3 text-sm text-espresso">
                      Na ten dzień nie ma już dostępnych godzin odbioru w tym lokalu. Wybierz inny dzień lub lokal.
                    </p>
                  ) : (
                    <div role="radiogroup" aria-label="Godzina odbioru" className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {slots.map((slot) => {
                        const active = slot === pickupTime;
                        return (
                          <button
                            key={slot}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => {
                              setPickupTime(slot);
                              if (!pickupDate && activeDate) setPickupDate(activeDate);
                              setErrors((e) => ({ ...e, pickup: undefined }));
                            }}
                            className={`min-h-11 rounded-lg border text-sm tabular-nums transition-colors ${
                              active ? "border-roast bg-roast text-paper" : "border-oat text-roast hover:border-espresso"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {pickupTime && !timeStillValid && location && (
                    <p className="mt-3 text-sm text-danger">Godzina {pickupTime} jest już niedostępna – wybierz nową.</p>
                  )}
                </div>
                {errors.pickup && <FieldError id="error-pickup">{errors.pickup}</FieldError>}
              </fieldset>

              {/* Dane */}
              <fieldset className="mt-12">
                <legend className="font-serif text-2xl text-roast">Twoje dane</legend>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="field-name" className="field-label">
                      Imię
                    </label>
                    <input
                      id="field-name"
                      autoComplete="given-name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
                      }}
                      onBlur={() => name && setErrors((e) => ({ ...e, name: validateName(name) ?? undefined }))}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "error-name" : "hint-name"}
                      className="field-input"
                      maxLength={60}
                    />
                    {errors.name ? (
                      <FieldError id="error-name">{errors.name}</FieldError>
                    ) : (
                      <p id="hint-name" className="mt-2 text-xs text-muted">
                        Barista zawoła Cię tym imieniem.
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="field-email" className="field-label">
                      Adres e-mail
                    </label>
                    <input
                      id="field-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
                      }}
                      onBlur={() => email && setErrors((e) => ({ ...e, email: validateEmail(email) ?? undefined }))}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? "error-email" : "hint-email"}
                      className="field-input"
                      maxLength={254}
                    />
                    {errors.email ? (
                      <FieldError id="error-email">{errors.email}</FieldError>
                    ) : (
                      <p id="hint-email" className="mt-2 text-xs text-muted">
                        Do kontaktu w sprawie zamówienia i potwierdzenia płatności.
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>

              <button type="submit" className="btn btn-primary mt-12 w-full sm:w-auto">
                Przejdź do podsumowania <ArrowRightIcon size={18} />
              </button>
            </form>
          ) : (
            <div>
              <h1 ref={headingRef} tabIndex={-1} className="scroll-mt-28 text-[clamp(2.4rem,1.5rem+3vw,4rem)] outline-none">
                Podsumowanie
              </h1>
              {formError && <FormAlert message={formError} />}

              <dl className="mt-10 grid gap-6 rounded-2xl border border-line bg-paper p-6 sm:grid-cols-3 sm:p-8">
                <SummaryItem label="Odbiór">
                  {location?.name}
                  <span className="block text-sm text-muted">
                    {location?.street}, {location?.city}
                  </span>
                </SummaryItem>
                <SummaryItem label="Kiedy">{activeDate && pickupTime ? formatPickup(activeDate, pickupTime, now ?? undefined) : "—"}</SummaryItem>
                <SummaryItem label="Zamawiający">
                  {name.trim()}
                  <span className="block break-all text-sm text-muted">{email.trim()}</span>
                </SummaryItem>
                <div className="sm:col-span-3">
                  <button type="button" onClick={() => goTo("details")} className="text-sm text-roast link-quiet">
                    Zmień odbiór lub dane
                  </button>
                </div>
              </dl>

              <section aria-labelledby="summary-items" className="mt-10">
                <h2 id="summary-items" className="font-serif text-2xl text-roast">
                  Twoje napoje
                </h2>
                <div className="mt-2">
                  <OrderLines lines={cart.lines} total={cart.total} />
                </div>
              </section>

              <div className="mt-10 rounded-2xl bg-sand/70 p-6 sm:p-8">
                <p className="flex gap-3 text-sm leading-relaxed text-espresso">
                  <InfoIcon size={18} className="mt-0.5 shrink-0 text-latte" />
                  <span>
                    Zamawiasz świeżo przygotowywane napoje do odbioru osobistego. Prawo odstąpienia od umowy zawartej na odległość nie przysługuje w przypadku
                    rzeczy szybko psujących się (art. 38 ust. 1 pkt 4 ustawy o prawach konsumenta). Reklamacje rozpatrujemy zgodnie z{" "}
                    <Link href="/regulamin" className="link-quiet" target="_blank">
                      regulaminem
                    </Link>
                    .
                  </span>
                </p>

                <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-espresso">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      setErrors((er) => ({ ...er, acceptTerms: undefined }));
                    }}
                    aria-invalid={errors.acceptTerms ? true : undefined}
                    aria-describedby={errors.acceptTerms ? "error-terms" : undefined}
                    className="mt-1 h-4 w-4 shrink-0 accent-roast"
                  />
                  <span>
                    Akceptuję{" "}
                    <Link href="/regulamin" className="link-quiet" target="_blank">
                      Regulamin zamawiania kawy online
                    </Link>{" "}
                    i potwierdzam zapoznanie się z{" "}
                    <Link href="/polityka-prywatnosci" className="link-quiet" target="_blank">
                      Polityką prywatności
                    </Link>
                    .
                  </span>
                </label>
                {errors.acceptTerms && <FieldError id="error-terms">{errors.acceptTerms}</FieldError>}
              </div>

              <PaymentsNotice mode={paymentsMode} />

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                <button type="button" onClick={() => goTo("details")} className="btn btn-secondary">
                  <ArrowLeftIcon size={18} /> Wstecz
                </button>
                <button
                  type="button"
                  onClick={pay}
                  disabled={submitting || paymentsMode === "unconfigured"}
                  className="btn btn-primary flex-1 sm:flex-none sm:px-10"
                  aria-describedby="pay-hint"
                >
                  {submitting ? "Przekierowujemy do płatności…" : `Zamawiam i płacę ${formatPrice(cart.total)}`}
                </button>
              </div>
              <p id="pay-hint" className="mt-3 text-xs text-muted">
                Płatność odbywa się na bezpiecznej stronie Stripe. Zamówienie przekażemy do lokalu po potwierdzeniu płatności przez operatora.
              </p>
            </div>
          )}
        </div>

        {/* Koszyk – edycja w kroku 1, w kroku 2 pozycje są w treści podsumowania */}
        <aside aria-labelledby="cart-summary-title" className={`lg:col-span-5 ${step === "summary" ? "hidden lg:block" : ""}`}>
          <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8 lg:sticky lg:top-24">
            <div className="flex items-baseline justify-between">
              <h2 id="cart-summary-title" className="font-serif text-2xl text-roast">
                Twój koszyk
              </h2>
              <button type="button" onClick={cart.openCart} className="text-sm text-muted link-quiet">
                Otwórz koszyk
              </button>
            </div>
            <ul className="mt-4 divide-y divide-line">
              {cart.lines.map((line) => {
                const product = getProduct(line.productId);
                return (
                  <li key={line.key} className="flex gap-4 py-4">
                    <div className="relative aspect-square w-14 shrink-0 overflow-hidden rounded-lg">
                      {product && <Photo image={product.image} sizes="56px" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <p className="font-serif text-lg leading-tight text-roast">{line.name}</p>
                        <p className="shrink-0 text-sm tabular-nums">{formatPrice(line.lineTotal)}</p>
                      </div>
                      {line.optionLabels.length > 0 && <p className="mt-0.5 text-xs leading-relaxed text-muted">{line.optionLabels.join(" · ")}</p>}
                      {step === "details" && (
                        <div className="mt-2 flex items-center gap-3">
                          <QuantityStepper size="sm" value={line.quantity} onChange={(q) => cart.setQuantity(line.key, q)} label={`Ilość: ${line.name}`} />
                          <span className="text-xs text-muted tabular-nums">{formatPrice(line.unitPrice)} / szt.</span>
                          <button
                            type="button"
                            onClick={() => cart.removeItem(line.key)}
                            className="ml-auto rounded-full p-1.5 text-muted transition-colors hover:bg-sand hover:text-danger"
                            aria-label={`Usuń ${line.name}`}
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-2 flex items-baseline justify-between border-t border-line pt-4">
              <span className="text-muted">Razem</span>
              <span className="font-serif text-2xl text-roast tabular-nums">{formatPrice(cart.total)}</span>
            </div>
            <p className="mt-1 text-xs text-muted">Ceny brutto w PLN. Bez opłat dodatkowych – odbiór osobisty.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.16em] text-muted">{label}</dt>
      <dd className="mt-2 text-roast">{children}</dd>
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm text-danger">
      <AlertIcon size={15} /> {children}
    </p>
  );
}

function FormAlert({ message }: { message: string }) {
  return (
    <p role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-paper px-4 py-3 text-sm text-danger">
      <AlertIcon size={18} className="mt-0.5 shrink-0" />
      {message}
    </p>
  );
}

function PaymentsNotice({ mode }: { mode: PaymentsMode }) {
  if (mode === "live") return null;
  if (mode === "test") {
    return (
      <p className="mt-6 flex gap-3 rounded-xl border border-dashed border-latte/70 px-4 py-3 text-sm leading-relaxed text-espresso">
        <InfoIcon size={18} className="mt-0.5 shrink-0 text-latte" />
        <span>
          <strong className="font-semibold">Tryb testowy Stripe.</strong> Żadne pieniądze nie zostaną pobrane. Użyj testowej karty 4242 4242 4242 4242, dowolnej
          przyszłej daty i dowolnego CVC.
        </span>
      </p>
    );
  }
  return (
    <p role="status" className="mt-6 flex gap-3 rounded-xl border border-danger/30 bg-paper px-4 py-3 text-sm leading-relaxed text-espresso">
      <AlertIcon size={18} className="mt-0.5 shrink-0 text-danger" />
      <span>
        <strong className="font-semibold">Płatności online nie są jeszcze skonfigurowane.</strong> Nie możemy przyjąć tego zamówienia – sklep czeka na
        podłączenie operatora płatności. Twój koszyk zostanie zachowany.
      </span>
    </p>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="container-x pb-24 pt-14" aria-busy="true" aria-label="Ładowanie zamówienia">
      <div className="h-4 w-32 rounded bg-sand" />
      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="h-14 w-2/3 rounded bg-sand" />
          <div className="h-32 rounded-xl bg-sand/70" />
          <div className="h-24 rounded-xl bg-sand/70" />
        </div>
        <div className="h-80 rounded-2xl bg-sand/70 lg:col-span-5" />
      </div>
    </div>
  );
}
