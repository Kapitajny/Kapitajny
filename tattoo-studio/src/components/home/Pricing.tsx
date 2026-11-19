"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PRICING, PRICING_CONFIRMED } from "@/config/pricing";
import { INTL_LOCALE } from "@/i18n/config";
import { LocalizedLink } from "@/i18n/LocalizedLink";
import { useI18n } from "@/i18n/I18nProvider";
import { bookingQueryFor, estimatePrice, formatPrice, priceFactors, type PricingSelection } from "@/lib/pricing";
import { ArrowIcon } from "@/components/ui/Icons";
import { Pattern } from "@/components/ui/Pattern";
import { SectionHeader } from "@/components/ui/SectionHeader";

const RULER_MAX_CM = 40;

/** Płynne przejście liczby (krótkie, bez animacji przy prefers-reduced-motion). */
function useTweened(value: number): number {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const initial = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const p = reduce ? 1 : Math.min(1, (now - start) / 450);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = Math.round(initial + (value - initial) * eased);
      setShown(next);
      from.current = next;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return shown;
}

function percent(factor: number): string {
  const diff = Math.round((factor - 1) * 100);
  return diff === 0 ? "±0%" : `${diff > 0 ? "+" : "−"}${Math.abs(diff)}%`;
}

function OptionGroup<T extends string>({
  legend,
  value,
  onChange,
  options,
  columns,
}: {
  legend: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly { id: T; label: string; sub?: string }[];
  columns: string;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="font-mincho text-xl">{legend}</legend>
      <div className={`mt-4 grid grid-cols-2 gap-2 ${columns}`}>
        {options.map((option) => (
          <label key={option.id} className="relative cursor-pointer">
            <input type="radio" name={name} value={option.id} checked={value === option.id} onChange={() => onChange(option.id)} className="peer sr-only" />
            <span className="flex h-full min-h-14 flex-col justify-center rounded-xl border border-sumi/15 bg-washi/50 px-4 py-3 transition-colors duration-300 hover:border-sumi/45 peer-checked:border-sumi peer-checked:bg-sumi peer-checked:text-washi peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sumi">
              <span className="font-gothic text-sm font-medium">{option.label}</span>
              {option.sub && <span className="mt-0.5 font-gothic text-xs opacity-70">{option.sub}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Pricing() {
  const { t, lang } = useI18n();
  const p = t.pricing;
  const sliderId = useId();
  const [selection, setSelection] = useState<PricingSelection>({ size: "medium", placement: "forearm", detail: "detailed", character: "black-grey" });
  const set =
    <K extends keyof PricingSelection>(key: K) =>
    (value: PricingSelection[K]) =>
      setSelection((current) => ({ ...current, [key]: value }));

  const estimate = estimatePrice(selection);
  const min = useTweened(estimate.min);
  const max = useTweened(estimate.max);
  const factors = priceFactors(selection);
  const sizeIndex = PRICING.sizes.findIndex((s) => s.id === selection.size);
  const size = PRICING.sizes[sizeIndex];
  const sizeText = p.sizes[size.id];
  const fmt = (n: number) => formatPrice(n, INTL_LOCALE[lang]);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative overflow-hidden bg-kinari py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 text-sumi/[0.06] [mask-image:linear-gradient(to_left,black,transparent)] lg:block">
        <Pattern kind="kumiko" scale={1.3} />
      </div>
      <div className="page-x relative">
        <SectionHeader id="pricing-title" kanji="料金" reading="ryōkin" title={p.title} lead={<p>{p.lead}</p>} />

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-12 lg:col-span-7">
            <div>
              <label htmlFor={sliderId} className="flex items-baseline justify-between gap-4">
                <span className="font-mincho text-xl">{p.groups.size}</span>
                <span className="font-gothic text-sm" aria-hidden="true">
                  {sizeText.label}, {sizeText.detail}
                </span>
              </label>
              <input
                id={sliderId}
                type="range"
                min={0}
                max={PRICING.sizes.length - 1}
                step={1}
                value={sizeIndex}
                onChange={(event) => set("size")(PRICING.sizes[Number(event.target.value)].id)}
                aria-valuetext={`${sizeText.label}, ${sizeText.detail}`}
                className="mt-5 h-11 w-full cursor-pointer accent-sumi"
              />
              {/* Etykiety dokładnie pod pozycjami suwaka (0%, 33%, 67%, 100%). */}
              <div className="relative mt-1 h-5 font-gothic text-xs text-nezumi" aria-hidden="true">
                {PRICING.sizes.map((s, i) => {
                  const position = (i / (PRICING.sizes.length - 1)) * 100;
                  const align = i === 0 ? "translate-x-0" : i === PRICING.sizes.length - 1 ? "-translate-x-full" : "-translate-x-1/2";
                  return (
                    <span key={s.id} className={`absolute top-0 whitespace-nowrap ${align} ${i === sizeIndex ? "text-sumi" : ""}`} style={{ left: `${position}%` }}>
                      {p.sizes[s.id].label}
                    </span>
                  );
                })}
              </div>
              <div className="mt-6" role="img" aria-label={`${p.rulerLabel}: ${sizeText.detail}`}>
                <div className="relative h-6">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-sumi/25" />
                  <div
                    className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 bg-sumi transition-[width] duration-700 ease-[var(--ease-ink)]"
                    style={{ width: `${(size.maxCm / RULER_MAX_CM) * 100}%` }}
                  />
                  {Array.from({ length: RULER_MAX_CM / 5 + 1 }, (_, i) => (
                    <span key={i} className={`absolute top-1/2 w-px -translate-y-1/2 bg-sumi/40 ${i % 2 === 0 ? "h-4" : "h-2"}`} style={{ left: `${(i * 5 * 100) / RULER_MAX_CM}%` }} />
                  ))}
                </div>
                <div className="mt-1 flex justify-between font-gothic text-2xs tabular-nums text-nezumi">
                  <span>0</span>
                  <span>10</span>
                  <span>20</span>
                  <span>30</span>
                  <span>40+ cm</span>
                </div>
              </div>
            </div>

            <OptionGroup
              legend={p.groups.placement}
              value={selection.placement}
              onChange={set("placement")}
              options={PRICING.placements.map((o) => ({ id: o.id, label: p.placements[o.id] }))}
              columns="sm:grid-cols-4"
            />
            <OptionGroup
              legend={p.groups.detail}
              value={selection.detail}
              onChange={set("detail")}
              options={PRICING.detail.map((o) => ({ id: o.id, label: p.detail[o.id].label, sub: p.detail[o.id].description }))}
              columns="sm:grid-cols-3"
            />
            <OptionGroup
              legend={p.groups.character}
              value={selection.character}
              onChange={set("character")}
              options={PRICING.character.map((o) => ({ id: o.id, label: p.character[o.id] }))}
              columns="sm:grid-cols-2"
            />
          </div>

          <div className="lg:col-span-5">
            <div className="on-dark sticky top-8 overflow-hidden rounded-2xl bg-graphite p-7 text-washi sm:p-10">
              <p className="font-gothic text-sm text-usuzumi">{p.resultLabel}</p>
              <p className="mt-4 font-mincho text-[clamp(2.4rem,5vw,3.6rem)] leading-none tabular-nums">
                <span className="sr-only" aria-live="polite" aria-atomic="true">
                  {fmt(estimate.min)}–{fmt(estimate.max)} {p.currency}
                </span>
                <span aria-hidden="true">
                  {fmt(min)}–{fmt(max)}
                  <span className="ml-3 font-gothic text-base tracking-[0.06em] text-usuzumi">{p.currency}</span>
                </span>
              </p>
              <span aria-hidden="true" className="kin-rule mt-8 block" />

              <dl aria-label={p.factorsLabel} className="mt-6 space-y-2 font-gothic text-sm">
                {[
                  [p.groups.size, `${sizeText.label}, ${sizeText.detail}`],
                  [p.groups.placement, `${p.placements[selection.placement]} (${percent(factors.placement)})`],
                  [p.groups.detail, `${p.detail[selection.detail].label} (${percent(factors.detail)})`],
                  [p.groups.character, `${p.character[selection.character]} (${percent(factors.character)})`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-usuzumi">{label}</dt>
                    <dd className="text-right">{value}</dd>
                  </div>
                ))}
              </dl>

              {!PRICING_CONFIRMED && (
                <p className="mt-8 border-l-2 border-kin/70 pl-4 font-gothic text-xs leading-relaxed text-usuzumi">{p.sampleNote}</p>
              )}
              <p className="mt-6 font-mincho text-base leading-relaxed text-washi/90">{p.finalNote}</p>

              <LocalizedLink route="booking" query={bookingQueryFor(selection)} className="btn btn-paper mt-8 w-full">
                {p.cta}
                <ArrowIcon className="btn-arrow h-4 w-4" />
              </LocalizedLink>
              <p className="mt-3 text-center font-gothic text-2xs text-usuzumi">{p.ctaNote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
