"use client";

import Link from "next/link";
import { directionsUrl } from "@/lib/maps";
import { useStoredFlag } from "@/lib/use-stored-flag";
import { ExternalIcon, PinIcon } from "@/components/ui/Icons";

const CONSENT_KEY = "wierzejki-maps-consent";

function embedUrl(query: string): string {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  if (key) return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(query)}&language=pl`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&hl=pl&output=embed`;
}

/**
 * Mapa Google wczytywana dopiero po kliknięciu (Google zapisuje pliki cookie i otrzymuje adres IP).
 * Wyszukiwanie po adresie – bez ręcznie wpisanych współrzędnych, których nie mamy zweryfikowanych.
 */
export function MapEmbed({ query, label }: { query: string; label: string }) {
  const [consent, setConsent] = useStoredFlag(CONSENT_KEY);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden border border-line bg-linen sm:aspect-[16/10]">
        {consent ? (
          <iframe
            title={`Mapa: ${label}`}
            src={embedUrl(query)}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="photo-slot absolute inset-0 flex items-center justify-center p-6">
            <div className="max-w-sm bg-surface px-6 py-6 text-center">
              <PinIcon size={26} className="mx-auto text-red" />
              <p className="display-sm mt-3">{label}</p>
              <p className="ui mt-1 text-[0.9375rem]">{query}</p>
              <p className="mt-3 text-[0.875rem] text-muted">
                Po wczytaniu mapy Google może zapisywać pliki cookie i otrzyma Twój adres IP. Więcej w{" "}
                <Link href="/polityka-prywatnosci#mapy" className="link">
                  polityce prywatności
                </Link>
                .
              </p>
              <button type="button" onClick={() => setConsent(true)} className="btn btn-ink btn-sm mt-5">
                Wczytaj mapę Google
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="ui mt-3 flex flex-wrap items-center justify-between gap-3 text-[0.875rem]">
        <a href={directionsUrl(query)} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1.5 font-semibold">
          Wyznacz trasę w Mapach Google
          <ExternalIcon size={15} />
          <span className="sr-only">(otwiera się w nowej karcie)</span>
        </a>
        {consent && (
          <button type="button" onClick={() => setConsent(false)} className="link cursor-pointer text-muted">
            Wyłącz mapę
          </button>
        )}
      </div>
    </div>
  );
}
