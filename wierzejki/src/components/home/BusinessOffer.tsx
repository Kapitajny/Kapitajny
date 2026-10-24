import Link from "next/link";
import { company, getDepartment } from "@/content/company";
import { wholesalePoints } from "@/content/locations";
import { listPl, telHref } from "@/lib/format";
import { PhoneIcon } from "@/components/ui/Icons";

const audiences = [
  { title: "Odbiorcy hurtowi", text: "Hurtownie i dystrybutorzy kupujący mięso, wędliny i garmażerkę w większych partiach." },
  { title: "Sklepy i punkty sprzedaży", text: "Sklepy spożywcze i mięsne, które chcą mieć w ofercie wyroby z Wierzejek." },
  { title: "Gastronomia i instytucje", text: "Hotele, restauracje, szkoły i stołówki zaopatrywane kompleksowo, z jednego miejsca." },
  { title: "Partnerzy handlowi", text: "Sieci i firmy zainteresowane współpracą w kraju i za granicą." },
];

export function BusinessOffer() {
  const sales = getDepartment("zbyt");
  const trade = getDepartment("handel-eksport");
  return (
    <section aria-labelledby="biznes-title" className="on-dark bg-green py-20 text-on-dark lg:py-28">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="ui text-[0.9375rem] font-medium text-green-mist">Oferta dla biznesu</p>
          <h2 id="biznes-title" className="display-lg mt-4 max-w-[42rem]">
            Zaopatrujemy hotele, restauracje, szkoły, stołówki i&nbsp;hurtownie
          </h2>
          <p className="lead mt-6 max-w-[38rem] text-on-dark/85">
            Mięso, wędliny i wyroby garmażeryjne z jednego zakładu. Własne samochody docierają na terenie województw lubelskiego i
            mazowieckiego, a cztery hurtownie firmowe działają w {listPl(wholesalePoints.map((w) => w.cityLocative))}.
          </p>

          <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {audiences.map((a) => (
              <li key={a.title} className="border-t border-on-dark/20 pt-5">
                <h3 className="display-sm text-[1.3rem]">{a.title}</h3>
                <p className="mt-2 text-[1rem] text-on-dark/75">{a.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside aria-label="Kontakt handlowy" className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <div className="bg-on-dark p-7 text-ink sm:p-8">
            <h3 className="display-sm">Z kim rozmawiać</h3>
            <p className="mt-2 text-[1rem] text-muted">Warunki współpracy ustalamy indywidualnie – zacznij od rozmowy z działem handlowym.</p>
            <dl className="ui mt-6 space-y-5">
              {[sales, trade].map((d) => (
                <div key={d.id} className="border-t border-line pt-4">
                  <dt className="text-[0.875rem] text-muted">{d.name}</dt>
                  <dd className="mt-1">
                    <a href={telHref(d.phones[0].display)} className="inline-flex items-center gap-2 text-[1.2rem] font-semibold hover:text-red">
                      <PhoneIcon size={18} />
                      {d.phones[0].display}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
            <Link href="/dla-biznesu#zapytanie" className="btn btn-red mt-7 w-full">
              Porozmawiajmy o współpracy
            </Link>
            <p className="ui mt-4 text-[0.8125rem] text-muted">
              Odbiorcy: {company.wholesaleAudiences.join(", ")}.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
