import { SERVICES } from "@/data/services";
import { InfoIcon } from "@/components/ui/Icons";
import { Motif } from "@/components/ui/Motifs";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { InquiryLink } from "./InquiryLink";
import { SectionHeading } from "./SectionHeading";

export function Services() {
  const hasUnconfirmed = SERVICES.some((s) => !s.confirmed);

  return (
    <section id="uslugi" aria-labelledby="uslugi-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="uslugi-title" eyebrow="Usługi" className="lg:col-span-6">
            Fizjoterapia i rehabilitacja <em className="italic text-forest">dopasowana do Ciebie</em>
          </SectionHeading>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="lead">
              Każda terapia zaczyna się od rozmowy i oceny. Poniżej znajdziesz obszary, w których możemy pomóc – jeśli nie masz pewności, która forma będzie
              właściwa, po prostu zapytaj.
            </p>
            {hasUnconfirmed && (
              <p className="mt-5 flex items-start gap-2 text-sm text-muted">
                <InfoIcon size={18} className="mt-0.5 shrink-0 text-moss" />
                <span>Zakres usług jest w trakcie potwierdzania przez gabinet. Zapytaj o dostępność wybranej usługi przed wizytą.</span>
              </p>
            )}
          </div>
        </div>

        <ol className="mt-14 border-t border-line lg:mt-20">
          {SERVICES.map((service, i) => (
            <Reveal as="li" key={service.slug} className="border-b border-line">
              <article
                aria-labelledby={`usluga-${service.slug}`}
                className="grid gap-6 py-8 md:grid-cols-12 md:items-center md:gap-8 lg:py-10"
              >
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-sage md:order-last md:col-span-4 lg:col-span-3">
                  {service.image ? (
                    <Photo image={service.image} sizes="(min-width: 1024px) 18rem, (min-width: 768px) 33vw, 92vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-forest">
                      <Motif motif={service.motif ?? "joint"} className="w-[70%] max-w-56" />
                    </div>
                  )}
                </div>

                <div className="md:col-span-8 lg:col-span-9 lg:grid lg:grid-cols-9 lg:gap-8">
                  <div className="flex items-baseline gap-4 lg:col-span-4">
                    <span aria-hidden="true" className="font-serif text-lg italic text-moss tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 id={`usluga-${service.slug}`} className="text-[clamp(1.6rem,1.3rem+1vw,2.15rem)]">
                      {service.title}
                    </h3>
                  </div>
                  <div className="mt-4 lg:col-span-5 lg:mt-0">
                    <p className="text-muted">{service.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-graphite" aria-label="Zakres">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-moss" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <InquiryLink slug={service.slug} title={service.title} />
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
