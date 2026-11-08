import { CATEGORY_IDS, PORTFOLIO } from "@/data/portfolio";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { resolveImage } from "@/lib/images.server";
import { Gallery, type GalleryItem } from "./Gallery";
import styles from "./Portfolio.module.css";

export function Portfolio({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.portfolio;
  const items: GalleryItem[] = PORTFOLIO.map((item) => ({
    id: item.image,
    category: item.category,
    title: t.items[item.image].title,
    place: t.items[item.image].place,
    year: item.year,
    photo: resolveImage(item.image, dict),
  }));
  const categories = CATEGORY_IDS.map((id) => ({ id, label: t.categories[id], count: PORTFOLIO.filter((item) => item.category === id).length }));

  return (
    <section id="portfolio" tabIndex={-1} className={styles.section} aria-labelledby="portfolio-title">
      <div className="container">
        <header className={styles.intro}>
          <h2 id="portfolio-title" className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.lead}>{t.lead}</p>
        </header>
        <Gallery
          items={items}
          categories={categories}
          locale={locale}
          t={{ all: t.all, filterLabel: t.filterLabel, photos: t.photos, showing: t.showing, open: t.open }}
          lightbox={dict.lightbox}
        />
      </div>
    </section>
  );
}
