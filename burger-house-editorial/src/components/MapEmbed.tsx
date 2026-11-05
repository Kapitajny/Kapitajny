"use client";

import { useState } from "react";

/** Mapa Google wczytywana dopiero po kliknięciu (bez plików cookie Google do tego momentu). */
export function MapEmbed({ query, title, directionsUrl }: { query: string; title: string; directionsUrl: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="map">
      {loaded ? (
        <iframe title={title} src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="map__place">
          <p className="title">{query}</p>
          <p className="prose grey">Mapa pochodzi z Map Google. Po jej wczytaniu Google może zapisać pliki cookie w Twojej przeglądarce.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            <button type="button" className="btn" onClick={() => setLoaded(true)}>
              Pokaż mapę
            </button>
            <a className="btn btn--line" href={directionsUrl} target="_blank" rel="noopener noreferrer">
              Wyznacz trasę<span className="sr-only"> (Mapy Google, nowa karta)</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
