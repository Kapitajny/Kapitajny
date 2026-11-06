import type { ReactNode } from "react";

/** Nagłówek sekcji: mały podpis z czerwoną kreską, tytuł H2 i opcjonalny lead. */
export function SectionHeading({
  title,
  lead,
  id,
  tone = "light",
  className = "",
  as: Tag = "h2",
}: {
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2";
}) {
  const dark = tone === "dark";
  return (
    <div className={className}>
      <Tag id={id} className={`${Tag === "h1" ? "h-display" : "h-section"} ${dark ? "text-white" : ""}`}>
        {title}
      </Tag>
      {lead && <div className={`lead mt-5 max-w-2xl ${dark ? "text-white/75" : ""}`}>{lead}</div>}
    </div>
  );
}
