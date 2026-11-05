"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CATEGORIES, formatPrice, MENU } from "@/data/menu";
import { SITE } from "@/data/site";
import { Phone } from "../Icons";

export function MenuBoard() {
  const [active, setActive] = useState<string>(CATEGORIES[0].id);
  const [target, setTarget] = useState<string | null>(null);

  // podświetlenie kategorii w spisie podczas przewijania
  useEffect(() => {
    const els = CATEGORIES.map((c) => document.getElementById(`kat-${c.id}`)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        // gdy sekcja menu jest jeszcze poniżej, aktywna zostaje pierwsza kategoria
        const hit = entries.filter((e) => e.isIntersecting).map((e) => e.target.id.slice(4));
        if (hit.length) setActive(hit[hit.length - 1]);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  // link #fire-burger z sekcji „ulubione” – krótkie podświetlenie pozycji
  useEffect(() => {
    const onHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (MENU.some((m) => m.id === id)) setTarget(id);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    if (!target) return;
    const t = setTimeout(() => setTarget(null), 2600);
    return () => clearTimeout(t);
  }, [target]);

  return (
    <section id="menu" className="section dark" aria-labelledby="menu-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="menu-title" className="display h2">
            Menu
          </h2>
          <p className="lead muted">
            {MENU.length} pozycje w sześciu kategoriach. Ceny brutto, takie same w Warszawie i w Grodzisku Mazowieckim.
          </p>
        </div>

        <div className="board">
          <nav className="board__nav" aria-label="Kategorie menu">
            {CATEGORIES.map((c) => (
              <a key={c.id} href={`#kat-${c.id}`} aria-current={active === c.id ? "true" : undefined}>
                <span>{c.label}</span>
                <span aria-hidden="true">{MENU.filter((m) => m.category === c.id).length}</span>
              </a>
            ))}
          </nav>

          <div className="board__cats">
            {CATEGORIES.map((c) => {
              const items = MENU.filter((m) => m.category === c.id);
              return (
                <section key={c.id} id={`kat-${c.id}`} className="cat" aria-labelledby={`kat-${c.id}-h`}>
                  <div className="cat__media">
                    <div className="cat__photo">
                      <Image src={c.banner.src} alt={c.banner.alt} fill sizes="(max-width: 1180px) 100vw, 30vw" />
                    </div>
                    <p className="cat__note">{c.note}</p>
                  </div>
                  <div>
                    <h3 id={`kat-${c.id}-h`} className="h3 cat__title">
                      {c.label}
                    </h3>
                    <ul className="items">
                      {items.map((m) => (
                        <li key={m.id} id={m.id} className={`item${target === m.id ? " is-target" : ""}`}>
                          <div className="item__thumb">
                            <Image src={`/images/menu/${m.image}`} alt="" width={64} height={64} sizes="64px" />
                          </div>
                          <div>
                            <div className="item__line">
                              <h4 className="item__name">{m.name}</h4>
                              <span className="item__dots" aria-hidden="true" />
                              <span className="item__price">{formatPrice(m.price)}</span>
                            </div>
                            <p className="item__desc">{m.description}</p>
                            {(m.tag || m.heat) && (
                              <div className="item__tags">
                                {m.tag && <span className="tag">{m.tag}</span>}
                                {m.heat && (
                                  <span className="tag tag--hot">
                                    {[1, 2, 3].map((n) => (
                                      <i key={n} className={n > m.heat! ? "off" : undefined} aria-hidden="true" />
                                    ))}
                                    Ostrość {m.heat}/3
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <div className="board__foot">
          <p>
            Burgery podajemy w maślanej bułce brioche, bułka bezglutenowa kosztuje 4 zł więcej. O alergeny w konkretnej pozycji zapytaj obsługę lokalu.
          </p>
          <a className="btn btn--mustard" href={SITE.phone.href}>
            <Phone />
            Zadzwoń i zamów
          </a>
        </div>
      </div>
    </section>
  );
}
