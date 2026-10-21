import Link from "next/link";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { ArrowRight } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";

const PILLARS = [
  {
    title: "Początkujący są u nas najważniejsi",
    text: "Większość osób przychodzi bez doświadczenia. Dlatego grupy „Od zera” nie są dodatkiem do grafiku, tylko jego fundamentem – z osobnym tempem i programem.",
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
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="relative lg:col-span-7">
            <div aria-hidden="true" className="absolute -left-5 top-10 hidden h-[78%] w-[62%] bg-blush md:block lg:-left-10" />
            <div className="relative aspect-[5/4] overflow-hidden rounded-sm md:ml-10 lg:ml-0">
              <Photo photo="teamMotion" sizes="(min-width: 1024px) 50vw, 100vw" position="50% 45%" />
            </div>
          </div>

          <div className="lg:col-span-5 lg:pt-6">
            <p className="eyebrow">O nas</p>
            <h2 id="o-nas-title" className="h2 mt-5 text-wine">
              Studio, w którym nikt nie musi być idealny
            </h2>
            <div className="prose-measure mt-7 space-y-5">
              <p>
                Swobodę założyła grupa instruktorów, którzy przez lata uczyli w dużych szkołach tańca. Widzieli, ile osób rezygnuje po pierwszych
                zajęciach – nie z braku talentu, ale z poczucia, że „nie pasują” do sali pełnej zaawansowanych tancerzy.
              </p>
              <p>
                Postanowili stworzyć miejsce odwrotne: kameralne, spokojne i zbudowane wokół osób, które dopiero zaczynają albo wracają do tańca po
                latach. Naszą misją jest pokazać, że taniec należy do każdego – w każdym wieku i na każdym etapie.
              </p>
            </div>
            <DemoBadge className="mt-7">Historia przykładowa – opis fikcyjnego studia</DemoBadge>
          </div>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8 lg:mt-24">
          {PILLARS.map((pillar, index) => (
            <div key={pillar.title} className="border-t rule pt-6">
              <p className="font-serif text-2xl text-rose" aria-hidden="true">
                {["i.", "ii.", "iii."][index]}
              </p>
              <h3 className="mt-3 font-serif text-[1.7rem] leading-tight">{pillar.title}</h3>
              <p className="mt-3">{pillar.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[52ch] font-serif text-2xl leading-snug">Ciekawi Cię, kto poprowadzi Twoje zajęcia?</p>
          <Link href="#instruktorzy" className="btn btn-secondary self-start sm:self-auto">
            Poznaj nas bliżej <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
