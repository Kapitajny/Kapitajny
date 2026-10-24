import Link from "next/link";
import { company, fullAddress } from "@/content/company";
import { categories } from "@/content/products";
import { pageMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { DemoNote } from "@/components/ui/DemoNote";

export const metadata = pageMetadata({
  title: "O firmie",
  description:
    "Zakład Mięsny Wierzejki – rodzinna spółka jawna z Płud w gminie Trzebieszów, założona w 1991 roku. Ubój, rozbiór, przetwórstwo mięsa oraz sprzedaż hurtowa i w sklepach firmowych.",
  path: "/o-firmie",
});

const activities = [
  { name: "Ubój", text: "Własna rzeźnia trzody chlewnej i bydła." },
  { name: "Rozbiór", text: "Tusze, ćwierćtusze i elementy dla hurtu i sklepów." },
  { name: "Przetwórstwo", text: "Wędliny i wyroby garmażeryjne." },
  { name: "Sprzedaż", text: "Hurtownie, sklepy firmowe i dostawy własnym transportem." },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        variant="split"
        media="aboutPlant"
        crumbs={[{ href: "/o-firmie", label: "O firmie" }]}
        title="Rodzinna firma z Płud"
        lead={
          <p>
            Od {company.foundedYear} roku wytwarzamy mięso, wędliny i wyroby garmażeryjne. Zaczynaliśmy w Wierzejkach, dziś pracujemy w
            zakładzie w Płudach, w powiecie łukowskim.
          </p>
        }
      />

      <section aria-labelledby="czym-sie-zajmujemy" className="py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="czym-sie-zajmujemy" className="display-lg">
              Czym się zajmujemy
            </h2>
            <p className="mt-6 max-w-[34rem]">
              Zakład Mięsny „Wierzejki” prowadzi ubój, rozbiór i przetwórstwo mięsa wieprzowego i wołowego. Gotowe wyroby sprzedajemy w
              sklepach firmowych oraz odbiorcom hurtowym: hotelom, restauracjom, szkołom, stołówkom i hurtowniom.
            </p>
            <p className="mt-4 max-w-[34rem]">
              Firmę założyli bracia {company.founders}. Od początku jest przedsiębiorstwem rodzinnym, prowadzonym w formie spółki jawnej.
            </p>
          </div>
          <dl className="grid gap-px self-start bg-line sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {activities.map((a) => (
              <div key={a.name} className="bg-paper py-6 sm:p-6">
                <dt className="display-md">{a.name}</dt>
                <dd className="mt-2 text-muted">{a.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="oferta-skrot" className="bg-surface py-20 lg:py-24">
        <div className="container-x">
          <h2 id="oferta-skrot" className="display-md">
            Co produkujemy
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-3">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/produkty/${c.slug}`} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden bg-linen">
                    <Photo media={c.media} sizes="(min-width: 768px) 30vw, 100vw" />
                  </div>
                  <h3 className="display-sm mt-4 group-hover:text-red">{c.name}</h3>
                  <p className="mt-1 text-[1rem] text-muted">{c.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="dane-firmy" className="py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="dane-firmy" className="display-md">
              Dane firmy
            </h2>
            <p className="mt-4 text-muted">Dla partnerów handlowych i dostawców – pełne dane rejestrowe spółki.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <dl className="ui divide-y divide-line border-y border-line text-[1rem]">
              {[
                ["Nazwa", company.legalName],
                ["Siedziba", `${fullAddress} (${company.address.county}, ${company.address.region})`],
                ["KRS", company.registry.krs],
                ["NIP", company.registry.nip],
                ["Rok założenia", String(company.foundedYear)],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <DemoNote className="mt-6">Dane rejestrowe pochodzą z KRS; przed publikacją firma powinna je potwierdzić.</DemoNote>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/o-firmie/historia" className="btn btn-ink">
                Historia firmy
              </Link>
              <Link href="/jakosc-i-produkcja" className="btn btn-outline">
                Jakość i produkcja
              </Link>
              <Link href="/kontakt" className="btn btn-outline">
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
