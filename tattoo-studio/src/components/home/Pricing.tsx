"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { PRICING, PRICING_CONFIRMED } from "@/config/pricing";
import { bookingQueryFor, estimatePrice, formatPrice, type PricingSelection } from "@/lib/pricing";
import { ArrowIcon } from "@/components/ui/Icons";
import { SectionMark } from "@/components/ui/SectionMark";

const RULER_MAX_CM = 40;
const SIZE_CM: Record<string, number> = { small: 5, medium: 15, large: 30, "extra-large": 40 };

function OptionGroup<T extends string>({
  legend,
  name,
  value,
  onChange,
  options,
  columns = "sm:grid-cols-2",
}: {
  legend: string;
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly { id: T; label: string; sub?: string }[];
  columns?: string;
}) {
  const id = useId();
  return (
    <fieldset>
      <legend className="font-mincho text-xl">{legend}</legend>
      <div className={`mt-4 grid grid-cols-2 gap-2 ${columns}`}>
        {options.map((option) => (
          <label key={option.id} className="relative cursor-pointer">
            <input
              type="radio"
              name={`${name}-${id}`}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="peer sr-only"
            />
            <span className="flex h-full min-h-14 flex-col justify-center rounded-[2px] border border-sumi/20 bg-kinari/40 px-4 py-3 transition-colors duration-300 hover:border-sumi/50 peer-checked:border-sumi peer-checked:bg-sumi peer-checked:text-washi peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sumi">
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
  const [selection, setSelection] = useState<PricingSelection>({
    size: "medium",
    placement: "forearm",
    detail: "detailed",
    character: "black-grey",
  });
  const set = <K extends keyof PricingSelection>(key: K) => (value: PricingSelection[K]) =>
    setSelection((current) => ({ ...current, [key]: value }));

  const estimate = estimatePrice(selection);
  const size = PRICING.sizes.find((s) => s.id === selection.size)!;
  const sizeCm = SIZE_CM[selection.size] ?? RULER_MAX_CM;

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative bg-kinari py-24 sm:py-32">
      <div className="page-x grid gap-10 lg:grid-cols-12">
        <SectionMark kanji="料金" reading="ryōkin" className="hidden lg:col-span-1 lg:flex" />
        <div className="lg:col-span-11">
          <h2 id="pricing-title" className="display display-lg">
            PRICING
          </h2>
          <p className="mt-5 max-w-[34rem] font-mincho text-lg leading-relaxed">
            Sprawdź orientacyjny koszt tatuażu. Wybierz rozmiar, miejsce, poziom szczegółowości i charakter projektu.
          </p>

          <div className="mt-14 grid gap-12 lg:grid-cols-11 lg:gap-10">
            <div className="space-y-12 lg:col-span-6">
              <div>
                <OptionGroup
                  legend="Rozmiar"
                  name="size"
                  value={selection.size}
                  onChange={set("size")}
                  options={PRICING.sizes.map((s) => ({ id: s.id, label: s.label, sub: s.detail }))}
                  columns="sm:grid-cols-4"
                />
                <div className="mt-5" aria-hidden="true">
                  <div className="relative h-6">
                    <div
                      className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 bg-sumi transition-[width] duration-700 ease-[var(--ease-ink)]"
                      style={{ width: `${(sizeCm / RULER_MAX_CM) * 100}%` }}
                    />
                    <div className="absolute inset-x-0 top-1/2 h-px bg-sumi/25" />
                    {Array.from({ length: RULER_MAX_CM / 5 + 1 }, (_, i) => (
                      <span
                        key={i}
                        className={`absolute top-1/2 w-px -translate-y-1/2 bg-sumi/40 ${i % 2 === 0 ? "h-4" : "h-2"}`}
                        style={{ left: `${(i * 5 * 100) / RULER_MAX_CM}%` }}
                      />
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
                legend="Miejsce na ciele"
                name="placement"
                value={selection.placement}
                onChange={set("placement")}
                options={PRICING.placements.map((p) => ({ id: p.id, label: p.label }))}
                columns="sm:grid-cols-4"
              />
              <OptionGroup
                legend="Poziom szczegółowości"
                name="detail"
                value={selection.detail}
                onChange={set("detail")}
                options={PRICING.detail.map((d) => ({ id: d.id, label: d.label, sub: d.description }))}
                columns="sm:grid-cols-3"
              />
              <OptionGroup
                legend="Charakter projektu"
                name="character"
                value={selection.character}
                onChange={set("character")}
                options={PRICING.character.map((c) => ({ id: c.id, label: c.label }))}
              />
            </div>

            <div className="lg:col-span-5">
              <div className="on-dark sticky top-10 bg-sumi p-7 text-washi sm:p-10">
                <p className="font-gothic text-sm text-usuzumi">Szacunkowy przedział</p>
                <p className="mt-3 font-mincho text-[clamp(2.4rem,5vw,3.6rem)] leading-none tabular-nums" aria-live="polite" aria-atomic="true">
                  {formatPrice(estimate.min)}–{formatPrice(estimate.max)}
                  <span className="ml-3 font-gothic text-base tracking-[0.1em] text-usuzumi">{estimate.currency}</span>
                </p>
                <p className="mt-5 font-gothic text-sm leading-relaxed text-washi/80">
                  {size.label} ({size.detail}),{" "}
                  {PRICING.placements.find((p) => p.id === selection.placement)!.label.toLowerCase()},{" "}
                  {PRICING.detail.find((d) => d.id === selection.detail)!.label.toLowerCase()},{" "}
                  {PRICING.character.find((c) => c.id === selection.character)!.label.toLowerCase()}.
                </p>

                {!PRICING_CONFIRMED && (
                  <p className="mt-6 border-l-2 border-washi/40 pl-4 font-gothic text-xs leading-relaxed text-usuzumi">
                    Wartości przykładowe: studio uzupełni swój cennik. Do tego czasu wynik ma wyłącznie charakter poglądowy.
                  </p>
                )}

                <p className="mt-6 font-mincho text-base leading-relaxed text-washi/90">
                  Ostateczna cena zależy od indywidualnej wyceny tatuatora po poznaniu projektu.
                </p>

                <Link href={`/rezerwacja?${bookingQueryFor(selection)}`} className="btn btn-paper mt-8 w-full">
                  Book a consultation
                  <ArrowIcon className="h-4 w-4" />
                </Link>
                <p className="mt-3 text-center font-gothic text-2xs text-usuzumi">Wybrane parametry przeniesiemy do formularza.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
