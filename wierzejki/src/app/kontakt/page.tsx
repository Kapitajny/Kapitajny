import { company, departments, fullAddress } from "@/content/company";
import { mailHref, telHref } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { isContactConfigured } from "@/lib/server/delivery";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";
import { MapEmbed } from "@/components/locations/MapEmbed";
import { DepartmentContact } from "@/components/ui/ContactCard";
import { DemoNote } from "@/components/ui/DemoNote";
import { MailIcon, PhoneIcon } from "@/components/ui/Icons";

export const metadata = pageMetadata({
  title: "Kontakt",
  description:
    "Kontakt z Zakładem Mięsnym Wierzejki, Płudy 21, 21-404 Trzebieszów: sekretariat, Dział Zbytu, Dział Handlu i Eksportu, Dział Skupu Żywca i Dział Transportu.",
  path: "/kontakt",
});

export default function ContactPage() {
  return (
    <>
      <header className="border-b border-line">
        <div className="container-x py-10 lg:py-14">
          <Breadcrumbs items={[{ href: "/kontakt", label: "Kontakt" }]} />
          <div className="mt-8 grid gap-10 lg:mt-14 lg:grid-cols-12">
            <h1 className="display-xl lg:col-span-6">Kontakt</h1>
            <div className="ui grid gap-6 sm:grid-cols-2 lg:col-span-6 lg:pt-3">
              <a href={telHref(company.phone)} className="group border-t-2 border-ink pt-4">
                <span className="flex items-center gap-2 text-[0.875rem] text-muted">
                  <PhoneIcon size={16} className="text-red" /> Sekretariat
                </span>
                <span className="display-md mt-2 block group-hover:text-red">{company.phone}</span>
              </a>
              <a href={mailHref(company.email)} className="group border-t-2 border-ink pt-4">
                <span className="flex items-center gap-2 text-[0.875rem] text-muted">
                  <MailIcon size={16} className="text-red" /> E-mail
                </span>
                <span className="display-md mt-2 block break-all group-hover:text-red">{company.email}</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="dzialy" className="py-16 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="dzialy" className="display-lg">
              Działy
            </h2>
            <p className="mt-4 text-muted">Wybierz dział, którego dotyczy Twoja sprawa – skrócisz drogę do odpowiedzi.</p>
          </div>
          <ul className="grid gap-px bg-line sm:grid-cols-2 lg:col-span-8">
            {departments.map((d) => (
              <li key={d.id} className="bg-paper py-7 sm:p-7">
                <DepartmentContact department={d} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="formularz" className="bg-surface py-16 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="formularz" className="display-lg">
              Napisz do nas
            </h2>
            <p className="mt-4 text-muted">
              Wybierz temat – dla zapytań handlowych formularz poprosi dodatkowo o dane firmy.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm
              variant="general"
              defaultTopic="inne"
              configured={isContactConfigured()}
              fallback={
                <p>
                  Sekretariat:{" "}
                  <a href={telHref(company.phone)} className="link font-semibold">
                    {company.phone}
                  </a>
                  ,{" "}
                  <a href={mailHref(company.email)} className="link font-semibold">
                    {company.email}
                  </a>
                </p>
              }
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="siedziba" className="py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="siedziba" className="display-lg">
              Siedziba
            </h2>
            <address className="mt-6 not-italic">
              <p className="ui font-semibold">{company.legalName}</p>
              <p className="mt-1">{fullAddress}</p>
              <p className="mt-1 text-muted">
                {company.address.county}, {company.address.region}
              </p>
              <p className="ui mt-4 text-[0.9375rem] text-muted">
                KRS {company.registry.krs}
                <br />
                NIP {company.registry.nip}
                <br />
                faks {company.fax}
              </p>
            </address>
            <DemoNote className="mt-8">
              Numery i adresy przeniesiono z zakładki „Kontakt” dotychczasowej strony. Przed publikacją każdy z nich musi potwierdzić firma.
            </DemoNote>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <MapEmbed query={`${company.address.street}, ${company.address.postalCode} ${company.address.city}`} label="Siedziba firmy w Płudach" />
          </div>
        </div>
      </section>
    </>
  );
}
