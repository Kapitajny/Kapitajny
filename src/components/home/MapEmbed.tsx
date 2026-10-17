"use client";

import Link from "next/link";
import type { Location } from "@/data/locations";
import { useStoredFlag } from "@/lib/use-stored-flag";
import { InfoIcon, PinIcon } from "@/components/ui/Icons";

const CONSENT_KEY = "noir-maps-consent";

/**
 * Mapa Google ładowana dopiero po kliknięciu (Google może zapisywać pliki cookie).
 *
 * - Z kluczem NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY używane jest oficjalne Maps Embed API.
 * - Bez klucza – standardowy, publiczny mechanizm osadzania map Google (bez klucza).
 * - Dopóki lokal nie ma `verified: true`, mapa pokazuje ogólny widok Gdańska, a nie pinezki.
 */
function buildEmbedUrl(location: Location | undefined): string {
  const query = location?.verified ? location.mapsQuery : "Gdańsk";
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  if (key) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(query)}&language=pl&zoom=${location?.verified ? 15 : 12}`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${location?.verified ? 15 : 12}&hl=pl&output=embed`;
}

export function MapEmbed({ selected, anyUnverified }: { selected: Location | undefined; anyUnverified: boolean }) {
  const [storedConsent, setConsent] = useStoredFlag(CONSENT_KEY);
  const consent = storedConsent === true;
  const accept = () => setConsent(true);

  return (
    <div className="relative flex flex-col gap-3 lg:block lg:h-full">
      <div className="relative h-[24rem] overflow-hidden rounded-2xl border border-line bg-sand sm:h-[32rem] lg:h-full lg:min-h-[36rem]">
        {consent ? (
          <iframe
            title={selected?.verified ? `Mapa: ${selected.name}` : "Mapa Gdańska (widok demonstracyjny)"}
            src={buildEmbedUrl(selected)}
            className="absolute inset-0 h-full w-full border-0 grayscale-[35%] sepia-[12%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            <MapSketch />
            <div className="relative max-w-sm rounded-2xl bg-sand/90 px-6 py-7">
              <PinIcon size={28} className="mx-auto text-roast" />
              <p className="mt-4 font-serif text-2xl text-roast">Mapa Google</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Po wczytaniu mapy Google może zapisywać pliki cookie i otrzyma Twój adres IP.{" "}
                <Link href="/cookies" className="link-quiet text-roast">
                  Więcej w polityce cookies
                </Link>
                .
              </p>
              <button type="button" onClick={accept} className="btn btn-primary btn-sm mt-6">
                Wczytaj mapę
              </button>
            </div>
          </div>
        )}
      </div>

      {anyUnverified && (
        <p className="flex items-start gap-2 rounded-xl border border-line bg-paper px-4 py-3 text-xs leading-relaxed text-espresso lg:absolute lg:left-3 lg:top-3 lg:max-w-sm lg:border-0 lg:bg-paper/95 lg:shadow-sm lg:backdrop-blur-sm">
          <InfoIcon size={16} className="mt-0.5 shrink-0 text-latte" />
          <span>
            <strong className="font-semibold">Mapa demonstracyjna.</strong> Pokazuje ogólny widok Gdańska – lokalizacje lokali NOIR wymagają weryfikacji i nie
            są na niej zaznaczone.
          </span>
        </p>
      )}
    </div>
  );
}

/** Dekoracyjny szkic ulic – tło przed wczytaniem mapy (bez żadnych prawdziwych lokalizacji). */
function MapSketch() {
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-oat" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M-10 220 C 80 200, 120 120, 210 110 S 330 60, 420 40" strokeWidth="14" stroke="var(--color-cream)" />
        <path d="M-10 60 L 140 90 L 260 200 L 420 230" />
        <path d="M60 -10 L 90 120 L 70 310" />
        <path d="M180 -10 L 200 140 L 240 310" />
        <path d="M300 -10 L 290 150 L 330 310" />
        <path d="M-10 160 L 420 130" />
        <path d="M-10 270 L 420 250" />
      </g>
    </svg>
  );
}
