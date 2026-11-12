import type { ReactNode } from "react";

/** Nagłówek sekcji: tytuł po lewej, krótki opis po prawej (na telefonie pod spodem). */
export function SectionHead({ id, kicker, title, children }: { id: string; kicker?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-10 grid gap-5 md:mb-14 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-end md:gap-12">
      <div>
        {kicker && <span className="kicker mb-3">{kicker}</span>}
        <h2 id={id} className="display-lg">
          {title}
        </h2>
      </div>
      {children && <div className="max-w-xl text-lg leading-relaxed opacity-85">{children}</div>}
    </div>
  );
}
