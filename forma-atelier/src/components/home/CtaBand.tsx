import Image from "next/image";
import Link from "next/link";

import dusk from "@/assets/photos/cta-dusk.jpg";
import { Reveal } from "@/components/ui/Reveal";

export function CtaBand() {
  return (
    <section aria-labelledby="cta" className="relative isolate flex min-h-[88svh] items-center overflow-hidden bg-graphite text-paper">
      <Image src={dusk} alt="" fill sizes="100vw" placeholder="blur" quality={82} className="-z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgb(26_24_20/0.45)]" />
      <div className="shell py-32 text-center">
        <Reveal>
          <h2 id="cta" className="t-display mx-auto max-w-[16ch]">
            Stwórzmy przestrzeń, w której dobrze się żyje.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="t-lead mx-auto mt-8 max-w-[34rem] text-paper/85">
            Opowiedz nam o swoim wnętrzu. Odpowiemy w ciągu dwóch dni roboczych i zaproponujemy termin spotkania.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <Link href="/kontakt" className="btn btn-light mt-12 min-h-14 px-10">
            Rozpocznijmy rozmowę
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
