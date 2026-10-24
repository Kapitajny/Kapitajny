/**
 * Owalna pieczęć „od 1991” – motyw graficzny marki.
 * Celowo bez numeru i skrótów urzędowych, żeby nie przypominała weterynaryjnego znaku identyfikacyjnego.
 */
export function Seal({ className = "", tone = "red" }: { className?: string; tone?: "red" | "light" }) {
  const color = tone === "red" ? "var(--color-red)" : "var(--color-on-dark)";
  return (
    <svg viewBox="0 0 220 150" className={className} role="img" aria-label="Wierzejki, od 1991 roku" style={{ color }}>
      <defs>
        <path id="seal-top" d="M30 75a80 52 0 0 1 160 0" />
        <path id="seal-bottom" d="M24 75a86 58 0 0 0 172 0" />
      </defs>
      <ellipse cx="110" cy="75" rx="106" ry="72" fill={tone === "red" ? "var(--color-paper)" : "none"} />
      <ellipse cx="110" cy="75" rx="104" ry="70" fill="none" stroke="currentColor" strokeWidth="3" />
      <ellipse cx="110" cy="75" rx="96" ry="62" fill="none" stroke="currentColor" strokeWidth="1" />
      <text fill="currentColor" style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, letterSpacing: "0.22em" }}>
        <textPath href="#seal-top" startOffset="50%" textAnchor="middle">
          ZAKŁAD MIĘSNY
        </textPath>
      </text>
      <text fill="currentColor" style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.2em" }}>
        <textPath href="#seal-bottom" startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
          PŁUDY · LUBELSKIE
        </textPath>
      </text>
      <text
        x="110"
        y="70"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: "var(--font-sans)", fontVariationSettings: '"wdth" 68', fontSize: 34, fontWeight: 800 }}
      >
        Wierzejki
      </text>
      <text x="110" y="96" textAnchor="middle" fill="currentColor" style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontStyle: "italic" }}>
        od 1991
      </text>
    </svg>
  );
}
