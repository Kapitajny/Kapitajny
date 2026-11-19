"use client";

import Image from "next/image";
import { useRef } from "react";
import { REVIEWS, SHOW_REVIEW_PLACEHOLDERS, type Review } from "@/config/reviews";
import { siteConfig } from "@/config/site";
import { WORK, workSrc, type WorkId } from "@/config/work";
import { INTL_LOCALE } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { ArrowIcon, StarIcon } from "@/components/ui/Icons";
import { SectionHeader } from "@/components/ui/SectionHeader";

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="flex gap-0.5 text-kin-deep" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} filled={n <= rating} className="h-4 w-4" />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const { t, lang } = useI18n();
  const work = review.image ? WORK.find((w) => w.id === review.image) : undefined;
  return (
    <figure className="flex h-full flex-col border border-sumi/12 bg-washi p-6 sm:p-8">
      {work && (
        <div className="relative -mx-6 -mt-6 mb-6 aspect-[4/3] overflow-hidden sm:-mx-8 sm:-mt-8">
          <Image src={workSrc(work)} alt={t.work.items[work.id as WorkId].alt} fill sizes="(min-width: 1024px) 28vw, 85vw" className="object-cover" />
        </div>
      )}
      <Stars rating={review.rating} label={t.reviews.rating(review.rating)} />
      <blockquote className="mt-5 flex-1 font-mincho text-lg leading-[1.7]" lang={review.lang}>
        <p>{review.text}</p>
      </blockquote>
      <figcaption className="mt-6 flex flex-wrap items-baseline justify-between gap-2 border-t border-sumi/10 pt-4 font-gothic text-xs text-nezumi">
        <span className="text-sm text-sumi">{review.author}</span>
        <span>
          {review.sourceUrl ? (
            <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" className="ink-link">
              {review.source}
            </a>
          ) : (
            review.source
          )}
          {review.date && (
            <time dateTime={review.date} className="ml-2">
              {new Date(review.date).toLocaleDateString(INTL_LOCALE[lang], { month: "long", year: "numeric" })}
            </time>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

export function Reviews() {
  const { t } = useI18n();
  const trackRef = useRef<HTMLUListElement>(null);
  const hasReviews = REVIEWS.length > 0;
  if (!hasReviews && !SHOW_REVIEW_PLACEHOLDERS) return null;

  const average = hasReviews ? REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length : 0;
  const links = [
    siteConfig.reviewsUrl && { href: siteConfig.reviewsUrl, label: t.reviews.readAll },
    siteConfig.social.instagram && { href: siteConfig.social.instagram, label: t.reviews.instagram },
  ].filter(Boolean) as { href: string; label: string }[];

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative bg-washi-2 py-24 sm:py-32">
      <div className="page-x">
        <SectionHeader
          id="reviews-title"
          kanji="声"
          reading="koe"
          title={t.reviews.title}
          lead={
            hasReviews ? (
              <p className="flex flex-wrap items-center gap-4">
                <Stars rating={Math.round(average)} label={t.reviews.rating(Math.round(average))} />
                <span>{t.reviews.summary(average.toFixed(1), REVIEWS.length)}</span>
              </p>
            ) : (
              <p>{t.reviews.emptyLead}</p>
            )
          }
          aside={
            links.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                    {link.label}
                    <ArrowIcon className="btn-arrow h-4 w-4" />
                  </a>
                ))}
              </div>
            )
          }
        />

        {hasReviews ? (
          <div className="mt-14">
            <ul ref={trackRef} aria-label={t.reviews.listLabel} className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-4">
              {REVIEWS.map((review, index) => (
                <li key={`${review.author}-${index}`} className="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
                  <ReviewCard review={review} />
                </li>
              ))}
            </ul>
            {REVIEWS.length > 1 && (
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => scroll(-1)} className="btn btn-line h-12 min-h-12 px-4" aria-label={t.reviews.prev}>
                  <ArrowIcon direction="left" className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => scroll(1)} className="btn btn-line h-12 min-h-12 px-4" aria-label={t.reviews.next}>
                  <ArrowIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[t.reviews.slotReview, t.reviews.slotPhoto, t.reviews.slotReview].map((label, i) => (
              <div key={i} className="flex min-h-48 flex-col justify-between border border-dashed border-sumi/30 p-6">
                <span aria-hidden="true" className="flex gap-0.5 text-sumi/25">
                  {i === 1 ? (
                    <span className="font-mincho text-3xl leading-none">写</span>
                  ) : (
                    [1, 2, 3, 4, 5].map((n) => <StarIcon key={n} filled={false} className="h-4 w-4" />)
                  )}
                </span>
                <p className="mt-8 font-gothic text-xs leading-relaxed text-nezumi">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
