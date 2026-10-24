import { IconAlert, IconCheck, IconClock, IconLedger } from "@/components/ui/Icons";

const rows = [
  { label: "Faktury sprzedażowe", status: "Zaksięgowane", tone: "ok" },
  { label: "Faktury kosztowe", status: "6 do uzupełnienia", tone: "todo" },
  { label: "Wyciągi bankowe", status: "Zaksięgowane", tone: "ok" },
  { label: "Lista płac", status: "Do akceptacji", tone: "wait" },
] as const;

const toneStyles = {
  ok: { icon: IconCheck, className: "text-teal-ink bg-teal-wash" },
  todo: { icon: IconAlert, className: "text-warning bg-warning-wash" },
  wait: { icon: IconClock, className: "text-blue-ink bg-sky" },
};

/**
 * Autorska ilustracja interfejsu: fragment panelu klienta z zamknięciem miesiąca.
 * Element dekoracyjny – wszystkie wartości są przykładowe i opisane jako takie.
 */
export function HeroPanel() {
  return (
    <figure className="relative mx-auto w-full max-w-[30rem] lg:mx-0">
      <div className="hero-enter overflow-hidden rounded-[var(--radius-panel)] border border-line bg-white shadow-[var(--shadow-float)]">
        <div className="flex items-center justify-between border-b border-line bg-navy px-5 py-3.5 text-white">
          <span className="flex items-center gap-2 text-sm font-medium">
            <IconLedger size={18} className="text-gold" />
            Zamknięcie miesiąca
          </span>
          <span className="text-xs text-on-navy">Październik</span>
        </div>

        <div className="px-5 pt-5">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-muted">Dokumenty zaksięgowane</p>
            <p className="num text-sm font-semibold text-navy">46 z 52</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist" aria-hidden="true">
            <div className="bar-fill h-full w-[88%] rounded-full bg-teal" />
          </div>
        </div>

        <ul className="mt-4 divide-y divide-line border-t border-line">
          {rows.map((row) => {
            const t = toneStyles[row.tone];
            const Icon = t.icon;
            return (
              <li key={row.label} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                <span className="text-ink">{row.label}</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${t.className}`}>
                  <Icon size={14} />
                  {row.status}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="grid grid-cols-2 border-t border-line text-sm">
          <div className="border-r border-line px-5 py-4">
            <p className="text-xs text-muted">Przychody</p>
            <p className="num mt-0.5 font-semibold text-navy">84&nbsp;200&nbsp;zł</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-muted">Koszty</p>
            <p className="num mt-0.5 font-semibold text-navy">51&nbsp;730&nbsp;zł</p>
          </div>
        </div>
        <div className="hero-enter-late flex items-end justify-between gap-4 border-t border-line bg-mist px-5 py-4">
          <div>
            <p className="text-xs text-muted">Abonament</p>
            <p className="text-sm text-ink">Pakiet Biznes, netto / mies.</p>
          </div>
          <p className="num font-serif text-2xl text-navy">
            <span className="ledger-total">1&nbsp;480&nbsp;zł</span>
          </p>
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-muted">
        Ilustracja panelu klienta. Wszystkie wartości są przykładowe.
      </figcaption>
    </figure>
  );
}
