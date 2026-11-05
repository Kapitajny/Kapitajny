import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/data/site";
import { Arrow } from "../Icons";

export function Hero() {
  return (
    <section className="hero mustard" aria-labelledby="hero-title">
      <div className="hero__copy">
        <div className="hero__copy-main">
          <p className="kicker" style={{ color: "var(--ink)" }}>
            Burgerownia w Warszawie i Grodzisku Mazowieckim
          </p>
          <h1 id="hero-title" className="display hero__title">
            Burger robimy wtedy, kiedy go zamawiasz.
          </h1>
          <p className="hero__text">
            Wołowina mielona każdego ranka, bułka z naszej piekarni i cheddar topiony na płycie. Od zamówienia do lady mija około siedmiu minut.
          </p>
          <div className="hero__cta">
            <Link className="btn" href="/#menu">
              Zobacz menu
              <Arrow />
            </Link>
            <Link className="link" href="/#lokale">
              Znajdź nasz lokal
            </Link>
          </div>
        </div>
        <div className="ticket" aria-label="Zamówienie telefoniczne">
          <div className="ticket__row">
            <span>Zamówienie telefoniczne</span>
            <span>na wynos i na miejscu</span>
          </div>
          <a className="ticket__phone" href={SITE.phone.href}>
            {SITE.phone.display}
          </a>
          <hr />
          <div className="ticket__row">
            <span>Odbiór</span>
            <span>ok. 15 min</span>
          </div>
          <div className="ticket__row">
            <span>Płatność</span>
            <span>karta, BLIK, gotówka</span>
          </div>
        </div>
      </div>
      <div className="hero__media">
        <Image
          src="/images/c2-hero.jpg"
          alt="Dłonie trzymają podwójnego cheeseburgera w białym papierze na tle musztardowej ściany w słońcu"
          fill
          preload
          fetchPriority="high"
          sizes="(max-width: 1000px) 100vw, 55vw"
          quality={85}
        />
      </div>
    </section>
  );
}
