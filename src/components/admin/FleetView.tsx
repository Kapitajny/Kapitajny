"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { formatPrice, jetskiTitle, type Jetski, type LicenseRequirement } from "@/lib/rental";
import { Field, Notice, PanelHeader, Pill, useApi, useFlash } from "./ui";

const LICENSE_OPTIONS: { value: LicenseRequirement; label: string }[] = [
  { value: "unknown", label: "Do potwierdzenia" },
  { value: "required", label: "Wymaga patentu" },
  { value: "none", label: "Bez patentu (podaj warunki)" },
];

export function FleetView({ jetskis, reload }: { jetskis: Jetski[]; reload: () => Promise<void> }) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [flash, show] = useFlash();
  const api = useApi();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function remove(id: string) {
    const r = await api<{ result: "deleted" | "deactivated" }>(`/api/admin/jetskis/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    if (r.data) {
      show("success", r.data.result === "deleted" ? "Skuter usunięty." : "Skuter ma historię rezerwacji, więc został ukryty zamiast usunięty.");
      await reload();
    } else show("error", r.error?.message ?? "Nie udało się usunąć.");
  }

  return (
    <div>
      <PanelHeader
        title="Flota"
        description="Dodawaj i edytuj skutery, zdjęcia i opisy. Ceny ustawisz w zakładce „Ceny i kaucje”."
        actions={
          <button type="button" className="btn btn-sm" onClick={() => setEditing("new")}>
            Dodaj skuter
          </button>
        }
      />
      {flash && <div className="mb-4">{flash}</div>}
      {editing === "new" && (
        <div className="mb-6">
          <JetskiForm
            onCancel={() => setEditing(null)}
            onSaved={async () => {
              setEditing(null);
              show("success", "Skuter dodany.");
              await reload();
            }}
          />
        </div>
      )}
      <ul className="grid gap-3">
        {jetskis.map((j) => (
          <li key={j.id} className="bg-white">
            <div className="grid gap-4 p-4 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center">
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                {j.image && <Image src={j.image} alt="" fill sizes="112px" className="object-cover" unoptimized={j.image.startsWith("/media/")} />}
              </div>
              <div className="min-w-0">
                <p className="font-display text-3xl font-extrabold uppercase leading-none">{jetskiTitle(j)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Pill tone={j.active ? "success" : "neutral"}>{j.active ? "Widoczny" : "Ukryty"}</Pill>
                  {j.needsReview && <Pill tone="warn">Dane do potwierdzenia</Pill>}
                  <Pill tone={j.license === "unknown" ? "warn" : "info"}>{LICENSE_OPTIONS.find((o) => o.value === j.license)?.label}</Pill>
                  <Pill>Kaucja: {formatPrice(j.depositGr)}</Pill>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-ghost btn-sm" aria-expanded={editing === j.id} onClick={() => setEditing(editing === j.id ? null : j.id)}>
                  {editing === j.id ? "Zamknij" : "Edytuj"}
                </button>
                {confirmDelete === j.id ? (
                  <>
                    <button type="button" className="btn btn-sm" onClick={() => remove(j.id)} autoFocus>
                      Tak, usuń
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}>
                      Anuluj
                    </button>
                  </>
                ) : (
                  <button type="button" className="min-h-10 px-2 font-semibold text-danger" onClick={() => setConfirmDelete(j.id)}>
                    Usuń
                  </button>
                )}
              </div>
            </div>
            {editing === j.id && (
              <div className="border-t border-line p-4">
                <JetskiForm
                  jetski={j}
                  onCancel={() => setEditing(null)}
                  onSaved={async () => {
                    setEditing(null);
                    show("success", "Zmiany zapisane.");
                    await reload();
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      {jetskis.length === 0 && <Notice>Flota jest pusta. Dodaj pierwszy skuter.</Notice>}
    </div>
  );
}

function JetskiForm({ jetski, onSaved, onCancel }: { jetski?: Jetski; onSaved: () => void; onCancel: () => void }) {
  const api = useApi();
  const p = jetski?.id ?? "new";
  const [image, setImage] = useState(jetski?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [license, setLicense] = useState<LicenseRequirement>(jetski?.license ?? "unknown");

  async function upload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const r = await api<{ path: string }>("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (r.data) setImage(r.data.path);
    else setErrors((e) => ({ ...e, image: r.error?.message ?? "Nie udało się wgrać zdjęcia." }));
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = {
      manufacturer: f.get("manufacturer"),
      model: f.get("model"),
      name: f.get("name"),
      description: f.get("description"),
      powerHp: f.get("powerHp"),
      seats: f.get("seats"),
      license,
      licenseNote: f.get("licenseNote"),
      deposit: f.get("deposit"),
      image,
      imageAlt: f.get("imageAlt"),
      active: f.get("active") === "on",
      needsReview: f.get("needsReview") === "on",
      sort: f.get("sort"),
    };
    const r = jetski ? await api(`/api/admin/jetskis/${jetski.id}`, { method: "PUT", json: body }) : await api("/api/admin/jetskis", { method: "POST", json: body });
    if (r.ok) return onSaved();
    setErrors(r.error?.fields ?? {});
    setFormError(r.error?.message ?? "Nie udało się zapisać.");
  }

  const id = (k: string) => `${p}-${k}`;
  return (
    <form onSubmit={submit} noValidate className="grid gap-5 bg-white">
      <div className="grid gap-5 md:grid-cols-3">
        <Field id={id("manufacturer")} label="Producent" error={errors.manufacturer}>
          <input id={id("manufacturer")} name="manufacturer" defaultValue={jetski?.manufacturer ?? ""} className="field" />
        </Field>
        <Field id={id("model")} label="Model" error={errors.model}>
          <input id={id("model")} name="model" defaultValue={jetski?.model ?? ""} className="field" />
        </Field>
        <Field id={id("name")} label="Nazwa na stronie" hint="Puste = producent + model" error={errors.name}>
          <input id={id("name")} name="name" defaultValue={jetski?.name ?? ""} className="field" />
        </Field>
      </div>
      <Field id={id("description")} label="Opis" hint="2–3 zdania o charakterze skutera." error={errors.description}>
        <textarea id={id("description")} name="description" rows={3} defaultValue={jetski?.description ?? ""} className="field" />
      </Field>
      <div className="grid gap-5 md:grid-cols-4">
        <Field id={id("powerHp")} label="Moc silnika (KM)" hint="Z dokumentacji producenta" error={errors.powerHp}>
          <input id={id("powerHp")} name="powerHp" inputMode="numeric" defaultValue={jetski?.powerHp ?? ""} className="field" />
        </Field>
        <Field id={id("seats")} label="Liczba miejsc" error={errors.seats}>
          <input id={id("seats")} name="seats" inputMode="numeric" defaultValue={jetski?.seats ?? ""} className="field" />
        </Field>
        <Field id={id("deposit")} label="Kaucja (zł)" error={errors.deposit}>
          <input id={id("deposit")} name="deposit" inputMode="decimal" defaultValue={jetski?.depositGr != null ? jetski.depositGr / 100 : ""} className="field" />
        </Field>
        <Field id={id("sort")} label="Kolejność" hint="Mniejsza liczba = wyżej" error={errors.sort}>
          <input id={id("sort")} name="sort" inputMode="numeric" defaultValue={jetski?.sort ?? 0} className="field" />
        </Field>
      </div>
      <fieldset className="grid gap-3">
        <legend className="field-label">Wymagane uprawnienia</legend>
        <div className="flex flex-wrap gap-2">
          {LICENSE_OPTIONS.map((o) => (
            <label key={o.value} className={`flex min-h-11 cursor-pointer items-center gap-2 px-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-turq-ink ${license === o.value ? "bg-graphite text-white" : "shadow-[inset_0_0_0_1px_var(--color-control)]"}`}>
              <input type="radio" name={`${p}-license`} value={o.value} checked={license === o.value} onChange={() => setLicense(o.value)} className="sr-only" />
              {o.label}
            </label>
          ))}
        </div>
        <Field
          id={id("licenseNote")}
          label={license === "none" ? "Warunki prowadzenia bez patentu i podstawa prawna (wymagane)" : "Uwagi o uprawnieniach (opcjonalnie)"}
          hint="Klient zobaczy ten tekst przy modelu i w rezerwacji."
          error={errors.licenseNote}
        >
          <textarea id={id("licenseNote")} name="licenseNote" rows={2} defaultValue={jetski?.licenseNote ?? ""} className="field" />
        </Field>
      </fieldset>
      <div className="grid gap-5 md:grid-cols-[12rem_minmax(0,1fr)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
          {image ? <Image src={image} alt="" fill sizes="192px" className="object-cover" unoptimized={image.startsWith("/media/")} /> : <span className="grid h-full place-items-center text-sm text-muted">Brak zdjęcia</span>}
        </div>
        <div className="grid gap-4">
          <Field id={id("file")} label="Zdjęcie" hint="JPG, PNG, WebP lub AVIF, do 8 MB. Najlepiej poziome, min. 1600 px szerokości." error={errors.image}>
            <input id={id("file")} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="block w-full text-sm" />
          </Field>
          {uploading && <p className="text-sm text-muted">Wgrywanie…</p>}
          <Field id={id("imageAlt")} label="Opis zdjęcia dla osób niewidomych" error={errors.imageAlt}>
            <input id={id("imageAlt")} name="imageAlt" defaultValue={jetski?.imageAlt ?? ""} className="field" />
          </Field>
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="active" defaultChecked={jetski?.active ?? true} className="check mt-0" /> Widoczny na stronie
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="needsReview" defaultChecked={jetski?.needsReview ?? false} className="check mt-0" /> Dane do potwierdzenia
        </label>
      </div>
      {formError && <Notice tone="error">{formError}</Notice>}
      <div className="flex gap-2">
        <button type="submit" className="btn btn-sm" disabled={uploading}>
          {jetski ? "Zapisz zmiany" : "Dodaj skuter"}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          Anuluj
        </button>
      </div>
    </form>
  );
}
