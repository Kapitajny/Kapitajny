import Image from "next/image";
import Link from "next/link";
import { latestDrop } from "@/lib/catalog";
import { formatDate } from "@/lib/format";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="wrap grid gap-8 pb-16 pt-8 md:pt-12 lg:grid-cols-12 lg:gap-10 lg:pb-24">
      <div className="flex flex-col lg:col-span-7 lg:py-6">
        <p className="text-sm text-muted">
          {latestDrop.name} – w sklepie od {formatDate(latestDrop.date)}
        </p>
        <h1 id="hero-title" className="display mt-6 text-[clamp(3.3rem,0.6rem+10.2vw,10.5rem)]">
          Bluzy.
          <br />
          Spodnie.
          <br />
          Nic ponad to.
        </h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-muted lg:mt-auto lg:pt-10">
          Hoodie, zipy, cargo i szerokie dresy. Ciężka dzianina, kroje z luzem i tabela wymiarów w centymetrach przy każdym produkcie.
        </p>
        <div className="mt-8 flex flex-col gap-3 xs:flex-row">
          <Link href="/kategoria/bluzy" className="btn btn-light">
            Odkryj bluzy
          </Link>
          <Link href="/kategoria/spodnie" className="btn btn-outline">
            Odkryj spodnie
          </Link>
        </div>
      </div>

      <div className="relative grid grid-cols-[1.25fr_1fr] items-end gap-2 lg:col-span-5 lg:block">
        <Link href="/produkt/sole-print-hoodie" className="studio relative block aspect-[4/5] overflow-hidden lg:ml-[18%]" aria-label="SOLE Print Hoodie">
          <Image
            src="/images/products/sole-hoodie-black.jpg"
            alt="Czarna bluza z kapturem z dużym nadrukiem buta na piersi"
            fill
            preload
            sizes="(min-width: 1024px) 34vw, 56vw"
            className="object-cover"
          />
        </Link>
        <Link
          href="/produkt/sole-wide-pants"
          className="studio relative block aspect-[4/5] overflow-hidden lg:absolute lg:-bottom-10 lg:left-0 lg:w-[42%] lg:border-[6px] lg:border-ink"
          aria-label="SOLE Wide Pants"
        >
          <Image
            src="/images/products/wide-sole-black.jpg"
            alt="Czarne spodnie dresowe z szeroką nogawką i małym znakiem buta na udzie"
            fill
            preload
            sizes="(min-width: 1024px) 15vw, 44vw"
            className="object-cover"
          />
        </Link>
      </div>
    </section>
  );
}
