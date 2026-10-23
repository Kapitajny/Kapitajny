import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { FIRST_VISIT, PRICES_ARE_EXAMPLES } from "@/data/pricing";
import { TEAM, type TeamMember } from "@/data/team";
import { VALUES } from "@/data/values";
import { getImageManifest } from "@/lib/images.server";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageIntro } from "@/components/sections/PageIntro";
import { VisitSteps } from "@/components/sections/VisitSteps";
import { Photo, PhotoCaption } from "@/components/ui/Photo";

export const metadata: Metadata = {
  title: "O gabinecie – podejście, pierwsza wizyta i fizjoterapeuci",
  description: `Jak pracujemy w gabinecie ${siteConfig.name}, jak wygląda pierwsza wizyta u fizjoterapeuty, co zabrać i kto prowadzi terapię.`,
  alternates: { canonical: "/o-gabinecie" },
};

const BRING = ["wygodny strój, w którym można odsłonić bolące miejsce", "wyniki badań, wypisy ze szpitala, zalecenia lekarza", "skierowanie, jeśli je masz", "listę przyjmowanych leków"];

export default function AboutPage() {
  const images = getImageManifest();
  const roomPhoto = images.clinicRoom.src ? "clinicRoom" : "hero";
  const good = [
    "Na wizytę prywatną nie potrzebujesz skierowania.",
    FIRST_VISIT?.duration
      ? `Pierwsza wizyta trwa ${FIRST_VISIT.duration}${FIRST_VISIT.price ? ` i kosztuje ${FIRST_VISIT.price}${PRICES_ARE_EXAMPLES ? " (cena przykładowa)" : ""}` : ""}.`
      : null,
    siteConfig.bookingUrl ? "Termin zarezerwujesz online, telefonicznie lub przez formularz." : "Termin ustalisz telefonicznie lub przez formularz kontaktowy.",
  ].filter(Boolean) as string[];

  return (
    <>
      <PageIntro
        title="O gabinecie"
        lead="Na wizycie się nie spieszymy. Najpierw słuchamy i pytamy, potem tłumaczymy, co proponujemy i dlaczego. Po każdej wizycie wiesz, co robimy dalej."
      />

      <section aria-labelledby="podejscie" className="py-section">
        <div className="page grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 id="podejscie" className="text-h2">
              Nasze podejście
            </h2>
            <div className="mt-5 max-w-prose space-y-4">
              <p>
                Przychodzą do nas osoby po urazach i operacjach, z bólem, który przeszkadza w pracy, i takie, które chcą znów pewnie się ruszać. Plan
                terapii układamy razem z Tobą. Bierzemy pod uwagę zalecenia lekarza, Twoje możliwości i to, co jest dla Ciebie ważne na co dzień.
              </p>
              <p>Nie obiecujemy szybkich efektów. Mówimy otwarcie, czego można się spodziewać, i zmieniamy plan, gdy coś nie działa.</p>
            </div>
            <dl className="mt-10 grid gap-x-10 border-t border-line sm:grid-cols-2">
              {VALUES.map((value) => (
                <div key={value.title} className="border-b border-line py-5">
                  <dt className="font-bold text-brand-strong">{value.title}</dt>
                  <dd className="mt-1">{value.text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure>
            <div className="media aspect-[4/5] lg:aspect-[3/4]">
              <Photo image={roomPhoto} sizes="(min-width: 1024px) 32rem, 92vw" />
            </div>
            <PhotoCaption image={roomPhoto} />
          </figure>
        </div>
      </section>

      <section id="pierwsza-wizyta" aria-labelledby="pierwsza-wizyta-title" className="scroll-mt-24 bg-brand-soft py-section">
        <div className="page grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 id="pierwsza-wizyta-title" className="text-h2">
              Jak wygląda pierwsza wizyta
            </h2>
            <VisitSteps layout="timeline" />
          </div>
          <div className="space-y-10 lg:pt-16">
            <div>
              <h3 className="text-h3">Co zabrać</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-brand">
                {BRING.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-h3">Dobrze wiedzieć</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-brand">
                {good.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-4">
                <Link href="/faq" className="link">
                  Najczęstsze pytania
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="zespol" className="py-section">
        <div className="page">
          <h2 id="zespol" className="text-h2">
            Fizjoterapeuci
          </h2>
          <ul className="mt-8 grid gap-8 lg:grid-cols-2">
            {TEAM.map((member, i) => (
              <TherapistProfile key={member.name ?? i} member={member} hasPhoto={Boolean(images.therapist.src)} />
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
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
    <li className={`grid gap-6 border-t-2 border-brand-strong pt-6 ${hasPhoto ? "sm:grid-cols-[10rem_minmax(0,1fr)]" : ""}`}>
      {hasPhoto && (
        <div className="media aspect-[4/5] w-full max-w-40">
          <Photo image="therapist" sizes="10rem" />
        </div>
      )}
      <div>
        {member.name ? (
          <p className="text-h3 font-bold text-brand-strong">{member.name}</p>
        ) : (
          <p className="text-h3 font-bold text-brand-strong">{member.role}</p>
        )}
        {member.name && <p className="text-muted">{member.role}</p>}
        {rows.length > 0 ? (
          <dl className="mt-4 space-y-1.5">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-x-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
                <dt className="text-muted">{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-2 max-w-prose text-muted">
            Imię i nazwisko, numer prawa wykonywania zawodu (PWZFz) i kwalifikacje pojawią się tutaj po uzupełnieniu przez gabinet.
          </p>
        )}
      </div>
    </li>
  );
}
