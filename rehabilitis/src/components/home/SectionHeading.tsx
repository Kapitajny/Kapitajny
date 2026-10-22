import type { ReactNode } from "react";

/** Nagłówek sekcji z opcjonalnym krótkim wprowadzeniem. */
export function SectionHeading({ id, title, children, className = "" }: { id: string; title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h2 id={id} className="h2">
        {title}
      </h2>
      {children && <div className="section-intro">{children}</div>}
    </div>
  );
}
