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
              eyebrow="Nasz zespół"
              title="Ludzie, którym możesz zaufać"
              id={`${id}-title`}
              tone="dark"
              lead="Za każdym przejazdem stoi zespół, który zna swoje zadanie: od dyspozytora przyjmującego zgłoszenie po ratowników przekazujących pacjenta w placówce."
            />
            <div className="mt-12 flex items-end gap-5 border-t border-white/15 pt-8">
              <p className="font-display text-7xl font-semibold leading-[0.85] tracking-tight text-white" style={{ fontStretch: "82%" }}>
                ~200
              </p>
              <p className="pb-1 text-[0.98rem] leading-snug text-white/70">
                pracowników medycznych,
                <br />
                transportowych i organizacyjnych
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            {photo && (
              <Reveal className="relative mb-10 aspect-[16/9] overflow-hidden">
                <Image src={TEAM_PHOTO} alt="Zespół medyczny Vitalis Med przy ambulansie" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              </Reveal>
            )}
            <ul className="grid gap-px bg-white/12 sm:grid-cols-2">
              {teamRoles.map((role, i) => (
                <Reveal as="li" key={role.title} delay={i * 60} className="bg-graphite p-6 sm:p-7">
                  <Icon name={role.icon} size={28} strokeWidth={1.4} className="text-[#ff4d55]" />
                  <h3 className="mt-4 text-[1.25rem] text-white">{role.title}</h3>
                  <p className="mt-2 text-[0.97rem] leading-relaxed text-white/70">{role.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
