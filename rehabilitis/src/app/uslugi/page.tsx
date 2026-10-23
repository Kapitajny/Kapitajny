import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { SERVICES } from "@/data/services";
import { PRICES_ARE_EXAMPLES, priceForService } from "@/data/pricing";
import { Breadcrumb } from "@/components/sections/Breadcrumb";
import { ContactStrip } from "@/components/sections/ContactStrip";
import { InquiryButton } from "@/components/sections/InquiryButton";
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
      <header className="content pt-10 lg:pt-16">
        <Breadcrumb current="Usługi" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
          <h1 className="text-display">Usługi</h1>
          <div className="space-y-4">
            <p className="text-lead">Każda terapia zaczyna się od rozmowy i oceny. Wybierz usługę, żeby przeczytać, jak wygląda wizyta i ile kosztuje.</p>
            {hasUnconfirmed && (
              <p className="rounded-field bg-mint px-4 py-3 text-small">Zakres usług jest jeszcze potwierdzany przez gabinet. Przed wizytą zapytaj o dostępność wybranej usługi.</p>
            )}
          </div>
        </div>

        {/* Spis usług jako stykówka zdjęć – każda miniatura prowadzi do opisu niżej */}
        <nav aria-label="Usługi na tej stronie" className="mt-12">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 xl:grid-cols-6">
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <a href={`#${service.slug}`} className="group block">
                  <span className="photo block aspect-[4/3]">
                    <Photo image={service.image} decorative sizes="(min-width: 1280px) 11rem, (min-width: 768px) 30vw, 45vw" />
                  </span>
                  <span className="mt-3 block text-small font-semibold leading-snug text-ink group-hover:text-brand-deep group-hover:underline">{service.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="content py-section">
        {SERVICES.map((service) => {
          const price = priceForService(service.slug);
          return (
            <section
              key={service.slug}
              id={service.slug}
              aria-labelledby={`${service.slug}-title`}
              className="grid gap-8 border-t border-line py-12 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-16"
            >
              {/* Lewa kolumna: nazwa, cena, opis i działanie; prawa: zdjęcie i szczegóły */}
              <div>
                <h2 id={`${service.slug}-title`} className="text-h2">
                  {service.title}
                </h2>
                {price && (
                  <p className="mt-6 flex items-baseline gap-3 tabular-nums">
                    <span className="text-h3 type-condensed">
                      {price.from ? "od " : ""}
                      {price.price}
                    </span>
                    {price.duration && <span className="text-muted">{price.duration}</span>}
                    {PRICES_ARE_EXAMPLES && <span className="text-caption text-muted">cena przykładowa</span>}
                  </p>
                )}
                <p className="mt-6 max-w-prose text-lead">{service.description}</p>
                <div className="mt-8">
                  <InquiryButton slug={service.slug} title={service.title} />
                </div>
              </div>

              <div>
                <figure>
                  <div className="photo aspect-[3/2]">
                    <Photo image={service.image} sizes="(min-width: 1280px) 38rem, (min-width: 1024px) 50vw, 92vw" />
                  </div>
                  <PhotoCaption image={service.image} />
                </figure>
                <div className="mt-8 grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="text-h4 type-plain">Z czym zgłaszają się pacjenci</h3>
                    <ul className="mt-3 space-y-2">
                      {service.forWhom.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-h4 type-plain">Jak wygląda wizyta</h3>
                    <p className="mt-3">{service.howItWorks}</p>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        <p className="mt-4 rounded-photo bg-mint p-6 md:p-8">
          Nie wiesz, która usługa jest dla Ciebie?{" "}
          <Link href="/#dolegliwosci" className="link">
            Wybierz okolicę ciała, która Ci dokucza
          </Link>{" "}
          albo umów pierwszą wizytę. Plan ustalimy po ocenie.
        </p>
      </div>

      <ContactStrip />
    </>
  );
}
