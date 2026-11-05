/** Kontur „rozgniecionego” kotleta – nieregularna, chrupiąca krawędź po docisku na blasze. */
export const PATTY =
  "M211.9 70.0 L211.0 75.9 L213.1 82.2 L206.5 87.5 L206.3 93.8 L200.3 98.8 L193.8 103.4 L190.4 109.4 L181.2 112.4 L175.7 117.7 L165.0 119.1 L157.6 123.1 L149.6 127.0 L140.9 130.7 L129.8 129.2 L119.9 129.8 L110.0 132.6 L99.5 133.6 L89.6 131.1 L80.0 128.9 L68.1 130.3 L62.5 122.9 L50.8 122.8 L45.0 117.2 L38.3 112.7 L33.0 107.6 L24.7 104.0 L16.3 99.9 L16.1 93.2 L9.9 88.1 L6.4 82.3 L7.4 76.0 L5.7 70.0 L9.7 64.1 L11.1 58.3 L13.8 52.6 L12.7 46.0 L18.7 40.9 L24.7 36.0 L29.1 30.4 L36.8 26.4 L44.9 22.7 L51.0 17.4 L60.3 14.6 L70.9 13.7 L79.6 10.2 L89.7 9.1 L99.5 6.7 L110.0 7.0 L120.0 9.2 L131.4 5.9 L139.4 12.3 L149.6 13.0 L159.9 14.3 L166.4 19.7 L175.9 22.1 L181.2 27.6 L191.3 30.2 L198.1 34.9 L202.2 40.6 L210.1 45.3 L208.2 52.2 L213.4 57.7 L214.2 63.9Z";

/** Okrągła wersja konturu – naklejka cenowa. */
export const STICKER =
  "M123.5 64.0 L123.8 71.9 L124.4 80.2 L119.2 86.9 L116.0 94.0 L112.3 101.0 L105.1 105.1 L100.6 111.7 L94.4 116.6 L87.6 121.1 L78.5 118.2 L71.7 122.3 L64.0 121.5 L55.9 125.3 L48.2 123.1 L42.7 115.4 L32.6 118.5 L25.8 113.8 L20.9 107.1 L15.8 100.9 L14.9 92.4 L11.3 85.8 L5.9 79.6 L7.1 71.5 L5.9 64.0 L7.0 56.5 L8.8 49.2 L8.8 41.1 L12.3 34.2 L14.8 26.2 L21.4 21.4 L27.0 15.7 L34.0 12.0 L40.7 7.7 L48.5 6.3 L56.4 6.6 L64.0 1.0 L72.2 1.6 L80.1 4.1 L87.4 7.4 L93.1 13.6 L99.5 17.7 L105.5 22.5 L109.6 29.0 L117.3 33.2 L118.5 41.4 L124.0 47.9 L122.8 56.3Z";

/**
 * Znak BUŁA: napis w szerokim, ciężkim kroju wpisany w kontur rozgniecionego kotleta.
 * Napis jest tekstem SVG, ale całość ma jedną etykietę dla czytników ekranu.
 */
export function Logo({ className = "", title = "BUŁA smash burger" }: { className?: string; title?: string }) {
  return (
    <svg className={`logo ${className}`} viewBox="0 0 220 140" role="img" aria-label={title}>
      <path d={PATTY} className="logo__patty" />
      <text x="110" y="86" textAnchor="middle" className="logo__word">
        BUŁA
      </text>
    </svg>
  );
}
