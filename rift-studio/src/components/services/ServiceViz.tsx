import type { ServiceId } from "@/data/services";
import styles from "./ServiceViz.module.css";

/** Deterministyczny pseudolosowy generator – ten sam obraz po stronie serwera i klienta. */
function seq(seed: number, n: number) {
  let s = seed;
  return Array.from({ length: n }, () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  });
}

/** Wizualizacje modułów usług – statyczne SVG; ruch tylko po najechaniu / fokusie modułu. */
export function ServiceViz({ id }: { id: ServiceId }) {
  if (id === "vocal") return <VocalViz />;
  if (id === "production") return <SequencerViz />;
  if (id === "mix") return <MixViz />;
  return <PodcastViz />;
}

function VocalViz() {
  const n = 96;
  const r = seq(7, n);
  // frazy wokalu: obwiednia z przerwami na oddech
  const env = (i: number) => {
    const phrase = Math.sin((i / n) * Math.PI * 3.2) ** 2;
    const gap = i % 32 > 27 ? 0.08 : 1;
    return Math.max(0.06, phrase * gap);
  };
  return (
    <svg className={styles.svg} viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="60" x2="600" y2="60" className={styles.axis} />
      {r.map((v, i) => {
        const h = Math.max(2, env(i) * (0.45 + v * 0.55) * 104);
        return <rect key={i} x={i * 6.25 + 1} y={60 - h / 2} width="3.4" height={h} rx="1" className={styles.bar} />;
      })}
      <rect x="0" y="0" width="2" height="120" className={styles.playhead} />
    </svg>
  );
}

function SequencerViz() {
  const rows = [
    { name: "kick", steps: [0, 3, 6, 8, 10] },
    { name: "snare", steps: [4, 12] },
    { name: "hat", steps: [0, 2, 4, 6, 8, 10, 11, 12, 14, 15] },
    { name: "808", steps: [0, 7, 10] },
  ];
  return (
    <svg className={styles.svg} viewBox="0 0 600 120" aria-hidden="true">
      {rows.map((row, ri) =>
        Array.from({ length: 16 }, (_, si) => (
          <rect
            key={`${ri}-${si}`}
            x={8 + si * 36.5}
            y={8 + ri * 27}
            width="30"
            height="21"
            rx="2"
            className={row.steps.includes(si) ? styles.stepOn : si % 4 === 0 ? styles.stepBeat : styles.step}
          />
        )),
      )}
      <rect x="4" y="2" width="38" height="116" rx="3" className={styles.sweep} />
    </svg>
  );
}

function MixViz() {
  return (
    <svg className={styles.svg} viewBox="0 0 600 120" aria-hidden="true">
      {[60, 250, 1000, 4000, 12000].map((f, i) => (
        <g key={f}>
          <line x1={20 + i * 115} y1="10" x2={20 + i * 115} y2="110" className={styles.grid} />
          <text x={24 + i * 115} y="114" className={styles.label}>
            {f >= 1000 ? `${f / 1000}k` : f}
          </text>
        </g>
      ))}
      <line x1="0" y1="60" x2="520" y2="60" className={styles.axis} />
      <path d="M0 74 C 40 74, 60 46, 110 52 S 200 66, 260 64 S 360 58, 400 46 S 470 40, 520 52" className={styles.curveFill} />
      <path d="M0 74 C 40 74, 60 46, 110 52 S 200 66, 260 64 S 360 58, 400 46 S 470 40, 520 52" className={styles.curve} />
      {[
        [96, 51],
        [255, 64],
        [400, 46],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="6" className={styles.node} />
      ))}
      {/* miernik LUFS */}
      <g transform="translate(548 6)">
        {Array.from({ length: 18 }, (_, i) => (
          <rect key={i} x="0" y={i * 6} width="40" height="4" className={i < 3 ? styles.meterHot : i < 7 ? styles.meterWarm : styles.meter} />
        ))}
        <rect x="0" y="0" width="40" height="108" className={styles.meterMask} />
      </g>
    </svg>
  );
}

function PodcastViz() {
  const a = seq(11, 64);
  const b = seq(29, 64);
  const lane = (vals: number[], y: number, on: (i: number) => boolean, cls: string) =>
    vals.map((v, i) => {
      const h = on(i) ? 6 + v * 30 : 1.5;
      return <rect key={i} x={46 + i * 8.4} y={y - h / 2} width="5" height={h} rx="1" className={cls} />;
    });
  return (
    <svg className={styles.svg} viewBox="0 0 600 120" aria-hidden="true">
      <text x="8" y="36" className={styles.laneLabel}>
        A
      </text>
      <text x="8" y="92" className={styles.laneLabel}>
        B
      </text>
      <line x1="40" y1="60" x2="600" y2="60" className={styles.grid} />
      {lane(a, 32, (i) => i % 22 < 12, styles.bar)}
      {lane(b, 88, (i) => i % 22 >= 11, styles.barAlt)}
      <rect x="40" y="0" width="2" height="120" className={styles.playhead} />
    </svg>
  );
}
