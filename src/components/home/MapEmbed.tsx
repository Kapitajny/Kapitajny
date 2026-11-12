"use client";

import Link from "next/link";
import { useStoredFlag } from "@/lib/use-stored-flag";
import { PinIcon } from "@/components/ui/Icons";

const CONSENT_KEY = "molo-maps-consent";

/** Mapa Google ładowana dopiero po zgodzie (Google może zapisywać pliki cookie i otrzymuje adres IP). */
export function MapEmbed({ query, label, fictional }: { query: string; label: string; fictional: boolean }) {
  const [consent, setConsent] = useStoredFlag(CONSENT_KEY);
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const src = key
    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(query)}&language=pl&zoom=14`
    : `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&hl=pl&output=embed`;

  return (
    <div className="relative h-full min-h-[22rem] overflow-hidden bg-[#dfe6ea]">
      {consent ? (
        <iframe title={label} src={src} className="absolute inset-0 h-full w-full border-0 grayscale-[30%]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6 pb-14">
          <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
            <rect width="400" height="300" fill="#dfe6ea" />
            <path d="M0 0 H175 C160 60 190 120 170 180 S150 260 165 300 H0z" fill="#eef0ea" />
            <path d="M172 150 H260" stroke="#151d23" strokeWidth="5" />
            <path d="M0 240 L400 120" stroke="#00b9c7" strokeWidth="3" opacity=".7" />
          </svg>
          <div className="relative max-w-sm bg-white p-6 text-center shadow-[0_1px_0_var(--color-line)]">
            <PinIcon size={28} className="mx-auto text-turq-ink" />
            <p className="mt-3 font-display text-3xl font-extrabold uppercase">Mapa Google</p>
            <p className="mt-2 text-[0.95rem] text-muted">
              Po wczytaniu mapy Google może zapisywać pliki cookie i otrzyma Twój adres IP.{" "}
              <Link href="/cookies" className="link text-graphite">
                Więcej o cookies
              </Link>
            </p>
            <button type="button" onClick={() => setConsent(true)} className="btn btn-sm mt-5">
              Wczytaj mapę
            </button>
          </div>
        </div>
      )}
      {fictional && (
        <p className="absolute inset-x-0 bottom-0 bg-white/95 px-3 py-2 text-sm text-graphite">
          Adres przystani jest przykładowy, więc mapa pokazuje ogólny widok Sopotu, bez pinezki.
        </p>
      )}
    </div>
  );
}
