import type { CSSProperties } from "react";

/**
 * Szkic konstrukcyjny strony (desktop 1440 px i telefon 390 px) unoszący się nad chmurami.
 * Linie „rysują się” po wejściu strony – projektowanie pokazane dosłownie, bez ikon i zdjęć.
 */

const box = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;
const line = (x1: number, y: number, x2: number) => `M${x1} ${y}H${x2}`;
const dimension = (x1: number, x2: number, y: number) => `M${x1} ${y - 6}v12M${x2} ${y - 6}v12M${x1} ${y}H${x2}`;
const image = (x: number, y: number, w: number, h: number) => `${box(x, y, w, h)}M${x} ${y}L${x + w} ${y + h}M${x + w} ${y}L${x} ${y + h}`;

const desktop = [
  box(0, 60, 560, 360),
  line(0, 92, 560),
  box(24, 70, 44, 12),
  line(300, 76, 330) + line(345, 76, 375) + line(390, 76, 420) + line(435, 76, 462),
  box(484, 68, 52, 16),
  box(24, 124, 248, 22) + box(24, 154, 196, 22),
  line(24, 196, 258) + line(24, 208, 232),
  box(102, 228, 70, 22),
  image(300, 118, 236, 136),
  box(24, 282, 160, 112) + box(200, 282, 160, 112) + box(376, 282, 160, 112),
  line(40, 364, 150) + line(216, 364, 330) + line(392, 364, 500),
  line(40, 376, 130) + line(216, 376, 310) + line(392, 376, 480),
];

const phone = [
  "M614 160h92a14 14 0 0 1 14 14v232a14 14 0 0 1-14 14h-92a14 14 0 0 1-14-14V174a14 14 0 0 1 14-14Z",
  line(644, 172, 676),
  box(614, 194, 84, 12) + box(614, 212, 62, 12),
  line(614, 236, 704) + line(614, 246, 690),
  image(614, 262, 92, 66),
  line(614, 372, 704) + line(614, 382, 696) + line(614, 392, 680),
];

const dimensions = [dimension(0, 560, 34), dimension(600, 720, 134)];

export function Blueprint({ className }: { className?: string }) {
  const stroke = (d: string, i: number, delay = 0) => (
    <path key={i} d={d} pathLength={1} style={{ "--d": `${delay + i * 70}ms` } as CSSProperties} />
  );

  return (
    <div aria-hidden="true" className={className}>
      <div className="blueprint-float">
        <svg viewBox="-10 0 750 440" className="blueprint h-auto w-full overflow-visible" fill="none" stroke="currentColor" strokeWidth="1">
          <g opacity="0.75">{desktop.map((d, i) => stroke(d, i))}</g>
          <g opacity="0.75">{phone.map((d, i) => stroke(d, i, 500))}</g>
          <g opacity="0.5">{dimensions.map((d, i) => stroke(d, i, 900))}</g>
          {/* Przyciski główne – jedyne wypełnione elementy szkicu. */}
          <g className="intro-after" style={{ "--d": "1500ms" } as CSSProperties} stroke="none">
            <rect x="24" y="228" width="70" height="22" fill="var(--color-sun)" />
            <rect x="614" y="340" width="54" height="16" fill="var(--color-sun)" />
            <text x="280" y="22" fill="currentColor" fontSize="12" textAnchor="middle" opacity="0.7" letterSpacing="1">
              1440
            </text>
            <text x="660" y="122" fill="currentColor" fontSize="12" textAnchor="middle" opacity="0.7" letterSpacing="1">
              390
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
