"use client";

import { useStoredFlag } from "@/lib/use-stored-flag";
import { MAP_CONSENT_KEY } from "./MapEmbed";

/** Pozwala sprawdzić i cofnąć zgodę na wczytywanie mapy Google. */
export function MapConsentControl() {
  const [consent, setConsent] = useStoredFlag(MAP_CONSENT_KEY);
  if (consent === null) return null;

  return (
    <div className="not-prose my-6 flex flex-wrap items-center gap-4 rounded-[4px] border border-line bg-mist px-5 py-4 text-[0.95rem]">
      <p className="m-0 flex-1" aria-live="polite">
        {consent ? "Zgoda na wczytywanie mapy Google jest zapisana w tej przeglądarce." : "W tej przeglądarce nie ma zapisanej zgody – mapa nie wczyta się automatycznie."}
      </p>
      {consent && (
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setConsent(false)}>
          Cofnij zgodę na mapę
        </button>
      )}
    </div>
  );
}
