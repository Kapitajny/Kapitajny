import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={`reveal max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <Tag id={id} className={`${Tag === "h1" ? "display" : "h2"} mt-5`}>
        {title}
      </Tag>
      {lead && <p className={`lead mt-5 ${align === "center" ? "mx-auto" : ""} max-w-2xl`}>{lead}</p>}
    </div>
  );
}

/** Nagłówek podstrony: siatka w tle, etykieta, tytuł, wstęp i opcjonalne przyciski. */
export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="grid-bg fade-mask pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-x hero-in relative pt-[clamp(3.5rem,9vw,7rem)] pb-[clamp(3.5rem,8vw,6rem)]">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-6 max-w-4xl">{title}</h1>
        <p className="lead mt-6 max-w-2xl">{lead}</p>
        {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
