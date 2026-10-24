import Link from "next/link";
import { company, getDepartment } from "@/content/company";
import { wholesalePoints } from "@/content/locations";
import { mailHref, telHref } from "@/lib/format";
import { directionsUrl } from "@/lib/maps";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { DemoNote } from "@/components/ui/DemoNote";
import { ExternalIcon, PhoneIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";

export const metadata = pageMetadata({
  title: "Gdzie kupić – hurtownie i sklepy firmowe",
  description:
    "Hurtownie firmowe Zakładu Mięsnego Wierzejki w Siedlcach, Łukowie, Otwocku i Warszawie oraz kontakt w sprawie najbliższego sklepu firmowego.",
  path: "/siec-sprzedazy",
});

export default function SalesNetworkPage() {
  const sales = getDepartment("zbyt");
  const secretariat = getDepartment("sekretariat");

  return (
    <>
      <PageIntro
        crumbs={[{ href: "/siec-sprzedazy", label: "Sieć sprzedaży" }]}
        title="Gdzie kupić"
        lead={<p>Cztery hurtownie firmowe dla odbiorców z Mazowsza i Lubelszczyzny. Adres najbliższego sklepu firmowego poda sekretariat.</p>}
      />

      <section aria-labelledby="hurtownie" className="py-14 lg:py-20">
        <div className="container-x">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 id="hurtownie" className="display-lg">
              Hurtownie firmowe
            </h2>
            <p className="ui text-[0.9375rem] text-muted">
              Godziny otwarcia i zamówienia:{" "}
              <a href={telHref(sales.phones[0].display)} className="link font-semibold text-ink">
                Dział Zbytu {sales.phones[0].display}
              </a>
            </p>
          </div>

          <ul className="mt-10 grid gap-px border-y border-line bg-line sm:grid-cols-2">
            {wholesalePoints.map((point) => (
              <li key={point.slug} className="flex flex-col bg-paper py-8 sm:p-8">
                <p className="ui text-[0.875rem] font-semibold text-red">Hurtownia</p>
                <h3 className="display-lg mt-1">{point.city}</h3>
                <p className="lead mt-2">{point.street}</p>
                <p className="ui mt-3 text-[0.9375rem] text-muted">{point.services.map((service, i) => (i === 0 ? service : service.charAt(0).toLowerCase() + service.slice(1))).join(", ")}</p>
                <div className="ui mt-6 flex flex-wrap gap-2">
                  <a href={directionsUrl(point.mapsQuery)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    Trasa
                    <ExternalIcon size={15} />
                    <span className="sr-only">do: {point.street}, {point.city} (Mapy Google, nowa karta)</span>
                  </a>
                  <Link href={`/siec-sprzedazy/${point.slug}`} className="btn btn-ink btn-sm">
                    Szczegóły i mapa<span className="sr-only">: {point.name}</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="sklepy-firmowe" className="border-t border-line bg-surface py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <figure className="lg:col-span-6">
            <div className="relative aspect-[3/2] overflow-hidden bg-linen">
              <Photo media="shop" sizes="(min-width: 1024px) 46vw, 100vw" />
            </div>
            <figcaption className="ui mt-3 text-[0.8125rem] text-muted">Stoisko patronackie Wierzejki – mięso, wędliny, drób</figcaption>
          </figure>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 id="sklepy-firmowe" className="display-lg">
              Sklepy firmowe
            </h2>
            <p className="mt-5">
              Wyroby z Wierzejek kupisz w sklepach firmowych i na stoiskach patronackich. Zadzwoń lub napisz do sekretariatu – podamy adres
              sklepu najbliżej Ciebie.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a href={telHref(secretariat.phones[0].display)} className="btn btn-red">
                <PhoneIcon size={18} />
                {secretariat.phones[0].display}
              </a>
              <a href={mailHref(company.email, "Adres najbliższego sklepu firmowego")} className="btn btn-outline">
                {company.email}
              </a>
            </div>
            <DemoNote className="mt-8">
              Firma nie publikuje dziś listy sklepów, a wpisy w katalogach internetowych bywają nieaktualne. Gdy firma przekaże listę, sklepy
              można dodać w pliku <code>src/content/locations.ts</code>.
            </DemoNote>
          </div>
        </div>
      </section>

      <section aria-labelledby="dla-firm" className="py-14 lg:py-20">
        <div className="container-x flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="dla-firm" className="display-md">
              Kupujesz dla firmy?
            </h2>
            <p className="mt-2 max-w-[34rem] text-muted">Dostawy własnym transportem na terenie województw lubelskiego i mazowieckiego.</p>
          </div>
          <Link href="/dla-biznesu" className="btn btn-outline self-start md:self-auto">
            Oferta dla biznesu
          </Link>
        </div>
      </section>
    </>
  );
}
