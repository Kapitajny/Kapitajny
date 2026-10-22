import type { ReactNode } from "react";

/** Nagłówek sekcji: krótka etykieta i tytuł szeryfowy. */
export function SectionHeading({
  id,
  eyebrow,
  children,
  tone = "dark",
  className = "",
}: {
  id: string;
  eyebrow: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={className}>
      <p className={`eyebrow flex items-center gap-3 ${tone === "light" ? "!text-sage" : ""}`}>
        <span aria-hidden="true" className="h-px w-8 bg-current" />
        {eyebrow}
      </p>
      <h2 id={id} className={`display-2 mt-5 ${tone === "light" ? "!text-paper" : ""}`}>
        {children}
      </h2>
    </div>
  );
}
