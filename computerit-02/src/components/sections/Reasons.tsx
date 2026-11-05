import type { CSSProperties } from "react";
import { reasons } from "@/data/offer";

export function Reasons() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {reasons.map((reason, n) => (
        <li key={reason.title} className="reveal bg-white p-7 sm:p-8" style={{ "--delay": `${(n % 3) * 80}ms` } as CSSProperties}>
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-[1px] bg-ink" aria-hidden="true" />
            <span className="font-mono text-[0.75rem] tracking-[0.08em] text-steel">{String(n + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="mt-6 text-[1.2rem] tracking-[-0.02em]">{reason.title}</h3>
          <p className="mt-3 text-[0.975rem] text-steel">{reason.text}</p>
        </li>
      ))}
    </ul>
  );
}
