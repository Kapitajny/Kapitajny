import { DemoBadge } from "@/components/ui/DemoBadge";
import { Photo } from "@/components/ui/Photo";
import { INSTRUCTORS } from "@/data/instructors";

export function Instructors() {
  return (
    <section id="instruktorzy" aria-labelledby="instruktorzy-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">Poznaj instruktorów</p>
            <h2 id="instruktorzy-title" className="h2 mt-5 text-wine" tabIndex={-1} data-section-focus>
              Ludzie, którzy pamiętają, jak to jest zaczynać
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead prose-measure">Każda osoba w naszym zespole uczy dorosłych i ma doświadczenie w pracy z początkującymi.</p>
            <DemoBadge className="mt-5">Postacie fikcyjne – dane demonstracyjne</DemoBadge>
          </div>
        </div>

        <ul className="mt-14 grid gap-x-10 gap-y-14 lg:mt-20 xl:grid-cols-2 xl:gap-y-16">
          {INSTRUCTORS.map((instructor, index) => (
            <li key={instructor.id} className={`grid gap-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8 ${index % 2 === 1 ? "xl:mt-24" : ""}`}>
              <div className={`relative aspect-[3/4] w-full max-w-[18rem] overflow-hidden bg-blush ${index % 2 === 0 ? "rounded-t-full" : "rounded-sm"}`}>
                <Photo photo={instructor.photo} sizes="(min-width: 640px) 15rem, 18rem" position="50% 30%" />
              </div>
              <div className="max-w-[40rem] sm:pt-4">
                <h3 className="font-serif text-[2rem] leading-tight">{instructor.name}</h3>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-wine">{instructor.specialization}</p>
                <p className="mt-4">{instructor.experience}</p>
                <blockquote className="mt-5 border-l-2 border-rose pl-4 font-serif text-xl leading-snug">„{instructor.approach}”</blockquote>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
