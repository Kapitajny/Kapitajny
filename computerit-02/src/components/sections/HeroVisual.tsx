import type { CSSProperties } from "react";

const i = (n: number, offset?: string) => ({ "--i": n, ...(offset ? { "--offset": offset } : {}) }) as CSSProperties;

const muted = "#c4c6c0";
const soft = "#efefeb";

/**
 * Monitor z logo ComputerIT w dużej skali. Na ekranie na przemian „składa się” szkic strony
 * internetowej i sklepu, a złote ścieżki obwodu prowadzą od monitora na zewnątrz.
 * Przy prefers-reduced-motion widać statyczny szkic strony, bez impulsów na ścieżkach.
 */
export function HeroVisual() {
  const offset = "4.5s";
  return (
    <div className="relative">
      <svg viewBox="0 0 640 520" className="h-auto w-full" role="img" aria-label="Monitor ComputerIT, na którego ekranie powstaje szkic strony internetowej i sklepu">
        {/* Ścieżki obwodu */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {[
            { d: "M80 150H44V300H0", delay: "0s" },
            { d: "M560 118H600V54H640", delay: "1.4s" },
            { d: "M560 300H612V420H640", delay: "2.6s" },
            { d: "M280 452V500H120V520", delay: "3.6s" },
          ].map((trace) => (
            <g key={trace.d}>
              <path d={trace.d} stroke="#dccb9f" strokeWidth="1.5" pathLength={1} className="trace-draw" style={{ "--d": trace.delay } as CSSProperties} />
              <path d={trace.d} stroke="var(--color-gold)" strokeWidth="2.5" className="trace-pulse" style={{ "--d": trace.delay } as CSSProperties} />
            </g>
          ))}
          <g fill="var(--color-paper)" stroke="var(--color-gold)" strokeWidth="1.5">
            <circle cx="44" cy="150" r="4" />
            <circle cx="44" cy="300" r="4" />
            <circle cx="600" cy="118" r="4" />
            <circle cx="600" cy="54" r="4" />
            <circle cx="612" cy="300" r="4" />
            <circle cx="612" cy="420" r="4" />
            <circle cx="280" cy="500" r="4" />
            <circle cx="120" cy="500" r="4" />
          </g>
        </g>

        {/* Monitor */}
        <rect x="84.5" y="24.5" width="471" height="371" rx="30" fill="var(--color-white)" stroke="var(--color-ink)" strokeWidth="9" />
        <rect x="150" y="430" width="340" height="22" rx="11" fill="var(--color-ink)" />

        <clipPath id="ekran">
          <rect x="102" y="42" width="436" height="336" rx="16" />
        </clipPath>

        <g clipPath="url(#ekran)">
          {/* Ekran A – strona internetowa */}
          <g className="screen-a">
            <g className="build">
              <g style={i(0)}>
                <rect x="122" y="62" width="62" height="11" rx="3" fill="var(--color-ink)" />
                <rect x="332" y="64" width="30" height="7" rx="3.5" fill={muted} />
                <rect x="372" y="64" width="30" height="7" rx="3.5" fill={muted} />
                <rect x="412" y="64" width="30" height="7" rx="3.5" fill={muted} />
                <rect x="458" y="58" width="60" height="18" rx="9" fill="var(--color-ink)" />
                <rect x="102" y="92" width="436" height="1" fill="#e6e6e2" />
              </g>
              <g style={i(1)}>
                <rect x="122" y="120" width="226" height="20" rx="4" fill="var(--color-ink)" />
                <rect x="122" y="148" width="170" height="20" rx="4" fill="var(--color-ink)" />
              </g>
              <g style={i(2)}>
                <rect x="122" y="184" width="200" height="7" rx="3.5" fill={muted} />
                <rect x="122" y="198" width="160" height="7" rx="3.5" fill={muted} />
              </g>
              <g style={i(3)}>
                <rect x="122" y="222" width="88" height="26" rx="13" fill="var(--color-ink)" />
                <rect x="219" y="223" width="86" height="24" rx="12" fill="none" stroke="var(--color-ink)" strokeWidth="2" />
              </g>
              <g style={i(4)}>
                <rect x="370" y="112" width="148" height="136" rx="12" fill={soft} />
                <circle cx="478" cy="146" r="13" fill="var(--color-gold-soft)" />
                <path d="M370 222l40-38 30 26 22-18 56 46v10H370z" fill="#dfdfda" />
              </g>
              <g style={i(5)}>
                {[122, 254, 386].map((x) => (
                  <g key={x}>
                    <rect x={x} y="272" width="120" height="56" rx="10" fill={soft} />
                    <rect x={x + 14} y="288" width="12" height="12" rx="2" fill="var(--color-ink)" />
                    <rect x={x + 14} y="310" width="70" height="6" rx="3" fill={muted} />
                  </g>
                ))}
              </g>
            </g>
          </g>

          {/* Ekran B – sklep internetowy */}
          <g className="screen-b">
            <g className="build">
              <g style={i(0, offset)}>
                <rect x="122" y="62" width="62" height="11" rx="3" fill="var(--color-ink)" />
                <rect x="252" y="58" width="150" height="18" rx="9" fill={soft} stroke="#e2e2de" />
                <circle cx="266" cy="67" r="4" fill="none" stroke={muted} strokeWidth="1.6" />
                <rect x="482" y="57" width="34" height="22" rx="6" fill="var(--color-ink)" />
                <circle cx="516" cy="57" r="7" fill="var(--color-gold)" />
                <rect x="102" y="92" width="436" height="1" fill="#e6e6e2" />
              </g>
              <g style={i(1, offset)}>
                <rect x="122" y="108" width="54" height="18" rx="9" fill="var(--color-ink)" />
                <rect x="184" y="108" width="62" height="18" rx="9" fill="none" stroke="#d4d5d0" strokeWidth="1.5" />
                <rect x="254" y="108" width="56" height="18" rx="9" fill="none" stroke="#d4d5d0" strokeWidth="1.5" />
                <rect x="448" y="110" width="70" height="14" rx="4" fill={soft} />
              </g>
              {[122, 222, 322, 422].map((x, n) => (
                <g key={x} style={i(2 + n, offset)}>
                  <rect x={x} y="140" width="94" height="104" rx="10" fill={soft} />
                  <rect x={x + 22} y="162" width="50" height="60" rx="8" fill="#e2e2dd" />
                  <rect x={x} y="254" width="64" height="7" rx="3.5" fill={muted} />
                  <rect x={x} y="268" width="38" height="9" rx="3" fill="var(--color-ink)" />
                  <circle cx={x + 82} cy="272" r="10" fill="none" stroke="var(--color-ink)" strokeWidth="1.8" />
                  <path d={`M${x + 78} 272h8M${x + 82} 268v8`} stroke="var(--color-ink)" strokeWidth="1.8" />
                </g>
              ))}
              <g style={i(6, offset)}>
                <rect x="122" y="300" width="294" height="30" rx="15" fill={soft} />
                <rect x="138" y="312" width="80" height="7" rx="3.5" fill={muted} />
                <rect x="346" y="310" width="56" height="10" rx="3" fill="var(--color-ink)" />
              </g>
            </g>
          </g>
        </g>

        {/* Kwadracik z logo – prawy dolny róg ekranu */}
        <rect x="486" y="326" width="30" height="30" rx="3" fill="var(--color-gold)" />
      </svg>

      <p className="relative mx-auto -mt-1 flex h-8 w-fit items-center justify-center" aria-hidden="true">
        <span className="chip screen-label-a absolute whitespace-nowrap">
          <span className="size-1.5 rounded-[1px] bg-ink" /> Strona internetowa
        </span>
        <span className="chip screen-label-b absolute whitespace-nowrap opacity-0">
          <span className="size-1.5 rounded-[1px] bg-gold" /> Sklep internetowy
        </span>
      </p>
    </div>
  );
}
