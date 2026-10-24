"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { CheckboxField, ErrorSummary, Honeypot, TextField } from "@/components/forms/Fields";
import { StepIndicator } from "@/components/forms/StepIndicator";
import { Ledger } from "@/components/calculator/Ledger";
import { IconArrowLeft, IconArrowRight, IconCheck, IconEdit } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import { postJson } from "@/lib/api-client";
import { formatPLN } from "@/lib/format";
import { buildOrderQuote } from "@/lib/order-quote";
import type { PublicOrder } from "@/lib/payments";
import type { CalculatorInput } from "@/lib/pricing/calculator";
import { packages, type PackageId } from "@/lib/pricing/packages";
import { hasErrors, type FieldErrors } from "@/lib/validation/fields";
import { validateOrderCustomer, type OrderCustomerField, type OrderCustomerValues } from "@/lib/validation/order";

const STEPS = ["Abonament", "Szczegóły", "Dane", "Podsumowanie"];

const LABELS: Record<OrderCustomerField, string> = {
  name: "Imię",
  email: "Adres e-mail",
  phone: "Telefon",
  company: "Nazwa firmy",
  acceptTerms: "Regulamin",
  acceptDemo: "Charakter demonstracyjny",
};

type Selection = { kind: "calculator" } | { kind: "package"; id: PackageId };

export function OrderFlow({
  calculator,
  calculatorQuery,
  initialPackage,
  initialCustomer,
}: {
  calculator: CalculatorInput | null;
  calculatorQuery: string | null;
  initialPackage: PackageId | null;
  initialCustomer: OrderCustomerValues;
}) {
  const router = useRouter();
  const [selection, setSelection] = useState<Selection | null>(
    calculator ? { kind: "calculator" } : initialPackage ? { kind: "package", id: initialPackage } : null,
  );
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState(initialCustomer);
  const [errors, setErrors] = useState<FieldErrors<OrderCustomerField>>({});
  const [selectionError, setSelectionError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

  const calcQuote = useMemo(() => (calculator ? buildOrderQuote(null, calculator) : null), [calculator]);
  const quote = useMemo(() => {
    if (!selection) return null;
    return selection.kind === "calculator" ? calcQuote : buildOrderQuote(selection.id, null);
  }, [selection, calcQuote]);

  function goTo(next: number) {
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function next() {
    if (step === 0) {
      if (!quote) return setSelectionError("Wybierz abonament, aby przejść dalej.");
      if (!quote.ok) return setSelectionError(quote.message);
      setSelectionError("");
    }
    if (step === 2) {
      const found = validateOrderCustomer(customer);
      if (hasErrors(found)) {
        setErrors(found);
        requestAnimationFrame(() => document.getElementById("error-summary")?.focus());
        return;
      }
    }
    goTo(step + 1);
  }

  const setField = <K extends OrderCustomerField>(key: K, value: OrderCustomerValues[K]) => {
    setCustomer((c) => ({ ...c, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function submit() {
    if (!quote?.ok) return goTo(0);
    setStatus("sending");
    const res = await postJson<{ order: PublicOrder }>("/api/demo/orders", {
      packageId: selection?.kind === "package" ? selection.id : null,
      calculatorQuery: selection?.kind === "calculator" ? calculatorQuery : null,
      customer,
      website: honeypot,
    });
    if (res.ok) {
      router.push(`/platnosc-demo?zamowienie=${encodeURIComponent(res.data.order.id)}`);
      return;
    }
    setStatus("error");
    setServerMessage(res.message);
    if (res.errors) {
      setErrors(res.errors as FieldErrors<OrderCustomerField>);
      goTo(2);
    }
  }

  const visibleErrors = Object.fromEntries(Object.entries(errors).filter(([, v]) => v));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
      <form
        noValidate
        aria-label="Zamówienie abonamentu"
        className="relative min-w-0"
        onSubmit={(e) => {
          e.preventDefault();
          if (step < STEPS.length - 1) next();
          else submit();
        }}
      >
        <StepIndicator steps={STEPS} current={step} label="Kroki zamówienia" />

        <div className="panel p-5 sm:p-8">
          <h2 ref={headingRef} tabIndex={-1} className="mb-6 text-[1.75rem] focus:outline-none">
            {["Wybierz abonament", "Szczegóły usługi", "Dane do zamówienia", "Podsumowanie zamówienia"][step]}
          </h2>
          <Honeypot value={honeypot} onChange={setHoneypot} />

          {step === 0 && (
            <fieldset aria-describedby={selectionError ? "selection-error" : undefined}>
              <legend className="sr-only">Abonament</legend>
              <div className="space-y-2.5">
                {calcQuote && (
                  <label className="choice">
                    <input
                      type="radio"
                      name="abonament"
                      checked={selection?.kind === "calculator"}
                      onChange={() => setSelection({ kind: "calculator" })}
                    />
                    <span className="flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <span className="font-medium text-navy">Twoja konfiguracja z kalkulatora</span>
                        <span className="num font-semibold text-navy">
                          {calcQuote.ok ? `${formatPLN(calcQuote.monthly)} / mies.` : "wycena indywidualna"}
                        </span>
                      </span>
                      <span className="block text-sm text-muted">
                        {calcQuote.ok ? `Pakiet ${calcQuote.pkg.name}. ${calcQuote.scope.join(", ")}.` : calcQuote.message}
                      </span>
                    </span>
                  </label>
                )}
                {packages.map((pkg) => (
                  <label key={pkg.id} className="choice">
                    <input
                      type="radio"
                      name="abonament"
                      disabled={!pkg.orderable}
                      checked={selection?.kind === "package" && selection.id === pkg.id}
                      onChange={() => setSelection({ kind: "package", id: pkg.id })}
                    />
                    <span className="flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <span className="font-medium text-navy">Pakiet {pkg.name}</span>
                        <span className="num font-semibold text-navy">
                          {pkg.priceFrom === null ? "wycena indywidualna" : `od ${formatPLN(pkg.priceFrom)} / mies.`}
                        </span>
                      </span>
                      <span className="block text-sm text-muted">{pkg.audience}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">
                Pakietu Enterprise nie można zamówić online.{" "}
                <Link href="/wycena" className="link">
                  Poproś o indywidualną wycenę
                </Link>
                .
              </p>
              {selectionError && (
                <div id="selection-error" className="mt-4">
                  <Notice tone="error" role="alert">
                    {selectionError}
                    {quote && !quote.ok && quote.reason === "individual-quote" && (
                      <>
                        {" "}
                        <Link href={calculatorQuery ? `/wycena?${calculatorQuery}` : "/wycena"} className="link">
                          Przejdź do formularza wyceny
                        </Link>
                        .
                      </>
                    )}
                  </Notice>
                </div>
              )}
            </fieldset>
          )}

          {step === 1 && quote?.ok && (
            <div className="space-y-8">
              <div>
                <h3 className="font-sans text-base font-semibold">Zakres – pakiet {quote.pkg.name}</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {quote.scope.map((item) => (
                    <li key={item} className="flex gap-2 text-ink">
                      <IconCheck size={18} className="mt-0.5 shrink-0 text-teal-ink" />
                      {item}
                    </li>
                  ))}
                </ul>
                {quote.priceBasis === "package" && (
                  <p className="mt-3 text-sm text-muted">
                    Zamawiasz pakiet w cenie wyjściowej. Ostateczna kwota zależałaby od weryfikacji zakresu.{" "}
                    <Link href="/kalkulator" className="link">
                      Policz dokładniej w kalkulatorze
                    </Link>
                    .
                  </p>
                )}
              </div>
              <SubscriptionRules />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {Object.keys(visibleErrors).length > 0 && <ErrorSummary errors={visibleErrors} labels={LABELS} />}
              <Notice tone="demo">Wpisz dane testowe, np. „Jan” i „jan@przyklad.pl”. Nie podawaj prawdziwych danych.</Notice>
              <div className="grid gap-6 sm:grid-cols-2">
                <TextField id="name" label={LABELS.name} autoComplete="given-name" value={customer.name} onChange={(e) => setField("name", e.target.value)} error={errors.name} />
                <TextField id="email" label={LABELS.email} type="email" autoComplete="email" value={customer.email} onChange={(e) => setField("email", e.target.value)} error={errors.email} />
                <TextField id="phone" label={LABELS.phone} optional type="tel" autoComplete="tel" value={customer.phone} onChange={(e) => setField("phone", e.target.value)} error={errors.phone} />
                <TextField id="company" label={LABELS.company} optional autoComplete="organization" value={customer.company} onChange={(e) => setField("company", e.target.value)} error={errors.company} />
              </div>
              <div className="space-y-3">
                <CheckboxField
                  id="acceptTerms"
                  checked={customer.acceptTerms}
                  onChange={(c) => setField("acceptTerms", c)}
                  error={errors.acceptTerms}
                  label={
                    <>
                      Akceptuję{" "}
                      <Link href="/regulamin" className="link" target="_blank">
                        regulamin serwisu demonstracyjnego
                      </Link>{" "}
                      i{" "}
                      <Link href="/polityka-prywatnosci" className="link" target="_blank">
                        politykę prywatności
                      </Link>
                      .
                    </>
                  }
                />
                <CheckboxField
                  id="acceptDemo"
                  checked={customer.acceptDemo}
                  onChange={(c) => setField("acceptDemo", c)}
                  error={errors.acceptDemo}
                  label="Rozumiem, że to zamówienie demonstracyjne: nie powstaje umowa, a płatność jest symulowana."
                />
              </div>
            </div>
          )}

          {step === 3 && quote?.ok && (
            <div className="space-y-6">
              <dl className="divide-y divide-line rounded-[var(--radius-control)] border border-line">
                {[
                  ["Abonament", `Pakiet ${quote.pkg.name}${quote.priceBasis === "calculator" ? " (konfiguracja z kalkulatora)" : ""}`, 0],
                  ["Zamawiający", [customer.name, customer.company].filter(Boolean).join(", "), 2],
                  ["E-mail", customer.email, 2],
                  ["Telefon", customer.phone || "Nie podano", 2],
                ].map(([label, value, editStep]) => (
                  <div key={label as string} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                    <div>
                      <dt className="text-sm text-muted">{label}</dt>
                      <dd className="text-ink">{value}</dd>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm px-2 text-blue-ink"
                      aria-label={`Zmień: ${label}`}
                      onClick={() => goTo(editStep as number)}
                    >
                      <IconEdit size={16} />
                      Zmień
                    </button>
                  </div>
                ))}
              </dl>
              <Notice tone="demo" title="Następny krok: płatność demonstracyjna">
                Po kliknięciu przycisku zamówienie testowe zostanie zapisane na serwerze demo, a Ty przejdziesz do
                symulacji płatności. Żadne środki nie zostaną pobrane.
              </Notice>
              {status === "error" && (
                <Notice tone="error" title="Nie udało się utworzyć zamówienia" role="alert">
                  {serverMessage}
                </Notice>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
            {step > 0 ? (
              <button type="button" className="btn btn-outline" onClick={() => goTo(step - 1)}>
                <IconArrowLeft size={18} />
                Wstecz
              </button>
            ) : (
              <Link href="/cennik" className="btn btn-outline">
                <IconArrowLeft size={18} />
                Wróć do cennika
              </Link>
            )}
            {step < STEPS.length - 1 ? (
              <button type="submit" className="btn btn-primary">
                Dalej
                <IconArrowRight size={18} />
              </button>
            ) : (
              <button type="submit" className="btn btn-primary" disabled={status === "sending"} aria-busy={status === "sending"}>
                {status === "sending" && <span className="spinner" aria-hidden="true" />}
                {status === "sending" ? "Tworzenie zamówienia…" : "Przejdź do płatności demo"}
              </button>
            )}
          </div>
        </div>
      </form>

      <OrderSummary quote={quote} />
    </div>
  );
}

function OrderSummary({ quote }: { quote: ReturnType<typeof buildOrderQuote> | null }) {
  return (
    <aside aria-label="Podsumowanie kosztów" className="lg:sticky lg:top-24 lg:self-start">
      <div className="panel overflow-hidden shadow-[var(--shadow-panel)]">
        <div className="border-b border-line bg-mist px-5 py-4">
          <h2 className="text-[1.375rem]">Twoje zamówienie</h2>
        </div>
        <div className="p-5">
          {quote?.ok ? (
            <>
              <p className="text-sm text-muted">Pakiet {quote.pkg.name}</p>
              <div className="mt-3">
                <Ledger lines={quote.lines} totalLabel="Opłata miesięczna" total={quote.monthly} />
              </div>
              <dl className="num mt-5 space-y-2 text-[0.9375rem]">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink">Opłata jednorazowa (wdrożenie)</dt>
                  <dd className="text-navy">{formatPLN(quote.oneTimeFee)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line pt-2">
                  <dt className="font-semibold text-navy">Do zapłaty teraz (symulacja)</dt>
                  <dd className="font-semibold text-navy">{formatPLN(quote.dueNow)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-[0.8125rem] text-muted">
                Pierwsza opłata miesięczna i opłata jednorazowa. Kolejne miesiące: {formatPLN(quote.monthly)} netto.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">Wybierz abonament, aby zobaczyć koszty.</p>
          )}
        </div>
      </div>
    </aside>
  );
}

function SubscriptionRules() {
  return (
    <div className="rounded-[var(--radius-control)] border border-line bg-mist p-5">
      <h3 className="font-sans text-base font-semibold">Zasady abonamentu (przykładowe)</h3>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.9375rem] text-ink marker:text-muted">
        <li>Opłata miesięczna pobierana z góry za każdy miesiąc obsługi.</li>
        <li>Opłata jednorazowa obejmuje przejęcie dokumentacji i konfigurację obiegu dokumentów.</li>
        <li>Zmiana pakietu możliwa od kolejnego okresu rozliczeniowego.</li>
        <li>Okres wypowiedzenia i pozostałe warunki określałaby umowa.</li>
      </ul>
      <p className="mt-3 text-sm text-muted">Zasady mają charakter demonstracyjny i nie stanowią oferty.</p>
    </div>
  );
}
