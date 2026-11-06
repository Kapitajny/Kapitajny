import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { teamRoles } from "@/data/team";
import { SectionHeading } from "./SectionHeading";

/**
 * ★ Zdjęcie zespołu: wgraj plik `public/images/zespol/zespol.webp` (zalecane min. 1600×900 px, poziome),
 * a pojawi się nad listą stanowisk. Do tego czasu sekcja wyświetla się bez zdjęcia.
 */
const TEAM_PHOTO = "/images/zespol/zespol.webp";

function hasTeamPhoto() {
  return existsSync(join(process.cwd(), "public", TEAM_PHOTO));
}

export function TeamSection({ id = "zespol" }: { id?: string }) {
  const photo = hasTeamPhoto();
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section bg-graphite text-white/80">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              title="Ludzie, którym możesz zaufać"
              id={`${id}-title`}
              tone="dark"
              lead="Zatrudniamy około 200 osób: ratowników medycznych, lekarzy, pielęgniarki, kierowców i personel organizacyjny. Każdy przejazd prowadzi zespół, który zna swoje zadanie – od przyjęcia zgłoszenia po przekazanie pacjenta w placówce."
            />
          </Reveal>

          <div className="lg:col-span-7">
            {photo && (
              <Reveal className="relative mb-10 aspect-[16/9] overflow-hidden">
                <Image src={TEAM_PHOTO} alt="Zespół medyczny Vitalis Med przy ambulansie" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              </Reveal>
            )}
            <ul className="grid gap-px bg-white/12 sm:grid-cols-2">
              {teamRoles.map((role) => (
                <li key={role.title} className="bg-graphite p-6 sm:p-7">
                  <Icon name={role.icon} size={28} strokeWidth={1.4} className="text-[#ff4d55]" />
                  <h3 className="mt-4 text-[1.25rem] text-white">{role.title}</h3>
                  <p className="mt-2 text-[0.97rem] leading-relaxed text-white/70">{role.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
