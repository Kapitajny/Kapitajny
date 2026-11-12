"use client";

import { useState } from "react";

export function CopyLink() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="btn btn-sm"
        onClick={async () => {
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete("nowa");
            await navigator.clipboard.writeText(url.toString());
            setState("copied");
          } catch {
            setState("failed");
          }
        }}
      >
        Kopiuj link do rezerwacji
      </button>
      <span role="status" className="text-sm text-muted">
        {state === "copied" && "Skopiowano."}
        {state === "failed" && "Nie udało się skopiować – zapisz adres z paska przeglądarki."}
      </span>
    </div>
  );
}
