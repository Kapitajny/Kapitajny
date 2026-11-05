/* eslint-disable @next/next/no-html-link-for-pages -- linki do sekcji (/#menu) celowo jako <a>: <Link> nie przewija, gdy router uważa adres za niezmieniony po kliknięciu kotwicy w spisie kategorii */
import { SITE } from "@/data/site";
import { CitiesStatus } from "../OpenStatus";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className="mega hero__title">
        <span className="hero__line hero__l1">
          <span>Dobry</span>
        </span>{" "}
        <span className="hero__line hero__l2">
          <span>Burger</span>
        </span>{" "}
        <span className="hero__line hero__l3">
          <span>bez kompromisów.</span>
        </span>
      </h1>
      <div className="grid hero__foot">
        <p className="prose hero__intro">
          Wołowina mielona każdego ranka, bułka z naszej piekarni, cheddar topiony na płycie dopiero po zamówieniu. Dwa lokale, jedna krótka karta.
        </p>
        <div className="hero__cta">
          <a className="btn" href="/#menu">
            Poznaj menu
          </a>
        </div>
        <div className="hero__side">
          <CitiesStatus />
          <a className="link num" href={SITE.phone.href}>
            {SITE.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
