import Image from "next/image";
import { formatPrice } from "@/data/menu";
import { PROMOS, SITE } from "@/data/site";

export function Promos() {
  const { fire, lunch } = PROMOS;
  return (
    <section id="promocje" className="section frame" aria-labelledby="promo-title">
      <h2 id="promo-title" className="sr-only">
        Promocje
      </h2>
      <article aria-labelledby="promo-fire">
        <div className="mega promo-a__type promo-a__row">
          <h3 id="promo-fire" className="promo-a__word">
            Ogień
          </h3>
          <p className="promo-a__price num">
            <span className="sr-only">Cena promocyjna: </span>
            {formatPrice(fire.price).replace(" zł", "")}
          </p>
        </div>
        <div className="reveal">
          <Image
            className="promo-a__img"
            src="/images/promo-fire.jpg"
            alt="Zestaw Fire w jednym rzędzie: burger z jalapeño, frytki z chili i lemoniada z limonką na jasnym stole"
            width={1680}
            height={944}
            sizes="100vw"
          />
        </div>
        <div className="grid promo-a__info">
          <p className="prose">
            {fire.title}: Fire Burger, frytki z przyprawą chili i lemoniada domowa. Zamiast {formatPrice(fire.regular)} płacisz {formatPrice(fire.price)}.
          </p>
          <p className="label grey promo-a__terms">
            {fire.when}. W obu lokalach, na miejscu i na wynos. Nie łączy się z innymi promocjami.
          </p>
          <a className="btn" href={SITE.phone.href}>
            Zamów zestaw
          </a>
        </div>
      </article>

      <article className="grid promo-b" aria-labelledby="promo-lunch">
        <figure className="promo-b__img reveal">
          <Image
            src="/images/promo-lunch.jpg"
            alt="Dłoń trzyma cheeseburgera w białym papierze nad jasnym biurkiem, obok cola z lodem i laptop"
            width={1136}
            height={1408}
            sizes="(max-width: 760px) 82vw, 40vw"
          />
        </figure>
        <div className="promo-b__text">
          <p className="mega promo-b__hours num" aria-hidden="true">
            12–15
          </p>
          <h3 id="promo-lunch" className="title">
            {lunch.title}
          </h3>
          <p className="prose grey">Classic Burger, frytki klasyczne i napój 0,4 l. {lunch.when}.</p>
          <div className="promo-b__price">
            <strong className="num">{formatPrice(lunch.price)}</strong>
            <s className="grey num">
              <span className="sr-only">Cena regularna </span>
              {formatPrice(lunch.regular)}
            </s>
          </div>
          <div>
            <a className="btn btn--line" href={SITE.phone.href}>
              Zamów lunch
            </a>
          </div>
        </div>
      </article>
    </section>
  );
}
