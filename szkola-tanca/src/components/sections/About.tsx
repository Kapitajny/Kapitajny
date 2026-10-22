import Link from "next/link";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Photo } from "@/components/ui/Photo";

const PILLARS = [
  {
    title: "Początkujący są u nas najważniejsi",
    text: "Większość osób przychodzi bez doświadczenia. Grupy „Od zera” nie są dodatkiem do grafiku, tylko jego fundamentem – z osobnym tempem i programem.",
  },
  {
    title: "Akceptacja zamiast porównań",
    text: "Nie oceniamy wyglądu, wieku ani kondycji. Lustro służy do nauki, nie do krytyki, a przerwę możesz zrobić w każdej chwili.",
  },
  {
    title: "Rozwój na Twoich warunkach",
    text: "Instruktorzy znają imiona uczestników i ich cele. Podpowiadają indywidualnie, kiedy przejść na wyższy poziom – i kiedy warto jeszcze poczekać.",
  },
];

export function About() {
  return (
    <section id="o-nas" aria-labelledby="o-nas-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-6">
            <h2 id="o-nas-title" className="h2 text-wine">
              Studio, w którym nikt nie musi być idealny
            </h2>
            <div className="prose-measure mt-8 space-y-5">
              <p className="lead">
                Swobodę założyła grupa instruktorów, którzy przez lata uczyli w dużych szkołach tańca. Widzieli, ile osób rezygnuje po pierwszych
                zajęciach – nie z braku talentu, ale z poczucia, że „nie pasują” do sali pełnej zaawansowanych tancerzy.
              </p>
              <p>
                Postanowili stworzyć miejsce odwrotne: kameralne, spokojne i zbudowane wokół osób, które dopiero zaczynają albo wracają do tańca po
                latach. Naszą misją jest pokazać, że taniec należy do każdego – w każdym wieku i na każdym etapie.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="#instruktorzy" className="btn btn-secondary">
                Poznaj nas bliżej
              </Link>
              <DemoBadge>Historia przykładowa, opis fikcyjnego studia</DemoBadge>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] lg:col-span-6 lg:aspect-[5/6]">
            <Photo photo="teamMotion" sizes="(min-width: 1024px) 40vw, 100vw" position="45% 50%" />
          </div>
        </div>

        <ul className="mt-16 grid gap-8 rounded-[2rem] bg-blush p-7 sm:p-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-cocoa/15 lg:mt-20 lg:p-12">
          {PILLARS.map((pillar) => (
            <li key={pillar.title} className="md:px-8 md:first:pl-0 md:last:pr-0">
              <h3 className="h3">{pillar.title}</h3>
              <p className="mt-3">{pillar.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
