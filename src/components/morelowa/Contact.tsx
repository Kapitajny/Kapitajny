import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="kontakt" aria-labelledby="kontakt-tytul" className="on-dark section-y bg-bordo text-krem">
      <div className="container-m grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow !text-krem/85">Kontakt</p>
          <h2 id="kontakt-tytul" className="display-2 mt-6 text-krem">
            Zapach świeżego pieczywa <em className="font-normal italic">najlepiej poznaje się osobiście.</em>
          </h2>
          <p className="lead mt-7 max-w-[32rem] text-krem/85">
            Zajrzyj do nas o poranku, kiedy z pieca wychodzą pierwsze bochenki, albo po południu na kawałek ciasta. W obu lokalach chętnie doradzimy,
            opowiemy, co dziś upiekliśmy, i przyjmiemy zamówienie na tort.
          </p>
          <a href="#lokale" className="btn btn-light mt-10">
            Zobacz nasze lokale
          </a>
        </Reveal>

        <Reveal delay={150} className="lg:col-span-5 lg:col-start-8">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
