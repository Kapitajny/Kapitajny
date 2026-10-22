import { TEAM, type TeamMember } from "@/data/team";
import { Pending } from "@/components/ui/Pending";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="o-gabinecie" aria-labelledby="o-gabinecie-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeading id="o-gabinecie-title" eyebrow="O gabinecie" className="lg:col-span-5">
            Miejsce, w którym <em className="italic text-forest">masz czas</em> na powrót do formy
          </SectionHeading>

          <div className="space-y-5 text-[1.05rem] leading-relaxed text-graphite lg:col-span-6 lg:col-start-7 lg:pt-12">
            <p>
              Wierzymy, że skuteczna rehabilitacja zaczyna się od relacji. Dlatego na wizycie nie spieszymy się – słuchamy, pytamy i tłumaczymy, zanim
              zaproponujemy jakiekolwiek ćwiczenie czy zabieg.
            </p>
            <p>
              Każdy pacjent przychodzi z inną historią: po urazie, po operacji, z bólem, który utrudnia pracę, albo z potrzebą odzyskania pewności w ruchu.
              Plan terapii tworzymy wspólnie, uwzględniając zalecenia lekarskie, Twoje możliwości i to, co jest dla Ciebie ważne na co dzień.
            </p>
            <p>
              Zależy nam, aby po każdej wizycie było jasne, co robimy dalej i jak możesz wspierać terapię samodzielnie – bez obietnic, których nie da się
              uczciwie złożyć.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-12">
          {TEAM.map((member, i) => (
            <TherapistProfile key={member.name ?? i} member={member} id={`terapeuta-${i + 1}`} />
          ))}

          <Reveal className="lg:col-span-5">
            <figure>
              <div className="relative aspect-[16/11] overflow-hidden rounded-lg bg-sage">
                <Photo image="clinicRoom" sizes="(min-width: 1024px) 36vw, 92vw" placeholderLabel="Miejsce na zdjęcie wnętrza gabinetu" />
              </div>
              <figcaption className="mt-3 text-sm text-muted">Wnętrze gabinetu – zdjęcie do uzupełnienia.</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function TherapistProfile({ member, id }: { member: TeamMember; id: string }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Wykształcenie", value: member.education ?? <Pending>potwierdzone wykształcenie</Pending> },
    {
      label: "Kwalifikacje i specjalizacje",
      value: member.qualifications?.length ? (
        <ul className="space-y-1">
          {member.qualifications.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      ) : (
        <Pending>kwalifikacje, kursy, specjalizacje</Pending>
      ),
    },
    { label: "Doświadczenie zawodowe", value: member.experience ?? <Pending>rzeczywiste doświadczenie</Pending> },
  ];
  if (member.licenseNumber) rows.push({ label: "Numer PWZFz", value: member.licenseNumber });

  return (
    <Reveal as="article" aria-labelledby={id} className="grid gap-8 sm:grid-cols-[minmax(0,15rem)_1fr] lg:col-span-7">
      <div className="arch relative aspect-[4/5] w-full max-w-60 overflow-hidden bg-sage">
        <Photo image="therapist" sizes="15rem" placeholderLabel="Miejsce na zdjęcie fizjoterapeuty" />
      </div>
      <div>
        <p className="eyebrow">{member.role}</p>
        <h3 id={id} className="mt-3 text-[clamp(1.7rem,1.4rem+1vw,2.3rem)]">
          {member.name ?? (
            <span className="text-lg">
              <Pending>imię i nazwisko</Pending>
            </span>
          )}
        </h3>
        <dl className="mt-6 divide-y divide-line border-y border-line">
          {rows.map((row) => (
            <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-ink">{row.label}</dt>
              <dd className="text-[0.98rem] text-graphite">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Reveal>
  );
}
