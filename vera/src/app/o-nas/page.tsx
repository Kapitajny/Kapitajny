import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand";
import { Photo } from "@/components/ui/Photo";

export const metadata: Metadata = {
  title: "O nas",
  description: "VÉRA to studio medycyny estetycznej i pielęgnacji skóry, które każdy zabieg zaczyna od konsultacji i pracuje małymi, sprawdzanymi krokami.",
  alternates: { canonical: "/o-nas" },
  openGraph: { title: "O VÉRA Aesthetic Studio", url: "/o-nas" },
};

const refusals = [
  { title: "Żadnego zabiegu bez konsultacji", text: "Nawet niewielkiego. Nawet jeśli wykonywano go już gdzie indziej." },
  { title: "Żadnych pakietów sprzedawanych od progu", text: "Serię proponujemy tylko wtedy, gdy skóra jej potrzebuje – i możesz ją przerwać w każdej chwili." },
  { title: "Żadnych obiecanych efektów", text: "Skóra każdej osoby reaguje inaczej. Mówimy, czego można się spodziewać – nigdy, co jest gwarantowane." },
];

export default function AboutPage() {
  return (
    <>
      <section className="shell pb-16 pt-[calc(var(--header-h)+3rem)] sm:pb-24 lg:pt-[calc(var(--header-h)+5rem)]">
        <Breadcrumbs
          items={[
            { href: "/", label: "Strona główna" },
            { href: "/o-nas", label: "O nas" },
          ]}
        />
        <h1 className="display mt-10 text-[clamp(3.25rem,10vw,9.5rem)] text-burgundy">
          <span className="block">Wierni</span>
          <span className="block pl-[0.6em] sm:pl-[1.4em]">Twojej twarzy.</span>
        </h1>
        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12">
          <p className="lede text-black/85 lg:col-span-5 lg:col-start-7">
            Nazwa VÉRA pochodzi od łacińskiego <em>vera</em> – prawdziwa. Otworzyliśmy studio dla osób, które chcą dbać o skórę i twarz, nie stając się przy tym
            kimś innym.
          </p>
        </div>
      </section>

      {/* Dwa wnętrza obok siebie, celowo nierówne. */}
      <section aria-label="Studio" className="shell grid gap-4 sm:grid-cols-12 sm:gap-6">
        <Photo image="treatmentRoom" sizes="(min-width: 640px) 66vw, 100vw" className="aspect-[4/3] sm:col-span-8 sm:aspect-[3/2]" />
        <div className="sm:col-span-4 sm:mt-32">
          <Photo image="reception" sizes="(min-width: 640px) 33vw, 100vw" className="aspect-[4/5]" focus="22% 60%" />
          <p className="mt-4 text-xs text-stone">Recepcja i jeden z dwóch gabinetów zabiegowych.</p>
        </div>
      </section>

      <section aria-labelledby="approach-title" className="shell grid gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:gap-8 lg:py-40">
        <h2 id="approach-title" className="display text-[clamp(2.75rem,5.5vw,5rem)] lg:col-span-5">
          Mniej zabiegów,
          <br />
          lepiej dobranych.
        </h2>
        <div className="space-y-6 text-lg leading-relaxed text-black/85 lg:col-span-6 lg:col-start-7">
          <p>
            Większość osób, które do nas przychodzą, już czegoś próbowała. Często za dużo, za szybko albo nie tego, czego potrzebowała ich skóra. Dlatego
            zwalniamy.
          </p>
          <p>
            Każda pierwsza wizyta to konsultacja ze specjalistą, który będzie się Tobą opiekować. Rozmawiamy, oglądamy skórę w świetle dziennym, a Ty wychodzisz z
            pisemnym planem. Zabiegi przychodzą później – o ile w ogóle są potrzebne.
          </p>
          <p>
            Zabiegi medycyny estetycznej wykonuje lekarz. Zabiegi na twarz, peelingi i pielęgnację dłoni – kosmetolodzy. Każda osoba pracuje wyłącznie w swojej
            dziedzinie.
          </p>
        </div>
      </section>

      <section aria-labelledby="refuse-title" className="bg-black py-24 text-ivory sm:py-32">
        <div className="shell">
          <h2 id="refuse-title" className="display max-w-4xl text-[clamp(2.75rem,5.5vw,5rem)]">
            Czego
            <br />
            <span className="pl-[0.9em]">nie robimy</span>
          </h2>
          <ul className="mt-16 divide-y divide-line-light border-y border-line-light">
            {refusals.map((r) => (
              <li key={r.title} className="grid gap-3 py-8 sm:grid-cols-12 sm:gap-8 sm:py-10">
                <h3 className="font-serif text-3xl leading-tight sm:col-span-6 lg:text-4xl">{r.title}</h3>
                <p className="text-ivory/75 sm:col-span-5 sm:col-start-8 sm:self-center">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="space-title" className="shell grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Photo image="facialRitual" sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-square" />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <h2 id="space-title" className="font-serif text-4xl leading-tight sm:text-5xl">
            Spokojne miejsce – celowo
          </h2>
          <p className="mt-6 text-black/85">
            Dwa gabinety zabiegowe, jedna recepcja, żadnej poczekalni pełnej obcych osób. Wizyty planujemy z zapasem, więc nikt nie wychodzi w pośpiechu i nikt nie
            czeka na swoją kolej.
          </p>
          <p className="mt-4 text-black/85">Studio mieści się na parterze, z wejściem bez schodów od strony dziedzińca.</p>
        </div>
      </section>

      <CtaBand title="Poznaj nas, zanim cokolwiek zdecydujesz" text="Konsultacja to godzina ze specjalistą i pisemny plan do zabrania do domu. Do niczego nie zobowiązuje." />
    </>
  );
}
