"use client";

import { useState } from "react";

export type ChartPoint = { label: string; value: number };

const W = 560;
const H = 220;
const PAD = { top: 24, right: 8, bottom: 28, left: 32 };
const BAR = 24;

/** Wykres kolumnowy jednej serii: cienkie kolumny, zaokrąglony koniec, podpowiedź po najechaniu i tabela danych. */
export function DocumentsChart({ data, title, unit }: { data: ChartPoint[]; title: string; unit: string }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value));
  const step = max > 40 ? 20 : 10;
  const top = Math.ceil(max / step) * step;
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const band = plotW / data.length;
  const y = (v: number) => PAD.top + plotH - (v / top) * plotH;
  const last = data.length - 1;

  return (
    <figure>
      <figcaption className="text-sm font-semibold text-navy">{title}</figcaption>
      <div className="relative mt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${title}. Szczegóły w tabeli poniżej.`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#E6EAF0" strokeWidth={1} />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="#5B6878">
                {t}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const cx = PAD.left + band * i + band / 2;
            const x0 = cx - BAR / 2;
            const yTop = y(d.value);
            const h = PAD.top + plotH - yTop;
            const r = Math.min(4, h);
            const path = `M${x0},${PAD.top + plotH} V${yTop + r} Q${x0},${yTop} ${x0 + r},${yTop} H${x0 + BAR - r} Q${x0 + BAR},${yTop} ${x0 + BAR},${yTop + r} V${PAD.top + plotH} Z`;
            return (
              <g
                key={d.label}
                tabIndex={0}
                role="img"
                aria-label={`${d.label}: ${d.value} ${unit}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="cursor-default outline-none"
              >
                <rect x={cx - band / 2} y={PAD.top} width={band} height={plotH} fill="transparent" />
                <path d={path} fill="#246BFD" opacity={active === null || active === i ? 1 : 0.45} />
                {i === last && active === null && (
                  <text x={cx} y={yTop - 8} textAnchor="middle" fontSize={12} fontWeight={600} fill="#10243A">
                    {d.value}
                  </text>
                )}
                <text x={cx} y={H - 8} textAnchor="middle" fontSize={11} fill="#5B6878">
                  {d.label}
                </text>
              </g>
            );
          })}
          <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top + plotH} y2={PAD.top + plotH} stroke="#C4CDD8" strokeWidth={1} />
        </svg>
        {active !== null && (
          <div
            role="status"
            className="pointer-events-none absolute -translate-x-1/2 rounded-md border border-line bg-white px-2.5 py-1.5 text-xs shadow-[var(--shadow-panel)]"
            style={{
              left: `${((PAD.left + band * active + band / 2) / W) * 100}%`,
              top: `${(Math.max(0, y(data[active].value) - 44) / H) * 100}%`,
            }}
          >
            <span className="block text-muted">{data[active].label}</span>
            <span className="num font-semibold text-navy">
              {data[active].value} {unit}
            </span>
          </div>
        )}
      </div>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-blue-ink">Pokaż dane w tabeli</summary>
        <table className="num mt-2 w-full max-w-xs text-left">
          <thead className="text-muted">
            <tr>
              <th scope="col" className="py-1 font-medium">Miesiąc</th>
              <th scope="col" className="py-1 text-right font-medium">Liczba ({unit})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {data.map((d) => (
              <tr key={d.label}>
                <th scope="row" className="py-1 font-normal">{d.label}</th>
                <td className="py-1 text-right">{d.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
