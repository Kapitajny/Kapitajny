import Image from "next/image";
import { formatPrice } from "@/data/menu";
import { CAMPAIGNS, SITE } from "@/data/site";
import { Phone } from "../Icons";

export function Campaigns() {
  const [fire, lunch] = CAMPAIGNS;
  return (
    <section id="promocje" className="section" aria-labelledby="promo-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="promo-title" className="display h2">
            Promocje w tym tygodniu
          </h2>
          <p className="lead muted">Obie obowiązują w Warszawie i w Grodzisku Mazowieckim, na miejscu i na wynos. Nie łączą się z innymi rabatami.</p>
        </div>
        <div className="campaigns">
          <article className="campaign campaign--poster mustard" aria-labelledby="c-fire">
            <div className="campaign__media">
              <Image
                src="/images/c2-plakat-fire.jpg"
                alt="Plakat kampanii: Zestaw Fire, poniedziałek–czwartek, 44,99 zł zamiast 49,99 zł; Fire Burger, frytki z chili i lemoniada na żółtym tle"
                fill
                sizes="(max-width: 1000px) 100vw, 45vw"
              />
            </div>
            <div className="campaign__body">
              <p className="campaign__when">{fire.when}</p>
              <h3 id="c-fire" className="display campaign__title">
                {fire.title}
              </h3>
              <p className="lead">{fire.text}</p>
              <div className="campaign__price">
                <strong>
                  <span className="sr-only">Cena promocyjna </span>
                  {formatPrice(fire.price)}
                </strong>
                <s>
                  <span className="sr-only">Cena regularna </span>
                  {formatPrice(fire.regular)}
                </s>
              </div>
              <div>
                <a className="btn" href={SITE.phone.href}>
                  <Phone />
                  Zadzwoń i zamów
                </a>
              </div>
              <div className="campaign__extra">
                <Image src={fire.image} alt={fire.alt} width={600} height={400} sizes="28rem" />
              </div>
            </div>
          </article>

          <article className="campaign campaign--pickle" aria-labelledby="c-lunch">
            <div className="campaign__media">
              <Image src={lunch.image} alt={lunch.alt} fill sizes="(max-width: 1000px) 100vw, 55vw" />
            </div>
            <div className="campaign__body">
              <p className="campaign__when">{lunch.when}</p>
              <h3 id="c-lunch" className="display campaign__title">
                {lunch.title}
              </h3>
              <p className="lead">{lunch.text}</p>
              <div className="campaign__price">
                <strong>
                  <span className="sr-only">Cena promocyjna </span>
                  {formatPrice(lunch.price)}
                </strong>
                <s>
                  <span className="sr-only">Cena regularna </span>
                  {formatPrice(lunch.regular)}
                </s>
              </div>
              <div>
                <a className="btn btn--mustard" href={SITE.phone.href}>
                  <Phone />
                  Zamów lunch
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
