"use client";

import { useState } from "react";

/**
 * Mapa Google ładowana dopiero po kliknięciu – strona nie wysyła danych do Google
 * i nie pobiera ciężkiego iframe, dopóki użytkownik o to nie poprosi.
 */
export function MapEmbed({ query, title, directionsUrl }: { query: string; title: string; directionsUrl: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="map">
      {loaded ? (
        <iframe
          title={title}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="map__placeholder">
          <span className="map__pin" aria-hidden="true" />
          <p>
            <strong>{query}</strong>
            <br />
            Mapa pochodzi z Map Google. Po jej wczytaniu Google może zapisać pliki cookie w Twojej przeglądarce.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            <button type="button" className="btn btn--dark btn--sm" onClick={() => setLoaded(true)}>
              Pokaż mapę
            </button>
            <a className="btn btn--sm" href={directionsUrl} target="_blank" rel="noopener noreferrer">
              Wyznacz trasę
              <span className="sr-only"> (otwiera Mapy Google w nowej karcie)</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
