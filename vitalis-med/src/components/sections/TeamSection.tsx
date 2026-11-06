import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";
import { teamRoles } from "@/data/team";
import { SectionHeading } from "./SectionHeading";

/**
 * ★ Zdjęcie zespołu: wgraj plik `public/images/zespol/zespol.webp` (zalecane min. 1600×900 px, poziome),
 * a pojawi się w sekcji. Do tego czasu sekcja wyświetla się bez zdjęcia.
 */
const TEAM_PHOTO = "/images/zespol/zespol.webp";

function hasTeamPhoto() {
  return existsSync(join(process.cwd(), "public", TEAM_PHOTO));
}

/** Przykładowy adres rekrutacyjny w domenie z danych kontaktowych. */
const careersEmail = `praca@${siteConfig.contact.email.split("@")[1]}`;

export function TeamSection({ id = "zespol" }: { id?: string }) {
  const photo = hasTeamPhoto();
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section bg-mist">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-4">
          <SectionHeading
            title="Ludzie, którym możesz zaufać"
            id={`${id}-title`}
            lead="Zatrudniamy około 200 osób: ratowników medycznych, lekarzy, pielęgniarki, kierowców i personel organizacyjny."
          />
          <div aria-labelledby={`${id}-praca`} role="group" className="mt-10 border-t border-line-strong pt-6">
            <h3 id={`${id}-praca`} className="text-[1.15rem]">
              Praca w&nbsp;Vitalis Med
            </h3>
            <p className="mt-2 text-[0.97rem] font-light leading-relaxed">
              Prowadzimy rekrutację ratowników medycznych, pielęgniarek, kierowców ambulansów i&nbsp;dyspozytorów. Prześlij CV z&nbsp;informacją, na jakie
              stanowisko aplikujesz.
            </p>
            <a href={`mailto:${careersEmail}`} className="link-arrow mt-4 [overflow-wrap:anywhere]">
              {careersEmail}
            </a>
          </div>
        </Reveal>

        <div className="lg:col-span-7 lg:col-start-6">
          {photo && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[24px]">
              <Image src={TEAM_PHOTO} alt="Zespół medyczny Vitalis Med przy ambulansie" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            </div>
          )}
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {teamRoles.map((role) => (
              <li key={role.title} className="border-t border-line-strong py-6">
                <h3 className="text-[1.15rem]">{role.title}</h3>
                <p className="mt-2 text-[0.97rem] font-light leading-relaxed">{role.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
