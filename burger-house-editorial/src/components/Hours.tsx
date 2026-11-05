import type { OpeningHours } from "@/data/locations";

export function Hours({ hours }: { hours: OpeningHours[] }) {
  return (
    <dl className="facts num">
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
