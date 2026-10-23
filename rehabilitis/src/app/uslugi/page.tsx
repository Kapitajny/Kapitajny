import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { SERVICES } from "@/data/services";
import { PRICES_ARE_EXAMPLES, priceForService } from "@/data/pricing";
import { Conditions } from "@/components/sections/Conditions";
import { CtaBand } from "@/components/sections/CtaBand";
import { InquiryButton } from "@/components/sections/InquiryButton";
import { PageIntro } from "@/components/sections/PageIntro";
import { Photo, PhotoCaption } from "@/components/ui/Photo";

export const metadata: Metadata = pageMetadata({
  title: "Usługi – fizjoterapia, rehabilitacja ortopedyczna i pooperacyjna, masaż leczniczy",
  description: "Fizjoterapia indywidualna, rehabilitacja ortopedyczna i pooperacyjna, terapia bólu pleców i karku, masaż leczniczy i ćwiczenia usprawniające. Opis usług, czas wizyt i ceny.",
  path: "/uslugi",
});

export default function ServicesPage() {
  const hasUnconfirmed = SERVICES.some((s) => !s.confirmed);

  return (
    <>
      <PageIntro
        title="Usługi"
        lead="Każda terapia zaczyna się od rozmowy i oceny. Poniżej opisujemy, z czym zgłaszają się pacjenci, jak wygląda wizyta, ile trwa i ile kosztuje."
        aside={
          hasUnconfirmed ? (
            <p className="border-l-4 border-brand bg-brand-soft px-4 py-3 text-small">
              Zakres usług jest jeszcze potwierdzany przez gabinet. Przed wizytą zapytaj o dostępność wybranej usługi.
            </p>
          ) : undefined
        }
      />

      <div className="page grid gap-10 py-section lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-labelledby="spis-uslug" className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="spis-uslug" className="text-small font-bold tracking-normal text-muted">
            Na tej stronie
          </h2>
          <ul className="mt-3 grid gap-x-6 border-t border-line sm:grid-cols-2 lg:grid-cols-1">
            {SERVICES.map((service) => (
              <li key={service.slug} className="border-b border-line">
                <a href={`#${service.slug}`} className="flex min-h-11 items-center py-1 text-small text-ink hover:text-brand hover:underline">
                  {service.title}
                </a>
              </li>
            ))}
            <li className="border-b border-line">
              <a href="#dolegliwosci" className="flex min-h-11 items-center py-1 text-small font-bold text-brand hover:underline">
                Z czym możesz przyjść?
              </a>
            </li>
          </ul>
        </nav>

        <div className="space-y-20 lg:space-y-24">
          {SERVICES.map((service, i) => {
            const price = priceForService(service.slug);
            return (
              <section key={service.slug} id={service.slug} aria-labelledby={`${service.slug}-title`} className="scroll-mt-28">
                <div className={`grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] xl:gap-12 ${i % 2 ? "xl:[&>figure]:order-first" : ""}`}>
                  <div>
                    <h2 id={`${service.slug}-title`} className="text-h2">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-lead">{service.description}</p>

                    <h3 className="mt-8 text-small font-bold tracking-normal text-brand">Z czym zgłaszają się pacjenci</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-brand">
                      {service.forWhom.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <h3 className="mt-6 text-small font-bold tracking-normal text-brand">Jak wygląda wizyta</h3>
                    <p className="mt-2">{service.howItWorks}</p>

                    <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                      {price ? (
                        <p className="tabular-nums">
                          <span className="font-bold text-brand-strong">
                            {price.from ? "od " : ""}
                            {price.price}
                          </span>
                          {price.duration && <span className="text-muted">, {price.duration}</span>}
                          {PRICES_ARE_EXAMPLES && <span className="block text-caption text-muted">cena przykładowa</span>}
                        </p>
                      ) : (
                        <span />
                      )}
                      <InquiryButton slug={service.slug} title={service.title} />
                    </div>
                  </div>
                  <figure>
                    <div className="media aspect-[4/3]">
                      <Photo image={service.image} sizes="(min-width: 1280px) 30rem, (min-width: 1024px) 60vw, 92vw" />
                    </div>
                    <PhotoCaption image={service.image} />
                  </figure>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <div className="border-t border-line bg-white">
        <Conditions />
      </div>
      <CtaBand />
    </>
  );
}
