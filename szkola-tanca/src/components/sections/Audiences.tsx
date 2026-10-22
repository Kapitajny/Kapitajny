"use client";

import { useState } from "react";
import { useStudio } from "@/components/schedule/StudioProvider";
import { AUDIENCES } from "@/data/audiences";

/** „Dla kogo są nasze zajęcia?” jako krótki wybór: zaznacz, co do Ciebie pasuje, a zobaczysz podpowiedź. */
export function Audiences() {
  const { showSchedule, requestTrial } = useStudio();
  const [selectedId, setSelectedId] = useState(AUDIENCES[0].id);
  const audience = AUDIENCES.find((item) => item.id === selectedId) ?? AUDIENCES[0];

  const action = () => {
    if (audience.filter) showSchedule(audience.filter);
    else if (audience.id === "mlodziez")
      requestTrial({ style: "nie-wiem", message: "Szukam zajęć dla dziecka / nastolatka. Proszę o informację, gdy pojawi się taka grupa." });
    else showSchedule({});
  };
  const actionLabel = audience.filter ? "Pokaż pasujące terminy" : audience.id === "mlodziez" ? "Zostaw kontakt" : "Zobacz cały grafik";

  return (
    <section id="dla-kogo" aria-labelledby="dla-kogo-title" className="band section-y bg-blush">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <h2 id="dla-kogo-title" className="h2 text-wine">
            Dla kogo są nasze zajęcia?
          </h2>
          <p className="lead mt-6 max-w-[40ch]">Zaznacz, co najlepiej opisuje Twoją sytuację. Podpowiemy, od czego zacząć.</p>
          <div role="group" aria-label="Twoja sytuacja" className="mt-8 flex flex-wrap gap-2">
            {AUDIENCES.map((item) => (
              <button
                key={item.id}
                type="button"
                className="chip sm:min-h-12 sm:px-5 sm:text-base"
                aria-pressed={item.id === selectedId}
                aria-controls="dla-kogo-podpowiedz"
                onClick={() => setSelectedId(item.id)}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div id="dla-kogo-podpowiedz" aria-live="polite" className="flex flex-col rounded-[1.75rem] bg-ivory p-7 sm:p-10 lg:col-span-6">
          <p className="label text-wine">Podpowiedź</p>
          <h3 className="h3 mt-2">{audience.title}</h3>
          <p className="mt-4">{audience.description}</p>
          <p className="mt-6 rounded-2xl bg-blush px-5 py-4">
            <span className="font-semibold">Polecamy na start: </span>
            {audience.recommendation}
          </p>
          {audience.demoNote && <p className="mt-3 text-sm italic">{audience.demoNote}</p>}
          <button type="button" onClick={action} className="btn btn-primary mt-8 self-start">
            {actionLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
