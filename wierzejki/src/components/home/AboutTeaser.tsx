import Link from "next/link";
import { company } from "@/content/company";
import { Photo } from "@/components/ui/Photo";

export function AboutTeaser() {
  return (
    <section aria-labelledby="o-firmie-title" className="py-20 lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-6">
          <p
            aria-hidden="true"
            data-numeral="1991"
            className="select-none before:content-[attr(data-numeral)] text-[clamp(6rem,3rem+14vw,15rem)] font-extrabold leading-[0.8] text-linen-deep"
            style={{ fontFamily: "var(--font-serif)" }}
          />
          <figure className="relative -mt-10 w-[88%] sm:-mt-16 lg:-mt-20 lg:ml-[12%]">
            <div className="relative aspect-[4/3] overflow-hidden bg-linen">
              <Photo media="aboutPlant" sizes="(min-width: 1024px) 42vw, 88vw" />
            </div>
            <figcaption className="ui mt-3 text-[0.8125rem] text-muted">Zakład w Płudach, gmina Trzebieszów</figcaption>
          </figure>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:pt-10">
          <h2 id="o-firmie-title" className="display-lg">
            Firma, która wyrosła z&nbsp;Wierzejek
          </h2>
          <div className="mt-7 max-w-[36rem] space-y-4">
            <p>
              Zakład założyli w grudniu {company.foundedYear} roku bracia {company.founders} – w rodzinnej miejscowości, od której firma wzięła
              nazwę. Dziś działa jako spółka jawna z siedzibą w Płudach, w gminie Trzebieszów.
            </p>
            <p>
              Nowy zakład powstawał w trzech etapach, w latach 2004–2008. W jednym miejscu odbywa się ubój, rozbiór i przetwórstwo, a gotowe
              wyroby trafiają do sklepów firmowych i hurtowni.
            </p>
          </div>

          <dl className="ui mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 text-[0.9375rem]">
            <div>
              <dt className="text-muted">Siedziba</dt>
              <dd className="mt-0.5 font-semibold">Płudy, powiat łukowski</dd>
            </div>
            <div>
              <dt className="text-muted">Zakres</dt>
              <dd className="mt-0.5 font-semibold">ubój, rozbiór, przetwórstwo</dd>
            </div>
            <div>
              <dt className="text-muted">Sprzedaż</dt>
              <dd className="mt-0.5 font-semibold">sklepy firmowe i hurt</dd>
            </div>
            <div>
              <dt className="text-muted">Dostawy</dt>
              <dd className="mt-0.5 font-semibold">lubelskie i mazowieckie</dd>
            </div>
          </dl>

          <Link href="/o-firmie/historia" className="btn btn-outline mt-10">
            Poznaj historię Wierzejek
          </Link>
        </div>
      </div>
    </section>
  );
}
