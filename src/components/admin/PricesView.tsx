"use client";

import { useState, type FormEvent } from "react";
import { DURATIONS, durationLabel, jetskiTitle, type Jetski } from "@/lib/rental";
import { Notice, PanelHeader, useApi, useFlash } from "./ui";

const toZl = (gr: number | null) => (gr == null ? "" : String(gr / 100).replace(".", ","));

export function PricesView({ jetskis, reload }: { jetskis: Jetski[]; reload: () => Promise<void> }) {
  const [flash, show] = useFlash();
  return (
    <div>
      <PanelHeader title="Ceny i kaucje" description="Ceny w złotych dla każdego skutera i czasu wynajmu. Puste pole = wariant niedostępny do rezerwacji online." />
      {flash && <div className="mb-4">{flash}</div>}
      <div className="grid gap-4">
        {jetskis.map((j) => (
          <PriceRow key={j.id} jetski={j} onSaved={async (msg, ok) => {
            show(ok ? "success" : "error", msg);
            if (ok) await reload();
          }} />
        ))}
      </div>
      {jetskis.length === 0 && <Notice>Najpierw dodaj skuter w zakładce Flota.</Notice>}
    </div>
  );
}

function PriceRow({ jetski, onSaved }: { jetski: Jetski; onSaved: (msg: string, ok: boolean) => void }) {
  const api = useApi();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const prices = Object.fromEntries(DURATIONS.map((d) => [d, String(f.get(`p-${d}`) ?? "").trim()]));
    setBusy(true);
    const r1 = await api(`/api/admin/jetskis/${jetski.id}`, { method: "PUT", json: { prices } });
    if (!r1.ok) {
      setBusy(false);
      setErrors(r1.error?.fields ?? {});
      return onSaved(r1.error?.message ?? "Nie udało się zapisać cen.", false);
    }
    // kaucja jest częścią danych skutera
    const r2 = await api(`/api/admin/jetskis/${jetski.id}`, {
      method: "PUT",
      json: {
        details: {
          manufacturer: jetski.manufacturer,
          model: jetski.model,
          name: jetski.name,
          description: jetski.description,
          powerHp: jetski.powerHp,
          seats: jetski.seats,
          license: jetski.license,
          licenseNote: jetski.licenseNote,
          deposit: String(f.get("deposit") ?? "").trim(),
          image: jetski.image,
          imageAlt: jetski.imageAlt,
          active: jetski.active,
          needsReview: jetski.needsReview,
          sort: jetski.sort,
        },
      },
    });
    setBusy(false);
    setErrors(r2.error?.fields ?? {});
    onSaved(r2.ok ? `Cennik „${jetskiTitle(jetski)}” zapisany.` : (r2.error?.fields?.deposit ?? r2.error?.message ?? "Nie udało się zapisać kaucji."), r2.ok);
  }

  return (
    <form onSubmit={submit} noValidate className="bg-white p-4" aria-label={`Cennik: ${jetskiTitle(jetski)}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-3xl font-extrabold uppercase">{jetskiTitle(jetski)}</h2>
        {!jetski.active && <span className="text-sm text-muted">Ukryty na stronie</span>}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
        {DURATIONS.map((d) => {
          const id = `${jetski.id}-p-${d}`;
          return (
            <div key={d}>
              <label htmlFor={id} className="field-label text-sm">
                {durationLabel(d)}
              </label>
              <div className="relative">
                <input id={id} name={`p-${d}`} inputMode="decimal" defaultValue={toZl(jetski.prices[d])} className="field tabular pr-8" aria-invalid={!!errors[String(d)]} />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted">zł</span>
              </div>
              {errors[String(d)] && <p className="field-error text-sm">{errors[String(d)]}</p>}
            </div>
          );
        })}
        <div>
          <label htmlFor={`${jetski.id}-deposit`} className="field-label text-sm">
            Kaucja
          </label>
          <div className="relative">
            <input id={`${jetski.id}-deposit`} name="deposit" inputMode="decimal" defaultValue={toZl(jetski.depositGr)} className="field tabular pr-8" aria-invalid={!!errors.deposit} />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted">zł</span>
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-sm mt-4" disabled={busy}>
        {busy ? "Zapisywanie…" : "Zapisz cennik"}
      </button>
    </form>
  );
}
