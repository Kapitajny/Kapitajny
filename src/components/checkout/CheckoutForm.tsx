"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SHIPPING_METHODS, type ShippingMethodId } from "@/data/shipping";
import { postJson } from "@/lib/api-client";
import { formatPrice, getShippingMethod, orderTotals } from "@/lib/pricing";
import { checkoutFieldErrors, type CheckoutField, type CheckoutRequest, type FieldErrors, type PaymentChoice } from "@/lib/validation";
import { useShop } from "@/components/shop/ShopProvider";
import { AlertIcon } from "@/components/ui/Icons";
import { clearAttempt, getAttemptKey } from "./checkout-attempt";

interface PaymentConfig {
  payments: "test" | "live" | "unconfigured";
  demoOrders: boolean;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  shippingMethod: ShippingMethodId;
  pickupPoint: string;
  notes: string;
  acceptTerms: boolean;
  payment: PaymentChoice | "";
}

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  postalCode: "",
  city: "",
  shippingMethod: "kurier",
  pickupPoint: "",
  notes: "",
  acceptTerms: false,
  payment: "",
};

const FIELD_IDS: Record<CheckoutField, string> = {
  items: "checkout-items",
  firstName: "co-firstName",
  lastName: "co-lastName",
  email: "co-email",
  phone: "co-phone",
  street: "co-street",
  postalCode: "co-postalCode",
  city: "co-city",
  shippingMethod: "co-shipping-kurier",
  pickupPoint: "co-pickupPoint",
  notes: "co-notes",
  acceptTerms: "co-acceptTerms",
  payment: "co-payment",
  idempotencyKey: "checkout-items",
};

type Submit = { kind: "idle" } | { kind: "sending" } | { kind: "redirecting" } | { kind: "error"; message: string; code?: string };

export function CheckoutForm() {
  const router = useRouter();
  const { priced, lines, subtotal, hydrated, clearCart } = useShop();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<CheckoutField, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [configError, setConfigError] = useState(false);
  const [submit, setSubmit] = useState<Submit>({ kind: "idle" });
  const [showAllErrors, setShowAllErrors] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  // Dostępne płatności i dane zalogowanego klienta (uzupełniają formularz, można je zmienić).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/checkout/config", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error())))
      .then((data: PaymentConfig) => {
        if (cancelled) return;
        setConfig(data);
        setForm((f) => (f.payment ? f : { ...f, payment: data.payments !== "unconfigured" ? "stripe" : data.demoOrders ? "demo" : "" }));
      })
      .catch(() => !cancelled && setConfigError(true));
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { user: { firstName: string; email: string } | null } | null) => {
        if (cancelled || !data?.user) return;
        const user = data.user;
        setForm((f) => ({ ...f, firstName: f.firstName || user.firstName, email: f.email || user.email }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const request: CheckoutRequest = {
    items: lines,
    customer: { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone },
    address: { street: form.street, postalCode: form.postalCode, city: form.city },
    shipping: { method: form.shippingMethod, pickupPoint: form.pickupPoint },
    notes: form.notes,
    acceptTerms: form.acceptTerms,
    payment: form.payment,
    idempotencyKey: "",
  };
  const clientErrors = checkoutFieldErrors(request);
  const errorFor = (field: CheckoutField) => serverErrors[field] ?? (showAllErrors || touched[field] ? clientErrors[field] : undefined);

  const method = getShippingMethod(form.shippingMethod);
  const totals = orderTotals(subtotal, method);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setServerErrors((e) => {
      const next = { ...e };
      delete next[key as CheckoutField];
      return next;
    });
  };
  const blur = (field: CheckoutField) => setTouched((t) => ({ ...t, [field]: true }));

  const send = async (forceNewKey = false): Promise<void> => {
    const payload = { ...request, items: lines };
    const fingerprint = JSON.stringify({ ...payload, idempotencyKey: undefined });
    const idempotencyKey = getAttemptKey(fingerprint, forceNewKey);
    const result = await postJson<{ url: string; orderId: string; demo: boolean }>("/api/checkout", { ...payload, idempotencyKey });

    if (result.ok) {
      if (result.data.demo) {
        clearAttempt();
        clearCart();
        router.push(result.data.url);
      } else {
        setSubmit({ kind: "redirecting" });
        window.location.assign(result.data.url);
      }
      return;
    }
    if ((result.code === "ATTEMPT_CLOSED" || result.code === "PAYLOAD_MISMATCH") && !forceNewKey) return send(true);
    if (result.code === "VALIDATION_ERROR") {
      const errors = (result.data?.errors as FieldErrors | undefined) ?? (result.field ? { [result.field]: result.message } : {});
      setServerErrors(errors);
      setShowAllErrors(true);
      const first = Object.keys(errors)[0] as CheckoutField | undefined;
      if (first) document.getElementById(FIELD_IDS[first])?.focus();
    }
    setSubmit({ kind: "error", message: result.message, code: result.code });
    requestAnimationFrame(() => errorRef.current?.focus());
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submit.kind === "sending" || submit.kind === "redirecting") return;
    setShowAllErrors(true);
    const order: CheckoutField[] = ["firstName", "lastName", "email", "phone", "street", "postalCode", "city", "shippingMethod", "pickupPoint", "notes", "acceptTerms"];
    const first = order.find((f) => clientErrors[f]);
    if (first) {
      setSubmit({ kind: "error", message: "Uzupełnij zaznaczone pola." });
      document.getElementById(FIELD_IDS[first])?.focus();
      return;
    }
    if (!form.payment) {
      setSubmit({ kind: "error", message: "Wybierz sposób płatności." });
      return;
    }
    setSubmit({ kind: "sending" });
    await send();
  };

  if (!hydrated) return <p className="py-16 text-muted">Wczytywanie koszyka…</p>;

  if (priced.length === 0 && submit.kind !== "redirecting") {
    return (
      <div className="border border-line px-6 py-20 text-center">
        <p className="display text-4xl md:text-5xl">Koszyk jest pusty</p>
        <p className="mx-auto mt-4 max-w-md text-muted">Dodaj produkty do koszyka, żeby złożyć zamówienie.</p>
        <Link href="/sklep" className="btn btn-light mt-8">
          Przejdź do sklepu
        </Link>
      </div>
    );
  }

  const busy = submit.kind === "sending" || submit.kind === "redirecting";
  const stripeAvailable = config?.payments === "test" || config?.payments === "live";
  const noPayment = config !== null && !stripeAvailable && !config.demoOrders;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-7">
        <Section title="Dane kontaktowe" step={1}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id={FIELD_IDS.firstName} label="Imię" error={errorFor("firstName")}>
              <input id={FIELD_IDS.firstName} className="field" autoComplete="given-name" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} onBlur={() => blur("firstName")} />
            </Field>
            <Field id={FIELD_IDS.lastName} label="Nazwisko" error={errorFor("lastName")}>
              <input id={FIELD_IDS.lastName} className="field" autoComplete="family-name" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} onBlur={() => blur("lastName")} />
            </Field>
            <Field id={FIELD_IDS.email} label="E-mail" hint="Wyślemy na niego potwierdzenie płatności." error={errorFor("email")}>
              <input id={FIELD_IDS.email} type="email" className="field" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} />
            </Field>
            <Field id={FIELD_IDS.phone} label="Telefon" hint="Dla przewoźnika." error={errorFor("phone")}>
              <input id={FIELD_IDS.phone} type="tel" className="field" autoComplete="tel" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => blur("phone")} />
            </Field>
          </div>
        </Section>

        <Section title="Adres" step={2}>
          <div className="grid gap-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <Field id={FIELD_IDS.street} label="Ulica i numer" error={errorFor("street")}>
                <input id={FIELD_IDS.street} className="field" autoComplete="street-address" value={form.street} onChange={(e) => set("street", e.target.value)} onBlur={() => blur("street")} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id={FIELD_IDS.postalCode} label="Kod pocztowy" error={errorFor("postalCode")}>
                <input
                  id={FIELD_IDS.postalCode}
                  className="field"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  placeholder="00-000"
                  maxLength={6}
                  value={form.postalCode}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 5);
                    set("postalCode", digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits);
                  }}
                  onBlur={() => blur("postalCode")}
                />
              </Field>
            </div>
            <div className="sm:col-span-4">
              <Field id={FIELD_IDS.city} label="Miejscowość" error={errorFor("city")}>
                <input id={FIELD_IDS.city} className="field" autoComplete="address-level2" value={form.city} onChange={(e) => set("city", e.target.value)} onBlur={() => blur("city")} />
              </Field>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">Wysyłamy wyłącznie na terenie Polski.</p>
        </Section>

        <Section title="Dostawa" step={3}>
          <fieldset>
            <legend className="sr-only">Sposób dostawy</legend>
            <div className="grid gap-2">
              {SHIPPING_METHODS.map((m) => (
                <label key={m.id} className="flex cursor-pointer items-start gap-3 border border-line p-4 has-[:checked]:border-paper">
                  <input id={`co-shipping-${m.id}`} type="radio" name="shipping" className="check" checked={form.shippingMethod === m.id} onChange={() => set("shippingMethod", m.id)} />
                  <span className="flex-1">
                    <span className="flex justify-between gap-4 font-semibold">
                      {m.name}
                      <span className="tabular-nums">{formatPrice(m.price)}</span>
                    </span>
                    <span className="mt-1 block text-sm text-muted">{m.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          {method?.requiresPickupPoint && (
            <div className="mt-4">
              <Field id={FIELD_IDS.pickupPoint} label="Punkt odbioru" hint="Kod punktu lub jego adres – przekażemy go przewoźnikowi." error={errorFor("pickupPoint")}>
                <input id={FIELD_IDS.pickupPoint} className="field" value={form.pickupPoint} onChange={(e) => set("pickupPoint", e.target.value)} onBlur={() => blur("pickupPoint")} maxLength={160} />
              </Field>
            </div>
          )}
          <div className="mt-4">
            <Field id={FIELD_IDS.notes} label="Uwagi do zamówienia (opcjonalnie)" error={errorFor("notes")}>
              <textarea id={FIELD_IDS.notes} className="field min-h-24" maxLength={500} value={form.notes} onChange={(e) => set("notes", e.target.value)} onBlur={() => blur("notes")} />
            </Field>
          </div>
        </Section>

        <Section title="Płatność" step={4}>
          {config === null && !configError && <p className="text-muted">Sprawdzanie dostępnych płatności…</p>}
          {configError && <p className="text-danger">Nie udało się sprawdzić dostępnych płatności. Odśwież stronę.</p>}
          {config && (
            <fieldset id={FIELD_IDS.payment} tabIndex={-1} className="grid gap-2 focus:outline-none">
              <legend className="sr-only">Sposób płatności</legend>
              <label className={`flex items-start gap-3 border border-line p-4 has-[:checked]:border-paper ${stripeAvailable ? "cursor-pointer" : "opacity-60"}`}>
                <input type="radio" name="payment" className="check" disabled={!stripeAvailable} checked={form.payment === "stripe"} onChange={() => set("payment", "stripe")} />
                <span>
                  <span className="block font-semibold">Płatność online (Stripe)</span>
                  <span className="mt-1 block text-sm text-muted">
                    {stripeAvailable
                      ? "Po kliknięciu przejdziesz na bezpieczną stronę płatności Stripe. Dostępne metody zależą od ustawień konta Stripe sklepu."
                      : "Niedostępna – płatności online nie zostały jeszcze skonfigurowane."}
                  </span>
                  {config.payments === "test" && <span className="mt-2 block text-sm text-paper">Tryb testowy Stripe: użyj testowej karty, prawdziwe pieniądze nie zostaną pobrane.</span>}
                </span>
              </label>
              {config.demoOrders && (
                <label className="flex cursor-pointer items-start gap-3 border border-dashed border-[#6b6b6b] p-4 has-[:checked]:border-paper">
                  <input type="radio" name="payment" className="check" checked={form.payment === "demo"} onChange={() => set("payment", "demo")} />
                  <span>
                    <span className="block font-semibold">Zamówienie demonstracyjne</span>
                    <span className="mt-1 block text-sm text-muted">
                      Tylko do testów sklepu: zamówienie zostanie zapisane z oznaczeniem DEMO, bez żadnej płatności, i nie zostanie zrealizowane.
                    </span>
                  </span>
                </label>
              )}
              {noPayment && <p className="text-danger">Sklep nie przyjmuje obecnie zamówień online – płatności nie są skonfigurowane.</p>}
            </fieldset>
          )}
        </Section>
      </div>

      <aside className="lg:col-span-5 xl:col-span-4 xl:col-start-9" aria-label="Podsumowanie zamówienia">
        <div className="border border-line bg-graphite p-6 lg:sticky lg:top-28">
          <h2 className="display-sm text-xl" id="checkout-items" tabIndex={-1}>
            Twoje zamówienie
          </h2>
          <ul className="mt-5 divide-y divide-line">
            {priced.map((line) => (
              <li key={line.sku} className="flex gap-3 py-3">
                <span className="studio relative block h-20 w-16 shrink-0 overflow-hidden">
                  <Image src={line.image} alt="" fill sizes="64px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block font-semibold">{line.name}</span>
                  <span className="block text-muted">
                    {line.colorName}, {line.size}, {line.quantity} szt.
                  </span>
                </span>
                <span className="text-sm tabular-nums">{formatPrice(line.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <Link href="/koszyk" className="link text-sm text-muted">
            Zmień zawartość koszyka
          </Link>
          <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Produkty</dt>
              <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Dostawa ({method?.name.toLowerCase()})</dt>
              <dd className="tabular-nums">{formatPrice(totals.shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-bold">
              <dt>Do zapłaty</dt>
              <dd className="tabular-nums">{formatPrice(totals.total)}</dd>
            </div>
          </dl>
          <p className="mt-1 text-xs text-muted">Ceny brutto. Kwotę i dostępność potwierdza serwer przy składaniu zamówienia.</p>

          <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm">
            <input
              id={FIELD_IDS.acceptTerms}
              type="checkbox"
              className="check"
              checked={form.acceptTerms}
              onChange={(e) => set("acceptTerms", e.target.checked)}
              aria-invalid={Boolean(errorFor("acceptTerms"))}
              aria-describedby={errorFor("acceptTerms") ? "co-acceptTerms-error" : undefined}
            />
            <span className="text-muted">
              Akceptuję{" "}
              <Link href="/regulamin" className="link text-paper" target="_blank">
                regulamin
              </Link>{" "}
              i zapoznałem/-am się z{" "}
              <Link href="/polityka-prywatnosci" className="link text-paper" target="_blank">
                polityką prywatności
              </Link>
              .
            </span>
          </label>
          {errorFor("acceptTerms") && (
            <p id="co-acceptTerms-error" className="field-error">
              {errorFor("acceptTerms")}
            </p>
          )}

          {submit.kind === "error" && (
            <div ref={errorRef} tabIndex={-1} role="alert" className="mt-5 flex gap-2 border border-danger/60 p-3 text-sm text-danger focus:outline-none">
              <AlertIcon size={18} className="mt-0.5 shrink-0" />
              <p>
                {submit.message}{" "}
                {submit.code === "OUT_OF_STOCK" && (
                  <Link href="/koszyk" className="link text-paper">
                    Przejdź do koszyka
                  </Link>
                )}
              </p>
            </div>
          )}

          <button type="submit" className="btn btn-light btn-block mt-6" disabled={busy || noPayment || !config}>
            {submit.kind === "sending"
              ? "Składanie zamówienia…"
              : submit.kind === "redirecting"
                ? "Przekierowanie do płatności…"
                : form.payment === "demo"
                  ? "Złóż zamówienie demonstracyjne"
                  : `Zamawiam i płacę ${formatPrice(totals.total)}`}
          </button>
        </div>
      </aside>
    </form>
  );
}

function Section({ title, step, children }: { title: string; step: number; children: ReactNode }) {
  return (
    <section aria-labelledby={`checkout-step-${step}`}>
      <h2 id={`checkout-step-${step}`} className="display-sm mb-5 flex items-baseline gap-3 text-xl">
        <span className="text-muted tabular-nums">{step}.</span> {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactElement<Record<string, unknown>> }) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
  const child = { ...children, props: { ...children.props, "aria-invalid": Boolean(error), "aria-describedby": describedBy } };
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {child}
      {error ? (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="field-hint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
