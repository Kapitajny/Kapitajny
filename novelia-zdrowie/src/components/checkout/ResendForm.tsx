"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AlertIcon, CheckIcon } from "@/components/ui/Icons";

const STATUS: Record<string, string> = {
  wygasl: "Link do pobrania wygasł. Podaj adres e-mail i numer zamówienia – wyślemy nowe linki.",
  "limit-pobran": "Wykorzystano limit pobrań dla tego linku. Jeśli potrzebujesz pobrać plik ponownie, skontaktuj się z nami.",
  nieprawidlowy: "Link do pobrania jest nieprawidłowy. Upewnij się, że skopiowano cały adres, albo zamów nowe linki poniżej.",
  "brak-pliku": "Plik jest chwilowo niedostępny. Spróbuj ponownie za kilka minut lub skontaktuj się z nami.",
  "limit-zapytan": "Zbyt wiele prób pobrania w krótkim czasie. Odczekaj chwilę i spróbuj ponownie.",
};

export function ResendForm() {
  const params = useSearchParams();
  const status = params.get("status");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/downloads/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, orderNumber }) });
      const data = (await res.json()) as { message?: string; error?: { message: string } };
      setResult(res.ok ? { ok: true, message: data.message ?? "Gotowe." } : { ok: false, message: data.error?.message ?? "Spróbuj ponownie." });
    } catch {
      setResult({ ok: false, message: "Brak połączenia z serwerem. Spróbuj ponownie." });
    }
    setBusy(false);
  }

  return (
    <>
      {status && STATUS[status] && (
        <div role="alert" className="mb-8 flex gap-3 border border-gold/50 bg-beige/60 p-4 text-[0.98rem] leading-relaxed">
          <AlertIcon size={20} className="mt-0.5 shrink-0 text-forest" />
          <p>{STATUS[status]}</p>
        </div>
      )}
      <form onSubmit={onSubmit} className="grid gap-5 bg-cream p-6 ring-1 ring-line sm:p-8">
        <div>
          <label htmlFor="resend-email" className="label">
            Adres e-mail użyty przy zakupie
          </label>
          <input id="resend-email" type="email" autoComplete="email" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="resend-number" className="label">
            Numer zamówienia
          </label>
          <input id="resend-number" required className="field uppercase" placeholder="NZ-XXXXXX" pattern="[Nn][Zz]-[A-Za-z0-9]{6}" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
          <p className="mt-1.5 text-sm text-muted">Znajdziesz go w e-mailu z potwierdzeniem zamówienia.</p>
        </div>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Wysyłanie…" : "Wyślij nowe linki"}
        </button>
        {result && (
          <p role="status" className={`flex gap-2.5 text-[0.98rem] leading-relaxed ${result.ok ? "text-success" : "text-danger"}`}>
            {result.ok ? <CheckIcon size={20} className="mt-0.5 shrink-0" /> : <AlertIcon size={20} className="mt-0.5 shrink-0" />}
            {result.message}
          </p>
        )}
      </form>
    </>
  );
}
