import Link from "next/link";
import type { ReactNode } from "react";
import type { PublicData } from "@/lib/server/public-data";
import { PlusIcon } from "@/components/ui/Icons";

export function Faq({ data }: { data: PublicData }) {
  const s = data.settings;
  const minAge = s.min_age.trim();
  const items: { q: string; a: ReactNode }[] = [
    {
      q: "Czy potrzebuję patentu?",
      a: (
        <>
          To zależy od skutera. Bez patentu można prowadzić tylko jednostki, które spełniają wymogi przepisów (m.in. dotyczące mocy silnika). Przy każdym modelu
          podajemy, czy wymaga patentu sternika motorowodnego. Przy rezerwacji potwierdzasz, że spełniasz warunki dla wybranego modelu.
        </>
      ),
    },
    {
      q: "Od jakiego wieku można wynająć skuter?",
      a: minAge ? (
        <>{minAge}</>
      ) : (
        <>Minimalny wiek kierującego podajemy w zasadach wynajmu. Jeśli chcesz płynąć z dzieckiem, zapytaj nas przed rezerwacją.</>
      ),
    },
    {
      q: "Czy można pływać we dwie osoby?",
      a: <>Tak, jeśli wybrany model ma co najmniej dwa miejsca. Liczbę miejsc znajdziesz w opisie każdego skutera. Każda osoba na pokładzie płynie w kamizelce.</>,
    },
    {
      q: "Czy wymagana jest kaucja?",
      a: (
        <>
          Tak. Wysokość kaucji zależy od modelu i jest podana w cenniku. Wpłacasz ją przed wypłynięciem i odzyskujesz po zwrocie skutera bez uszkodzeń.
          {s.deposit_rules.trim() && <span className="mt-2 block whitespace-pre-line">{s.deposit_rules.trim()}</span>}
        </>
      ),
    },
    {
      q: "Jak wygląda instruktaż?",
      a: (
        <>
          Przed startem, na pomoście, pokazujemy obsługę skutera: start, przyspieszanie, hamowanie i manewry. Omawiamy zasady na wodzie, granice akwenu i co zrobić po
          wywrotce. Ruszasz dopiero, gdy wszystko jest jasne.
        </>
      ),
    },
    { q: "Czy zapewniacie kamizelki ratunkowe?", a: <>Tak. Kamizelka asekuracyjna jest w cenie wynajmu, dobieramy ją do wzrostu i wagi. Bez kamizelki nie wypływamy.</> },
    {
      q: "Co w przypadku złej pogody?",
      a: <>Gdy wiatr, fala lub burza nie pozwalają na bezpieczne pływanie, odwołujemy wynajem i proponujemy inny termin albo zwrot wpłaconych pieniędzy.</>,
    },
    {
      q: "Czy mogę anulować rezerwację?",
      a: (
        <>
          Tak, bezpłatnie do {data.rules.cancelFreeHours} h przed startem, przez link z potwierdzenia rezerwacji. Później zadzwoń do nas, a znajdziemy rozwiązanie.
          Szczegóły w{" "}
          <Link href="/regulamin" className="link text-graphite">
            regulaminie
          </Link>
          .
        </>
      ),
    },
    { q: "Jak długo można wynająć skuter?", a: <>Od 1 do 24 godzin. Do wyboru masz 1, 2, 3, 4, 6, 12 i 24 godziny. Minimalny czas wynajmu to godzina.</> },
    {
      q: "Czy można wynająć skuter na całą dobę?",
      a: <>Tak. Przy wynajmie na 12 i 24 godziny zwrot musi przypaść w godzinach otwarcia przystani, dlatego system pokaże tylko pasujące godziny startu.</>,
    },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
      <div>
        <h2 id="faq-title" className="display-lg text-[clamp(2.75rem,5vw,5rem)]">
          Pytania i odpowiedzi
        </h2>
        <p className="mt-5 max-w-sm text-lg text-muted">Nie ma tu Twojego pytania? Napisz do nas, odpowiemy najszybciej, jak się da.</p>
        <Link href="/#kontakt" className="btn mt-6">
          Zadaj pytanie
        </Link>
      </div>
      <div className="border-t-2 border-graphite">
        {items.map((item) => (
          <details key={item.q} className="faq-item group">
            <summary className="flex items-center justify-between gap-6 py-5 text-left text-lg font-bold md:text-xl">
              {item.q}
              <PlusIcon size={24} className="shrink-0 transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <div className="max-w-2xl pb-6 text-[1.05rem] leading-relaxed text-muted">{item.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
