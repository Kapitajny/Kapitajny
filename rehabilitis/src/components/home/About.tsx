import { TEAM, type TeamMember } from "@/data/team";
import { getImageManifest } from "@/lib/images.server";
import { Photo, PhotoCaption } from "@/components/ui/Photo";

export function About() {
  const images = getImageManifest();
  // Własne zdjęcie wnętrza ma pierwszeństwo; do tego czasu pokazujemy zdjęcie poglądowe z pracy z pacjentem.
  const photo = images.clinicRoom.src ? "clinicRoom" : "hero";

  return (
    <section id="o-gabinecie" aria-labelledby="o-gabinecie-title" className="section-y">
      <div className="container-x grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h2 id="o-gabinecie-title" className="h2">
            O gabinecie
          </h2>
          <div className="mt-6 max-w-[36rem] space-y-4 text-graphite">
            <p>Na wizycie się nie spieszymy. Najpierw słuchamy i pytamy, potem tłumaczymy, co proponujemy i dlaczego.</p>
            <p>
              Przychodzą do nas osoby po urazach i operacjach, z bólem, który przeszkadza w pracy, i takie, które chcą znów pewnie się ruszać. Plan terapii
              układamy razem z Tobą. Bierzemy pod uwagę zalecenia lekarza, Twoje możliwości i to, co jest dla Ciebie ważne na co dzień.
            </p>
            <p>Po każdej wizycie wiesz, co robimy dalej i jakie ćwiczenia możesz robić w domu.</p>
          </div>

          <h3 className="mt-12 text-[1.2rem]">Fizjoterapeuci</h3>
          <ul className="mt-4 space-y-8">
            {TEAM.map((member, i) => (
              <TherapistProfile key={member.name ?? i} member={member} hasPhoto={Boolean(images.therapist.src)} />
            ))}
          </ul>
        </div>

        <figure className="lg:pt-2">
          <div className="relative aspect-[1/0.96] bg-sage">
            <Photo image={photo} sizes="(min-width: 1024px) 34rem, 92vw" />
          </div>
          <PhotoCaption image={photo} />
        </figure>
      </div>
    </section>
  );
}

function TherapistProfile({ member, hasPhoto }: { member: TeamMember; hasPhoto: boolean }) {
  const rows = [
    { label: "Numer PWZFz", value: member.licenseNumber },
    { label: "Wykształcenie", value: member.education },
    { label: "Kwalifikacje", value: member.qualifications?.length ? member.qualifications.join(", ") : null },
    { label: "Doświadczenie", value: member.experience },
  ].filter((row) => row.value);

  return (
    <li className={`grid gap-5 ${hasPhoto ? "sm:grid-cols-[8.5rem_1fr]" : ""}`}>
      {hasPhoto && (
        <div className="relative aspect-[4/5] w-full max-w-[8.5rem] bg-sage">
          <Photo image="therapist" sizes="8.5rem" />
        </div>
      )}
      <div>
        {member.name ? (
          <p className="text-[1.15rem] font-bold text-ink">
            {member.name}, <span className="font-normal text-muted">{member.role.toLowerCase()}</span>
          </p>
        ) : (
          <p className="text-muted">
            Imię i nazwisko fizjoterapeuty, numer prawa wykonywania zawodu (PWZFz) oraz kwalifikacje pojawią się tutaj po uzupełnieniu przez gabinet.
          </p>
        )}
        {rows.length > 0 && (
          <dl className="mt-3 space-y-1.5">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-x-4 sm:grid-cols-[9rem_1fr]">
                <dt className="text-muted">{row.label}</dt>
                <dd className="text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </li>
  );
}
