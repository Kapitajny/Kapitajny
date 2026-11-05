import type { CSSProperties } from "react";
import { siteConfig } from "@/config/site";

/** Napis COMPUTERIT – litery wyłaniają się kolejno z rozświetlenia (animacja w globals.css). */
export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="wordmark" role="img" aria-label={siteConfig.name}>
        {siteConfig.wordmark.split("").map((letter, i) => (
          <span key={i} aria-hidden="true" className="wordmark-letter" style={{ "--i": i } as CSSProperties}>
            {letter}
          </span>
        ))}
      </p>
      <div aria-hidden="true" className="wordmark-rule mt-[clamp(1rem,2.4vw,2rem)] flex items-center text-white/60">
        <span className="h-3 w-px bg-current" />
        <span className="h-px flex-1 bg-current" />
        <span className="h-3 w-px bg-current" />
      </div>
    </div>
  );
}
