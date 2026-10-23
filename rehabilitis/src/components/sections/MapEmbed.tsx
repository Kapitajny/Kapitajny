"use client";

import Link from "next/link";
import { useStoredFlag } from "@/lib/use-stored-flag";
import { PinIcon } from "@/components/ui/Icons";

export const MAP_CONSENT_KEY = "rehabilitis-maps-consent";

/**
 * Mapa Google ładowana dopiero po kliknięciu (Google może zapisywać pliki cookie).
 * - Z kluczem NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY używane jest oficjalne Maps Embed API.
 * - Bez klucza – standardowy, publiczny mechanizm osadzania map Google.
 * Komponent renderujemy tylko wtedy, gdy adres gabinetu jest uzupełniony.
 */
function buildEmbedUrl(address: string): string {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  if (key) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(address)}&language=pl&zoom=16`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&hl=pl&output=embed`;
}

export function MapEmbed({ address }: { address: string }) {
  const [storedConsent, setConsent] = useStoredFlag(MAP_CONSENT_KEY);

  return (
    <div className="relative h-72 overflow-hidden rounded-media border border-line bg-brand-soft sm:h-80">
      {storedConsent === true ? (
        <iframe
          title={`Mapa dojazdu: ${address}`}
          src={buildEmbedUrl(address)}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <PinIcon size={28} className="text-brand" />
          <p className="mt-3 text-lead font-semibold text-ink">Mapa dojazdu</p>
          <p className="mt-2 max-w-xs text-small leading-relaxed text-ink">
            Po wczytaniu mapy Google może zapisywać pliki cookie i otrzyma Twój adres IP.{" "}
            <Link href="/cookies" className="link">
              Więcej informacji
            </Link>
          </p>
          <button type="button" onClick={() => setConsent(true)} className="btn btn-primary btn-sm mt-5">
            Wczytaj mapę
          </button>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link mt-3 text-small"
          >
            Otwórz w Mapach Google<span className="sr-only"> (nowa karta)</span>
          </a>
        </div>
      )}
    </div>
  );
}
