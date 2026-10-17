"use client";

import { LOCATIONS, formatHours, getDirectionsUrl, getLocation } from "@/data/locations";
import { useCart } from "@/components/cart/CartProvider";
import { CheckIcon, ClockIcon, InfoIcon, PinIcon, RouteIcon } from "@/components/ui/Icons";
import { MapEmbed } from "./MapEmbed";
import { SectionHeading } from "./SectionHeading";

export function Locations() {
  const { locationId, setLocation, notify } = useCart();
  const selected = getLocation(locationId);
  const anyUnverified = LOCATIONS.some((l) => !l.verified);

  return (
    <section id="lokale" aria-labelledby="lokale-title" className="bg-paper py-24 lg:py-32">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="lokale-title" index="05" eyebrow="Nasze lokale" className="lg:col-span-7">
            Znajdź swój <em className="italic text-latte">NOIR</em>
          </SectionHeading>
          <p className="text-muted lg:col-span-4 lg:col-start-9">
            Trzy miejsca w Gdańsku. Wybierz lokal, a Twoje zamówienie online będzie czekało właśnie tam.
          </p>
        </div>

        {anyUnverified && (
          <p className="mt-10 flex max-w-3xl items-start gap-3 rounded-xl border border-dashed border-latte/60 bg-cream px-5 py-4 text-sm leading-relaxed text-espresso">
            <InfoIcon size={18} className="mt-0.5 shrink-0 text-latte" />
            <span>
              Adresy i godziny otwarcia poniżej to <strong className="font-semibold">dane demonstracyjne</strong>. Nie są zweryfikowanymi lokalizacjami
              działających kawiarni i wymagają uzupełnienia przed uruchomieniem sprzedaży.
            </span>
          </p>
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <ul className="space-y-4 lg:col-span-5">
            {LOCATIONS.map((location, i) => {
              const isSelected = location.id === selected?.id;
              return (
                <li key={location.id}>
                  <article
                    aria-labelledby={`location-${location.id}`}
                    className={`rounded-2xl border p-6 transition-[border-color,box-shadow] duration-300 sm:p-7 ${
                      isSelected ? "border-roast bg-cream shadow-[var(--shadow-soft)]" : "border-line bg-paper hover:border-oat"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium tabular-nums text-latte">0{i + 1}</p>
                        <h3 id={`location-${location.id}`} className="mt-1 text-3xl">
                          {location.district}
                        </h3>
                        <p className="mt-1 text-sm text-muted">{location.name}</p>
                      </div>
                      {isSelected && (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-roast px-3 py-1 text-xs font-medium text-paper">
                          <CheckIcon size={14} /> Twój lokal
                        </span>
                      )}
                    </div>

                    <dl className="mt-5 grid gap-3 text-sm">
                      <div className="flex gap-3">
                        <dt className="sr-only">Adres</dt>
                        <PinIcon size={18} className="mt-0.5 shrink-0 text-latte" />
                        <dd>
                          {location.street}, {location.city}
                          {!location.verified && (
                            <span className="ml-2 rounded-sm bg-sand px-1.5 py-0.5 text-[0.7rem] uppercase tracking-wider text-muted">
                              adres demonstracyjny
                            </span>
                          )}
                        </dd>
                      </div>
                      <div className="flex gap-3">
                        <dt className="sr-only">Godziny otwarcia{location.verified ? "" : " (przykładowe)"}</dt>
                        <ClockIcon size={18} className="mt-0.5 shrink-0 text-latte" />
                        <dd className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
                          <span className="text-muted">pon.–pt.</span>
                          <span className="tabular-nums">{formatHours(location.hours.weekdays)}</span>
                          <span className="text-muted">sob.–niedz.</span>
                          <span className="tabular-nums">{formatHours(location.hours.weekend)}</span>
                          {!location.verified && <span className="col-span-2 mt-1 text-xs text-muted">Godziny przykładowe.</span>}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => {
                          setLocation(location.id);
                          notify({ message: `Odbiór: ${location.name}`, detail: "Lokal zapisany w Twoim zamówieniu.", showCartAction: true });
                        }}
                        className={`btn btn-sm ${isSelected ? "btn-secondary" : "btn-primary"}`}
                      >
                        {isSelected ? (
                          <>
                            <CheckIcon size={16} /> Wybrany lokal
                          </>
                        ) : (
                          "Wybierz ten lokal"
                        )}
                      </button>
                      <a href={getDirectionsUrl(location)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                        <RouteIcon size={16} /> Pokaż trasę
                        <span className="sr-only">(otwiera Google Maps w nowej karcie)</span>
                      </a>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24 lg:h-[calc(100dvh-8rem)] lg:max-h-[44rem]">
              <MapEmbed selected={selected} anyUnverified={anyUnverified} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
