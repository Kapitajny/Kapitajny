/** Jedno zdanie o podejściu studia – duża, spokojna kursywa na pudrowym tle. */
export function QuoteBand() {
  return (
    <section aria-label="Nasze podejście" className="bg-powder py-20 sm:py-28">
      <figure className="shell mx-auto max-w-4xl text-center">
        <blockquote className="script text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.2]">
          <p>Nie zmieniamy Twojej twarzy. Pomagamy jej wyglądać na tak wypoczętą i pewną siebie, jak Ty się czujesz.</p>
        </blockquote>
        <figcaption className="mt-8 text-sm">Zespół studia VÉRA</figcaption>
      </figure>
    </section>
  );
}
