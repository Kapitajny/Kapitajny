import Image from "next/image";
import { photos } from "@/components/morelowa/images";
import { Reveal } from "@/components/ui/Reveal";
import { pastries } from "@/data/morelowa";

/** Cukiernia jako rozkładówka magazynu: blok z tytułem nachodzi na zdjęcie. */
export function Patisserie() {
  return (
    <section id="cukiernia" aria-labelledby="cukiernia-tytul" className="rytm bg-bordo">
      <div className="shell">
        <div className="grid lg:grid-cols-12">
          {/* GRAFIKA 3 – cukiernia i torty */}
          <Reveal as="figure" className="lg:col-span-8 lg:col-start-5 lg:row-start-1">
            <div className="relative aspect-[4/3] overflow-hidden bg-bordo-ciemne">
              <Image
                src={photos.patisserie.src}
                alt={photos.patisserie.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1376px) 840px, (min-width: 1024px) 64vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 text-right text-[0.82rem] text-krem/80 italic">Tort z morelami, tarta owocowa i monoporcje z naszej witryny.</figcaption>
          </Reveal>

          <Reveal
            delay={150}
            className="relative z-10 mx-4 -mt-16 bg-noc p-7 sm:mx-10 sm:p-10 lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:mt-0 lg:mb-24 lg:self-end lg:p-12"
          >
            <p className="etykieta">Nasze wypieki · Cukiernia</p>
            <h2 id="cukiernia-tytul" className="display-xl mt-6 text-krem">
              Słodkości <em className="text-zloto italic">wykańczane ręcznie.</em>
            </h2>
            <p className="lead mt-6 text-mgla">
              Polska tradycja cukiernicza spotyka się u nas z nowoczesną patisserie. Każdy tort, tarta i monoporcja przechodzą przez ręce cukiernika.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:mt-20 lg:grid-cols-12">
          {pastries.map((item, index) => (
            <Reveal key={item.name} delay={index * 120} className="border-t border-krem/30 pt-6 lg:col-span-4">
              <h3 className="text-[2rem] text-krem italic">{item.name}</h3>
              <p className="mt-3 text-krem/85">{item.text}</p>
            </Reveal>
          ))}
          <Reveal delay={240} className="flex flex-col items-start gap-4 border-t border-krem/30 pt-6 md:col-span-2 lg:col-span-3 lg:col-start-10">
            <p className="text-[0.95rem] text-krem/85">Nie prowadzimy zamówień online — o torcie najlepiej porozmawiać przy ladzie.</p>
            <a href="#lokale" className="cta cta-kontur">
              Gdzie nas znaleźć <span aria-hidden="true">→</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
