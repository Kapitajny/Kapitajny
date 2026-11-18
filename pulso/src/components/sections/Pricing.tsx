"use client";

import { useState } from "react";
import {
  budgetNote,
  comparison,
  currency,
  formatPrice,
  packageForPlatformCount,
  packages,
  priceSuffix,
  pricingIsDraft,
} from "@/config/pricing";
import { ContactLink, Arrow } from "@/components/ui/ContactLink";
import { Check, Dash } from "@/components/ui/Icons";

const counts = [1, 2, 3, 4] as const;

export function Pricing() {
  const [count, setCount] = useState<number>(2);
  const selected = packageForPlatformCount(count);

  return (
    <section id="cennik" aria-labelledby="cennik-tytul" className="section border-t border-rule">
      <div className="container-plan">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="cennik-tytul" className="t-h2 lg:col-span-6">
            Stała opłata za obsługę. Budżet reklamowy osobno.
          </h2>
          <p className="t-lead lg:col-span-5 lg:col-start-8 lg:self-end">
            Płacisz nam za pracę: strategię, konfigurację, optymalizację i raporty. Pieniądze na reklamy trafiają bezpośrednio
            do platform, bez naszej marży.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <p id="liczba-platform" className="text-[1.0625rem] font-[640]">
            Ile platform chcesz prowadzić?
          </p>
          <div className="inline-flex w-fit rounded-full border border-ink p-1" role="radiogroup" aria-labelledby="liczba-platform">
            {counts.map((c) => (
              <label key={c} className="relative">
                <input
                  type="radio"
                  name="liczba-platform"
                  value={c}
                  checked={count === c}
                  onChange={() => setCount(c)}
                  className="peer sr-only"
                  aria-label={`${c} ${c === 1 ? "platforma" : "platformy"}`}
                />
                <span className="tnum flex h-11 min-w-14 items-center justify-center rounded-full px-4 text-[1.0625rem] font-[640] text-ink-2 transition-colors peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink hover:text-ink peer-checked:hover:text-paper">
                  {c}
                </span>
              </label>
            ))}
          </div>
          <p className="text-[0.9375rem] text-ink-2" aria-live="polite">
            Pasuje pakiet <strong className="font-[680] text-ink">{selected.name}</strong>
          </p>
        </div>

        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {packages.map((p) => {
            const isSel = p.id === selected.id;
            return (
              <li
                key={p.id}
                className={`flex flex-col rounded-[10px] bg-sheet p-6 transition-[border-color,box-shadow] duration-300 sm:p-7 ${
                  isSel ? "border-2 border-ink shadow-(--shadow-sheet)" : "border-[1.5px] border-dashed border-field"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[1.25rem] font-[780] tracking-[0.02em]" style={{ fontVariationSettings: '"wdth" 120' }}>
                    {p.name}
                  </h3>
                  {isSel && <span className="rounded-full bg-ink px-3 py-1 text-xs font-[640] text-paper">Twój wybór</span>}
                </div>
                <p className="mt-1 text-[0.9375rem] font-[600] text-ink-2">{p.platformsLabel}</p>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="tnum text-[clamp(2.5rem,2.1rem+1.6vw,3.25rem)] leading-none font-[760] tracking-[-0.03em]" style={{ fontVariationSettings: '"wdth" 110' }}>
                    {formatPrice(p.priceNet)}
                  </span>
                  <span className="text-[1.0625rem] font-[640]">{currency}</span>
                </p>
                <p className="mt-1 text-sm text-ink-3">{priceSuffix}</p>
                <p className="mt-5 text-[0.9875rem] leading-relaxed text-ink-2">{p.summary}</p>
                <div className="mt-auto pt-7">
                  <ContactLink
                    package={p.id}
                    className={`btn w-full ${isSel ? "btn-primary" : "btn-secondary"}`}
                    ariaLabel={`Wybieram pakiet ${p.name}`}
                  >
                    Wybieram pakiet <Arrow />
                  </ContactLink>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          <p className="rounded-[10px] border-2 border-ink bg-sheet p-5 text-[1rem] leading-relaxed lg:col-span-8">
            <span className="font-[700]">Budżet reklamowy nie jest wliczony. </span>
            <span className="text-ink-2">{budgetNote.replace("Budżet reklamowy nie jest wliczony w cenę obsługi. ", "")}</span>
          </p>
          {pricingIsDraft && (
            <p className="self-center text-[0.9375rem] text-ink-3 lg:col-span-4">
              Ceny są robocze. Zakres i cenę zawsze potwierdzamy na piśmie przed startem współpracy.
            </p>
          )}
        </div>

        <div className="mt-14">
          <h3 className="t-h3">Porównanie pakietów</h3>
          <div className="relative mt-5 overflow-x-auto rounded-[10px] border border-rule bg-sheet">
            <table className="w-full min-w-[40rem] text-left text-[0.9875rem]">
              <caption className="sr-only">Zakres usług w pakietach START, GROWTH i PROFESSIONAL</caption>
              <thead>
                <tr className="border-b border-rule">
                  <th scope="col" className="w-[40%] px-5 py-4 font-[620] text-ink-2">
                    Zakres
                  </th>
                  {packages.map((p) => (
                    <th
                      key={p.id}
                      scope="col"
                      className={`px-5 py-4 text-center font-[760] tracking-[0.02em] transition-colors ${p.id === selected.id ? "bg-ink text-paper" : ""}`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-rule last:border-b-0">
                    <th scope="row" className="px-5 py-3.5 font-[500]">
                      {row.feature}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className={`px-5 py-3.5 text-center ${packages[i].id === selected.id ? "bg-paper-2" : ""}`}>
                        {v === true ? (
                          <>
                            <Check className="mx-auto h-5 w-5" />
                            <span className="sr-only">tak</span>
                          </>
                        ) : v === false ? (
                          <>
                            <Dash className="mx-auto h-5 w-5 text-ink-3" />
                            <span className="sr-only">nie</span>
                          </>
                        ) : (
                          <span className="font-[560]">{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
