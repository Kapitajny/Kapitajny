import type { OpeningHours } from "@/data/locations";

export function Hours({ hours, className = "hours" }: { hours: OpeningHours[]; className?: string }) {
  return (
    <dl className={className}>
      {hours.map((h) => (
        <div key={h.label} style={{ display: "contents" }}>
          <dt>{h.label}</dt>
          <dd>
            {h.opens}–{h.closes}
          </dd>
        </div>
      ))}
    </dl>
  );
}
