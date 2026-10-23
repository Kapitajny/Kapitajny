"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { postJson } from "@/lib/api-client";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-outline"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await postJson("/api/auth/logout", {});
        router.push("/logowanie");
        router.refresh();
      }}
    >
      {busy ? "Wylogowywanie…" : "Wyloguj się"}
    </button>
  );
}
