import type { Metadata } from "next";

import shelf from "@/assets/photos/studio-shelf.jpg";
import wide from "@/assets/photos/studio-wide.jpg";
import { CtaBand } from "@/components/home/CtaBand";
import { Values } from "@/components/home/Values";
import { PageIntro } from "@/components/ui/PageIntro";
import { PageTransition } from "@/components/ui/PageTransition";
import { Reveal, RevealImage } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "O pracowni",
  description:
    "FORMA ATELIER to warszawska pracownia architektury wnętrz. Projektujemy ponadczasowe domy i apartamenty, prowadząc projekt od koncepcji do nadzoru.",
  alternates: { canonical: "/o-pracowni" },
};

const approach = [
  {
    title: "Słuchamy dłużej, niż rysujemy",
    text: "Pierwsze spotkania poświęcamy na rozmowę o tym, jak żyjesz: kiedy wstajesz, gdzie czytasz, ile osób siada do stołu w święta. Z tych odpowiedzi powstaje program wnętrza.",
  },
  {
    title: "Materiał przed formą",
    text: "Pracujemy z próbkami, nie z katalogami. Kamień, drewno i tkaniny oglądasz w dziennym świetle, w swoim wnętrzu, zanim trafią na listę zamówień.",
  },
  {
    title: "Detal rozrysowany do końca",
    text: "Rysujemy cokoły, styki materiałów i rozmieszczenie gniazd. Dzięki temu ekipa nie musi zgadywać, a Ty nie musisz poprawiać.",
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <PageIntro title="O pracowni">
        <p>
          Jesteśmy pracownią architektury wnętrz z Warszawy. Projektujemy domy i apartamenty dla osób, które szukają wnętrz
          spokojnych, funkcjonalnych i odpornych na upływ mody.
        </p>
      </PageIntro>

      <div className="shell">
        <RevealImage
          src={wide}
          alt="Wnętrze pracowni FORMA ATELIER: stół z próbkami materiałów, półki z ceramiką i duże okno"
          sizes="92vw"
          ratio="21 / 10"
          preload
          parallax={4}
        />
      </div>

      <section aria-labelledby="podejscie" className="shell grid grid-cols-12 gap-x-6 gap-y-14 py-[var(--section)]">
        <Reveal className="col-span-12 lg:col-span-5">
          <h2 id="podejscie" className="t-h2">
            Wnętrze to opowieść o ludziach, którzy w nim mieszkają.
          </h2>
        </Reveal>
        <div className="col-span-12 space-y-12 lg:col-span-6 lg:col-start-7">
          {approach.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06} className="border-t border-line pt-7">
              <h3 className="t-h3">{a.title}</h3>
              <p className="t-body mt-4 max-w-[34rem]">{a.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="zakres" className="shell grid grid-cols-12 items-center gap-x-6 gap-y-14 pb-[var(--section)]">
        <div className="col-span-12 sm:col-span-8 md:col-span-5">
          <RevealImage src={shelf} alt="Półki pracowni z ceramiką i książkami o architekturze" sizes="(min-width: 768px) 40vw, 80vw" ratio="4 / 5" />
        </div>
        <Reveal className="col-span-12 md:col-span-6 md:col-start-7">
          <h2 id="zakres" className="t-h2">
            Kompleksowo, od koncepcji po nadzór.
          </h2>
          <p className="t-body mt-8 max-w-[34rem]">
            Jeden zespół prowadzi projekt od inwentaryzacji, przez koncepcję i dokumentację techniczną, po zamówienia,
            koordynację wykonawców i odbiory. Pracujemy w Warszawie i okolicach: w Konstancinie, Józefowie, Magdalence, Wilanowie
            i na Żoliborzu.
          </p>
          <p className="t-body mt-5 max-w-[34rem]">
            Każdy projekt prowadzi jedna architektka lub jeden architekt, który jest Twoim stałym punktem kontaktu przez cały
            proces.
          </p>
        </Reveal>
      </section>

      <Values />
      <CtaBand />
    </PageTransition>
  );
}
