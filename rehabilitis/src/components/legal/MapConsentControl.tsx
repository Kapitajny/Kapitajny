"use client";

import { useStoredFlag } from "@/lib/use-stored-flag";
import { MAP_CONSENT_KEY as CONSENT_KEY } from "@/components/home/MapEmbed";

/** Pozwala cofnąć zgodę na wczytywanie mapy Google (zapisaną w localStorage). */
export function MapConsentControl() {
  const [consent, setConsent] = useStoredFlag(CONSENT_KEY);
  if (consent === null) return null;

  return (
    <div className="my-6 flex flex-wrap items-center gap-4 rounded-xl border border-line bg-sand px-5 py-4 text-sm">
      <p className="m-0 flex-1" aria-live="polite">
        {consent
          ? "Zgoda na wczytywanie mapy Google jest zapisana w tej przeglądarce."
          : "Mapa Google nie wczyta się automatycznie – w tej przeglądarce nie ma zapisanej zgody."}
      </p>
      {consent && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setConsent(false)}>
          Cofnij zgodę na mapę
        </button>
      )}
    </div>
  );
}
