import Link from "next/link";
import type { ReactNode } from "react";
import type { JobOffer } from "@/content/careers";
import { mailHref } from "@/lib/format";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArrowLeft } from "@/components/ui/Icons";

const dateFormat = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });

/** Treść list w ogłoszeniu – w szablonie zamiast nich wyświetlane są pola do uzupełnienia. */
function OfferList({ items, placeholder }: { items: string[]; placeholder?: ReactNode }) {
  if (placeholder) return <div className="mt-4 border border-dashed border-linen-deep bg-surface p-5 text-muted">{placeholder}</div>;
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 bg-red" />
          {i}
        </li>
      ))}
    </ul>
  );
}

export function JobOfferView({ offer, template }: { offer: JobOffer; template?: boolean }) {
  const slot = (label: string) => (template ? <>Treść uzupełnia dział kadr: {label}.</> : undefined);
  return (
    <article>
      <header className="border-b border-line">
        <div className="container-x py-10 lg:py-14">
          <Breadcrumbs
            items={[
              { href: "/kariera", label: "Kariera" },
              { href: template ? "/kariera/wzor-ogloszenia" : `/kariera/${offer.slug}`, label: offer.title },
            ]}
          />
          <p className="ui mt-8 text-[0.9375rem] font-semibold text-red lg:mt-14">
            {offer.place}, {offer.employmentType}
          </p>
          <h1 className="display-xl mt-2">{offer.title}</h1>
          <p className="lead mt-5 max-w-[40rem]">{offer.summary}</p>
        </div>
      </header>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
        <div className="space-y-12 lg:col-span-7">
          <section>
            <h2 className="display-md">Zakres obowiązków</h2>
            <OfferList items={offer.responsibilities} placeholder={slot("zakres obowiązków")} />
          </section>
          <section>
            <h2 className="display-md">Oczekujemy</h2>
            <OfferList items={offer.requirements} placeholder={slot("wymagania")} />
          </section>
          <section>
            <h2 className="display-md">Oferujemy</h2>
            <OfferList items={offer.offer} placeholder={slot("forma zatrudnienia i świadczenia")} />
          </section>
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="border-t-2 border-ink pt-5 lg:sticky lg:top-28">
            <dl className="ui space-y-3 text-[0.9375rem]">
              <div>
                <dt className="text-muted">Miejsce pracy</dt>
                <dd className="font-semibold">{offer.place}</dd>
              </div>
              <div>
                <dt className="text-muted">Opublikowano</dt>
                <dd className="font-semibold">{template ? "data publikacji" : dateFormat.format(new Date(offer.publishedAt))}</dd>
              </div>
              {(offer.validUntil || template) && (
                <div>
                  <dt className="text-muted">Zgłoszenia do</dt>
                  <dd className="font-semibold">{template || !offer.validUntil ? "termin" : dateFormat.format(new Date(offer.validUntil))}</dd>
                </div>
              )}
            </dl>
            {template ? (
              <p className="btn btn-red mt-6 w-full cursor-default opacity-70">Aplikuj (aktywne w opublikowanym ogłoszeniu)</p>
            ) : (
              <a href={mailHref(offer.applyEmail, `Zgłoszenie: ${offer.title}`)} className="btn btn-red mt-6 w-full">
                Aplikuj e-mailem
              </a>
            )}
            <Link href="/kariera" className="btn btn-outline mt-3 w-full">
              <ArrowLeft size={18} />
              Wszystkie ogłoszenia
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
