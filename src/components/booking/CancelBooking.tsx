"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDateTime } from "@/lib/time";

export function CancelBooking({ number, token, canCancel, deadline, phone }: { number: string; token: string; canCancel: boolean; deadline: number; phone: string | null }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canCancel) {
    return (
      <p className="border-l-4 border-graphite pl-4 text-muted">
        Termin bezpłatnego anulowania online minął ({formatDateTime(deadline)}). {phone ? `Zadzwoń pod ${phone}, a pomożemy.` : "Skontaktuj się z nami, a pomożemy."}
      </p>
    );
  }

  async function cancel() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings/cancel", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ number, token }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error?.message ?? "Nie udało się anulować rezerwacji.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nie udało się anulować rezerwacji.");
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  return (
    <div className="border-t border-line pt-6">
      <p className="text-muted">Możesz bezpłatnie anulować do {formatDateTime(deadline)}.</p>
      {!confirming ? (
        <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => setConfirming(true)}>
          Anuluj rezerwację
        </button>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3" role="group" aria-label="Potwierdzenie anulowania">
          <span className="font-semibold">Na pewno anulować?</span>
          <button type="button" className="btn btn-sm" onClick={cancel} disabled={busy} autoFocus>
            {busy ? "Anuluję…" : "Tak, anuluj"}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)} disabled={busy}>
            Nie, zostaw
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="field-error mt-3">
          {error}
        </p>
      )}
    </div>
  );
}
