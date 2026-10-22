"use client";

import { SERVICES, type Service } from "@/data/services";
import { selectService } from "@/lib/inquiry-store";
import { CheckIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "./SectionHeading";

export function Services() {
  const hasUnconfirmed = SERVICES.some((s) => !s.confirmed);

  return (
    <section id="uslugi" aria-labelledby="uslugi-title" className="section-y border-t border-line bg-white">
      <div className="container-x">
        <SectionHeading id="uslugi-title" title="Usługi">
          <p>Każda terapia zaczyna się od rozmowy i oceny. Jeśli nie wiesz, która forma będzie dla Ciebie właściwa, zapytaj – pomożemy wybrać.</p>
          {hasUnconfirmed && <p className="mt-2 text-base">Zakres usług jest w trakcie potwierdzania – przed wizytą zapytaj o dostępność wybranej usługi.</p>}
        </SectionHeading>

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceTile key={service.slug} service={service} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceTile({ service }: { service: Service }) {
  const titleId = `usluga-${service.slug}`;
  return (
    <li className={`flex flex-col overflow-hidden rounded-lg border ${service.image ? "border-line bg-paper" : "border-sage bg-sage"}`}>
      <article aria-labelledby={titleId} className="flex flex-1 flex-col">
        {service.image && (
          <div className="relative aspect-[16/10] bg-sage">
            <Photo image={service.image} sizes="(min-width: 1024px) 24rem, (min-width: 768px) 46vw, 92vw" />
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <h3 id={titleId} className="text-xl">
            {service.title}
          </h3>
          <p className="mb-5 mt-3 text-graphite">{service.summary}</p>
          {service.image ? (
            <p className="text-sm text-muted">Obejmuje: {service.includes.join(", ").toLowerCase()}.</p>
          ) : (
            <ul className="mt-auto space-y-2 border-t border-forest/15 pt-4" aria-label="Obejmuje">
              {service.includes.map((item) => (
                <li key={item} className="flex items-center gap-3 font-medium text-ink">
                  <CheckIcon size={18} strokeWidth={2} className="shrink-0 text-forest" />
                  {item}
                </li>
              ))}
            </ul>
          )}
          <a href="#kontakt" onClick={() => selectService(service.slug)} className={`link self-start pt-5 ${service.image ? "mt-auto" : ""}`}>
            Zapytaj o wizytę<span className="sr-only">: {service.title}</span>
          </a>
        </div>
      </article>
    </li>
  );
}
