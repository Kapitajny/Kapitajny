import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { FIRST_VISIT, PRICES_ARE_EXAMPLES } from "@/data/pricing";
import { TEAM, type TeamMember } from "@/data/team";
import { VALUES } from "@/data/values";
import { getImageManifest } from "@/lib/images.server";
import { Breadcrumb } from "@/components/sections/Breadcrumb";
import { ContactStrip } from "@/components/sections/ContactStrip";
import { RangeSteps } from "@/components/sections/RangeSteps";
import { Photo, PhotoCaption } from "@/components/ui/Photo";

export const metadata: Metadata = pageMetadata({
  title: "O gabinecie – podejście, pierwsza wizyta i fizjoterapeuci",
  description: `Jak pracujemy w gabinecie ${siteConfig.name}, jak wygląda pierwsza wizyta u fizjoterapeuty, co zabrać i kto prowadzi terapię.`,
  path: "/o-gabinecie",
});

const BRING = ["wygodny strój, w którym można odsłonić bolące miejsce", "wyniki badań, wypisy ze szpitala, zalecenia lekarza", "skierowanie, jeśli je masz", "listę przyjmowanych leków"];

export default function AboutPage() {
  const images = getImageManifest();
  const roomPhoto = images.clinicRoom.src ? "clinicRoom" : "serviceIndividual";
  const good = [
    "Na wizytę prywatną nie potrzebujesz skierowania.",
    FIRST_VISIT?.duration
      ? `Pierwsza wizyta trwa ${FIRST_VISIT.duration}${FIRST_VISIT.price ? ` i kosztuje ${FIRST_VISIT.price}${PRICES_ARE_EXAMPLES ? " (cena przykładowa)" : ""}` : ""}.`
      : null,
    siteConfig.bookingUrl
      ? "Termin zarezerwujesz online lub przez formularz kontaktowy."
      : siteConfig.contact.phone
        ? "Termin ustalisz telefonicznie lub przez formularz kontaktowy."
        : "Termin ustalisz przez formularz kontaktowy.",
  ].filter(Boolean) as string[];

  return (
    <>
      {/* Nagłówek: zdanie o sposobie pracy zamiast hasła, obok jedno pionowe zdjęcie */}
      <header className="content pt-10 lg:pt-16">
        <Breadcrumb current="O gabinecie" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16">
          <div>
            <h1 className="text-h2">O gabinecie</h1>
            <p className="mt-8 max-w-[24ch] text-h3 font-medium text-brand-deep [font-stretch:78%]">
              Na wizycie się nie spieszymy. Najpierw słuchamy i pytamy, potem tłumaczymy, co proponujemy i dlaczego.
            </p>
            <div className="mt-8 max-w-prose space-y-4">
              <p>
                Przychodzą do nas osoby po urazach i operacjach, z bólem, który przeszkadza w pracy, i takie, które chcą znów pewnie się ruszać. Plan
                terapii układamy razem z Tobą. Bierzemy pod uwagę zalecenia lekarza, Twoje możliwości i to, co jest dla Ciebie ważne na co dzień.
              </p>
              <p>Nie obiecujemy szybkich efektów. Mówimy otwarcie, czego można się spodziewać, i zmieniamy plan, gdy coś nie działa.</p>
            </div>
          </div>
          <figure className="lg:pt-4">
            <div className="photo aspect-[4/5]">
              <Photo image={roomPhoto} preload sizes="(min-width: 1280px) 22rem, (min-width: 1024px) 28vw, 92vw" />
            </div>
            <PhotoCaption image={roomPhoto} />
          </figure>
        </div>
      </header>

      {/* Zasady pracy: siatka 2 × 2 z cienką linią u góry, bez kart i ikon */}
      <section aria-labelledby="zasady" className="content py-section">
        <h2 id="zasady" className="text-h2">
          Zasady, których się trzymamy
        </h2>
        <dl className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {VALUES.map((value) => (
            <div key={value.title} className="border-t-2 border-brand pt-5">
              <dt className="type-condensed text-h3">{value.title}</dt>
              <dd className="mt-3 max-w-prose">{value.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="przebieg" aria-labelledby="przebieg-title" className="bg-white py-section">
        <div className="content">
          <h2 id="przebieg-title" className="text-h2">
            Jak wygląda pierwsza wizyta
          </h2>
          <div className="mt-10">
            <RangeSteps />
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="text-h3">Co zabrać</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {BRING.map((item) => (
                  <li key={item} className="py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-h3">Dobrze wiedzieć</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {good.map((item) => (
                  <li key={item} className="py-3">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5">
                <Link href="/faq" className="link">
                  Najczęstsze pytania
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="zespol" className="content py-section">
        <h2 id="zespol" className="text-h2">
          Fizjoterapeuci
        </h2>
        <ul className="mt-10 grid gap-6 lg:grid-cols-2">
          {TEAM.map((member, i) => (
            <TherapistProfile key={member.name ?? i} member={member} hasPhoto={Boolean(images.therapist.src)} />
          ))}
        </ul>
      </section>

      <ContactStrip />
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
    <li className={`grid gap-6 rounded-photo bg-mint p-6 md:p-8 ${hasPhoto ? "sm:grid-cols-[10rem_minmax(0,1fr)]" : ""}`}>
      {hasPhoto && (
        <div className="photo aspect-[4/5] w-full max-w-40">
          <Photo image="therapist" sizes="10rem" />
        </div>
      )}
      <div>
        <p className="text-h3 type-condensed">{member.name ?? member.role}</p>
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
          <p className="mt-3 max-w-prose text-muted">
            Imię i nazwisko, numer prawa wykonywania zawodu (PWZFz) i kwalifikacje pojawią się tutaj po uzupełnieniu przez gabinet.
          </p>
        )}
      </div>
    </li>
  );
}
