import Image from "next/image";
import { REVIEWS, SHOW_REVIEW_PLACEHOLDERS, type Review } from "@/config/reviews";
import { siteConfig } from "@/config/site";
import { workById, workSrc } from "@/config/work";
import { ArrowIcon, StarIcon } from "@/components/ui/Icons";
import { SectionMark } from "@/components/ui/SectionMark";

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`flex gap-0.5 ${className}`} role="img" aria-label={`Ocena ${rating} na 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} filled={n <= rating} className="h-4 w-4" />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const work = review.image ? workById(review.image) : null;
  return (
    <figure className="break-inside-avoid border border-sumi/15 bg-washi p-6 sm:p-7">
      {work && (
        <div className="relative -mx-6 -mt-6 mb-6 aspect-[4/3] overflow-hidden sm:-mx-7 sm:-mt-7">
          <Image src={workSrc(work)} alt={work.alt} fill sizes="(min-width: 1024px) 28vw, 90vw" className="object-cover" />
        </div>
      )}
      <Stars rating={review.rating} />
      <blockquote className="mt-5 font-mincho text-lg leading-[1.75]">
        <p>{review.text}</p>
      </blockquote>
      <figcaption className="mt-6 flex flex-wrap items-baseline justify-between gap-2 font-gothic text-xs text-nezumi">
        <span className="text-sm text-sumi">{review.author}</span>
        <span>
          {review.tattoo && <span>{review.tattoo}. </span>}
          {review.sourceUrl ? (
            <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" className="ink-link">
              {review.source}
            </a>
          ) : (
            review.source
          )}
          {review.date && (
            <time dateTime={review.date} className="ml-2">
              {new Date(review.date).toLocaleDateString("pl-PL", { month: "long", year: "numeric" })}
            </time>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

/** Puste miejsce na prawdziwą opinię — oznaczone, aby nikt nie wziął go za opinię. */
function ReviewSlot({ kind }: { kind: "review" | "photo" }) {
  return (
    <div className="break-inside-avoid border border-dashed border-sumi/30 p-6 sm:p-7">
      {kind === "photo" ? (
        <div className="flex aspect-[4/5] flex-col items-center justify-center gap-3 bg-washi-2 text-center">
          <span className="font-mincho text-4xl text-sumi/30" aria-hidden="true">
            写
          </span>
          <span className="max-w-[14rem] font-gothic text-xs leading-relaxed text-nezumi">
            Miejsce na zdjęcie od klienta lub post z mediów społecznościowych
          </span>
        </div>
      ) : (
        <>
          <span className="flex gap-0.5 text-sumi/25" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
              <StarIcon key={n} filled={false} className="h-4 w-4" />
            ))}
          </span>
          <div className="mt-6 space-y-3" aria-hidden="true">
            <span className="block h-2.5 w-full bg-sumi/[0.07]" />
            <span className="block h-2.5 w-11/12 bg-sumi/[0.07]" />
            <span className="block h-2.5 w-3/5 bg-sumi/[0.07]" />
          </div>
          <p className="mt-6 font-gothic text-xs text-nezumi">Miejsce na opinię klienta: ocena, treść, imię i źródło</p>
        </>
      )}
    </div>
  );
}

export function Reviews() {
  const hasReviews = REVIEWS.length > 0;
  if (!hasReviews && !SHOW_REVIEW_PLACEHOLDERS) return null;

  const average = hasReviews ? REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length : 0;
  const links = [
    siteConfig.reviewsUrl && { href: siteConfig.reviewsUrl, label: "Read all reviews" },
    siteConfig.social.instagram && { href: siteConfig.social.instagram, label: "Follow on Instagram" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="page-x relative py-24 sm:py-32">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionMark kanji="声" reading="koe" className="hidden lg:col-span-1 lg:flex" />
        <div className="lg:col-span-11">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 id="reviews-title" className="display display-lg">
                CLIENT REVIEWS
              </h2>
              {hasReviews ? (
                <p className="mt-5 flex items-center gap-4 font-mincho text-lg">
                  <Stars rating={Math.round(average)} />
                  <span>
                    {average.toFixed(1).replace(".", ",")} / 5. Opinie: {REVIEWS.length}
                  </span>
                </p>
              ) : (
                <p className="mt-5 max-w-[34rem] font-mincho text-lg leading-relaxed text-nezumi">
                  Tu pojawią się prawdziwe opinie klientów studia, zdjęcia zagojonych prac i materiały z mediów
                  społecznościowych.
                </p>
              )}
            </div>
            {links.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                    {link.label}
                    <ArrowIcon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {hasReviews ? (
              REVIEWS.map((review, index) => <ReviewCard key={`${review.author}-${index}`} review={review} />)
            ) : (
              <>
                <ReviewSlot kind="review" />
                <ReviewSlot kind="photo" />
                <ReviewSlot kind="review" />
                <ReviewSlot kind="review" />
                <ReviewSlot kind="photo" />
                <ReviewSlot kind="review" />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
