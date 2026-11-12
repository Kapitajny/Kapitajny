"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { formatDateTime } from "@/lib/time";
import { Field, Notice, PanelHeader, useApi, useFlash } from "./ui";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  createdAt: number;
  bookings: number;
  lastBooking: number | null;
}

export function CustomersView() {
  const api = useApi();
  const [query, setQuery] = useState("");
  const [list, setList] = useState<Customer[] | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [flash, show] = useFlash();

  const load = useCallback(async () => {
    const r = await api<{ customers: Customer[] }>(`/api/admin/customers?q=${encodeURIComponent(query)}`);
    if (r.data) setList(r.data.customers);
  }, [api, query]);
  useEffect(() => {
    const t = window.setTimeout(load, 200);
    return () => window.clearTimeout(t);
  }, [load]);

  async function remove(id: string) {
    const r = await api(`/api/admin/customers/${id}`, { method: "DELETE" });
    setConfirm(null);
    if (r.ok) {
      show("success", "Dane klienta usunięte. Rezerwacje zostały w historii bez danych osobowych.");
      await load();
    } else show("error", r.error?.message ?? "Nie udało się usunąć.");
  }

  return (
    <div>
      <PanelHeader title="Klienci" description="Dane z rezerwacji. Możesz je poprawić albo usunąć na prośbę klienta (RODO)." />
      <label htmlFor="cust-q" className="sr-only">
        Szukaj klienta
      </label>
      <input id="cust-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Imię, e-mail lub telefon" className="field mb-6 max-w-md" />
      {flash && <div className="mb-4">{flash}</div>}
      {!list ? (
        <p className="text-muted">Ładowanie…</p>
      ) : list.length === 0 ? (
        <Notice>Brak klientów{query ? " dla tego wyszukiwania" : ". Pojawią się po pierwszej rezerwacji"}.</Notice>
      ) : (
        <ul className="grid gap-2">
          {list.map((c) => (
            <li key={c.id} className="bg-white">
              <div className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_10rem_auto] md:items-center">
                <p className="font-semibold">{c.name}</p>
                <p className="min-w-0 text-sm">
                  <a href={`mailto:${c.email}`} className="link break-all">
                    {c.email}
                  </a>
                  <br />
                  <a href={`tel:${c.phone}`} className="link">
                    {c.phone}
                  </a>
                </p>
                <p className="text-sm text-muted">
                  {c.bookings} rez.{c.lastBooking ? `, ostatnia ${formatDateTime(c.lastBooking)}` : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn btn-ghost btn-sm" aria-expanded={editing === c.id} onClick={() => setEditing(editing === c.id ? null : c.id)}>
                    {editing === c.id ? "Zamknij" : "Edytuj"}
                  </button>
                  {confirm === c.id ? (
                    <>
                      <button type="button" className="btn btn-sm" onClick={() => remove(c.id)} autoFocus>
                        Tak, usuń dane
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirm(null)}>
                        Anuluj
                      </button>
                    </>
                  ) : (
                    <button type="button" className="min-h-10 px-2 font-semibold text-danger" onClick={() => setConfirm(c.id)}>
                      Usuń dane
                    </button>
                  )}
                </div>
              </div>
              {editing === c.id && (
                <CustomerForm
                  customer={c}
                  onSaved={async () => {
                    setEditing(null);
                    show("success", "Dane klienta zapisane.");
                    await load();
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CustomerForm({ customer, onSaved }: { customer: Customer; onSaved: () => void }) {
  const api = useApi();
  const [errors, setErrors] = useState<Record<string, string>>({});
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = await api(`/api/admin/customers/${customer.id}`, { method: "PUT", json: Object.fromEntries(f) });
    if (r.ok) return onSaved();
    setErrors(r.error?.fields ?? (r.error?.field ? { [r.error.field]: r.error.message } : { name: r.error?.message ?? "Nie udało się zapisać." }));
  }
  const id = (k: string) => `cu-${customer.id}-${k}`;
  return (
    <form onSubmit={submit} noValidate className="grid gap-4 border-t border-line p-4 md:grid-cols-3">
      <Field id={id("name")} label="Imię i nazwisko" error={errors.name}>
        <input id={id("name")} name="name" defaultValue={customer.name} className="field" />
      </Field>
      <Field id={id("email")} label="E-mail" error={errors.email}>
        <input id={id("email")} name="email" type="email" defaultValue={customer.email} className="field" />
      </Field>
      <Field id={id("phone")} label="Telefon" error={errors.phone}>
        <input id={id("phone")} name="phone" defaultValue={customer.phone} className="field" />
      </Field>
      <Field id={id("notes")} label="Notatka" className="md:col-span-3">
        <textarea id={id("notes")} name="notes" rows={2} defaultValue={customer.notes ?? ""} className="field" />
      </Field>
      <div>
        <button type="submit" className="btn btn-sm">
          Zapisz
        </button>
      </div>
    </form>
  );
}
