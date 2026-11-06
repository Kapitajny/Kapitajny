"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { siteConfig } from "@/config/site";
import { useStoredFlag } from "@/lib/use-stored-flag";

export const MAP_CONSENT_KEY = "vm-maps-consent";

/**
 * Mapa Google wczytywana dopiero po kliknięciu (Google może zapisywać pliki cookie).
 * Z kluczem NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY używane jest Maps Embed API, bez klucza – publiczne osadzenie mapy.
 */
function embedUrl() {
  const { contact } = siteConfig;
  const query = contact.addressVerified ? `${contact.street}, ${contact.postalCode} ${contact.city}` : contact.mapQuery;
  const zoom = contact.addressVerified ? 15 : 12;
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  if (key) return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(query)}&language=pl&zoom=${zoom}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&hl=pl&output=embed`;
}

export function MapEmbed({ className = "" }: { className?: string }) {
  const [stored, setConsent] = useStoredFlag(MAP_CONSENT_KEY);
  const consent = stored === true;
  const { contact } = siteConfig;

  return (
    <div className="flex flex-col gap-3">
      <div className={`relative overflow-hidden rounded-[6px] border border-line bg-fog ${className}`}>
        {consent ? (
          <iframe
            title={`Mapa: ${contact.city}`}
            src={embedUrl()}
            className="absolute inset-0 h-full w-full border-0 grayscale-[30%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <MapSketch />
            <div className="relative max-w-sm rounded-[6px] border border-line bg-white p-6 text-center shadow-[var(--shadow-soft)]">
              <Icon name="pin" size={28} className="mx-auto text-red" />
              <p className="mt-3 font-display text-xl font-bold text-ink">
                {contact.street}, {contact.city}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Po wczytaniu mapy Google może zapisać pliki cookie i otrzyma Twój adres IP.{" "}
                <Link href="/polityka-cookies" className="link-quiet text-ink">
                  Polityka cookies
                </Link>
              </p>
              <button type="button" onClick={() => setConsent(true)} className="btn btn-dark btn-sm mt-5">
                Wczytaj mapę Google
              </button>
            </div>
          </div>
        )}
      </div>
      {!contact.addressVerified && (
        <p className="flex gap-2 text-[0.85rem] leading-snug text-muted">
          <Icon name="info" size={16} className="mt-0.5 shrink-0" />
          Adres przykładowy – mapa pokazuje ogólny widok miasta {contact.city}.
        </p>
      )}
    </div>
  );
}

/** Dekoracyjny szkic ulic – tło przed wczytaniem mapy. */
function MapSketch() {
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-line-strong" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M-10 210 C 80 190, 130 120, 210 112 S 330 70, 420 50" strokeWidth="12" stroke="#fff" />
        <path d="M-10 70 L 150 95 L 260 205 L 420 228" />
        <path d="M70 -10 L 95 130 L 75 310" />
        <path d="M185 -10 L 205 140 L 240 310" />
        <path d="M305 -10 L 292 150 L 335 310" />
        <path d="M-10 165 L 420 135" />
        <path d="M-10 268 L 420 250" />
      </g>
    </svg>
  );
}
