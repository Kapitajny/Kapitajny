import Link from "next/link";
import { jobOffers, workAreas } from "@/content/careers";
import { Photo } from "@/components/ui/Photo";

export function CareersTeaser() {
  return (
    <section aria-labelledby="kariera-title" className="bg-surface py-20 lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="relative aspect-[4/5] overflow-hidden bg-linen sm:aspect-[3/2] lg:col-span-5 lg:aspect-auto lg:min-h-[32rem]">
          <Photo media="careers" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:py-4">
          <h2 id="kariera-title" className="display-lg">
            Praca w zakładzie i&nbsp;w&nbsp;sklepach firmowych
          </h2>
          <p className="mt-6 max-w-[34rem] text-ink/85">
            Zatrudniamy w produkcji i magazynie w Płudach, w transporcie oraz przy ladzie w sklepach firmowych w Warszawie i okolicach.
          </p>

          <ul className="mt-9 divide-y divide-line border-y border-line">
            {workAreas.map((area) => (
              <li key={area.id} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <span className="display-sm text-[1.2rem]">{area.name}</span>
                <span className="ui text-[0.9375rem] text-muted">
                  {area.place}: {area.roles.join(", ")}
                </span>
              </li>
            ))}
          </ul>

          <p className="ui mt-6 text-[0.9375rem]">
            {jobOffers.length > 0 ? (
              <>Aktualne ogłoszenia: {jobOffers.length}.</>
            ) : (
              <span className="text-muted">Nie ma teraz opublikowanych ogłoszeń – możesz wysłać zgłoszenie do sekretariatu.</span>
            )}
          </p>
          <Link href="/kariera" className="btn btn-red mt-7">
            Zobacz, jak do nas dołączyć
          </Link>
        </div>
      </div>
    </section>
  );
}
