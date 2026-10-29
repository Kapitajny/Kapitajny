"use client";

import Link from "next/link";
import { useEffect } from "react";
import { IconRefresh } from "@/components/ui/Icons";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // W produkcji: przekazanie błędu do narzędzia monitorującego (bez danych osobowych).
    console.error(error);
  }, [error]);

  return (
    <section className="bg-mist">
      <div className="shell py-20 sm:py-28">
        <p className="kicker">Błąd aplikacji</p>
        <h1 className="mt-4 max-w-2xl">Nie udało się wyświetlić tej strony.</h1>
        <p className="lede mt-5">
          Wystąpił nieoczekiwany błąd. Twoje dane nie zostały wysłane ponownie. Spróbuj odświeżyć widok – jeśli problem się
          powtarza, wróć na stronę główną.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={() => retry()}>
            <IconRefresh size={18} />
            Spróbuj ponownie
          </button>
          <Link href="/" className="btn btn-outline">
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </section>
  );
}
