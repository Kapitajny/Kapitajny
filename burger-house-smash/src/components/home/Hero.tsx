import Image from "next/image";
import { IconPhone } from "@/components/Icons";
import { STICKER } from "@/components/Logo";
import { FROM_PRICE, formatPrice } from "@/data/menu";
import { SITE } from "@/data/site";
import { PlacePicker } from "./PlacePicker";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__in wrap">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line">Chrupie</span> <span className="hero__line">na brzegach.</span> <span className="hero__line">Cieknie</span>{" "}
            <span className="hero__line">w środku.</span>
          </h1>
          <p className="hero__lead">Kulę świeżo mielonej wołowiny dociskamy stalową prasą do blachy rozgrzanej do 230°C. Smażymy dopiero, kiedy zamówisz.</p>
          <div className="hero__cta">
            <a className="btn btn--order btn--lg" href={SITE.phone.href}>
              <IconPhone className="btn__ico" />
              Zamów teraz
            </a>
            <a className="btn btn--ghost btn--lg" href="#menu">
              Zobacz menu
            </a>
          </div>
        </div>
        <figure className="hero__shot">
          <Image
            src="/images/hero.jpg"
            alt="Podwójny smash cheeseburger: dwa cienkie kotlety z chrupiącymi, koronkowymi brzegami, roztopiony cheddar, ogórki i siekana cebula"
            width={1264}
            height={1264}
            sizes="(max-width: 760px) 100vw, 52vw"
            quality={85}
            preload
          />
          <p className="hero__sticker">
            <svg viewBox="0 0 128 128" aria-hidden="true">
              <path d={STICKER} />
            </svg>
            <span>
              burgery od <strong>{formatPrice(FROM_PRICE).replace(" zł", "")}</strong> zł
            </span>
          </p>
        </figure>
      </div>
      <PlacePicker />
    </section>
  );
}
