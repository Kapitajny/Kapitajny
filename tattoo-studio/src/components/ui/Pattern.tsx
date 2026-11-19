import { useId } from "react";

/**
 * Tradycyjne japońskie wzory jako SVG <pattern>:
 *  - asanoha  (麻の葉, liść konopi) — siatka trójkątów z liniami do środka,
 *  - seigaiha (青海波, fale błękitnego morza) — zachodzące na siebie koncentryczne łuki,
 *  - kumiko   (組子) — kratownica stolarska.
 * Kolor linii = `currentColor`; wzór ma być tłem, nie treścią.
 */

type Kind = "asanoha" | "seigaiha" | "kumiko";

const ASANOHA_SIZE = 36;
const ASANOHA_H = ASANOHA_SIZE * Math.sqrt(3);

function buildAsanoha(): string {
  const s = ASANOHA_SIZE;
  const rowH = ASANOHA_H / 2;
  const segs: string[] = [];
  const p = (x: number, y: number) => `${x.toFixed(2)} ${y.toFixed(2)}`;
  const tri = (a: [number, number], b: [number, number], c: [number, number]) => {
    const cx = (a[0] + b[0] + c[0]) / 3;
    const cy = (a[1] + b[1] + c[1]) / 3;
    segs.push(`M${p(...a)}L${p(...b)}L${p(...c)}Z`);
    for (const v of [a, b, c]) segs.push(`M${p(cx, cy)}L${p(...v)}`);
  };
  for (let r = -1; r <= 2; r++) {
    const y0 = r * rowH;
    const y1 = (r + 1) * rowH;
    const off0 = (((r % 2) + 2) % 2) * (s / 2);
    const off1 = ((((r + 1) % 2) + 2) % 2) * (s / 2);
    for (let k = -2; k <= 2; k++) {
      const x = off0 + k * s;
      // trójkąt z podstawą w rzędzie r
      tri([x, y0], [x + s, y0], [x + s / 2, y1]);
      // trójkąt z podstawą w rzędzie r+1
      const xb = off1 + k * s;
      tri([xb, y1], [xb + s, y1], [xb + s / 2, y0]);
    }
  }
  return segs.join("");
}

const ASANOHA_PATH = buildAsanoha();

const SEIGAIHA_W = 48;
const SEIGAIHA_H = 24;
/** Środki łuków w kolejności rysowania: niższe zakrywają wyższe. */
const SEIGAIHA_CENTERS: [number, number][] = [
  [0, 0],
  [48, 0],
  [24, 12],
  [0, 24],
  [48, 24],
  [24, 36],
  [0, 48],
  [48, 48],
];

const KUMIKO_SIZE = 40;
const KUMIKO_PATH =
  "M0 0H40V40H0Z M20 0L40 20L20 40L0 20Z M0 0L10 10 M40 0L30 10 M40 40L30 30 M0 40L10 30 M10 10H30V30H10Z";

export function Pattern({
  kind,
  className = "",
  scale = 1,
  strokeWidth = 0.75,
  bg = "var(--color-washi)",
}: {
  kind: Kind;
  className?: string;
  scale?: number;
  strokeWidth?: number;
  /** Kolor tła pod łukami seigaiha (musi odpowiadać tłu sekcji). */
  bg?: string;
}) {
  const id = `pt-${kind}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  let tile: React.ReactNode;
  let w: number;
  let h: number;
  if (kind === "asanoha") {
    w = ASANOHA_SIZE;
    h = ASANOHA_H;
    tile = <path d={ASANOHA_PATH} fill="none" stroke="currentColor" strokeWidth={strokeWidth} />;
  } else if (kind === "kumiko") {
    w = KUMIKO_SIZE;
    h = KUMIKO_SIZE;
    tile = <path d={KUMIKO_PATH} fill="none" stroke="currentColor" strokeWidth={strokeWidth} />;
  } else {
    w = SEIGAIHA_W;
    h = SEIGAIHA_H;
    tile = SEIGAIHA_CENTERS.map(([cx, cy]) => (
      <g key={`${cx}-${cy}`}>
        <circle cx={cx} cy={cy} r={23.5} style={{ fill: bg }} stroke="currentColor" strokeWidth={strokeWidth} />
        <circle cx={cx} cy={cy} r={17.5} fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
        <circle cx={cx} cy={cy} r={11.5} fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
        <circle cx={cx} cy={cy} r={5.5} fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
      </g>
    ));
  }

  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width={w * scale} height={h * scale} patternUnits="userSpaceOnUse">
          <g transform={`scale(${scale})`}>{tile}</g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
