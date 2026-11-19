import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { PLACEMENT_OPTIONS, SIZE_OPTIONS, STYLE_OPTIONS } from "@/config/booking";
import { siteConfig } from "@/config/site";
import type { BookingData } from "@/lib/booking/schema";
import { isDeliveryConfigured } from "@/lib/server/env";
import { BookingBuilder } from "@/components/booking/BookingBuilder";
import { ArrowIcon } from "@/components/ui/Icons";
import { Wordmark } from "@/components/ui/Seal";

export const metadata: Metadata = {
  title: "Book your tattoo",
  description: `Opowiedz nam o swoim pomyśle na tatuaż. Formularz konsultacji studia ${siteConfig.name} w Warszawie: styl, miejsce, rozmiar, budżet i zdjęcia inspiracji.`,
  alternates: { canonical: "/rezerwacja" },
};

/** Wstępne wypełnienie z kalkulatora cen (?size=…&placement=…&style=…) — tylko znane wartości. */
function prefillFrom(params: Record<string, string | string[] | undefined>): Partial<BookingData> {
  const one = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : "");
  const prefill: Partial<BookingData> = {};
  const size = SIZE_OPTIONS.find((o) => o.id === one("size"));
  const placement = PLACEMENT_OPTIONS.find((o) => o.id === one("placement"));
  const style = STYLE_OPTIONS.find((o) => o.id === one("style"));
  if (size) prefill.size = size.id;
  if (placement) prefill.placement = placement.id;
  if (style) prefill.styles = [style.id];
  return prefill;
}

export default async function BookingPage({ searchParams }: PageProps<"/rezerwacja">) {
  // Konfiguracja odbioru zgłoszeń jest czytana przy każdym żądaniu (zmienne środowiskowe serwera).
  await connection();
  const prefill = prefillFrom(await searchParams);
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY : null;
  const { email, phone } = siteConfig.contact;

  return (
    <>
      <header className="on-dark bg-sumi text-washi">
        <div className="page-x flex items-center justify-between py-5">
          <Link href="/" aria-label={`${siteConfig.name} — strona główna`} className="rounded-sm">
            <Wordmark />
          </Link>
          <Link href="/" className="flex min-h-11 items-center gap-2 font-gothic text-sm hover:text-kinari">
            <ArrowIcon direction="left" className="h-4 w-4" />
            Back to the studio
          </Link>
        </div>
      </header>

      <main id="main" className="page-x pb-24 pt-14 sm:pt-20">
        <div className="mx-auto max-w-[62rem]">
          <h1 className="display display-xl">BOOK YOUR TATTOO</h1>
          <p className="mt-6 font-gothic text-sm font-medium tracking-[0.2em] text-nezumi">
            YOUR IDEA. OUR ARTISTRY. LET&apos;S CREATE SOMETHING UNIQUE.
          </p>
          <p className="mt-8 max-w-[36rem] font-mincho text-lg leading-[1.85]">
            Tell us about your tattoo step by step: your idea, style, placement, size and inspiration. We&apos;ll use it to prepare
            your consultation.
          </p>
          <p className="mt-4 font-gothic text-sm text-nezumi">Takes about 5–7 minutes. Six short steps.</p>

          <div className="mt-14">
            <BookingBuilder
              prefill={prefill}
              deliveryConfigured={isDeliveryConfigured()}
              turnstileSiteKey={turnstileSiteKey}
              contact={{ email, phone }}
            />
          </div>

          <aside className="mt-14 grid gap-8 border-t border-sumi/15 pt-10 font-gothic text-sm leading-relaxed text-nezumi sm:grid-cols-3">
            <div>
              <h2 className="font-mincho text-lg text-sumi">Your privacy</h2>
              <p className="mt-2">
                We use your details only to respond to this request. Read the{" "}
                <Link href="/polityka-prywatnosci" className="ink-link text-sumi">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div>
              <h2 className="font-mincho text-lg text-sumi">Questions first?</h2>
              <p className="mt-2">
                {email || phone ? (
                  <>
                    Contact the studio directly
                    {email && (
                      <>
                        {" "}
                        at{" "}
                        <a href={`mailto:${email}`} className="ink-link text-sumi">
                          {email}
                        </a>
                      </>
                    )}
                    {phone && (
                      <>
                        {email ? " or " : " "}
                        <a href={`tel:${phone.replace(/\s/g, "")}`} className="ink-link text-sumi">
                          {phone}
                        </a>
                      </>
                    )}
                    .
                  </>
                ) : (
                  <span className="todo">Dane kontaktowe studia: do uzupełnienia</span>
                )}
              </p>
            </div>
            <div>
              <h2 className="font-mincho text-lg text-sumi">Not a confirmation</h2>
              <p className="mt-2">Sending this form doesn&apos;t book an appointment. The studio will contact you to agree on a date.</p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
