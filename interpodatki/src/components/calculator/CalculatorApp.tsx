"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NumberField } from "@/components/forms/NumberField";
import { IconInfo, IconRefresh } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import { formatPLN } from "@/lib/format";
import { calculate, defaultCalculatorInput, type CalculatorInput } from "@/lib/pricing/calculator";
import {
  BUSINESS_TYPES,
  COMPLEXITIES,
  SCALES,
  pricingConfig as cfg,
  type BusinessType,
  type ServiceId,
} from "@/lib/pricing/config";
import { calculatorToParams } from "@/lib/pricing/params";
import { Ledger } from "./Ledger";

const ACCOUNTING_SERVICES: ServiceId[] = ["ksiegowosc", "vat", "kadry", "raportowanie", "konsultacje", "ecommerce"];

export function CalculatorApp({ initial }: { initial: CalculatorInput }) {
  const [input, setInput] = useState<CalculatorInput>(initial);
  const [resetKey, setResetKey] = useState(0);
  const result = useMemo(() => calculate(input), [input]);
  const query = useMemo(() => calculatorToParams(input).toString(), [input]);

  // Konfiguracja trafia do adresu URL – odświeżenie strony lub udostępnienie linku zachowuje wybór.
  useEffect(() => {
    const url = `${window.location.pathname}?${query}`;
    window.history.replaceState(window.history.state, "", url);
  }, [query]);

  // Pasek z ceną na telefonie pokazujemy tylko, dopóki panel wyniku jest poniżej widocznego obszaru.
  const [resultBelow, setResultBelow] = useState(true);
  useEffect(() => {
    const el = document.getElementById("wynik");
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setResultBelow(!entry.isIntersecting && entry.boundingClientRect.top > 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const update = (patch: Partial<CalculatorInput>) => setInput((prev) => ({ ...prev, ...patch }));

  function setBusinessType(type: BusinessType) {
    const t = cfg.businessTypes[type];
    setInput((prev) => ({
      ...prev,
      businessType: type,
      legalForm: t.defaultLegalForm,
      // Sklep internetowy zwykle potrzebuje obsługi raportów sprzedażowych – proponujemy ją, ale można ją odznaczyć.
      services:
        type === "ecommerce" && !prev.services.includes("ecommerce") ? [...prev.services, "ecommerce"] : prev.services,
    }));
  }

  function toggleService(id: ServiceId) {
    setInput((prev) => ({
      ...prev,
      services: prev.services.includes(id) ? prev.services.filter((s) => s !== id) : [...prev.services, id],
    }));
  }

  function reset() {
    setInput(defaultCalculatorInput);
    setResetKey((k) => k + 1);
  }

  const typeCfg = cfg.businessTypes[input.businessType];
  const legalForms = typeCfg.legalForms;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-12">
      <form
        key={resetKey}
        className="min-w-0 space-y-6"
        aria-label="Kalkulator abonamentu"
        onSubmit={(e) => e.preventDefault()}
      >
        <Step number={1} title="Rodzaj działalności" legendId="krok-1">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {BUSINESS_TYPES.map((type) => {
              const t = cfg.businessTypes[type];
              return (
                <label key={type} className="choice">
                  <input
                    type="radio"
                    name="businessType"
                    value={type}
                    checked={input.businessType === type}
                    onChange={() => setBusinessType(type)}
                  />
                  <span>
                    <span className="block font-medium text-navy">{t.label}</span>
                    <span className="block text-sm text-muted">{t.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </Step>

        <Step number={2} title="Zakres usług" legendId="krok-2" hint="Zaznacz jedną lub kilka usług.">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {ACCOUNTING_SERVICES.map((id) => (
              <ServiceChoice key={id} id={id} checked={input.services.includes(id)} onToggle={toggleService} input={input} />
            ))}
          </div>
          <div className="mt-5 rounded-[var(--radius-control)] border border-line bg-mist p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-navy">
              <IconInfo size={18} className="text-blue-ink" />
              Doradztwo podatkowe to osobna usługa
            </p>
            <p className="mt-1 mb-3 text-sm text-muted">
              Bieżące rozliczenia prowadzi księgowość. Analizy, opinie i reprezentację w sprawach podatkowych może
              świadczyć wyłącznie osoba z odpowiednimi uprawnieniami – zakres ustalamy indywidualnie.
            </p>
            <ServiceChoice id="doradztwo" checked={input.services.includes("doradztwo")} onToggle={toggleService} input={input} />
          </div>
        </Step>

        <Step number={3} title="Skala działalności" legendId="krok-3">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="forma-prawna" className="field-label">
                Forma prawna
              </label>
              <select
                id="forma-prawna"
                className="input"
                value={input.legalForm}
                onChange={(e) => update({ legalForm: e.target.value as CalculatorInput["legalForm"] })}
                disabled={legalForms.length === 1}
                aria-describedby="forma-prawna-hint"
              >
                {legalForms.map((f) => (
                  <option key={f} value={f}>
                    {cfg.legalForms[f].label}
                    {cfg.legalForms[f].surcharge > 0 ? ` (+${cfg.legalForms[f].surcharge} zł)` : ""}
                  </option>
                ))}
              </select>
              <p id="forma-prawna-hint" className="field-hint mt-1.5">
                {legalForms.length === 1
                  ? "Wynika z wybranego rodzaju działalności."
                  : "Niektóre formy prawne wymagają dodatkowej sprawozdawczości."}
              </p>
            </div>
            <NumberField
              label="Dokumenty księgowe miesięcznie"
              name="documents"
              value={input.documents}
              {...cfg.limits.documents}
              onChange={(documents) => update({ documents })}
              sliderMax={400}
              step={1}
              unit="szt."
              hint={`W cenie bazowej: do ${typeCfg.includedDocuments} dokumentów. Faktury, rachunki, wyciągi.`}
            />
            <NumberField
              label="Liczba pracowników"
              name="employees"
              value={input.employees}
              {...cfg.limits.employees}
              onChange={(employees) => update({ employees })}
              unit="os."
              hint={
                input.services.includes("kadry")
                  ? "Umowy o pracę i umowy cywilnoprawne."
                  : "Uwzględniana po zaznaczeniu usługi „Kadry i płace”."
              }
            />
            <NumberField
              label="Dokumenty kadrowe miesięcznie"
              name="hrDocuments"
              value={input.hrDocuments}
              {...cfg.limits.hrDocuments}
              onChange={(hrDocuments) => update({ hrDocuments })}
              unit="szt."
              hint="Np. nowe umowy, aneksy, zaświadczenia, rozliczenia urlopów."
              disabled={!input.services.includes("kadry")}
            />
          </div>

          <ChoiceGroup legend="Orientacyjna skala działalności" className="mt-6">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {SCALES.map((s) => (
                <label key={s} className="choice">
                  <input type="radio" name="scale" checked={input.scale === s} onChange={() => update({ scale: s })} />
                  <span>
                    <span className="block font-medium text-navy">{cfg.scales[s].label}</span>
                    <span className="block text-sm text-muted">{cfg.scales[s].hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </ChoiceGroup>

          <ChoiceGroup legend="Złożoność rozliczeń" className="mt-6">
            <div className="grid gap-2.5 sm:grid-cols-3">
              {COMPLEXITIES.map((c) => (
                <label key={c} className="choice">
                  <input
                    type="radio"
                    name="complexity"
                    checked={input.complexity === c}
                    onChange={() => update({ complexity: c })}
                  />
                  <span>
                    <span className="block font-medium text-navy">{cfg.complexities[c].label}</span>
                    <span className="block text-sm text-muted">{cfg.complexities[c].hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </ChoiceGroup>
        </Step>

        <Step number={4} title="Dodatkowe potrzeby" legendId="krok-4">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <ToggleChoice
              checked={input.urgent}
              onChange={(urgent) => update({ urgent })}
              label={cfg.extras.urgent.label}
              description={`${cfg.extras.urgent.description} Dopłata ${Math.round(cfg.extras.urgent.rate * 100)}%.`}
            />
            <ToggleChoice
              checked={input.frequentReporting}
              onChange={(frequentReporting) => update({ frequentReporting })}
              label={cfg.extras.frequentReporting.label}
              description={`${cfg.extras.frequentReporting.description} +${formatPLN(cfg.extras.frequentReporting.monthly)}.`}
            />
            <ToggleChoice
              checked={input.customScope}
              onChange={(customScope) => update({ customScope })}
              label={cfg.extras.customScope.label}
              description={cfg.extras.customScope.description}
            />
          </div>
          <div className="mt-6 max-w-sm">
            <NumberField
              label={cfg.extras.consultationHour.label}
              name="extraConsultationHours"
              value={input.extraConsultationHours}
              {...cfg.limits.extraConsultationHours}
              onChange={(extraConsultationHours) => update({ extraConsultationHours })}
              unit="h / mies."
              hint={`${formatPLN(cfg.extras.consultationHour.perHour)} za godzinę.`}
            />
          </div>
        </Step>
      </form>

      <ResultPanel result={result} query={query} onReset={reset} />

      {/* Pasek z wynikiem na telefonie – wynik jest zawsze widoczny podczas zmiany parametrów. */}
      <div
        hidden={!resultBelow}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur lg:hidden"
      >
        <div className="shell flex items-center justify-between gap-4 py-3">
          <div>
            <p className="text-xs text-muted">Szacunkowy abonament</p>
            <p className="num text-lg font-semibold text-navy">
              {result.ok ? `${formatPLN(result.monthly)} / mies.` : "Wybierz usługę"}
            </p>
          </div>
          <a href="#wynik" className="btn btn-sm btn-primary">
            Zobacz wynik
          </a>
        </div>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  hint,
  legendId,
  children,
}: {
  number: number;
  title: string;
  hint?: string;
  legendId: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="panel p-5 sm:p-7">
      <legend className="sr-only">{`Krok ${number}: ${title}`}</legend>
      <div className="mb-5 flex items-baseline gap-3">
        <span
          aria-hidden="true"
          className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white"
        >
          {number}
        </span>
        <div>
          <h2 id={legendId} className="text-[1.5rem] leading-tight">
            <span className="sr-only">Krok {number}: </span>
            {title}
          </h2>
          {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
        </div>
      </div>
      {children}
    </fieldset>
  );
}

function ChoiceGroup({ legend, children, className = "" }: { legend: string; children: ReactNode; className?: string }) {
  return (
    <fieldset className={className}>
      <legend className="field-label">{legend}</legend>
      {children}
    </fieldset>
  );
}

function ServiceChoice({
  id,
  checked,
  onToggle,
  input,
}: {
  id: ServiceId;
  checked: boolean;
  onToggle: (id: ServiceId) => void;
  input: CalculatorInput;
}) {
  const s = cfg.services[id];
  let price: string;
  switch (id) {
    case "ksiegowosc":
      price = `od ${formatPLN(cfg.businessTypes[input.businessType].accountingBase)}`;
      break;
    case "vat":
      price = `+${formatPLN(cfg.services.vat.monthly[input.businessType])}`;
      break;
    case "kadry":
      price = `+${formatPLN(cfg.services.kadry.base)} + ${formatPLN(cfg.services.kadry.perEmployee)}/os.`;
      break;
    default:
      price = `+${formatPLN(cfg.services[id].monthly)}`;
  }
  return (
    <label className="choice bg-white">
      <input type="checkbox" name="services" value={id} checked={checked} onChange={() => onToggle(id)} />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
          <span className="font-medium text-navy">{s.label}</span>
          <span className="num text-sm text-muted">{price}</span>
        </span>
        <span className="block text-sm text-muted">{s.description}</span>
      </span>
    </label>
  );
}

function ToggleChoice({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <label className="choice">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        <span className="block font-medium text-navy">{label}</span>
        <span className="block text-sm text-muted">{description}</span>
      </span>
    </label>
  );
}

function ResultPanel({
  result,
  query,
  onReset,
}: {
  result: ReturnType<typeof calculate>;
  query: string;
  onReset: () => void;
}) {
  const pkg = result.recommendedPackage;
  return (
    <aside id="wynik" aria-labelledby="wynik-tytul" className="scroll-mt-24">
      <div className="panel overflow-hidden shadow-[var(--shadow-panel)] lg:sticky lg:top-24">
        <div className="border-b border-line bg-mist px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="wynik-tytul" className="text-[1.5rem]">
              <span className="sr-only">Krok 5: </span>Wynik
            </h2>
            <span className="demo-stamp">Wycena orientacyjna</span>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <div aria-live="polite" aria-atomic="true">
            {result.ok ? (
              <>
                <p className="text-sm text-muted">Szacunkowa cena miesięczna netto</p>
                <p className="num mt-1 font-serif text-[2.75rem] leading-none text-navy" data-testid="calc-monthly">
                  {formatPLN(result.monthly)}
                </p>
                <p className="num mt-2 text-sm text-ink" data-testid="calc-range">
                  Przewidywany przedział: {formatPLN(result.range.min)} – {formatPLN(result.range.max)}
                </p>
              </>
            ) : (
              <Notice tone="warning" title="Brak wybranych usług">
                {result.errors[0]}
              </Notice>
            )}
          </div>

          {result.ok && (
            <>
              <div className="mt-6">
                <h3 className="mb-2 font-sans text-sm font-semibold text-navy">Rozbicie na usługi</h3>
                <Ledger
                  lines={result.lines}
                  adjustments={result.adjustments}
                  totalLabel="Razem"
                  total={result.monthly}
                  caption="Rozbicie szacunkowej ceny na usługi"
                />
              </div>

              <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted">Proponowany pakiet</dt>
                <dd className="text-right font-medium text-navy" data-testid="calc-package">
                  {pkg.name}
                </dd>
                <dt className="text-muted">Opłata jednorazowa</dt>
                <dd className="num text-right text-navy">
                  {result.oneTimeFee === null ? "ustalana indywidualnie" : formatPLN(result.oneTimeFee)}
                </dd>
              </dl>

              {result.notes.length > 0 && (
                <ul className="mt-5 space-y-2 text-sm text-ink">
                  {result.notes.map((note) => (
                    <li key={note} className="flex gap-2">
                      <IconInfo size={16} className="mt-0.5 shrink-0 text-blue-ink" />
                      {note}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted">
            Kwoty netto o charakterze demonstracyjnym. Ostateczna oferta zależy od liczby dokumentów, rodzaju
            działalności, liczby pracowników, formy opodatkowania i rzeczywistego zakresu usług.
          </p>

          <div className="mt-6 grid gap-2.5">
            <Link href={`/wycena?${query}`} className="btn btn-primary w-full">
              Przejdź do indywidualnej wyceny
            </Link>
            {result.ok && !result.requiresIndividualQuote ? (
              <Link href={`/zamowienie?${query}`} className="btn btn-dark w-full">
                Wybierz abonament
              </Link>
            ) : result.ok ? (
              <p className="rounded-[var(--radius-control)] bg-mist p-3 text-sm text-ink">
                Ten zakres wymaga rozmowy, dlatego nie można zamówić go online. Prześlij formularz wyceny – dane z
                kalkulatora zostaną do niego przeniesione.
              </p>
            ) : null}
            <button type="button" onClick={onReset} className="btn btn-sm mt-1 text-muted hover:text-navy">
              <IconRefresh size={16} />
              Resetuj kalkulator
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
