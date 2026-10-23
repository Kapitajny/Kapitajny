"use client";

import { SERVICES } from "@/data/services";
import { selectService } from "@/lib/inquiry-store";
import { Photo, PhotoCaption } from "@/components/ui/Photo";

const PHOTOS = [
  { image: "serviceOrthopedic", caption: "Ćwiczenie z taśmą oporową" },
  { image: "serviceBack", caption: "Ćwiczenie na piłce z asekuracją" },
  { image: "serviceExercise", caption: "Ćwiczenie stabilizacji tułowia" },
] as const;

export function Services() {
  const hasUnconfirmed = SERVICES.some((s) => !s.confirmed);

  return (
    <section id="uslugi" aria-labelledby="uslugi-title" className="section-y">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_2.2fr] lg:gap-16">
        <div>
          <h2 id="uslugi-title" className="h2">
            Usługi
          </h2>
          <p className="section-intro">Każda terapia zaczyna się od rozmowy i oceny. Nie wiesz, co wybrać? Zapytaj, pomożemy.</p>
          {hasUnconfirmed && <p className="mt-4 text-[0.95rem] text-muted">Zakres usług jest jeszcze potwierdzany. Przed wizytą zapytaj o dostępność.</p>}
        </div>

        <ul className="grid gap-x-12 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <li key={service.slug} className="border-t border-graphite/20 py-6">
              <h3 id={`usluga-${service.slug}`} className="text-[1.2rem]">
                {service.title}
              </h3>
              <p className="mt-2 text-graphite">{service.summary}</p>
              <a href="#kontakt" onClick={() => selectService(service.slug)} className="link mt-3 inline-block">
                Zapytaj o wizytę<span className="sr-only">: {service.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-x mt-12 grid gap-6 sm:grid-cols-3">
        {PHOTOS.map((photo) => (
          <figure key={photo.image}>
            <div className="relative aspect-[3/2] bg-sage">
              <Photo image={photo.image} sizes="(min-width: 640px) 30vw, 92vw" />
            </div>
            <PhotoCaption image={photo.image}>{photo.caption}</PhotoCaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
