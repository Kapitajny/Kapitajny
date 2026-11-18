import { serviceById, type ServiceId } from "@/data/services";
import { channelStyle } from "@/lib/channels";

/** Mały plan emisji: kanały w wierszach, tygodnie w kolumnach. */
export function MiniPlan({ flights, weeks = 8, label }: { flights: [ServiceId, number, number][]; weeks?: number; label: string }) {
  return (
    <div role="img" aria-label={label} className="rounded-md border border-rule bg-paper/60 p-3">
      <div className="grid grid-cols-[4.5rem_1fr] gap-2" aria-hidden="true">
        <span />
        <div className="grid" style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}>
          {Array.from({ length: weeks }, (_, i) => (
            <span key={i} className="t-col tnum !text-[0.625rem]">
              T{i + 1}
            </span>
          ))}
        </div>
        {flights.map(([id, start, span]) => (
          <div key={id} className="contents">
            <span className="truncate text-xs font-[620]">{serviceById(id)!.channel}</span>
            <span className="week-grid relative block h-5" style={{ "--weeks": weeks } as React.CSSProperties}>
              <span className="absolute inset-y-1" style={{ left: `${((start - 1) / weeks) * 100}%`, width: `${(span / weeks) * 100}%` }}>
                <span className="flight block" data-state="booked" style={channelStyle(id)} />
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
