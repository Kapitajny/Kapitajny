import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/brand/logo-dark.png";

/** Opis podejścia sklepu – bez wymyślonej historii marki i współprac. */
export function BrandStory() {
  return (
    <section aria-labelledby="story-title" className="border-t border-line bg-graphite py-16 md:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Image src={logo} alt="Znak marki: stylizowany but sportowy" className="h-auto w-40 md:w-56" />
          <h2 id="story-title" className="display mt-10 text-[clamp(2.6rem,1rem+5vw,5.5rem)]">
            Dwie kategorie. Zero dodatków.
          </h2>
        </div>
        <div className="space-y-6 text-lg leading-relaxed text-muted lg:col-span-5 lg:col-start-8 lg:pt-4">
          <p>
            Sprzedajemy tylko bluzy i spodnie. Dzięki temu każdy model ma opisany krój, gramaturę dzianiny i wymiary w centymetrach – zanim go kupisz, wiesz,
            jak będzie leżał.
          </p>
          <p>
            Jedynym oznaczeniem na ubraniach jest znak buta: duży na piersi, mały przy sercu albo tonalny, prawie niewidoczny. Reszta to kolor, materiał i
            krój.
          </p>
          <p>
            Szukasz rozmiaru między dwoma? Przy każdym produkcie jest tabela wymiarów, a w razie wątpliwości{" "}
            <Link href="/kontakt" className="link text-paper">
              napisz do nas
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
