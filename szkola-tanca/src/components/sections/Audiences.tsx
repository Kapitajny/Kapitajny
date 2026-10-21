"use client";

import { useStudio } from "@/components/schedule/StudioProvider";
import { ArrowRight } from "@/components/ui/Icons";
import { AUDIENCES } from "@/data/audiences";

export function Audiences() {
  const { showSchedule, requestTrial } = useStudio();

  return (
    <section id="dla-kogo" aria-labelledby="dla-kogo-title" className="on-dark section-y bg-cocoa text-ivory">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow text-blush">Dla kogo są nasze zajęcia?</p>
            <h2 id="dla-kogo-title" className="h2 mt-5">
              Znajdź grupę, w której poczujesz się <em className="text-blush">na miejscu</em>
            </h2>
          </div>
          <p className="lead prose-measure text-ivory/90 lg:col-span-5 lg:col-start-8 lg:self-end">
            Nie wiesz, od czego zacząć? Wybierz opis, który najbardziej do Ciebie pasuje – pokażemy pasujące terminy w grafiku.
          </p>
        </div>

        <ul className="mt-14 border-b rule lg:mt-20">
          {AUDIENCES.map((audience, index) => (
            <li key={audience.id} className="grid gap-4 border-t rule py-8 md:grid-cols-12 md:gap-8 md:py-10">
              <span className="font-serif text-xl text-rose md:col-span-1" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-3xl leading-tight md:col-span-4 lg:text-4xl">{audience.title}</h3>
              <div className="md:col-span-7 lg:col-span-5">
                <p className="text-ivory/90">{audience.description}</p>
                <p className="mt-4 text-sm">
                  <span className="font-semibold text-blush">Polecamy: </span>
                  {audience.recommendation}
                </p>
                {audience.demoNote && <p className="mt-2 text-sm italic text-ivory/80">{audience.demoNote}</p>}
              </div>
              <div className="md:col-span-12 md:col-start-6 lg:col-span-2 lg:col-start-auto lg:text-right">
                {audience.filter ? (
                  <button type="button" onClick={() => showSchedule(audience.filter ?? {})} className="link-arrow text-blush">
                    Pokaż terminy <ArrowRight size={18} />
                  </button>
                ) : audience.id === "mlodziez" ? (
                  <button
                    type="button"
                    onClick={() => requestTrial({ style: "nie-wiem", message: "Szukam zajęć dla dziecka / nastolatka. Proszę o informację, gdy pojawi się taka grupa." })}
                    className="link-arrow text-blush"
                  >
                    Zostaw kontakt <ArrowRight size={18} />
                  </button>
                ) : (
                  <button type="button" onClick={() => showSchedule({})} className="link-arrow text-blush">
                    Cały grafik <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
