import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="kontakt" aria-labelledby="kontakt-tytul" className="rytm bg-noc">
      <div className="shell">
        <Reveal className="mx-auto max-w-[58rem] text-center">
          <p className="etykieta">Kontakt</p>
          <h2 id="kontakt-tytul" className="display-xl mt-6 text-krem">
            Zapach świeżego pieczywa <em className="text-zloto italic">najlepiej poznaje się osobiście.</em>
          </h2>
          <p className="lead mx-auto mt-7 max-w-[40rem] text-mgla">
            Zajrzyj do nas o poranku, kiedy z pieca wychodzą pierwsze bochenki, albo po południu na kawałek ciasta. W obu lokalach chętnie doradzimy i
            przyjmiemy zamówienie na tort.
          </p>
          <a href="#lokale" className="cta cta-zloto mt-10">
            Zobacz nasze lokale <span aria-hidden="true">→</span>
          </a>
        </Reveal>

        <Reveal delay={150} className="mx-auto mt-16 max-w-[48rem] lg:mt-20">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
