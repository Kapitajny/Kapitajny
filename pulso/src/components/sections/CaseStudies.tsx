"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { cases, caseTotals, type DemoCase } from "@/data/demo";
import { serviceById } from "@/data/services";
import { channelColor } from "@/lib/channels";
import { ContactLink, Arrow } from "@/components/ui/ContactLink";
import { Chevron } from "@/components/ui/Icons";

const pln = (v: number, digits = 0) =>
  new Intl.NumberFormat("pl-PL", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v).replace(/ /g, " ");

function niceMax(v: number): number {
  const pow = 10 ** Math.floor(Math.log10(v));
  const n = v / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * pow;
}

/** Maksimum osi podzielne na 4 równe, okrągłe działki (np. 40, 60, 2000). */
function niceAxisMax(v: number): number {
  return niceMax(v / 4) * 4;
}

/** Wykres: wydatki tygodniowe (słupki) i konwersje (linia) na wspólnej siatce. */
function CaseChart({ c }: { c: DemoCase }) {
  const W = 640;
  const H = 300;
  const pad = { l: 56, r: 48, t: 20, b: 36 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const maxSpend = niceAxisMax(Math.max(...c.weeks.map((w) => w.spend)) * 1.05);
  const maxConv = niceAxisMax(Math.max(...c.weeks.map((w) => w.conversions)) * 1.05);
  const step = iw / c.weeks.length;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const color = channelColor(c.platform);
  const pts = c.weeks.map((w, i) => [pad.l + step * i + step / 2, pad.t + ih - (w.conversions / maxConv) * ih] as const);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby={`wykres-${c.id}-opis`}>
      <title id={`wykres-${c.id}-opis`}>
        {`Wykres demonstracyjny: tygodniowe wydatki (słupki) i ${c.conversionLabel} (linia) w ${c.weeks.length} tygodniach.`}
      </title>
      {ticks.map((t) => {
        const y = pad.t + ih - t * ih;
        return (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="var(--color-rule)" strokeWidth="1" />
            <text x={pad.l - 10} y={y + 4} textAnchor="end" className="fill-ink-3 text-[11px] tnum">
              {pln(maxSpend * t)} zł
            </text>
            <text x={W - pad.r + 10} y={y + 4} textAnchor="start" className="fill-ink-3 text-[11px] tnum">
              {pln(maxConv * t)}
            </text>
          </g>
        );
      })}
      {c.weeks.map((w, i) => {
        const h = (w.spend / maxSpend) * ih;
        return (
          <g key={w.week}>
            <rect x={pad.l + step * i + step * 0.22} y={pad.t + ih - h} width={step * 0.56} height={h} rx="2" fill="var(--color-rule-strong)" />
            <text x={pad.l + step * i + step / 2} y={H - 12} textAnchor="middle" className="fill-ink-3 text-[11px] tnum">
              T{w.week}
            </text>
          </g>
        );
      })}
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill="var(--color-sheet)" stroke={color} strokeWidth="2.5" />
      ))}
    </svg>
  );
}

/** Wykres pociskowy: rzeczywisty koszt pozyskania wobec celu. */
function CpaBullet({ cpa, target }: { cpa: number; target: number }) {
  const max = niceMax(Math.max(cpa, target) * 1.4);
  const ok = cpa <= target;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="font-[620]">Koszt pozyskania wobec celu</span>
        <span className="tnum text-ink-2">
          {pln(cpa, 2)} zł / cel {pln(target)} zł
        </span>
      </div>
      <div className="relative mt-2 h-6 rounded-[3px] bg-paper-2" role="img" aria-label={`Koszt pozyskania ${pln(cpa, 2)} zł, cel ${pln(target)} zł, ${ok ? "poniżej celu" : "powyżej celu"}.`}>
        <span className="absolute inset-y-1.5 left-0 rounded-[2px] bg-ink" style={{ width: `${(cpa / max) * 100}%` }} />
        <span className="absolute -inset-y-1 w-[3px] rounded-full bg-youtube" style={{ left: `calc(${(target / max) * 100}% - 1.5px)` }} />
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-ink-3 tnum" aria-hidden="true">
        <span>0 zł</span>
        <span>{pln(max)} zł</span>
      </div>
    </div>
  );
}

export function CaseStudies() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const c = cases[active];
  const t = caseTotals(c);
  const service = serviceById(c.platform)!;

  const onKey = (e: KeyboardEvent) => {
    const n = cases.length;
    const map: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: n - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + n) % n;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const ledger: [string, string][] = [
    ["Wydatki reklamowe", `${pln(t.spend)} zł`],
    ["Kliknięcia", pln(t.clicks)],
    ["Średni koszt kliknięcia", `${pln(t.cpc, 2)} zł`],
    [`Konwersje (${c.conversionLabel})`, pln(t.conversions)],
    ["Koszt pozyskania (CPA)", `${pln(t.cpa, 2)} zł`],
    ["Przychód przypisany", `${pln(t.revenue)} zł`],
    ["ROAS (przychód / wydatki)", `${pln(t.roas, 2)}×`],
  ];

  return (
    <section id="case-studies" aria-labelledby="case-tytul" className="section">
      <div className="container-plan">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="case-tytul" className="t-h2 lg:col-span-6">
            Raport, który czytasz bez tłumacza.
          </h2>
          <p className="t-lead lg:col-span-5 lg:col-start-8 lg:self-end">
            Tak wygląda podsumowanie kampanii w PULSO: wydatki, wyniki i wnioski w jednym miejscu. Poniższe liczby są{" "}
            <strong className="font-[660] text-ink">demonstracyjne</strong>, nie są wynikami klientów.
          </p>
        </div>

        <div className="mt-12 rounded-[10px] border border-rule bg-sheet shadow-(--shadow-sheet)">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule px-4 py-3 sm:px-6">
            <div role="tablist" aria-label="Przykładowe raporty" className="flex flex-wrap gap-1">
              {cases.map((cs, i) => (
                <button
                  key={cs.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`case-tab-${cs.id}`}
                  aria-selected={active === i}
                  aria-controls="case-panel"
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onKey}
                  className={`min-h-11 rounded-full px-4 text-[0.9375rem] font-[600] transition-colors ${
                    active === i ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-2"
                  }`}
                >
                  {cs.name.split(":")[0]}
                </button>
              ))}
            </div>
            <span className="stamp-demo text-stamp">Dane demonstracyjne</span>
          </div>

          <div id="case-panel" role="tabpanel" aria-labelledby={`case-tab-${c.id}`} className="grid lg:grid-cols-12">
            <div className="border-b border-rule p-4 sm:p-6 lg:col-span-5 lg:border-r lg:border-b-0">
              <h3 className="t-h3">{c.name}</h3>
              <p className="mt-2 text-[0.9375rem] text-ink-2">
                {service.name} · {c.objective}. {c.context}
              </p>
              <table className="mt-6 w-full text-[0.9875rem]">
                <caption className="sr-only">Podsumowanie kampanii demonstracyjnej</caption>
                <tbody>
                  {ledger.map(([k, v]) => (
                    <tr key={k} className="border-t border-rule">
                      <th scope="row" className="py-2.5 pr-4 text-left font-[480] text-ink-2">
                        {k}
                      </th>
                      <td className="tnum py-2.5 text-right text-[1.0625rem] font-[680]">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6">
                <CpaBullet cpa={t.cpa} target={c.targetCpa} />
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-2">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-[2px] bg-rule-strong" aria-hidden="true" /> Wydatki tygodniowe (oś lewa)
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-[3px] w-5 rounded-full" style={{ background: channelColor(c.platform) }} aria-hidden="true" />
                  {c.conversionLabel[0].toUpperCase() + c.conversionLabel.slice(1)} (oś prawa)
                </span>
              </div>
              <div className="mt-4">
                <CaseChart c={c} />
              </div>
              <details className="group mt-2 text-sm">
                <summary className="inline-flex min-h-11 items-center gap-2 font-[600] text-ink-2 hover:text-ink">
                  <Chevron className="h-4 w-4 transition-transform group-open:rotate-90" /> Pokaż dane w tabeli
                </summary>
                <div className="relative mt-2 overflow-x-auto">
                  <table className="tnum w-full min-w-[28rem] text-left">
                    <thead>
                      <tr className="t-col">
                        <th scope="col" className="py-2 font-[620]">Tydzień</th>
                        <th scope="col" className="py-2 text-right font-[620]">Wydatki</th>
                        <th scope="col" className="py-2 text-right font-[620]">Kliknięcia</th>
                        <th scope="col" className="py-2 text-right font-[620]">Konwersje</th>
                        <th scope="col" className="py-2 text-right font-[620]">Przychód</th>
                      </tr>
                    </thead>
                    <tbody>
                      {c.weeks.map((w) => (
                        <tr key={w.week} className="border-t border-rule">
                          <td className="py-1.5">T{w.week}</td>
                          <td className="py-1.5 text-right">{pln(w.spend)} zł</td>
                          <td className="py-1.5 text-right">{pln(w.clicks)}</td>
                          <td className="py-1.5 text-right">{w.conversions}</td>
                          <td className="py-1.5 text-right">{pln(w.revenue)} zł</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>

              <h4 className="t-col mt-6 !text-ink">Co zrobiliśmy w tej kampanii</h4>
              <ul className="mt-3 space-y-2">
                {c.whatWeDid.map((s) => {
                  const [when, what] = s.split(": ");
                  return (
                    <li key={s} className="grid grid-cols-[6.5rem_1fr] gap-3 text-[0.9375rem] leading-snug">
                      <span className="tnum font-[640]">{when}</span>
                      <span className="text-ink-2">{what}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-rule bg-paper/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-[0.9375rem] text-ink-2">Chcesz zobaczyć, jak mógłby wyglądać raport dla Twojej firmy?</p>
            <ContactLink className="btn btn-primary btn-sm" services={[c.platform]}>
              Umów konsultację <Arrow />
            </ContactLink>
          </div>
        </div>
      </div>
    </section>
  );
}
