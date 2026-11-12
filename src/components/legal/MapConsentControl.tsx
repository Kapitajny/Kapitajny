"use client";

import { useStoredFlag } from "@/lib/use-stored-flag";

export function MapConsentControl() {
  const [consent, setConsent] = useStoredFlag("molo-maps-consent");
  if (consent === null) return null;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4 bg-sand px-5 py-4">
      <p className="m-0 flex-1" aria-live="polite">
        {consent ? "Zgoda na wczytywanie mapy Google jest zapisana w tej przeglądarce." : "Mapa Google nie wczyta się automatycznie – nie ma zapisanej zgody."}
      </p>
      {consent && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConsent(false)}>
          Cofnij zgodę
        </button>
      )}
    </div>
  );
}
