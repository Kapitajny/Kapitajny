import type { Metadata } from "next";
import Link from "next/link";
import { FAQ } from "@/data/faq";
import { VALUES } from "@/data/values";
import { getLocalBusinessJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { Hero } from "@/components/home/Hero";
import { Testimonials } from "@/components/home/Testimonials";
import { Conditions } from "@/components/sections/Conditions";
import { ContactStrip } from "@/components/sections/ContactStrip";
import { FaqList } from "@/components/sections/FaqList";
import { RangeSteps } from "@/components/sections/RangeSteps";
import { ServiceMenu } from "@/components/sections/ServiceMenu";
import { Photo, PhotoCaption } from "@/components/ui/Photo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const HOME_FAQ = ["pierwsza-wizyta", "przygotowanie", "czas-trwania"];

export default function HomePage() {
  const jsonLd = getLocalBusinessJsonLd();
  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />}
      <Hero />

      <div className="bg-white">
        <Conditions />
      </div>

      {/* Usługi: karta z cenami obok jednego zdjęcia z ćwiczeń */}
      <section aria-labelledby="uslugi-title" className="content py-section">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <h2 id="uslugi-title" className="text-h2">
              Usługi i ceny
            </h2>
            <p className="mt-5 max-w-prose text-muted">Każdą terapię poprzedza rozmowa i ocena. Pełne opisy, czas wizyt i zakres znajdziesz na stronie usług.</p>
            <figure className="mt-10 hidden lg:block">
              <div className="photo aspect-[4/5]">
                <Photo image="serviceBack" sizes="(min-width: 1280px) 22rem, 30vw" />
              </div>
              <PhotoCaption image="serviceBack" />
            </figure>
          </div>
          <div>
            <ServiceMenu />
            <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <Link href="/uslugi" className="link">
                Opisy usług
              </Link>
              <Link href="/cennik" className="link">
                Pełny cennik i pakiety
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Przebieg pierwszej wizyty – jedyne miejsce z motywem łuku zakresu ruchu na stronie głównej */}
      <section aria-labelledby="przebieg-title" className="content pb-section">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="przebieg-title" className="max-w-[18ch] text-h2">
            Pierwsza wizyta krok po kroku
          </h2>
          <p className="max-w-sm text-muted">Nie musisz wiedzieć, jakiej terapii potrzebujesz. Ustalimy to razem na pierwszym spotkaniu.</p>
        </div>
        <div className="mt-10">
          <RangeSteps />
        </div>
        <p className="mt-6">
          <Link href="/o-gabinecie#przebieg" className="link">
            Co zabrać i jak się przygotować
          </Link>
        </p>
      </section>

      {/* O gabinecie: dwa zdjęcia z ćwiczeń i zasady pracy */}
      <section aria-labelledby="podejscie-title" className="bg-white py-section">
        <div className="content grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="grid grid-cols-5 gap-4 self-start">
            <figure className="col-span-3">
              <div className="photo aspect-[3/4]">
                <Photo image="servicePostOp" sizes="(min-width: 1024px) 22rem, 55vw" />
              </div>
            </figure>
            <figure className="col-span-2 mt-16">
              <div className="photo aspect-[3/5]">
                <Photo image="serviceExercise" sizes="(min-width: 1024px) 14rem, 36vw" />
              </div>
            </figure>
            <PhotoCaption image="servicePostOp" className="col-span-5 !mt-0" asParagraph />
          </div>
          <div>
            <h2 id="podejscie-title" className="text-h2">
              Jak pracujemy
            </h2>
            <p className="mt-5 max-w-prose text-lead">
              Na wizycie się nie spieszymy. Najpierw słuchamy i pytamy, potem tłumaczymy, co proponujemy i dlaczego.
            </p>
            <dl className="mt-10 divide-y divide-line border-y border-line">
              {VALUES.map((value) => (
                <div key={value.title} className="grid gap-1 py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="font-semibold text-brand-deep">{value.title}</dt>
                  <dd className="text-small">{value.text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8">
              <Link href="/o-gabinecie" className="link">
                Więcej o gabinecie
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Testimonials />

      <section aria-labelledby="faq-skrot-title" className="content py-section">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <h2 id="faq-skrot-title" className="text-h2">
              Zanim przyjdziesz
            </h2>
            <p className="mt-5">
              <Link href="/faq" className="link">
                Wszystkie pytania i odpowiedzi
              </Link>
            </p>
          </div>
          <FaqList items={FAQ.filter((item) => HOME_FAQ.includes(item.id))} />
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
