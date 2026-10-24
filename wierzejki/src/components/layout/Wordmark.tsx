import Link from "next/link";

/**
 * Tymczasowy znak słowny koncepcji. NIE jest oficjalnym logo Zakładu Mięsnego Wierzejki –
 * po uzyskaniu zgody zastąp go plikiem znaku dostarczonym przez firmę.
 */
export function Wordmark({ tone = "dark", onNavigate }: { tone?: "dark" | "light"; onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={`group inline-flex flex-col leading-none ${tone === "light" ? "text-on-dark" : "text-ink"}`}
      aria-label="Wierzejki – strona główna"
    >
      <span className="ui text-[0.625rem] font-semibold tracking-[0.18em] opacity-70">ZAKŁAD MIĘSNY</span>
      <span
        className={`mt-0.5 text-[1.85rem] font-extrabold ${tone === "light" ? "text-on-dark" : "text-red"}`}
        style={{ fontFamily: "var(--font-sans)", fontVariationSettings: '"wdth" 66', letterSpacing: "-0.01em" }}
      >
        Wierzejki
      </span>
    </Link>
  );
}
