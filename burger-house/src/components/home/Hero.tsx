import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/data/site";
import { PhoneIcon } from "../Icons";

export function Hero() {
  return (
    <>
      <section className="hero on-dark" aria-labelledby="hero-title">
        <div className="hero__media">
          <Image
            src="/images/hero-burger.jpg"
            alt="Podwójny cheeseburger z chrupiącymi kotletami, roztopionym cheddarem, sałatą i pomidorem w błyszczącej bułce brioche"
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            quality={85}
          />
        </div>
        <div className="container hero__inner">
          <div className="hero__content">
            <h1 id="hero-title" className="display hero__title">
              <span className="line">
                <span>Robione teraz.</span>
              </span>
              <span className="line">
                <span>Nie wcześniej.</span>
              </span>
            </h1>
            <p className="hero__text">
              Wołowinę mielimy każdego ranka, bułki pieczemy sami, a cheddar topimy na płycie dopiero, gdy złożysz zamówienie. Burgery BUŁA w Warszawie
              i Grodzisku Mazowieckim.
            </p>
            <div className="hero__cta">
              <Link className="btn" href="/#menu">
                Zobacz menu
              </Link>
              <Link className="btn btn--ghost" href="/#lokale">
                Znajdź nasz lokal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="order-bar on-red">
        <div className="container order-bar__inner">
          <p className="order-bar__label">Zamów na wynos lub na miejscu</p>
          <a className="order-bar__phone" href={SITE.phone.href} aria-label={`Zadzwoń i zamów: ${SITE.phone.display}`}>
            <PhoneIcon />
            {SITE.phone.display}
          </a>
          <p className="order-bar__hours">Codziennie od 11:00, w niedziele od 12:00</p>
        </div>
      </div>
    </>
  );
}
