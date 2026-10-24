"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { NumberField } from "@/components/forms/NumberField";
import { formatPLN } from "@/lib/format";
import { calculate, defaultCalculatorInput, type CalculatorInput } from "@/lib/pricing/calculator";
import { BUSINESS_TYPES, pricingConfig as cfg, type BusinessType, type ServiceId } from "@/lib/pricing/config";
import { calculatorToParams } from "@/lib/pricing/params";

const QUICK_SERVICES: ServiceId[] = ["ksiegowosc", "vat", "kadry", "raportowanie"];

/** Skrócona wersja kalkulatora na stronę główną – ta sama logika cenowa, mniej parametrów. */
export function QuickCalculator() {
  const [input, setInput] = useState<CalculatorInput>({ ...defaultCalculatorInput, services: ["ksiegowosc", "vat"] });
  const result = useMemo(() => calculate(input), [input]);
  const query = calculatorToParams(input).toString();

  function setType(type: BusinessType) {
    setInput((p) => ({ ...p, businessType: type, legalForm: cfg.businessTypes[type].defaultLegalForm }));
  }
  function toggle(id: ServiceId) {
    setInput((p) => ({
      ...p,
      services: p.services.includes(id) ? p.services.filter((s) => s !== id) : [...p.services, id],
    }));
  }

  return (
    <div className="grid overflow-hidden rounded-[var(--radius-panel)] border border-line bg-white shadow-[var(--shadow-panel)] lg:grid-cols-[minmax(0,1fr)_22rem]">
      <form className="space-y-6 p-5 sm:p-8" aria-label="Szybki kalkulator abonamentu" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className="field-label">Rodzaj działalności</legend>
          <div className="flex flex-wrap gap-2">
            {BUSINESS_TYPES.map((type) => (
              <label key={type} className="choice py-2.5">
                <input type="radio" name="quick-type" checked={input.businessType === type} onChange={() => setType(type)} />
                <span className="font-medium text-navy">{cfg.businessTypes[type].label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="field-label">Usługi</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {QUICK_SERVICES.map((id) => (
              <label key={id} className="choice py-2.5">
                <input type="checkbox" checked={input.services.includes(id)} onChange={() => toggle(id)} />
                <span className="font-medium text-navy">{cfg.services[id].label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberField
            label="Dokumenty miesięcznie"
            value={input.documents}
            {...cfg.limits.documents}
            onChange={(documents) => setInput((p) => ({ ...p, documents }))}
            sliderMax={300}
            unit="szt."
          />
          <NumberField
            label="Pracownicy"
            value={input.employees}
            {...cfg.limits.employees}
            onChange={(employees) => setInput((p) => ({ ...p, employees }))}
            unit="os."
            hint={input.services.includes("kadry") ? undefined : "Zaznacz „Kadry i płace”, aby uwzględnić."}
          />
        </div>
      </form>

      <div className="flex flex-col justify-between gap-6 border-t border-line bg-mist p-5 sm:p-8 lg:border-t-0 lg:border-l">
        <div aria-live="polite" aria-atomic="true">
          <p className="text-sm text-muted">Szacunkowy abonament netto</p>
          {result.ok ? (
            <>
              <p className="num mt-1 font-serif text-5xl leading-none text-navy">
                <span className="ledger-total">{formatPLN(result.monthly)}</span>
              </p>
              <p className="mt-3 text-sm text-ink">
                Proponowany pakiet: <strong className="font-semibold text-navy">{result.recommendedPackage.name}</strong>
              </p>
              <p className="num mt-1 text-sm text-muted">
                Przedział: {formatPLN(result.range.min)} – {formatPLN(result.range.max)}
              </p>
            </>
          ) : (
            <p className="mt-2 font-medium text-warning">Zaznacz co najmniej jedną usługę.</p>
          )}
        </div>
        <div className="grid gap-2.5">
          <Link href={`/kalkulator?${query}`} className="btn btn-primary">
            Otwórz pełny kalkulator
          </Link>
          <p className="text-[0.8125rem] text-muted">
            Pełna wersja uwzględnia formę prawną, złożoność rozliczeń i dodatkowe potrzeby.
          </p>
        </div>
      </div>
    </div>
  );
}
