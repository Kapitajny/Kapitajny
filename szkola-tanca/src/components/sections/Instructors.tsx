import { DemoBadge } from "@/components/ui/DemoBadge";
import { Photo } from "@/components/ui/Photo";
import { INSTRUCTORS } from "@/data/instructors";

export function Instructors() {
  return (
    <section id="instruktorzy" aria-labelledby="instruktorzy-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="instruktorzy-title" className="h2 text-wine lg:col-span-7" tabIndex={-1} data-section-focus>
            Ludzie, którzy pamiętają, jak to jest zaczynać
          </h2>
          <div className="lg:col-span-5">
            <p className="lead prose-measure">Każda osoba w naszym zespole uczy dorosłych i ma doświadczenie w pracy z początkującymi.</p>
            <DemoBadge className="mt-5">Postacie fikcyjne, dane demonstracyjne</DemoBadge>
          </div>
        </div>

        <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-20 xl:grid-cols-4">
          {INSTRUCTORS.map((instructor, index) => (
            <li key={instructor.id} className={index % 2 === 1 ? "xl:mt-16" : ""}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-blush">
                <Photo photo={instructor.photo} sizes="(min-width: 1280px) 18rem, (min-width: 640px) 45vw, 92vw" position="50% 30%" />
              </div>
              <h3 className="h3 mt-5">{instructor.name}</h3>
              <p className="mt-1 font-semibold text-wine">{instructor.specialization}</p>
              <p className="mt-3">{instructor.experience}</p>
              <blockquote className="mt-4 text-lg font-medium leading-snug [font-stretch:90%]">„{instructor.approach}”</blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
