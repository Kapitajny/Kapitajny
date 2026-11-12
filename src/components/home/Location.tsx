import { site } from "@/config/site";
import type { PublicData } from "@/lib/server/public-data";
import { WEEKDAYS } from "@/lib/time";
import { ClockIcon, ParkingIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { MapEmbed } from "./MapEmbed";

const ORDER = [1, 2, 3, 4, 5, 6, 0];

export function Location({ data }: { data: PublicData }) {
  const { settings, hours } = data;
  const phone = settings.contact_phone.trim();
  const sameEveryDay = hours.every((h) => h.open === hours[0].open && h.close === hours[0].close);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-0">
      <div className="grid min-h-[26rem] gap-3 lg:grid-rows-[1fr_auto]">
        <MapEmbed query={site.address.mapQuery} label={`Mapa okolicy: ${site.address.city}`} fictional={site.address.fictional} />
        <div className="relative aspect-[16/7] overflow-hidden bg-slate">
          <Photo src="/images/kilwater/yamaha-gp1800r-plaza.jpg" alt="Skuter przy brzegu, w tle pomost i łodzie – zdjęcie poglądowe przystani" sizes="(min-width: 1024px) 55vw, 100vw" position="50% 75%" />
          <span className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-xs">Zdjęcie poglądowe</span>
        </div>
      </div>
      <div className="flex flex-col gap-8 lg:pl-14">
        <div className="flex gap-4">
          <PinIcon size={26} className="mt-1 shrink-0 text-turq-ink" />
          <div>
            <h3 className="font-display text-4xl font-extrabold uppercase leading-none">Przystań {site.city}</h3>
            <p className="mt-2 text-lg">
              {site.address.street}
              <br />
              {site.address.postal} {site.address.city}
            </p>
            {site.address.fictional && <p className="mt-1 text-sm text-muted">Adres przykładowy – projekt demonstracyjny.</p>}
          </div>
        </div>

        <div className="flex gap-4 border-t border-line pt-6">
          <ClockIcon size={26} className="mt-1 shrink-0 text-turq-ink" />
          <div className="min-w-0 flex-1">
            <h3 className="font-sans text-lg font-bold normal-case tracking-normal">Godziny otwarcia</h3>
            {sameEveryDay ? (
              <p className="tabular mt-1 text-lg">{hours[0].open ? `Codziennie ${hours[0].open}–${hours[0].close}` : "Przystań jest obecnie zamknięta"}</p>
            ) : (
              <dl className="tabular mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                {ORDER.map((d) => {
                  const h = hours.find((x) => x.weekday === d);
                  return (
                    <div key={d} className="contents">
                      <dt className="text-muted">{WEEKDAYS[d]}</dt>
                      <dd>{h?.open ? `${h.open}–${h.close}` : "zamknięte"}</dd>
                    </div>
                  );
                })}
              </dl>
            )}
            {settings.hours_confirmed !== "1" && <p className="mt-1 text-sm text-muted">Godziny sezonu mogą się jeszcze zmienić.</p>}
          </div>
        </div>

        <div className="flex gap-4 border-t border-line pt-6">
          <ParkingIcon size={26} className="mt-1 shrink-0 text-turq-ink" />
          <div>
            <h3 className="font-sans text-lg font-bold normal-case tracking-normal">Parking i dojazd</h3>
            <p className="mt-1 whitespace-pre-line text-muted">
              {settings.parking_info.trim() || "Informację o parkingu i dojeździe uzupełnimy wkrótce. Zadzwoń, a podpowiemy, gdzie najłatwiej zaparkować."}
            </p>
          </div>
        </div>

        <div className="flex gap-4 border-t border-line pt-6">
          <PhoneIcon size={26} className="mt-1 shrink-0 text-turq-ink" />
          <div>
            <h3 className="font-sans text-lg font-bold normal-case tracking-normal">Kontakt</h3>
            {phone ? (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="link mt-1 inline-block font-display text-3xl font-bold">
                {phone}
              </a>
            ) : (
              <p className="mt-1 text-muted">Numer telefonu podamy przed startem sezonu. Napisz przez formularz poniżej.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
