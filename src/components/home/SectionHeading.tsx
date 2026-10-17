import type { ReactNode } from "react";

/** Nagłówek sekcji w stylu redakcyjnym: numer, etykieta i duży tytuł szeryfowy. */
export function SectionHeading({
  id,
  index,
  eyebrow,
  children,
  tone = "dark",
  className = "",
}: {
  id: string;
  index: string;
  eyebrow: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={className}>
      <p className={`eyebrow flex items-center gap-3 ${tone === "light" ? "text-oat/70" : ""}`}>
        <span className="tabular-nums">{index}</span>
        <span aria-hidden="true" className="h-px w-10 bg-current opacity-50" />
        <span>{eyebrow}</span>
      </p>
      <h2 id={id} className={`mt-5 text-[clamp(2.4rem,1.5rem+3.4vw,4.5rem)] ${tone === "light" ? "text-paper" : ""}`}>
        {children}
      </h2>
    </div>
  );
}
