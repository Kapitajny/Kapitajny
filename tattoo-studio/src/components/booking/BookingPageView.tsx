"use client";

import { siteConfig } from "@/config/site";
import { LocalizedLink } from "@/i18n/LocalizedLink";
import { useI18n } from "@/i18n/I18nProvider";
import type { BookingData } from "@/lib/booking/schema";
import { SubpageHeader } from "@/components/layout/SubpageHeader";
import { BookingBuilder } from "./BookingBuilder";

/** Widok strony formularza — bez zależności serwerowych (konfigurację przekazuje strona). */
export function BookingPageView({
  prefill,
  deliveryConfigured,
  turnstileSiteKey,
}: {
  prefill: Partial<BookingData>;
  deliveryConfigured: boolean;
  turnstileSiteKey: string | null;
}) {
  const { t } = useI18n();
  const b = t.booking;
  const { email, phone } = siteConfig.contact;

  return (
    <>
      <SubpageHeader />
      <main id="main" className="page-x pb-24 pt-14 sm:pt-20">
        <div className="mx-auto max-w-[80rem]">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h1 className="display display-xl">{b.title}</h1>
              <p className="mt-6 flex items-center gap-4 font-mincho text-xl text-nezumi">
                <span aria-hidden="true" className="h-px w-10 shrink-0 bg-kin" />
                {b.subtitle}
              </p>
            </div>
            <div className="lg:col-span-4">
              <p className="font-gothic text-base leading-relaxed">{b.intro}</p>
              <p className="mt-3 font-gothic text-sm text-nezumi">{b.duration}</p>
            </div>
          </div>

          <div className="mt-14">
            <BookingBuilder prefill={prefill} deliveryConfigured={deliveryConfigured} turnstileSiteKey={turnstileSiteKey} contact={{ email, phone }} />
          </div>

          <aside className="mt-16 grid gap-8 border-t border-sumi/12 pt-10 font-gothic text-sm leading-relaxed text-nezumi sm:grid-cols-3">
            <div>
              <h2 className="font-mincho text-lg text-sumi">{b.aside.privacyTitle}</h2>
              <p className="mt-2">
                {b.aside.privacyBefore}
                <LocalizedLink route="privacy" className="ink-link text-sumi">
                  {b.aside.privacyLink}
                </LocalizedLink>
                {b.aside.privacyAfter}
              </p>
            </div>
            <div>
              <h2 className="font-mincho text-lg text-sumi">{b.aside.questionsTitle}</h2>
              <p className="mt-2">
                {email || phone ? (
                  <>
                    {b.aside.questionsText}{" "}
                    {email && (
                      <a href={`mailto:${email}`} className="ink-link text-sumi">
                        {email}
                      </a>
                    )}
                    {email && phone ? ", " : ""}
                    {phone && (
                      <a href={`tel:${phone.replace(/\s/g, "")}`} className="ink-link text-sumi">
                        {phone}
                      </a>
                    )}
                  </>
                ) : (
                  <span className="todo">{b.aside.contactTodo}</span>
                )}
              </p>
            </div>
            <div>
              <h2 className="font-mincho text-lg text-sumi">{b.aside.confirmationTitle}</h2>
              <p className="mt-2">{b.aside.confirmationText}</p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
