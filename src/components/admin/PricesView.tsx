"use client";

import { useState, type FormEvent, type MouseEvent } from "react";
import { DURATIONS, durationLabel, formatPrice, hourlyRate, jetskiTitle, lowestPrice, pricesFromHourly, type Jetski } from "@/lib/rental";
import { Notice, PanelHeader, useApi, useFlash } from "./ui";

const toZl = (gr: number | null) => (gr == null ? "" : String(gr / 100).replace(".", ","));

/** Pola formularza → { "30": "250", … } (tylko czasy, które mają zostać zapisane). */
function readPrices(f: FormData, onlyFilled: boolean) {
  const out: Record<string, string> = {};
  for (const d of DURATIONS) {
    const v = String(f.get(`p-${d}`) ?? "").trim();
    if (!onlyFilled || v) out[String(d)] = v;
  }
  return out;
}

export function PricesView({ jetskis, reload }: { jetskis: Jetski[]; reload: () => Promise<void> }) {
  const [flash, show] = useFlash();
  return (
    <div>
      <PanelHeader
        title="Ceny i kaucje"
        description="Wpisz ceny brutto (z VAT) w złotych. Klient widzi je w cenniku, na karcie skutera i w rezerwacji. Puste pole = ten czas nie jest dostępny do rezerwacji online."
      />
      {flash && <div className="mb-4">{flash}</div>}
      {jetskis.length > 0 && (
        <BulkPrices
          jetskis={jetskis}
          onDone={async (msg, ok) => {
            show(ok ? "success" : "error", msg);
            await reload();
          }}
        />
      )}
      <h2 className="mb-3 mt-10 font-sans text-xl font-bold normal-case tracking-normal">Cennik poszczególnych skuterów</h2>
      <div className="grid gap-4">
        {jetskis.map((j) => (
          <PriceRow
            key={`${j.id}-${JSON.stringify(j.prices)}-${j.depositGr}`}
            jetski={j}
            onSaved={async (msg, ok) => {
              show(ok ? "success" : "error", msg);
              if (ok) await reload();
            }}
          />
        ))}
      </div>
      {jetskis.length === 0 && <Notice>Najpierw dodaj skuter w zakładce Flota.</Notice>}
    </div>
  );
}

function MoneyInput({ id, name, defaultValue, error, label }: { id: string; name: string; defaultValue?: string; error?: string; label: string }) {
  return (
    <div>
      <label htmlFor={id} className="field-label text-sm">
        {label}
      </label>
      <div className="relative">
        <input id={id} name={name} inputMode="decimal" defaultValue={defaultValue} placeholder="—" className="field tabular pr-9" aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted">zł</span>
      </div>
      {error && (
        <p id={`${id}-err`} className="field-error text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

/** Zamienia „170” / „170,50” na grosze; null przy błędnej wartości. */
function parseZl(value: string): number | null {
  const n = Number(value.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 && n <= 100_000 ? Math.round(n * 100) : null;
}

/** Pole „cena za godzinę” z przyciskiem, który wypełnia wszystkie czasy wynajmu w tym samym formularzu. */
function HourlyCalculator({ id, initial }: { id: string; initial?: number | null }) {
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState(initial ? toZl(initial) : "");
  function fill(e: MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.form;
    const gr = parseZl(value);
    if (!form || gr == null) return setError("Podaj cenę za godzinę, np. 170.");
    setError(null);
    const prices = pricesFromHourly(gr);
    for (const d of DURATIONS) {
      const input = form.elements.namedItem(`p-${d}`);
      if (input instanceof HTMLInputElement) input.value = toZl(prices[d]);
    }
  }
  return (
    <div className="mt-4 flex flex-wrap items-end gap-3 bg-sand p-3">
      <div>
        <label htmlFor={id} className="field-label text-sm">
          Cena za godzinę (brutto)
        </label>
        <div className="relative w-40">
          <input
            id={id}
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="np. 170"
            className="field tabular pr-9"
            aria-invalid={!!error}
            aria-describedby={`${id}-hint${error ? ` ${id}-err` : ""}`}
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted">zł</span>
        </div>
      </div>
      <button type="button" className="btn btn-ghost btn-sm" onClick={fill}>
        Przelicz wszystkie czasy
      </button>
      <p id={`${id}-hint`} className="basis-full text-sm text-muted">
        Każda godzina po tej samej stawce: 30 min = połowa stawki, 24 h = stawka × 24. Sprawdź wyliczone kwoty i zapisz.
      </p>
      {error && (
        <p id={`${id}-err`} className="field-error basis-full text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

/** Wspólny cennik: wpisane kwoty trafiają do wszystkich skuterów, puste pola niczego nie zmieniają. */
function BulkPrices({ jetskis, onDone }: { jetskis: Jetski[]; onDone: (msg: string, ok: boolean) => void }) {
  const api = useApi();
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<FormData | null>(null);

  async function apply(f: FormData) {
    const prices = readPrices(f, true);
    const deposit = String(f.get("deposit") ?? "").trim();
    setBusy(true);
    let failed: string | null = null;
    for (const j of jetskis) {
      const r = await api(`/api/admin/jetskis/${j.id}`, { method: "PUT", json: { prices, ...(deposit ? { deposit } : {}) } });
      if (!r.ok) {
        failed = Object.values(r.error?.fields ?? {})[0] ?? r.error?.message ?? "Nie udało się zapisać.";
        break;
      }
    }
    setBusy(false);
    setConfirm(null);
    onDone(failed ?? `Wspólny cennik zastosowany do ${jetskis.length} skuterów.`, !failed);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const filled = Object.keys(readPrices(f, true)).length + (String(f.get("deposit") ?? "").trim() ? 1 : 0);
    if (filled === 0) return onDone("Wpisz co najmniej jedną kwotę.", false);
    setConfirm(f);
  }

  return (
    <form onSubmit={submit} noValidate className="border-l-4 border-turq bg-white p-4" aria-label="Wspólny cennik dla całej floty">
      <h2 className="font-display text-3xl font-extrabold uppercase">Wspólny cennik dla całej floty</h2>
      <p className="mt-1 max-w-3xl text-muted">
        Wpisz cenę za godzinę i kliknij „Przelicz wszystkie czasy” (np. 170 zł → 24 h = 4080 zł) albo wpisz kwoty ręcznie. Wpisane kwoty nadpiszą ceny
        wszystkich skuterów, puste pola zostaną bez zmian.
      </p>
      <HourlyCalculator id="bulk-hourly" />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
        {DURATIONS.map((d) => (
          <MoneyInput key={d} id={`bulk-p-${d}`} name={`p-${d}`} label={`${durationLabel(d)} brutto`} />
        ))}
        <MoneyInput id="bulk-deposit" name="deposit" label="Kaucja" />
      </div>
      {confirm ? (
        <div className="mt-4 flex flex-wrap items-center gap-3" role="group" aria-label="Potwierdzenie">
          <span className="font-semibold">Nadpisać te ceny we wszystkich skuterach ({jetskis.length})?</span>
          <button type="button" className="btn btn-sm" onClick={() => apply(confirm)} disabled={busy} autoFocus>
            {busy ? "Zapisywanie…" : "Tak, zastosuj"}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirm(null)} disabled={busy}>
            Anuluj
          </button>
        </div>
      ) : (
        <button type="submit" className="btn btn-sm mt-4">
          Zastosuj do wszystkich skuterów
        </button>
      )}
    </form>
  );
}

function PriceRow({ jetski, onSaved }: { jetski: Jetski; onSaved: (msg: string, ok: boolean) => void }) {
  const api = useApi();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const from = lowestPrice(jetski);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const r = await api(`/api/admin/jetskis/${jetski.id}`, { method: "PUT", json: { prices: readPrices(f, false), deposit: String(f.get("deposit") ?? "").trim() } });
    setBusy(false);
    setErrors(r.error?.fields ?? {});
    onSaved(r.ok ? `Cennik „${jetskiTitle(jetski)}” zapisany.` : (r.error?.message ?? "Nie udało się zapisać cen."), r.ok);
  }

  return (
    <form onSubmit={submit} noValidate className="bg-white p-4" aria-label={`Cennik: ${jetskiTitle(jetski)}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-3xl font-extrabold uppercase">{jetskiTitle(jetski)}</h3>
        <p className="text-sm text-muted">
          {!jetski.active && "Ukryty na stronie · "}
          Klient widzi: <b className="text-graphite">{from ? `od ${formatPrice(from.price)} brutto za ${durationLabel(from.duration)}` : "Cena wkrótce"}</b>
        </p>
      </div>
      <HourlyCalculator id={`${jetski.id}-hourly`} initial={jetski.prices[60] ?? (from ? hourlyRate(from.price, from.duration) : null)} />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
        {DURATIONS.map((d) => (
          <MoneyInput key={d} id={`${jetski.id}-p-${d}`} name={`p-${d}`} label={`${durationLabel(d)} brutto`} defaultValue={toZl(jetski.prices[d])} error={errors[String(d)]} />
        ))}
        <MoneyInput id={`${jetski.id}-deposit`} name="deposit" label="Kaucja" defaultValue={toZl(jetski.depositGr)} error={errors.deposit} />
      </div>
      <button type="submit" className="btn btn-sm mt-4" disabled={busy}>
        {busy ? "Zapisywanie…" : "Zapisz cennik"}
      </button>
    </form>
  );
}
