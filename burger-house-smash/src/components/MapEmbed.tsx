"use client";

import { useState } from "react";

/** Mapa Google wczytywana dopiero po kliknięciu (bez plików cookie Google do tego momentu). */
export function MapEmbed({ query, title, directionsUrl }: { query: string; title: string; directionsUrl: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="map" data-loaded={loaded}>
      {loaded ? (
        <iframe
          title={title}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="map__ph">
          <div className="map__art" aria-hidden="true">
            <svg className="map__grid" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
              <path d="M0 70 H400 M0 150 H400 M90 0 V240 M250 0 V240 M0 220 L400 20" />
              <path className="map__road" d="M-10 190 C120 160 160 90 410 110" />
            </svg>
            <svg className="map__pin" viewBox="0 0 40 52">
              <path d="M20 51C20 51 3 31 3 19a17 17 0 0 1 34 0c0 12-17 32-17 32Z" />
              <circle cx="20" cy="19" r="6.5" />
            </svg>
          </div>
          <div className="map__copy">
            <p className="map__addr">{query}</p>
            <p className="map__note">Mapa pochodzi z Map Google. Po jej wczytaniu Google może zapisać pliki cookie w Twojej przeglądarce.</p>
            <div className="map__btns">
              <button type="button" className="btn btn--sm" onClick={() => setLoaded(true)}>
                Pokaż mapę
              </button>
              <a className="btn btn--sm btn--ghost" href={directionsUrl} target="_blank" rel="noopener noreferrer">
                Wyznacz trasę<span className="sr-only"> (Mapy Google, nowa karta)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
