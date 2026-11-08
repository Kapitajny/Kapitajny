"use client";

import { useState } from "react";
import type { ResolvedImage } from "@/config/images";
import type { CategoryId } from "@/data/portfolio";
import { format, plural, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/pl";
import { Lightbox } from "./Lightbox";
import { Photo } from "./Photo";
import { Unveil } from "./Unveil";
import styles from "./Gallery.module.css";

export interface GalleryItem {
  id: string;
  category: CategoryId;
  title: string;
  place: string;
  year: number;
  photo: ResolvedImage;
}

type GalleryTexts = Pick<Dictionary["portfolio"], "all" | "filterLabel" | "photos" | "showing" | "open">;

type Filter = CategoryId | "all";

/**
 * Galeria w asymetrycznym rytmie: sześć różnych pozycji w siatce 12 kolumn powtarza się,
 * a proporcje kadrów pochodzą ze zdjęć. Po kliknięciu kadru otwiera się lightbox.
 */
export function Gallery({
  items,
  categories,
  locale,
  t,
  lightbox,
}: {
  items: GalleryItem[];
  categories: { id: CategoryId; label: string; count: number }[];
  locale: Locale;
  t: GalleryTexts;
  lightbox: Dictionary["lightbox"];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visible = filter === "all" ? items : items.filter((item) => item.category === filter);
  const labelOf = (id: CategoryId) => categories.find((category) => category.id === id)?.label ?? id;
  const filters: { id: Filter; label: string; count: number }[] = [{ id: "all", label: t.all, count: items.length }, ...categories];

  return (
    <>
      <div className={styles.filters} role="group" aria-label={t.filterLabel}>
        {filters.map((option) => (
          <button
            key={option.id}
            type="button"
            className={styles.filter}
            aria-pressed={filter === option.id}
            onClick={() => {
              setFilter(option.id);
              setOpenIndex(null);
            }}
          >
            {option.label}
            <sup className={styles.count}>
              <span className="visually-hidden">, </span>
              {option.count}
              <span className="visually-hidden"> {plural(locale, option.count, t.photos)}</span>
            </sup>
          </button>
        ))}
      </div>

      <p className="visually-hidden" aria-live="polite">
        {format(t.showing, { label: filter === "all" ? t.all : labelOf(filter), count: visible.length, photos: plural(locale, visible.length, t.photos) })}
      </p>

      <ul role="list" className={styles.grid} key={filter} data-filter={filter}>
        {visible.map((item, index) => (
          <li key={item.id} className={`${styles.item} ${item.photo.aspect === "2/3" ? styles.tall : ""}`} style={{ ["--n" as string]: index }}>
            <figure className={styles.figure}>
              <button type="button" className={styles.open} onClick={() => setOpenIndex(index)} aria-label={format(t.open, { title: item.title })}>
                <Unveil className={styles.frame} style={{ aspectRatio: item.photo.aspect }}>
                  <Photo
                    image={item.photo}
                    label={labelOf(item.category)}
                    sizes="(min-width: 1200px) 50vw, (min-width: 600px) 66vw, 92vw"
                  />
                </Unveil>
              </button>
              <figcaption className={styles.caption}>
                <span className={styles.captionTitle}>{item.title}</span>
                <span className={styles.captionMeta}>
                  {filter === "all" && <span className={styles.captionCategory}>{labelOf(item.category)}</span>}
                  <span>
                    {item.place}, {item.year}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <Lightbox
        items={visible.map((item) => ({ photo: item.photo, title: item.title, meta: `${labelOf(item.category)}, ${item.place}, ${item.year}` }))}
        index={openIndex}
        onIndexChange={setOpenIndex}
        t={lightbox}
      />
    </>
  );
}
