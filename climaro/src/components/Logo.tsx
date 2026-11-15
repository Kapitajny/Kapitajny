import { LOGO_WIDTH, TAGLINE_PATH, WORDMARK_PATH } from "./logo-paths";

type LogoProps = {
  /** "dark" – na ciemnym tle, "light" – na jasnym tle. */
  tone?: "dark" | "light";
  /** Podpis pod logotypem. Czytelny dopiero od ok. 220 px szerokości logo. */
  withTagline?: boolean;
  className?: string;
  title?: string;
};

/** Znak CLIMARO: łuk litery C otwarty w prawo i trzy strugi powietrza (wariant „Przepływ”). */
export function LogoSymbol({ arc = "#FF7900", bars = "currentColor" }: { arc?: string; bars?: string }) {
  return (
    <>
      <path d="M35.89 13.29A16 16 0 1 0 35.89 34.71" fill="none" stroke={arc} strokeWidth="8" />
      <rect x="27" y="15.2" width="13" height="3.6" fill={bars} />
      <rect x="27" y="22.2" width="19" height="3.6" fill={bars} />
      <rect x="27" y="29.2" width="13" height="3.6" fill={bars} />
    </>
  );
}

export function Logo({ tone = "dark", withTagline = false, className, title = "CLIMARO" }: LogoProps) {
  const ink = tone === "dark" ? "#F5F5F5" : "#111315";
  const tagInk = tone === "dark" ? "#92989D" : "#4A5056";
  return (
    // Bez podpisu logotyp przesuwamy w dół, by stał na osi znaku.
    <svg className={className} viewBox={`2 2 ${LOGO_WIDTH - 2} 44`} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <LogoSymbol bars={ink} />
      <path d={WORDMARK_PATH} fill={ink} transform={withTagline ? undefined : "translate(0 6.5)"} />
      {withTagline ? <path d={TAGLINE_PATH} fill={tagInk} /> : null}
    </svg>
  );
}
