"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { portfolio } from "@/data/demo";
import { services } from "@/data/services";
import { ContactLink, Arrow } from "@/components/ui/ContactLink";
import { MiniPlan } from "./MiniPlan";

/**
 * Portfolio jako stos arkuszy planu w przestrzeni 3D. Aktywny arkusz jest z przodu, pozostałe
 * odsunięte w głąb. Wszystkie projekty są demonstracyjne i tak oznaczone.
 */
export function Portfolio() {
  const [active, setActive] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [motionOk, setMotionOk] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = portfolio.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover)");
    const update = () => setMotionOk(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const go = (i: number, focus = false) => {
    const next = (i + n) % n;
    setActive(next);
    setTilt({ x: 0, y: 0 });
    if (focus) tabRefs.current[next]?.focus();
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const target: Record<string, number> = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: n - 1 };
    if (!(e.key in target)) return;
    e.preventDefault();
    go(target[e.key], true);
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!motionOk) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 5, y: px * 7 });
  };

  return (
    <section id="portfolio" aria-labelledby="portfolio-tytul" className="section overflow-hidden border-t border-rule bg-paper-2">
      <div className="container-plan grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <h2 id="portfolio-tytul" className="t-h2">
            Tak wygląda plan, zanim ruszy kampania.
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-2">
            PULSO dopiero buduje portfolio. Zamiast wymyślonych realizacji pokazujemy trzy{" "}
            <strong className="font-[660] text-ink">projekty demonstracyjne</strong>: przykłady planów, jakie przygotowujemy dla
            różnych branż.
          </p>

          <div role="tablist" aria-label="Projekty demonstracyjne" className="mt-8 flex flex-col border-t border-rule">
            {portfolio.map((p, i) => (
              <button
                key={p.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`projekt-tab-${p.id}`}
                aria-selected={active === i}
                aria-controls={`projekt-${p.id}`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => go(i)}
                onKeyDown={onTabKey}
                className={`flex min-h-14 items-center justify-between gap-4 border-b border-rule text-left transition-colors ${
                  active === i ? "text-ink" : "text-ink-3 hover:text-ink"
                }`}
              >
                <span className="flex flex-col py-2">
                  <span className="text-[1.0625rem] font-[640]">{p.name}</span>
                  <span className="text-sm">{p.industry}</span>
                </span>
                <span className={`h-6 w-0.5 rounded-full bg-ink transition-opacity ${active === i ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <button type="button" className="btn btn-secondary btn-sm !px-0 w-11" onClick={() => go(active - 1)} aria-label="Poprzedni projekt">
              <Arrow className="rotate-180" />
            </button>
            <button type="button" className="btn btn-secondary btn-sm !px-0 w-11" onClick={() => go(active + 1)} aria-label="Następny projekt">
              <Arrow />
            </button>
            <span className="tnum ml-2 text-sm text-ink-3" aria-live="polite">
              {active + 1} z {n}
            </span>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div
            className="relative mx-auto h-[38rem] max-w-[40rem] [perspective:1800px] sm:h-[36rem]"
            onPointerMove={onMove}
            onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          >
            {portfolio.map((p, i) => {
              let offset = i - active;
              if (offset > n / 2) offset -= n;
              if (offset < -n / 2) offset += n;
              const isActive = offset === 0;
              const depth = Math.abs(offset);
              const transform = isActive
                ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                : `translateX(${offset * 9}%) translateZ(${-depth * 160}px) rotateY(${offset * -16}deg)`;
              return (
                <article
                  key={p.id}
                  id={`projekt-${p.id}`}
                  role="tabpanel"
                  aria-labelledby={`projekt-tab-${p.id}`}
                  aria-hidden={!isActive}
                  inert={!isActive}
                  onClick={() => !isActive && go(i)}
                  className="absolute inset-0 flex flex-col rounded-[10px] border border-rule bg-sheet p-5 shadow-(--shadow-sheet) transition-[transform,opacity,filter] duration-700 ease-(--ease-out-expo) sm:p-7"
                  style={{
                    transform,
                    zIndex: 10 - depth,
                    opacity: depth > 1 ? 0 : isActive ? 1 : 0.7,
                    filter: isActive ? "none" : "saturate(0.4)",
                    transformStyle: "preserve-3d",
                    transitionDuration: isActive && (tilt.x || tilt.y) ? "200ms" : undefined,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="stamp-demo text-youtube">Projekt demonstracyjny</span>
                    <span className="text-right text-sm text-ink-3">{p.industry}</span>
                  </div>
                  <h3 className="t-h3 mt-5">{p.name}</h3>
                  <dl className="mt-4 grid gap-3 text-[0.9375rem] sm:grid-cols-[7rem_1fr]">
                    <dt className="t-col pt-0.5">Cel kampanii</dt>
                    <dd className="leading-snug text-ink-2">{p.goal}</dd>
                    <dt className="t-col pt-0.5">Platformy</dt>
                    <dd className="leading-snug text-ink-2">{p.platforms.map((id) => services.find((s) => s.id === id)!.name).join(", ")}</dd>
                    <dt className="t-col pt-0.5">Strategia</dt>
                    <dd className="leading-snug text-ink-2">{p.strategy}</dd>
                  </dl>
                  <div className="mt-auto pt-5">
                    <MiniPlan flights={p.flights} label={`Plan emisji projektu ${p.name} na 8 tygodni`} />
                    <ContactLink className="btn btn-primary btn-sm mt-4" services={p.platforms}>
                      Chcę podobny plan <Arrow />
                    </ContactLink>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
