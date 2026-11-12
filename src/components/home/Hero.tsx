import Link from "next/link";
import { Photo } from "@/components/ui/Photo";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-graphite text-white">
      <Photo
        src="/images/kilwater/hero-aerial.jpg"
        alt="Skuter wodny pędzący po turkusowej wodzie, za nim długi biały kilwater – widok z drona"
        sizes="100vw"
        priority
        className="-z-20 object-[40%_38%] md:object-[50%_100%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(21,29,35,1)_0%,rgba(21,29,35,.82)_34%,rgba(21,29,35,0)_68%)] md:bg-[linear-gradient(8deg,rgba(21,29,35,.96)_0%,rgba(21,29,35,.72)_30%,rgba(21,29,35,0)_58%)]" />

      <div className="wrap flex min-h-[100svh] flex-col justify-end pb-28 pt-28 md:min-h-[min(100svh,62rem)] md:pb-14">
        <h1 id="hero-title" className="display-xl rise max-w-[14ch]">
          Poczuj wolność na wodzie
        </h1>
        <span className="wake wake-draw -ml-[5vw] mt-6 w-[min(105%,56rem)] rotate-[-3deg] md:mt-8" aria-hidden="true" />

        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-[minmax(0,26rem)_auto_1fr] md:items-end md:gap-10">
          <p className="max-w-md text-[1.1rem] leading-relaxed text-white/85 md:text-lg">
            Skutery wodne od 30 minut do pełnej doby. Wypływasz z przystani w Sopocie, a przed Tobą otwarta Zatoka Gdańska.
          </p>
          <div className="hidden flex-wrap gap-3 md:flex">
            <Link href="/rezerwacja" className="btn btn-primary">
              Zarezerwuj skuter
            </Link>
            <Link href="/#flota" className="btn btn-ghost">
              Poznaj naszą flotę
            </Link>
          </div>
          <dl className="hidden grid-cols-2 gap-x-8 justify-self-end md:grid">
            <div>
              <dt className="sr-only">Najkrótszy wynajem</dt>
              <dd className="font-display text-5xl font-extrabold leading-none">30 min</dd>
              <dd className="mt-1 text-sm text-white/65">najkrótszy wynajem</dd>
            </div>
            <div>
              <dt className="sr-only">Najdłuższy wynajem</dt>
              <dd className="font-display text-5xl font-extrabold leading-none">24 h</dd>
              <dd className="mt-1 text-sm text-white/65">najdłuższy wynajem</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
