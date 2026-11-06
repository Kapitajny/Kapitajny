import { LOCKUP, MARK, TAGLINE, WORDMARK } from "./logo-paths";

type Tone = "light" | "dark";

const palette = {
  /** Na jasnym tle – kolory z oryginalnego logo. */
  light: { dark: "#2b2f33", red: "#d7050f", grey: "#dedede" },
  /** Na ciemnym tle – grafit zamieniony na biel. */
  dark: { dark: "#ffffff", red: "#ef1c24", grey: "rgba(255,255,255,0.32)" },
} as const;

const [mx, my] = MARK.viewBox.split(" ").map(Number);

function MarkPaths({ tone }: { tone: Tone }) {
  const c = palette[tone];
  return (
    <g transform={`translate(${-mx} ${-my})`} fillRule="evenodd">
      <path fill={c.grey} d={MARK.grey} />
      <path fill={c.dark} d={MARK.dark} />
      <path fill={c.red} d={MARK.red} />
    </g>
  );
}

/** Sam sygnet (tarcza, skrzydło i linia EKG). */
export function LogoMark({ className = "", tone = "light", title }: { className?: string; tone?: Tone; title?: string }) {
  const [, , w, h] = MARK.viewBox.split(" ").map(Number);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <MarkPaths tone={tone} />
    </svg>
  );
}

/**
 * Logo poziome: sygnet + napis VITALIS MED (opcjonalnie z hasłem „Private Medical Services”).
 * Wysokość ustaw klasą (np. `h-11`), szerokość dopasuje się automatycznie.
 */
export function Logo({ className = "", tone = "light", withTagline = false }: { className?: string; tone?: Tone; withTagline?: boolean }) {
  const c = palette[tone];
  const wordX = LOCKUP.markWidth + LOCKUP.gap;
  const s = LOCKUP.wordScale;
  // Hasło pod napisem, wyrównane do jego szerokości.
  const tagScale = (WORDMARK.width * s) / TAGLINE.width;
  const tagY = LOCKUP.wordY + WORDMARK.height * s + 70;
  const height = withTagline ? Math.max(LOCKUP.height, tagY + TAGLINE.height * tagScale + 10) : LOCKUP.height;
  const wordY = withTagline ? LOCKUP.wordY - 70 : LOCKUP.wordY;

  return (
    <svg viewBox={`0 0 ${LOCKUP.width} ${height}`} className={className} role="img" aria-label="Vitalis Med">
      <MarkPaths tone={tone} />
      <g transform={`translate(${wordX} ${wordY}) scale(${s}) translate(${-WORDMARK.x} ${-WORDMARK.y})`} fillRule="evenodd">
        <path fill={c.dark} d={WORDMARK.d} />
      </g>
      {withTagline && (
        <g transform={`translate(${wordX} ${tagY - 70}) scale(${tagScale}) translate(${-TAGLINE.x} ${-TAGLINE.y})`} fillRule="evenodd">
          <path fill={c.red} d={TAGLINE.d} />
        </g>
      )}
    </svg>
  );
}
