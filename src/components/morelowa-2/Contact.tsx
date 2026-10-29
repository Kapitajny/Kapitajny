import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="kontakt" aria-labelledby="kontakt-tytul" className="band border-t border-linia bg-bez">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <p className="kicker">Kontakt</p>
          <h2 id="kontakt-tytul" className="mt-6 text-[clamp(2.3rem,1.5rem+2.2vw,3.6rem)] text-braz">
            Zapach świeżego pieczywa <em className="text-bordo italic">najlepiej poznaje się osobiście.</em>
          </h2>
          <p className="intro mt-7 text-szary">
            Zajrzyj do nas o poranku, kiedy z pieca wychodzą pierwsze bochenki, albo po południu na kawałek ciasta. W obu lokalach chętnie doradzimy i
            przyjmiemy zamówienie na tort.
          </p>
          <a href="#lokale" className="pill pill-bordo mt-10">
            Zobacz nasze lokale
          </a>
        </Reveal>

        <Reveal delay={150} className="lg:col-span-7">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
