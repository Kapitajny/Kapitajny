import Link from "next/link";
import { company, getDepartment } from "@/content/company";
import { jobOffers, recruitmentSteps, workAreas } from "@/content/careers";
import { mailHref } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { DepartmentContact } from "@/components/ui/ContactCard";
import { DemoNote } from "@/components/ui/DemoNote";
import { siteConfig } from "@/config/site";

export const metadata = pageMetadata({
  title: "Kariera – praca w Zakładzie Mięsnym Wierzejki",
  description:
    "Praca w Wierzejkach: produkcja i magazyn w zakładzie w Płudach, transport oraz sprzedaż w sklepach firmowych w Warszawie i okolicach. Aktualne ogłoszenia i kontakt rekrutacyjny.",
  path: "/kariera",
});

const dateFormat = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });

export default function CareersPage() {
  const secretariat = getDepartment("sekretariat");
  const transport = getDepartment("transport");

  return (
    <>
      <PageIntro
        variant="split"
        media="careers"
        crumbs={[{ href: "/kariera", label: "Kariera" }]}
        title="Praca w Wierzejkach"
        lead={<p>Zakład w Płudach, transport i sklepy firmowe. Praca przy mięsie – w produkcji, w logistyce i przy ladzie.</p>}
      >
        <a href="#oferty" className="btn btn-red">
          Zobacz ogłoszenia
        </a>
      </PageIntro>

      <section aria-labelledby="obszary" className="py-20 lg:py-24">
        <div className="container-x">
          <h2 id="obszary" className="display-lg max-w-[40rem]">
            Gdzie możesz pracować
          </h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {workAreas.map((area) => (
              <li key={area.id} className="border-t-2 border-ink pt-5">
                <p className="ui text-[0.875rem] font-semibold text-red">{area.place}</p>
                <h3 className="display-md mt-2">{area.name}</h3>
                <p className="mt-3 text-muted">{area.description}</p>
                <p className="ui mt-4 text-[0.9375rem]">Stanowiska: {area.roles.join(", ")}</p>
              </li>
            ))}
          </ul>
          <DemoNote className="mt-10">
            Obszary i stanowiska pochodzą z zakładki „Praca” dotychczasowej strony. To nie są aktualne ogłoszenia.
          </DemoNote>
        </div>
      </section>

      <section id="oferty" aria-labelledby="oferty-title" className="scroll-mt-28 bg-surface py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="oferty-title" className="display-lg">
              Aktualne ogłoszenia
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            {jobOffers.length > 0 ? (
              <ul className="border-t border-line">
                {jobOffers.map((offer) => (
                  <li key={offer.slug} className="border-b border-line">
                    <Link href={`/kariera/${offer.slug}`} className="group grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                      <span>
                        <span className="display-sm block group-hover:text-red">{offer.title}</span>
                        <span className="ui text-[0.9375rem] text-muted">
                          {offer.place}, {offer.employmentType}
                        </span>
                      </span>
                      <span className="ui text-[0.875rem] text-muted">
                        Opublikowano {dateFormat.format(new Date(offer.publishedAt))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="border border-dashed border-linen-deep bg-paper p-7">
                <p className="display-sm">Nie ma teraz opublikowanych ogłoszeń</p>
                <p className="mt-2 text-muted">
                  Możesz wysłać zgłoszenie z wyprzedzeniem – w temacie wiadomości wpisz obszar pracy i miejscowość.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={mailHref(company.email, "Zgłoszenie – praca w Wierzejkach")} className="btn btn-red">
                    Wyślij CV na {company.email}
                  </a>
                  {siteConfig.demoMode && (
                    <Link href="/kariera/wzor-ogloszenia" className="btn btn-outline">
                      Podgląd szablonu ogłoszenia
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="jak-aplikowac" className="py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="jak-aplikowac" className="display-lg">
              Jak się zgłosić
            </h2>
          </div>
          <ol className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {recruitmentSteps.map((s, i) => (
              <li key={s.title}>
                <span
                  className="block text-[3rem] font-extrabold leading-none text-red"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {i + 1}
                </span>
                <h3 className="display-sm mt-3">{s.title}</h3>
                <p className="mt-2 text-[1rem] text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="kontakt-rekrutacja" className="border-t border-line py-16 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <h2 id="kontakt-rekrutacja" className="display-md lg:col-span-4">
            Kontakt w sprawie pracy
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            <DepartmentContact department={secretariat} />
            <div>
              <DepartmentContact department={transport} />
              <p className="mt-2 text-[0.9375rem] text-muted">Dla kierowców i pracowników logistyki.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
