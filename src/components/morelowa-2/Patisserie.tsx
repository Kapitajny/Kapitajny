import Image from "next/image";
import { photos } from "@/components/morelowa/images";
import { Reveal } from "@/components/ui/Reveal";
import { pastries } from "@/data/morelowa";

export function Patisserie() {
  return (
    <section id="cukiernia" aria-labelledby="cukiernia-tytul" className="on-dark band bg-bordo text-krem">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
        {/* GRAFIKA 3 – cukiernia i torty, w złotej ramce jak w witrynie cukierni */}
        <Reveal as="figure" className="lg:sticky lg:top-40 lg:col-span-7 lg:self-start">
          <div className="relative aspect-[4/3] overflow-hidden bg-bordo-ciemne">
            <Image
              src={photos.patisserie.src}
              alt={photos.patisserie.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1344px) 680px, (min-width: 1024px) 54vw, 92vw"
              className="object-cover"
            />
            <span aria-hidden="true" className="pointer-events-none absolute inset-3 border border-krem/60 sm:inset-5" />
          </div>
          <figcaption className="mt-5 text-[0.85rem] text-krem/80 italic">Tort z morelami, tarta owocowa i monoporcje z naszej witryny.</figcaption>
        </Reveal>

        <Reveal delay={150} className="flex flex-col lg:col-span-5 lg:pt-6">
          <p className="kicker">Nasze wypieki · Cukiernia</p>
          <h2 id="cukiernia-tytul" className="title-lg mt-6 text-krem">
            Słodkości <em className="italic">wykańczane ręcznie.</em>
          </h2>
          <p className="intro mt-7 text-krem/85">
            Polska tradycja cukiernicza spotyka się u nas z nowoczesną patisserie: tarty owocowe, monoporcje i torty, które cukiernik kończy ręcznie.
          </p>

          <dl className="mt-10 divide-y divide-krem/20 border-y border-krem/20">
            {pastries.map((item) => (
              <div key={item.name} className="py-6">
                <dt className="font-serif text-[1.7rem] leading-tight italic">{item.name}</dt>
                <dd className="mt-3 text-[0.98rem] text-krem/80">{item.text}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-col items-start gap-4">
            <a href="#lokale" className="pill pill-krem">
              Zamów tort w lokalu
            </a>
            <p className="text-[0.85rem] text-krem/75">Nie prowadzimy zamówień online — tort najlepiej omówić osobiście, przy ladzie.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
