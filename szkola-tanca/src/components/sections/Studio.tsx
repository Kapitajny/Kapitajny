import { Photo } from "@/components/ui/Photo";
import { siteConfig } from "@/config/site";

/** Wyłącznie elementy widoczne na zdjęciu sali – bez niepotwierdzonych udogodnień. */
const VISIBLE_FEATURES = [
  { title: "Drewniana podłoga", text: "Ciepła, sprężysta nawierzchnia, przyjazna dla stawów." },
  { title: "Lustra na całej ścianie", text: "Pomagają kontrolować postawę i uczyć się ruchu." },
  { title: "Drążki baletowe", text: "Dwa poziomy wysokości – do baletu i rozciągania." },
  { title: "Duże okna", text: "Dzienne światło i widok na zieleń podczas porannych zajęć." },
];

export function Studio() {
  const { contact } = siteConfig;
  return (
    <section id="studio" aria-labelledby="studio-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow">Nasze studio</p>
            <h2 id="studio-title" className="h2 mt-5 text-wine">
              Jasna sala, w której łatwo się oddycha
            </h2>
          </div>
          <p className="lead prose-measure lg:col-span-5 lg:col-start-8">
            Przestrzeń jest celowo prosta: dużo światła, miejsce na ruch i nic, co rozprasza. Tak wygląda sala, w której odbywają się zajęcia.
          </p>
        </div>

        <div className="relative mt-12 aspect-[4/3] overflow-hidden rounded-sm sm:aspect-[16/9] lg:mt-16 lg:aspect-[21/9]">
          <Photo photo="studioHall" sizes="(min-width: 1344px) 79rem, 100vw" position="50% 58%" />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:col-span-8">
            {VISIBLE_FEATURES.map((feature) => (
              <div key={feature.title} className="border-t rule pt-5">
                <dt className="font-serif text-2xl">{feature.title}</dt>
                <dd className="mt-2">{feature.text}</dd>
              </div>
            ))}
          </dl>
          <div className="bg-blush p-7 lg:col-span-4">
            <h3 className="font-serif text-2xl">Lokalizacja i dostępność</h3>
            <p className="mt-3">
              {contact.street}, {contact.city} <span className="text-sm">(adres demonstracyjny)</span>
            </p>
            <p className="mt-3">
              Informacje o dojeździe, parkingu i dostępności budynku dla osób z niepełnosprawnościami uzupełnimy po potwierdzeniu. Jeśli to dla
              Ciebie ważne, zapytaj nas przed wizytą.
            </p>
            <a href="#kontakt" className="link mt-4 inline-block font-semibold">
              Przejdź do kontaktu
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
