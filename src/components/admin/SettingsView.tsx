"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Settings } from "./types";
import { Field, Notice, PanelHeader, useApi, useFlash } from "./ui";

const MODES = [
  { value: "hidden", label: "Informacja bez modeli", hint: "Sekcja wyjaśnia zasady i zaprasza do kontaktu. Bezpieczny wybór, dopóki nie zweryfikujesz przepisów." },
  { value: "models", label: "Modele bez patentu", hint: "Pokazuje skutery oznaczone we flocie jako „Bez patentu” razem z ich warunkami." },
  { value: "instructor", label: "Pierwszy raz z instruktorem", hint: "Skuter prowadzi instruktor z uprawnieniami, klient płynie razem z nim." },
];

export function SettingsView() {
  const api = useApi();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, show] = useFlash();

  useEffect(() => {
    void api<{ settings: Settings }>("/api/admin/settings").then((r) => r.data && setSettings(r.data.settings));
  }, [api]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const r = await api<{ settings: Settings }>("/api/admin/settings", { method: "PUT", json: Object.fromEntries(new FormData(e.currentTarget)) });
    if (r.data) {
      setSettings(r.data.settings);
      setError(null);
      show("success", "Ustawienia zapisane.");
    } else setError(r.error?.message ?? "Nie udało się zapisać.");
  }

  if (!settings) return <p className="text-muted">Ładowanie…</p>;
  const num = (key: string, label: string, hint: string) => (
    <Field id={`s-${key}`} label={label} hint={hint}>
      <input id={`s-${key}`} name={key} inputMode="numeric" defaultValue={settings[key]} className="field tabular" />
    </Field>
  );
  const text = (key: string, label: string, hint: string, rows = 3) => (
    <Field id={`s-${key}`} label={label} hint={hint}>
      <textarea id={`s-${key}`} name={key} rows={rows} defaultValue={settings[key]} className="field" />
    </Field>
  );

  return (
    <form onSubmit={submit} noValidate>
      <PanelHeader
        title="Ustawienia"
        description="Zasady rezerwacji, dane kontaktowe i teksty widoczne na stronie."
        actions={
          <button type="submit" className="btn btn-sm">
            Zapisz ustawienia
          </button>
        }
      />
      <div className="mb-6 grid gap-3">
        {error && <Notice tone="error">{error}</Notice>}
        {flash}
      </div>

      <section className="bg-white p-5">
        <h2 className="font-sans text-xl font-bold normal-case tracking-normal">Rezerwacje</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {num("prep_minutes", "Przygotowanie skutera (min)", "Przerwa między wynajmami")}
          {num("lead_minutes", "Najwcześniej za (min)", "Minimalny czas od rezerwacji do startu")}
          {num("slot_step_minutes", "Co ile minut start", "Np. 30 = 10:00, 10:30…")}
          {num("horizon_days", "Rezerwacje na ile dni", "Jak daleko w przód")}
          {num("cancel_free_hours", "Bezpłatne anulowanie (h)", "Do ilu godzin przed startem")}
        </div>
      </section>

      <section className="mt-6 bg-white p-5">
        <h2 className="font-sans text-xl font-bold normal-case tracking-normal">Sekcja „Bez patentu”</h2>
        <fieldset className="mt-4 grid gap-3">
          <legend className="sr-only">Tryb sekcji</legend>
          {MODES.map((m) => (
            <label key={m.value} className="flex items-start gap-3">
              <input type="radio" name="no_license_mode" value={m.value} defaultChecked={settings.no_license_mode === m.value} className="check" />
              <span>
                <b>{m.label}</b>
                <span className="block text-sm text-muted">{m.hint}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <div className="mt-4">{text("instructor_note", "Opis oferty z instruktorem (opcjonalnie)", "Pokazywany w trybie „z instruktorem”.", 2)}</div>
      </section>

      <section className="mt-6 bg-white p-5">
        <h2 className="font-sans text-xl font-bold normal-case tracking-normal">Kontakt i dojazd</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <Field id="s-contact_phone" label="Telefon" hint="Widoczny w stopce, lokalizacji i potwierdzeniu">
            <input id="s-contact_phone" name="contact_phone" defaultValue={settings.contact_phone} className="field" />
          </Field>
          <Field id="s-contact_email" label="E-mail">
            <input id="s-contact_email" name="contact_email" type="email" defaultValue={settings.contact_email} className="field" />
          </Field>
        </div>
        <div className="mt-5">{text("parking_info", "Parking i dojazd", "Np. bezpłatny parking przy przystani, wjazd od ulicy…")}</div>
      </section>

      <section className="mt-6 bg-white p-5">
        <h2 className="font-sans text-xl font-bold normal-case tracking-normal">Teksty w cenniku i FAQ</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {text("deposit_rules", "Kaucja – zasady", "Forma wpłaty, kiedy zwracana")}
          {text("extra_fees", "Opłaty dodatkowe", "Paliwo, przekroczenie czasu, sprzątanie…")}
          {text("rental_rules", "Zasady i anulowanie", "Krótko, pełna wersja w regulaminie")}
          {text("min_age", "Odpowiedź FAQ: wiek", "Np. „Skuter może prowadzić osoba pełnoletnia…”")}
        </div>
      </section>
      <div className="mt-6">
        <button type="submit" className="btn">
          Zapisz ustawienia
        </button>
      </div>
    </form>
  );
}
