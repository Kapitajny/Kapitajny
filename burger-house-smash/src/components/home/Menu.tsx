"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { IconChili, IconPhone } from "@/components/Icons";
import { CATEGORIES, MENU, formatPrice, type CategoryId, type MenuItem } from "@/data/menu";
import { SITE } from "@/data/site";

function Heat({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="heat" title={`Ostrość ${level} z 3`}>
      <span className="sr-only">Ostrość {level} z 3</span>
      {[1, 2, 3].map((n) => (
        <IconChili key={n} className={n <= level ? "heat__on" : "heat__off"} />
      ))}
    </span>
  );
}

function Price({ item }: { item: MenuItem }) {
  return (
    <p className="price">
      <span className="num">{formatPrice(item.price)}</span>
      {item.regular ? (
        <s className="price__was">
          <span className="sr-only">zamiast </span>
          {formatPrice(item.regular)}
        </s>
      ) : null}
    </p>
  );
}

function Order({ item }: { item: MenuItem }) {
  return (
    <a className="btn btn--sm btn--order" href={SITE.phone.href}>
      <IconPhone className="btn__ico" />
      Zamów<span className="sr-only"> {item.name} telefonicznie</span>
    </a>
  );
}

function Meta({ item }: { item: MenuItem }) {
  if (!item.tag && !item.heat) return null;
  return (
    <p className="dish__meta">
      {item.tag ? <span className="tag">{item.tag}</span> : null}
      {item.heat ? <Heat level={item.heat} /> : null}
    </p>
  );
}

/** Kategoria, w której każda pozycja ma swoje zdjęcie: pierwsza pozycja szeroka, reszta w siatce. */
function Dishes({ items }: { items: MenuItem[] }) {
  return (
    <ul className="dishes">
      {items.map((m, i) => (
        <li key={m.id} id={m.id} className="dish" data-wide={i === 0 || undefined}>
          <div className="dish__shot">
            <Image
              src={m.photo!.src}
              alt={m.photo!.alt}
              width={m.photo!.w}
              height={m.photo!.h}
              sizes={i === 0 ? "(max-width: 760px) 92vw, 40vw" : "(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 30vw"}
            />
          </div>
          <div className="dish__body">
            <Meta item={m} />
            <h3 className="dish__name">{m.name}</h3>
            <p className="dish__desc">{m.description}</p>
            <div className="dish__foot">
              <Price item={m} />
              <Order item={m} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Kategoria ze wspólnym zdjęciem: duże zdjęcie i lista pozycji obok. */
function Board({ items, photo }: { items: MenuItem[]; photo: NonNullable<(typeof CATEGORIES)[number]["photo"]> }) {
  return (
    <div className="board">
      <div className="board__shot">
        <Image src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} sizes="(max-width: 760px) 92vw, 45vw" />
      </div>
      <ul className="rows">
        {items.map((m) => (
          <li key={m.id} id={m.id} className="row">
            <div className="row__text">
              <Meta item={m} />
              <h3 className="dish__name">{m.name}</h3>
              <p className="dish__desc">{m.description}</p>
            </div>
            <div className="row__end">
              <Price item={m} />
              <Order item={m} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Menu() {
  const [active, setActive] = useState<CategoryId>(CATEGORIES[0].id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = useCallback((id: CategoryId, focus = false) => {
    setActive(id);
    const i = CATEGORIES.findIndex((c) => c.id === id);
    const el = tabs.current[i];
    if (focus) el?.focus();
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, []);

  // #fire-burger → właściwa kategoria, przewinięcie i podświetlenie
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const item = MENU.find((m) => m.id === id);
      if (!item) return;
      setActive(item.category);
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        el.classList.add("is-target");
        setTimeout(() => el.classList.remove("is-target"), 2400);
      });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = CATEGORIES.length;
    const next = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(CATEGORIES[next].id, true);
  };

  return (
    <section id="menu" className="menu" aria-labelledby="menu-title">
      <div className="wrap">
        <div className="menu__head">
          <h2 id="menu-title" className="h2" data-reveal="">
            Menu
          </h2>
          <p className="menu__intro">
            {MENU.length} pozycje w sześciu kategoriach. Zamawiasz telefonicznie pod numerem{" "}
            <a className="link num" href={SITE.phone.href}>
              {SITE.phone.display}
            </a>{" "}
            i odbierasz w jednym z dwóch lokali.
          </p>
        </div>

        <div className="tabs" role="tablist" aria-label="Kategorie menu">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`tab-${c.id}`}
              aria-selected={active === c.id}
              aria-controls={`panel-${c.id}`}
              tabIndex={active === c.id ? 0 : -1}
              onClick={() => select(c.id)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <span className="tabs__long">{c.label}</span>
              <span className="tabs__short">{c.short}</span>
              <span className="tabs__n" aria-hidden="true">
                {MENU.filter((m) => m.category === c.id).length}
              </span>
            </button>
          ))}
        </div>

        {CATEGORIES.map((c) => {
          const items = MENU.filter((m) => m.category === c.id);
          return (
            <div key={c.id} role="tabpanel" id={`panel-${c.id}`} aria-labelledby={`tab-${c.id}`} hidden={active !== c.id} className="panel" tabIndex={0}>
              <p className="panel__note">{c.note}</p>
              {c.photo ? <Board items={items} photo={c.photo} /> : <Dishes items={items} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
