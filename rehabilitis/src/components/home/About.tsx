import { TEAM, type TeamMember } from "@/data/team";
import { PendingValue } from "@/components/ui/Pending";
import { Photo } from "@/components/ui/Photo";

export function About() {
  return (
    <section id="o-gabinecie" aria-labelledby="o-gabinecie-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="o-gabinecie-title" className="h2">
              O gabinecie
            </h2>
            <div className="mt-5 space-y-4 text-lg text-graphite">
              <p>
                Skuteczna rehabilitacja zaczyna się od relacji. Na wizycie nie spieszymy się: słuchamy, pytamy i tłumaczymy, zanim zaproponujemy ćwiczenie
                czy zabieg.
              </p>
              <p>
                Każdy przychodzi z inną historią – po urazie, po operacji, z bólem, który utrudnia pracę, albo z potrzebą odzyskania pewności w ruchu. Plan
                terapii tworzymy wspólnie, uwzględniając zalecenia lekarskie, Twoje możliwości i to, co jest dla Ciebie ważne na co dzień.
              </p>
              <p>Po każdej wizycie wiesz, co robimy dalej i jak możesz wspierać terapię samodzielnie.</p>
            </div>
          </div>
          <figure>
            <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-sage">
              <Photo image="clinicRoom" sizes="(min-width: 1024px) 34rem, 92vw" placeholderLabel="Zdjęcie gabinetu" />
            </div>
          </figure>
        </div>

        <h3 className="mt-16 text-2xl">Fizjoterapeuci</h3>
        <ul className="mt-6 grid gap-6 lg:grid-cols-2">
          {TEAM.map((member, i) => (
            <TherapistCard key={member.name ?? i} member={member} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function TherapistCard({ member }: { member: TeamMember }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Numer PWZFz", value: member.licenseNumber ?? <PendingValue /> },
    { label: "Wykształcenie", value: member.education ?? <PendingValue /> },
    {
      label: "Kwalifikacje",
      value: member.qualifications?.length ? member.qualifications.join(", ") : <PendingValue />,
    },
    { label: "Doświadczenie", value: member.experience ?? <PendingValue /> },
  ];

  return (
    <li className="grid gap-6 rounded-lg border border-line bg-white p-5 sm:grid-cols-[10rem_1fr]">
      <div className="relative aspect-[4/5] w-full max-w-40 overflow-hidden rounded-md bg-sage">
        <Photo image="therapist" sizes="10rem" placeholderLabel="Zdjęcie" />
      </div>
      <div>
        <p className="text-xl font-semibold text-ink">{member.name ?? "Imię i nazwisko"}</p>
        {!member.name && <PendingValue />}
        <p className="text-muted">{member.role}</p>
        <dl className="mt-4 space-y-2 text-[0.95rem]">
          {rows.map((row) => (
            <div key={row.label} className="grid gap-x-4 sm:grid-cols-[8rem_1fr]">
              <dt className="text-muted">{row.label}</dt>
              <dd className="text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </li>
  );
}
