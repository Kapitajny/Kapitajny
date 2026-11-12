"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DURATIONS, durationLabel, durationLabelLong, formatPrice, hasAnyPrice, hourlyRate, jetskiTitle, LONG_RENTAL_MIN, type Jetski } from "@/lib/rental";
import { toTime } from "@/lib/time";

const EXAMPLE_START = 12 * 60;

export function Pricing({
  jetskis,
  info,
}: {
  jetskis: Jetski[];
  info: { cancelFreeHours: number; depositRules: string; extraFees: string; rentalRules: string };
}) {
  const [selectedId, setSelectedId] = useState(jetskis[0]?.id ?? "");
  const firstPriced = (j: Jetski | undefined) => Math.max(0, DURATIONS.findIndex((d) => j?.prices[d] != null));
  const [index, setIndex] = useState(() => firstPriced(jetskis[0]));
  const jetski = jetskis.find((j) => j.id === selectedId) ?? jetskis[0];
  const duration = DURATIONS[index];
  const price = jetski?.prices[duration] ?? null;
  const anyPrices = useMemo(() => jetskis.some(hasAnyPrice), [jetskis]);
  const back = EXAMPLE_START + duration;

  if (!jetski) return null;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-14">
      <div className="grid gap-10 bg-sand p-5 sm:p-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:p-12">
        <div className="min-w-0">
          <h3 className="display-md">Ile czasu na wodzie?</h3>
          <div role="group" aria-label="Model skutera" className="mt-6 flex flex-wrap gap-2">
            {jetskis.map((j) => (
              <button
                key={j.id}
                type="button"
                aria-pressed={j.id === jetski.id}
                onClick={() => {
                  setSelectedId(j.id);
                  if (j.prices[DURATIONS[index]] == null && hasAnyPrice(j)) setIndex(firstPriced(j));
                }}
                className={`min-h-11 px-4 text-[0.95rem] font-semibold ${j.id === jetski.id ? "bg-graphite text-white" : "shadow-[inset_0_0_0_1.5px_var(--color-graphite)] hover:bg-white"}`}
              >
                {jetskiTitle(j)}
              </button>
            ))}
          </div>

          <div className="mt-10">
            <label htmlFor="throttle" className="block font-semibold">
              Czas wynajmu: <span className="text-turq-ink">{durationLabelLong(duration)}</span>
            </label>
            <input
              id="throttle"
              type="range"
              min={0}
              max={DURATIONS.length - 1}
              step={1}
              value={index}
              onChange={(e) => setIndex(Number(e.target.value))}
              aria-valuetext={durationLabelLong(duration)}
              className="throttle mt-5 w-full"
              style={{ ["--p" as string]: `${(index / (DURATIONS.length - 1)) * 100}%` }}
            />
            <div className="tabular mt-1 flex justify-between text-sm font-semibold text-muted" aria-hidden="true">
              {DURATIONS.map((d, i) => (
                <button key={d} type="button" tabIndex={-1} onClick={() => setIndex(i)} className={`min-h-11 min-w-8 ${i === index ? "text-graphite" : ""}`}>
                  {durationLabel(d)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 border-t-2 border-graphite pt-5" aria-live="polite">
          <dl className="grid">
            <div className="flex items-baseline justify-between gap-4 border-b border-sand-line pb-4">
              <dt className="text-muted">
                Cena za {durationLabelLong(duration).replace(/^1 godzina$/, "1 godzinę")} <span className="whitespace-nowrap">(brutto)</span>
              </dt>
              <dd key={`${jetski.id}-${duration}`} className="rise tabular text-right">
                <span className="block font-display text-5xl font-extrabold leading-none">{price != null ? formatPrice(price) : "—"}</span>
                {price != null && duration >= 60 && <span className="mt-1 block text-sm text-muted">{formatPrice(hourlyRate(price, duration))} za godzinę</span>}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-sand-line py-4">
              <dt className="text-muted">Kaucja zwrotna</dt>
              <dd className="tabular font-display text-3xl font-bold leading-none">{jetski.depositGr != null ? formatPrice(jetski.depositGr) : "—"}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-sand-line py-4">
              <dt className="text-muted">Przykład: start {toTime(EXAMPLE_START)}, zwrot</dt>
              <dd className="tabular font-display text-3xl font-bold leading-none">
                {toTime(back)}
                {back >= 1440 && <span className="ml-1 font-sans text-base font-semibold">następnego dnia</span>}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-[0.95rem] text-muted">
            {price == null
              ? "Cenę tego wariantu ustalamy. Zadzwoń lub wybierz inny czas – rezerwacja online działa dla czasów z podaną ceną."
              : duration >= LONG_RENTAL_MIN
                ? "Przy wynajmie na 12 i 24 godziny zwrot musi przypaść w godzinach otwarcia przystani."
                : "Cena obejmuje skuter i kamizelkę. Kaucję wpłacasz na miejscu i odzyskujesz po zwrocie sprzętu."}
          </p>
          <Link
            href={`/rezerwacja?skuter=${encodeURIComponent(jetski.id)}&czas=${duration}`}
            className={`btn mt-6 w-full ${price == null ? "pointer-events-none opacity-50" : ""}`}
            aria-disabled={price == null}
            tabIndex={price == null ? -1 : undefined}
          >
            Zarezerwuj ten czas
          </Link>
        </div>
      </div>

      <div>
        <h3 className="font-display text-3xl font-extrabold uppercase">Wszystkie stawki</h3>
        <p className="mt-2 text-muted">Ceny brutto w złotych, z podatkiem VAT.</p>
        {!anyPrices && <p className="mt-3 max-w-2xl text-muted">Cennik sezonu jest w przygotowaniu. Ceny pojawią się tutaj, gdy tylko je ustalimy.</p>}
        <div className="relative mt-5 overflow-x-auto border-t-2 border-graphite" tabIndex={0} role="region" aria-label="Tabela cen wszystkich skuterów">
          <table className="tabular w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">Ceny brutto wynajmu skuterów wodnych według czasu wynajmu, w złotych</caption>
            <thead>
              <tr className="border-b border-graphite/25 text-sm text-muted">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Skuter
                </th>
                {DURATIONS.map((d) => (
                  <th key={d} scope="col" className="px-3 py-3 text-right font-semibold">
                    {durationLabel(d)}
                  </th>
                ))}
                <th scope="col" className="py-3 pl-3 text-right font-semibold">
                  Kaucja
                </th>
              </tr>
            </thead>
            <tbody>
              {jetskis.map((j) => (
                <tr key={j.id} className="border-b border-line">
                  <th scope="row" className="py-4 pr-4 font-display text-2xl font-bold uppercase leading-none">
                    {jetskiTitle(j)}
                  </th>
                  {DURATIONS.map((d) => (
                    <td key={d} className={`px-3 py-4 text-right ${j.prices[d] == null ? "text-muted" : "font-semibold"}`}>
                      {formatPrice(j.prices[d])}
                    </td>
                  ))}
                  <td className={`py-4 pl-3 text-right ${j.depositGr == null ? "text-muted" : "font-semibold"}`}>{formatPrice(j.depositGr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted">Wszystkie ceny są cenami brutto. „—” oznacza, że cena tego wariantu nie jest jeszcze ustalona.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <InfoBlock title="Kaucja" text={info.depositRules} fallback="Kaucja zależy od modelu (patrz tabela). Wpłacasz ją przed wypłynięciem i odzyskujesz po zwrocie skutera bez uszkodzeń." />
        <InfoBlock title="Opłaty dodatkowe" text={info.extraFees} fallback="Informację o opłatach dodatkowych (np. paliwo, przekroczenie czasu) uzupełnimy przed sezonem." />
        <InfoBlock
          title="Zasady i anulowanie"
          text={info.rentalRules}
          fallback={`Rezerwację możesz bezpłatnie anulować do ${info.cancelFreeHours} h przed startem, korzystając z linku z potwierdzenia. Pełne zasady znajdziesz w regulaminie.`}
          link
        />
      </div>
    </div>
  );
}

function InfoBlock({ title, text, fallback, link = false }: { title: string; text: string; fallback: string; link?: boolean }) {
  return (
    <div className="border-t-2 border-graphite pt-4">
      <h3 className="font-sans text-lg font-bold normal-case tracking-normal">{title}</h3>
      <p className="mt-2 whitespace-pre-line text-muted">{text.trim() || fallback}</p>
      {link && (
        <Link href="/zasady-wynajmu" className="link mt-3 inline-block font-semibold">
          Zasady wynajmu
        </Link>
      )}
    </div>
  );
}
