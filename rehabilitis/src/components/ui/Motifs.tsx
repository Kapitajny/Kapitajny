import type { ServiceMotif } from "@/data/services";

/**
 * Spokojne detale graficzne rysowane cienką linią – używane tam, gdzie usługa nie ma zdjęcia.
 * Każdy motyw odnosi się do treści usługi, a nie jest przypadkową ikoną:
 * - assessment: łuk zakresu ruchu ze skalą, jak w goniometrze (ocena funkcjonalna),
 * - massage: miękkie, równoległe fale (praca z tkankami),
 * - recovery: łagodnie wznosząca się ścieżka z kolejnymi etapami (stopniowy powrót do sprawności).
 */
export function Motif({ motif, className = "" }: { motif: ServiceMotif | "joint"; className?: string }) {
  return (
    <svg viewBox="0 0 240 180" className={className} fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true" focusable="false">
      {motif === "assessment" && (
        <g strokeWidth="1.4">
          <path d="M50 140a70 70 0 0 1 140 0" />
          <path d="M70 140a50 50 0 0 1 100 0" opacity="0.45" />
          {Array.from({ length: 13 }, (_, i) => {
            const a = Math.PI - (i * Math.PI) / 12;
            const r1 = 70;
            const r2 = i % 3 === 0 ? 80 : 76;
            const x1 = (120 + r1 * Math.cos(a)).toFixed(2);
            const y1 = (140 - r1 * Math.sin(a)).toFixed(2);
            const x2 = (120 + r2 * Math.cos(a)).toFixed(2);
            const y2 = (140 - r2 * Math.sin(a)).toFixed(2);
            return <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} />;
          })}
          <path d="M120 140 L163 85" strokeWidth="2" />
          <circle cx="120" cy="140" r="5" fill="currentColor" stroke="none" />
          <path d="M40 140h160" opacity="0.45" />
        </g>
      )}
      {motif === "massage" && (
        <g strokeWidth="1.4">
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M30 ${62 + i * 16} C 70 ${46 + i * 16}, 100 ${80 + i * 16}, 140 ${62 + i * 16} S 200 ${46 + i * 16}, 212 ${60 + i * 16}`} opacity={i === 2 ? 1 : 0.5} />
          ))}
        </g>
      )}
      {motif === "recovery" && (
        <g strokeWidth="1.4">
          <path d="M30 150 C 80 148, 90 120, 120 108 S 170 70, 212 36" strokeWidth="2" />
          <path d="M30 150h182" opacity="0.4" />
          {[
            [62, 145],
            [102, 117],
            [146, 92],
            [190, 54],
          ].map(([x, y], i) => (
            <g key={i}>
              <path d={`M${x} 150V${y + 8}`} opacity="0.35" strokeDasharray="2 4" />
              <circle cx={x} cy={y} r={i === 3 ? 5 : 3.5} fill={i === 3 ? "currentColor" : "var(--color-sage)"} />
            </g>
          ))}
        </g>
      )}
      {motif === "joint" && (
        <g strokeWidth="1.4">
          <path d="M60 150a60 60 0 0 1 120 0" opacity="0.5" />
          <path d="M120 150 L 84 104" strokeWidth="2" />
          <path d="M120 150 L 172 128" strokeWidth="2" />
          <circle cx="120" cy="150" r="6" fill="currentColor" stroke="none" />
        </g>
      )}
    </svg>
  );
}
