import type { CSSProperties } from "react";
import { formatPrice, services } from "@/data/offer";

export function Services() {
  return (
    <section id="uslugi" tabIndex={-1} aria-labelledby="uslugi-title" className="section bg-white outline-none">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-10">
          <h2 id="uslugi-title" className="reveal title-xl md:col-span-6">
            Usługi i cennik
          </h2>
          <p className="reveal max-w-[34rem] text-[1.125rem] text-slate md:col-span-6 md:justify-self-end" style={{ "--d": "120ms" } as CSSProperties}>
            Dwa rodzaje projektów, ten sam sposób pracy: indywidualny projekt, staranna realizacja i wdrożenie gotowej strony.
          </p>
        </div>

        <div className="mt-[clamp(3rem,6vw,5rem)] grid border border-ink/12 md:grid-cols-2">
          {services.map((service, i) => (
            <article
              key={service.id}
              aria-labelledby={`oferta-${service.id}`}
              className="reveal group relative flex flex-col p-7 transition-colors duration-500 hover:bg-cloud/70 sm:p-10 lg:p-14 [&+&]:border-t [&+&]:border-ink/12 md:[&+&]:border-t-0 md:[&+&]:border-l"
              style={{ "--d": `${i * 120}ms` } as CSSProperties}
            >
              {/* Linia światła u góry panelu – reaguje na najechanie. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -top-px h-0.5 origin-left scale-x-0 bg-sky transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100"
              />
              <h3 id={`oferta-${service.id}`} className="wide text-[clamp(1.5rem,2.2vw,1.875rem)]">
                {service.name}
              </h3>
              <p className="mt-4 max-w-[30rem] text-slate">{service.description}</p>

              <p className="mt-10 flex flex-wrap items-baseline gap-x-3">
                <span className="text-[1.125rem] text-slate">od</span>
                <span className="wide text-[clamp(3.25rem,6vw,5rem)] leading-none font-medium tracking-[-0.035em]">
                  {formatPrice(service.price)}&nbsp;zł
                </span>
                <span className="text-[1.125rem] text-slate">netto</span>
              </p>

              <h4 className="sr-only">Zakres</h4>
              <ul className="mt-10 mb-12 border-t border-ink/10">
                {service.scope.map((item) => (
                  <li key={item} className="flex items-center gap-4 border-b border-ink/10 py-3.5">
                    <span aria-hidden="true" className="h-px w-4 shrink-0 bg-sky" />
                    {item}
                  </li>
                ))}
              </ul>

              <a href="#kontakt" data-project={service.project} className="btn btn-ink mt-auto self-start">
                {service.cta}
              </a>
            </article>
          ))}
        </div>

        <p className="reveal mt-6 max-w-[52rem] text-[0.9375rem] text-slate">
          Podane kwoty to ceny minimalne. Ostateczna wycena zależy od zakresu projektu i jest ustalana indywidualnie przed rozpoczęciem prac – razem
          z listą funkcji, które znajdą się na stronie lub w sklepie.
        </p>
      </div>
    </section>
  );
}
