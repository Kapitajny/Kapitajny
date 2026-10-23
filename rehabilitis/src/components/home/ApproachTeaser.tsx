import Link from "next/link";
import { VALUES } from "@/data/values";
import { Photo, PhotoCaption } from "@/components/ui/Photo";

/** Zapowiedź podstrony „O gabinecie”: zdjęcie i cztery zasady pracy. */
export function ApproachTeaser() {
  return (
    <section aria-labelledby="podejscie-title" className="py-section">
      <div className="page grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <figure className="lg:sticky lg:top-28">
          <div className="media aspect-[4/3]">
            <Photo image="serviceMassage" sizes="(min-width: 1024px) 34rem, 92vw" />
          </div>
          <PhotoCaption image="serviceMassage" />
        </figure>
        <div>
          <h2 id="podejscie-title" className="text-h2">
            Jak pracujemy
          </h2>
          <p className="mt-4 max-w-prose text-lead">Na wizycie się nie spieszymy. Najpierw słuchamy i pytamy, potem tłumaczymy, co proponujemy i dlaczego.</p>
          <dl className="mt-8 border-t border-line">
            {VALUES.map((value) => (
              <div key={value.title} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
                <dt className="font-bold text-brand-strong">{value.title}</dt>
                <dd>{value.text}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8">
            <Link href="/o-gabinecie" className="link">
              Więcej o gabinecie i przebiegu terapii
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
