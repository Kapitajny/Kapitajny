import type { OpeningHours } from "@/data/locations";

export function Hours({ hours }: { hours: OpeningHours[] }) {
  return (
    <dl className="hours">
      {hours.map((h) => (
        <div key={h.label}>
          <dt>{h.label}</dt>
          <dd>
            {h.opens}–{h.closes}
          </dd>
        </div>
      ))}
    </dl>
  );
}
