import type { CSSProperties } from "react";
import { processSteps } from "@/data/offer";

/** Pięć kroków połączonych złotą ścieżką obwodu. */
export function Process() {
  return (
    <ol className="relative grid gap-8 lg:grid-cols-5 lg:gap-6">
      <span className="absolute top-[1.15rem] right-[10%] left-[10%] hidden h-px bg-gradient-to-r from-gold/0 via-gold to-gold/0 lg:block" aria-hidden="true" />
      <span className="absolute top-2 bottom-2 left-[1.15rem] w-px bg-gradient-to-b from-gold via-gold/60 to-gold/0 lg:hidden" aria-hidden="true" />
      {processSteps.map((step, n) => (
        <li key={step.title} className="reveal relative flex gap-5 lg:block" style={{ "--delay": `${n * 90}ms` } as CSSProperties}>
          <span className="relative z-10 grid size-[2.3rem] shrink-0 place-items-center rounded-full border border-gold bg-paper font-mono text-[0.75rem] lg:mx-auto">
            {n + 1}
          </span>
          <div className="lg:mt-6 lg:text-center">
            <h3 className="text-[1.15rem] tracking-[-0.02em]">{step.title}</h3>
            <p className="mt-2 text-[0.95rem] text-steel">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
