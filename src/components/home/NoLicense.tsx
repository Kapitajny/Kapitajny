import Link from "next/link";
import { jetskiTitle } from "@/lib/rental";
import type { PublicData } from "@/lib/server/public-data";
import { ClockIcon, ShieldIcon, VestIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";

const POINTS = [
  { Icon: ShieldIcon, title: "Instruktaż przed startem", text: "Na pomoście pokażemy obsługę skutera, zasady na wodzie i granice akwenu." },
  { Icon: VestIcon, title: "Kamizelka w cenie", text: "Dobieramy kamizelkę asekuracyjną do Twojego wzrostu i wagi." },
  { Icon: ClockIcon, title: "Od 30 minut", text: "Krótki wynajem na pierwszy raz albo dłuższy, gdy złapiesz rytm." },
];

/**
 * Sekcja dla osób bez patentu. Tryb wybiera administrator:
 *  - models: modele oznaczone jako dostępne bez patentu (z opisem warunków),
 *  - instructor: wypłynięcie z instruktorem, który ma uprawnienia,
 *  - hidden: informacja bez obietnic, dopóki nie ma takich modeli.
 */
export function NoLicense({ data }: { data: PublicData }) {
  const models = data.jetskis.filter((j) => j.license === "none");
  const mode = data.noLicenseMode === "models" && models.length === 0 ? "hidden" : data.noLicenseMode;
  const photo = models.find((m) => m.image) ?? data.jetskis.find((j) => j.id === "sea-doo-spark") ?? data.jetskis.find((j) => j.image);

  return (
    <section id="bez-patentu" aria-labelledby="bez-patentu-title" className="on-light bg-white py-20 md:py-28">
      <div className="wrap grid gap-10 md:grid-cols-2 md:gap-0">
        <div className="relative aspect-[16/10] self-start overflow-hidden bg-sand md:sticky md:top-28">
          {photo?.image && <Photo src={photo.image} alt={photo.imageAlt ?? jetskiTitle(photo)} sizes="(min-width: 768px) 50vw, 100vw" position="45% 50%" />}
        </div>
        <div className="flex flex-col md:pl-14 lg:pl-20">
          <span className="kicker mb-3">Bez patentu</span>
          <h2 id="bez-patentu-title" className="display-lg">
            {mode === "instructor" ? "Pierwszy raz z instruktorem" : "Pierwszy raz na skuterze?"}
          </h2>

          {mode === "models" && (
            <p className="mt-5 max-w-lg text-lg text-muted">
              Wybierz model dostępny bez patentu. Przed wypłynięciem przejdziesz instruktaż na pomoście, a my zostaniemy w kontakcie przez cały czas wynajmu.
            </p>
          )}
          {mode === "instructor" && (
            <p className="mt-5 max-w-lg text-lg text-muted">
              {data.settings.instructor_note.trim() ||
                "Nie masz patentu? Wypłyń z naszym instruktorem, który ma wymagane uprawnienia. Ty poczujesz prędkość, on czuwa nad bezpieczeństwem."}
            </p>
          )}
          {mode === "hidden" && (
            <p className="mt-5 max-w-lg text-lg text-muted">
              Bez patentu można prowadzić tylko skuter, który spełnia wymogi przepisów. Gdy takie modele pojawią się w naszej flocie, znajdziesz je tutaj. Do tego czasu
              zadzwoń lub napisz, a podpowiemy, co możemy zaproponować.
            </p>
          )}

          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {POINTS.map(({ Icon, title, text }) => (
              <li key={title} className="border-t-2 border-graphite pt-4">
                <Icon size={26} className="text-turq-ink" />
                <h3 className="mt-3 font-sans text-lg font-bold normal-case leading-snug tracking-normal">{title}</h3>
                <p className="mt-1 text-muted">{text}</p>
              </li>
            ))}
            <li className="border-t-2 border-graphite pt-4">
              <span className="font-display text-3xl font-extrabold leading-none">30′–24 h</span>
              <h3 className="mt-3 font-sans text-lg font-bold normal-case leading-snug tracking-normal">Wynajem na różny czas</h3>
              <p className="mt-1 text-muted">Osiem wariantów czasu, od pół godziny do pełnej doby.</p>
            </li>
          </ul>

          {mode === "models" && (
            <ul className="mt-8 grid gap-4">
              {models.map((m) => (
                <li key={m.id} className="bg-sand p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-display text-3xl font-extrabold uppercase">{jetskiTitle(m)}</h3>
                    <Link href={`/rezerwacja?skuter=${encodeURIComponent(m.id)}`} className="btn btn-sm">
                      Zarezerwuj
                    </Link>
                  </div>
                  {m.licenseNote && <p className="mt-2 text-muted">{m.licenseNote}</p>}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-8 border-l-4 border-turq py-1 pl-4 text-[0.95rem] text-muted">
            Brak patentu nie zwalnia z innych wymogów: obowiązują m.in. ograniczenia wieku, trzeźwość, zasady akwenu i warunki podane w opisie modelu oraz w{" "}
            <Link href="/zasady-wynajmu" className="link text-graphite">
              zasadach wynajmu
            </Link>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {mode !== "hidden" ? (
              <Link href="/rezerwacja" className="btn btn-primary">
                Zarezerwuj termin
              </Link>
            ) : (
              <Link href="/#kontakt" className="btn">
                Zapytaj o możliwości
              </Link>
            )}
            <Link href="/#faq" className="btn btn-ghost">
              Czy potrzebuję patentu?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
