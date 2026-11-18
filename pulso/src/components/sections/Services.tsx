"use client";

import { useEffect, useRef, useState } from "react";
import { services } from "@/data/services";
import { channelStyle } from "@/lib/channels";
import { ContactLink, Arrow } from "@/components/ui/ContactLink";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { Check } from "@/components/ui/Icons";
import { Placement } from "./Placement";

export function Services() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="uslugi" aria-labelledby="uslugi-tytul" className="section">
      <div className="container-plan">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="uslugi-tytul" className="t-h2 lg:col-span-7">
            Cztery kanały. Prowadzimy te, które mają sens dla Twojej firmy.
          </h2>
          <p className="t-lead lg:col-span-4 lg:col-start-9 lg:self-end">
            Nie każda platforma pasuje do każdego biznesu. Przy każdym kanale piszemy wprost, kiedy działa, a kiedy lepiej
            zacząć gdzie indziej.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12">
          {/* Scena: gdzie wyświetla się reklama aktywnego kanału */}
          <div className="hidden lg:col-span-5 lg:block" aria-hidden="true">
            <div className="sticky top-[calc(var(--nav-h)+3rem)]">
              <div className="relative grid h-[min(70vh,36rem)] place-items-center overflow-hidden rounded-[10px] border border-rule bg-paper-2">
                <div className="week-grid absolute inset-0 opacity-70" style={{ "--weeks": 8 } as React.CSSProperties} />
                {services.map((s, i) => (
                  <div
                    key={s.id}
                    className="absolute inset-0 grid place-items-center p-10 transition-[opacity,transform] duration-500 ease-(--ease-out-expo) motion-reduce:transition-none"
                    style={{ opacity: active === i ? 1 : 0, transform: active === i ? "none" : "translateY(12px)" }}
                  >
                    <Placement id={s.id} />
                  </div>
                ))}
                <div className="absolute inset-x-0 bottom-0 flex border-t border-rule bg-paper">
                  {services.map((s, i) => (
                    <span key={s.id} className="flex flex-1 items-center gap-2 px-3 py-2.5 text-xs font-[620]" style={channelStyle(s.id)}>
                      <span className="flight block h-2 w-6" data-state={active === i ? "booked" : "tentative"} />
                      <span className={active === i ? "text-ink" : "text-ink-3"}>{s.channel}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {services.map((s, i) => (
              <article
                key={s.id}
                id={`usluga-${s.id}`}
                data-index={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                aria-labelledby={`usluga-${s.id}-tytul`}
                className="scroll-mt-28 border-t border-rule py-12 first:border-t-0 first:pt-0 lg:py-20 lg:first:pt-0"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-rule bg-sheet">
                    <PlatformIcon id={s.id} className="h-5 w-5" />
                  </span>
                  <span className="flight block h-3 w-12" style={channelStyle(s.id)} data-state="booked" aria-hidden="true" />
                </div>
                <h3 id={`usluga-${s.id}-tytul`} className="t-h2 mt-5 !text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)]">
                  {s.name}
                </h3>
                <p className="mt-1 text-[0.9375rem] font-[560] text-ink-3">{s.where}</p>
                <p className="mt-5 max-w-[56ch] text-[1.1875rem] leading-[1.6] text-ink-2">{s.description}</p>

                <div className="mt-8 lg:hidden" aria-hidden="true">
                  <div className="week-grid -mx-[var(--gutter)] grid place-items-center bg-paper-2 px-5 py-8" style={{ "--weeks": 8 } as React.CSSProperties}>
                    <Placement id={s.id} />
                  </div>
                </div>

                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  <div>
                    <h4 className="t-col !text-ink">Kiedy ma sens</h4>
                    <ul className="mt-3 space-y-2.5">
                      {s.useCases.map((u) => (
                        <li key={u} className="flex gap-3 text-[0.9875rem] leading-snug text-ink-2">
                          <span className="mt-[0.45em] h-1.5 w-3 shrink-0 rounded-full" style={{ background: "var(--flight-color)", ...channelStyle(s.id) }} />
                          {u}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="t-col !text-ink">Co zyskujesz</h4>
                    <ul className="mt-3 space-y-2.5">
                      {s.benefits.map((b) => (
                        <li key={b} className="flex gap-3 text-[0.9875rem] leading-snug text-ink-2">
                          <Check className="mt-[0.2em] h-4 w-4 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-8 max-w-[60ch] rounded-md border border-dashed border-field px-4 py-3 text-[0.9375rem] leading-snug text-ink-2">
                  <span className="font-[660] text-ink">Kiedy to nie jest dobry wybór: </span>
                  {s.notFor}
                </p>

                <ContactLink className="btn btn-secondary mt-8" services={[s.id]}>
                  Zapytaj o {s.name} <Arrow />
                </ContactLink>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
