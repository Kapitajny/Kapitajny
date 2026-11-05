import Image from "next/image";
import { formatPrice, getItem, PROMO } from "@/data/menu";
import { SITE } from "@/data/site";
import { PhoneIcon } from "../Icons";

export function Promo() {
  const item = getItem(PROMO.itemId);
  return (
    <section className="promo on-dark" aria-labelledby="promo-title">
      <div className="promo__media">
        <Image
          src="/images/promo-fire.jpg"
          alt="Fire Burger z jalapeño i ostrym sosem, frytki w czerwonym kartoniku i napój z lodem na ciemnoczerwonym tle"
          fill
          sizes="100vw"
          quality={75}
        />
      </div>
      <div className="container promo__inner">
        <div className="promo__content" data-reveal>
          <p className="promo__badge">Promocja od poniedziałku do czwartku</p>
          <h2 id="promo-title" className="display promo__title">
            {item.name}
          </h2>
          <p className="lead">{item.description}</p>
          <div className="promo__price">
            <strong>
              <span className="sr-only">Cena promocyjna: </span>
              {formatPrice(PROMO.price)}
            </strong>
            <s>
              <span className="sr-only">Cena regularna: </span>
              {formatPrice(PROMO.regular)}
            </s>
          </div>
          <div>
            <a className="btn" href={SITE.phone.href}>
              <PhoneIcon />
              Zadzwoń i zamów
            </a>
          </div>
          <p className="promo__note">{PROMO.validity} Nie łączy się z innymi promocjami.</p>
        </div>
      </div>
    </section>
  );
}
