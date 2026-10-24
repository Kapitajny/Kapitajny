import Link from "next/link";
import { productionSteps } from "@/content/production";
import { Photo } from "@/components/ui/Photo";

export function Production() {
  return (
    <section aria-labelledby="produkcja-title" className="py-20 lg:py-28">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="produkcja-title" className="display-lg lg:col-span-7">
            Od rzeźni do lady – cały proces w&nbsp;jednym zakładzie
          </h2>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-muted">
              Ubój, rozbiór i przetwórstwo odbywają się w Płudach, w budynkach oddawanych kolejno od 2004 do 2008 roku. Dzięki temu
              zakład sam odpowiada za każdy etap – od przyjęcia żywca po wydanie towaru.
            </p>
            <Link href="/jakosc-i-produkcja" className="btn btn-outline mt-6">
              Jakość i produkcja
            </Link>
          </div>
        </div>

        <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden bg-linen sm:aspect-[21/9]">
          <Photo media="production" sizes="(min-width: 1344px) 1264px, 100vw" />
        </div>

        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {productionSteps.map((step, i) => (
            <li key={step.id} className="relative border-t-2 border-ink pt-5">
              <span className="ui text-[0.875rem] font-semibold tabular-nums text-red">Etap {i + 1}</span>
              <h3 className="display-md mt-2">{step.name}</h3>
              <p className="ui mt-2 text-[0.875rem] font-medium text-muted">{step.building}</p>
              <p className="mt-3 text-[1rem] text-ink/85">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
