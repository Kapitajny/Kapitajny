import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Icon } from "@/components/ui/Icons";
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
    <section id={id} aria-labelledby={`${id}-title`} className="section">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <SectionHeading
            title="Ludzie, którym możesz zaufać"
            id={`${id}-title`}
            lead="Zatrudniamy około 200 osób: ratowników medycznych, lekarzy, pielęgniarki, kierowców i personel organizacyjny."
          />
        </Reveal>

        {photo && (
          <div className="relative mt-10 aspect-[21/9] overflow-hidden rounded-[10px]">
            <Image src={TEAM_PHOTO} alt="Zespół medyczny Vitalis Med przy ambulansie" fill sizes="100vw" className="object-cover" />
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {teamRoles.map((role) => (
              <li key={role.title} className="flex gap-4">
                <span className="icon-badge">
                  <Icon name={role.icon} size={22} />
                </span>
                <div>
                  <h3 className="text-[1.1rem]">{role.title}</h3>
                  <p className="mt-1 text-[0.97rem] leading-relaxed">{role.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <aside aria-labelledby={`${id}-praca`} className="panel self-start p-6 lg:col-span-4">
            <h3 id={`${id}-praca`} className="text-[1.2rem]">
              Praca w&nbsp;Vitalis Med
            </h3>
            <p className="mt-2 text-[0.97rem] leading-relaxed">
              Prowadzimy rekrutację ratowników medycznych, pielęgniarek, kierowców ambulansów i&nbsp;dyspozytorów. Prześlij CV z&nbsp;informacją, na jakie
              stanowisko aplikujesz.
            </p>
            <p className="mt-4 text-[0.97rem]">
              <span className="block text-sm text-muted">Adres rekrutacji</span>
              <a href={`mailto:${careersEmail}`} className="link-quiet break-all font-bold text-ink">
                {careersEmail}
              </a>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
