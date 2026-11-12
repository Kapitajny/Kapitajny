"use client";

import { useToday } from "@/lib/use-today";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { jetskiTitle, type Jetski } from "@/lib/rental";
import { formatDateTime } from "@/lib/time";
import type { Block } from "./types";
import { Field, Notice, PanelHeader, useApi, useFlash } from "./ui";

export function BlocksView({ jetskis }: { jetskis: Jetski[] }) {
  const api = useApi();
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, show] = useFlash();
  const today = useToday();

  const load = useCallback(async () => {
    const r = await api<{ blocks: Block[] }>("/api/admin/blocks");
    if (r.data) setBlocks(r.data.blocks);
  }, [api]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pobranie listy blokad
    void load();
  }, [load]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const r = await api("/api/admin/blocks", { method: "POST", json: Object.fromEntries(new FormData(form)) });
    if (!r.ok) return setError(r.error?.message ?? "Nie udało się dodać blokady.");
    setError(null);
    form.reset();
    show("success", "Blokada dodana. Te godziny zniknęły z rezerwacji online.");
    await load();
  }

  async function remove(id: string) {
    const r = await api(`/api/admin/blocks/${id}`, { method: "DELETE" });
    if (r.ok) {
      show("success", "Blokada usunięta.");
      await load();
    }
  }

  return (
    <div>
      <PanelHeader title="Blokady terminów" description="Serwis, impreza zamknięta, rezerwacja telefoniczna – zablokuj godziny dla jednego skutera albo całej floty." />
      <form onSubmit={submit} noValidate className="grid gap-4 bg-white p-4 md:grid-cols-6 md:items-end">
        <Field id="bl-jetski" label="Skuter" className="md:col-span-2">
          <select id="bl-jetski" name="jetskiId" className="field">
            <option value="">Cała flota</option>
            {jetskis.map((j) => (
              <option key={j.id} value={j.id}>
                {jetskiTitle(j)}
              </option>
            ))}
          </select>
        </Field>
        <Field id="bl-sd" label="Od (data)">
          <input id="bl-sd" name="startDate" type="date" defaultValue={today} required className="field" />
        </Field>
        <Field id="bl-st" label="Od (godz.)">
          <input id="bl-st" name="startTime" type="time" defaultValue="10:00" required className="field" />
        </Field>
        <Field id="bl-ed" label="Do (data)">
          <input id="bl-ed" name="endDate" type="date" defaultValue={today} required className="field" />
        </Field>
        <Field id="bl-et" label="Do (godz.)">
          <input id="bl-et" name="endTime" type="time" defaultValue="12:00" required className="field" />
        </Field>
        <Field id="bl-reason" label="Powód (widoczny tylko w panelu)" className="md:col-span-4">
          <input id="bl-reason" name="reason" className="field" placeholder="Np. przegląd silnika" />
        </Field>
        <div className="md:col-span-2">
          <button type="submit" className="btn btn-sm w-full">
            Dodaj blokadę
          </button>
        </div>
      </form>
      <div className="mt-4 grid gap-2">
        {error && <Notice tone="error">{error}</Notice>}
        {flash}
      </div>
      <h2 className="mt-8 font-sans text-xl font-bold normal-case tracking-normal">Aktualne i przyszłe blokady</h2>
      {!blocks ? (
        <p className="mt-3 text-muted">Ładowanie…</p>
      ) : blocks.length === 0 ? (
        <div className="mt-3">
          <Notice>Brak blokad.</Notice>
        </div>
      ) : (
        <ul className="mt-3 grid gap-2">
          {blocks.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 bg-white p-4">
              <span>
                <b>{b.jetskiId ? jetskiTitle(jetskis.find((j) => j.id === b.jetskiId) ?? { name: b.jetskiId, manufacturer: null, model: null }) : "Cała flota"}</b> ·{" "}
                {formatDateTime(b.start)} – {formatDateTime(b.end)}
                {b.reason && <span className="text-muted"> · {b.reason}</span>}
              </span>
              <button type="button" className="min-h-10 px-2 font-semibold text-danger" onClick={() => remove(b.id)}>
                Usuń<span className="sr-only"> blokadę</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
