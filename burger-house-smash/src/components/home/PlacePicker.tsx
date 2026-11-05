"use client";

import Link from "next/link";
import { useState } from "react";
import { IconArrow, IconPhone, IconPin } from "@/components/Icons";
import { OpenPill, useTick } from "@/components/OpenStatus";
import { LOCATIONS, mapsDirectionsUrl } from "@/data/locations";
import { warsawNow } from "@/lib/open";

/**
 * Dodatkowa nawigacja w hero: wybór lokalu. Pokazuje, czy lokal jest teraz otwarty,
 * adres, dzisiejsze godziny i skróty: telefon do lokalu, trasa, podstrona lokalu.
 */
export function PlacePicker() {
  const [slug, setSlug] = useState(LOCATIONS[0].slug);
  const t = useTick();
  const loc = LOCATIONS.find((l) => l.slug === slug)!;
  const today = t < 0 ? null : loc.hours.find((h) => h.days.includes(warsawNow().day));

  return (
    <div className="picker wrap" role="group" aria-labelledby="picker-label">
      <div className="picker__in">
        <p className="picker__label" id="picker-label">
          Odbierasz w:
        </p>
        <div className="picker__seg">
          {LOCATIONS.map((l) => (
            <button key={l.slug} type="button" aria-pressed={l.slug === slug} onClick={() => setSlug(l.slug)}>
              {l.city}
            </button>
          ))}
        </div>
        <div className="picker__info" aria-live="polite">
          <OpenPill loc={loc} />
          <p className="picker__addr">
            <IconPin className="picker__ico" />
            {loc.street}
          </p>
          {today ? (
            <p className="picker__today">
              Dziś {today.opens}–{today.closes}
            </p>
          ) : null}
        </div>
        <div className="picker__go">
          <a className="picker__link" href={loc.phone.href}>
            <IconPhone className="picker__ico" />
            <span className="num">{loc.phone.display}</span>
          </a>
          <a className="picker__link" href={mapsDirectionsUrl(loc.mapQuery)} target="_blank" rel="noopener noreferrer">
            Trasa<span className="sr-only"> do lokalu {loc.city} (Mapy Google, nowa karta)</span>
          </a>
          <Link className="picker__link" href={`/lokale/${loc.slug}`}>
            O lokalu<span className="sr-only"> {loc.city}</span>
            <IconArrow className="picker__ico" />
          </Link>
        </div>
      </div>
    </div>
  );
}
