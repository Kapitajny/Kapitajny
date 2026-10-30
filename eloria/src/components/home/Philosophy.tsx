import Link from "next/link";
import { Photo } from "@/components/ui/Photo";

const principles = [
  {
    title: "Rozmowa przed zabiegiem",
    text: "Każdą współpracę zaczynamy od konsultacji. Masz czas na pytania – i na spokojną decyzję, także na „nie”.",
  },
  {
    title: "Naturalność ponad efekt",
    text: "Proponujemy zmiany w skali, która zachowuje Twoje rysy i mimikę. Zamiast jednej dużej korekty – etapy i ocena po czasie.",
  },
  {
    title: "Plan zamiast przypadku",
    text: "Zabiegi i pielęgnację domową układamy w jeden plan, który wspólnie weryfikujemy przy kolejnych wizytach.",
  },
];

export function Philosophy() {
  return (
    <section aria-labelledby="filozofia" className="border-t border-line">
      <div className="frame grid gap-y-14 py-24 md:grid-cols-12 md:gap-x-8 lg:py-36">
        <div className="md:col-span-7 lg:col-span-7">
          <h2 id="filozofia" className="sr-only">
            Filozofia kliniki
          </h2>
          <p className="font-serif text-[clamp(2rem,4.4vw,3.75rem)] font-light leading-[1.08] text-espresso">
            Najpierw słuchamy. Dopiero potem proponujemy zabieg – albo mówimy szczerze, że nie jest potrzebny.
          </p>
          <p className="prose-body mt-10 text-base sm:text-lg">
            ÉLORIA powstała z przekonania, że medycyna estetyczna może być spokojna i rzeczowa. Bez presji czasu, bez pakietów „na zapas”, z lekarzem
            i kosmetologiem, którzy znają Twoją historię.
          </p>
          <Link href="/o-klinice" className="link-quiet mt-8 inline-block text-sm font-medium">
            Więcej o klinice
          </Link>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <div className="relative ml-auto aspect-[3/4] w-4/5 overflow-hidden bg-blush md:w-full">
            <Photo image="philosophy" sizes="(min-width: 768px) 30vw, 80vw" />
          </div>
        </div>

        <dl className="grid gap-y-10 border-t border-line pt-12 md:col-span-12 md:grid-cols-3 md:gap-x-0 md:pt-14">
          {principles.map((p, i) => (
            <div key={p.title} className={`md:px-8 ${i === 0 ? "md:pl-0" : "md:border-l md:border-line"} ${i === principles.length - 1 ? "md:pr-0" : ""}`}>
              <dt className="font-serif text-2xl font-normal text-espresso">{p.title}</dt>
              <dd className="mt-3 max-w-sm text-sm text-taupe sm:text-base">{p.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
