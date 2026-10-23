/**
 * Łuk zakresu ruchu – motyw marki. Rysuje skalę goniometru 0–180° i zaznacza zakres `angle`.
 * Używany w przebiegu pierwszej wizyty (kolejne kroki = rosnący zakres) i na stronie 404 (0°).
 */
export function RangeArc({ angle, className = "" }: { angle: number; className?: string }) {
  const cx = 60;
  const cy = 60;
  const r = 48;
  const point = (deg: number, radius: number) => {
    const a = Math.PI - (deg * Math.PI) / 180;
    return [cx + radius * Math.cos(a), cy - radius * Math.sin(a)].map((v) => v.toFixed(2));
  };
  const [ex, ey] = point(angle, r);
  const [lx, ly] = point(angle, r + 6);
  const ticks = Array.from({ length: 13 }, (_, i) => i * 15);

  return (
    <svg viewBox="0 0 120 68" className={className} aria-hidden="true" focusable="false">
      <path d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="var(--color-mint-strong)" strokeWidth="6" strokeLinecap="round" />
      <path
        d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${ex} ${ey}`}
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {ticks.map((deg) => {
        const [x1, y1] = point(deg, r - 9);
        const [x2, y2] = point(deg, r - (deg % 45 === 0 ? 14 : 12));
        return <path key={deg} d={`M${x1} ${y1}L${x2} ${y2}`} stroke="var(--color-muted)" strokeWidth="1" opacity={deg <= angle ? 0.9 : 0.35} />;
      })}
      <path d={`M${cx} ${cy}L${lx} ${ly}`} stroke="var(--color-brand-deep)" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill="var(--color-brand-deep)" />
    </svg>
  );
}
