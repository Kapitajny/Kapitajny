import Link from "next/link";

/**
 * Tymczasowy znak koncepcji nawiązujący do identyfikacji firmy: czerwony owal z pochylonym napisem
 * i zielona wstęga „Zakład Mięsny”. To NIE jest oficjalne logo Zakładu Mięsnego Wierzejki –
 * po uzyskaniu zgody zastąp go plikiem znaku (SVG) dostarczonym przez firmę.
 */
export function Wordmark({ tone = "dark", onNavigate }: { tone?: "dark" | "light"; onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="inline-flex shrink-0" aria-label="Wierzejki – strona główna">
      <svg viewBox="0 0 200 96" className="h-[3.6rem] w-auto" aria-hidden="true" focusable="false">
        <ellipse cx="100" cy="56" rx="94" ry="36" fill="var(--color-red)" />
        {tone === "light" && <ellipse cx="100" cy="56" rx="95.5" ry="37.5" fill="none" stroke="#ffffff" strokeWidth="1.5" />}
        <ellipse cx="100" cy="56" rx="88" ry="30.5" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.2" />
        <path d="M34 8 H166 L158 19 L166 30 H34 L42 19 Z" fill="var(--color-green)" />
        <text x="100" y="23" textAnchor="middle" fill="#ffffff" style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 800, letterSpacing: "0.16em" }}>
          ZAKŁAD MIĘSNY
        </text>
        <text
          x="100"
          y="70"
          textAnchor="middle"
          fill="#ffffff"
          style={{ fontFamily: "var(--font-serif)", fontSize: 38, fontWeight: 800, fontStyle: "italic", letterSpacing: "-0.01em" }}
        >
          Wierzejki
        </text>
        <text x="100" y="85" textAnchor="middle" fill="#ffffff" fillOpacity="0.85" style={{ fontFamily: "var(--font-sans)", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.14em" }}>
          OD 1991
        </text>
      </svg>
    </Link>
  );
}
