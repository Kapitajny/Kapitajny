import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { site } from "@/config/site";
import { durationLabelLong, formatPrice, STATUS_LABELS } from "@/lib/rental";
import { getBookingForCustomer } from "@/lib/server/bookings";
import { getPublicData } from "@/lib/server/public-data";
import { formatDateTime } from "@/lib/time";
import { CancelBooking } from "@/components/booking/CancelBooking";
import { CopyLink } from "@/components/booking/CopyLink";

export const metadata: Metadata = { title: "Twoja rezerwacja", robots: { index: false, follow: false } };

async function Details({ searchParams }: { searchParams: PageProps<"/rezerwacja/potwierdzenie">["searchParams"] }) {
  const params = await searchParams;
  const nr = typeof params.nr === "string" ? params.nr : "";
  const token = typeof params.t === "string" ? params.t : "";
  const fresh = params.nowa === "1";
  const booking = nr && token ? getBookingForCustomer(nr, token) : null;
  const { settings } = await getPublicData();

  if (!booking) {
    return (
      <div className="border-t-2 border-graphite pt-8">
        <h1 className="display-lg">Nie znaleziono rezerwacji</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">Link jest niepełny albo nieprawidłowy. Skopiuj go dokładnie z potwierdzenia lub skontaktuj się z nami.</p>
        <Link href="/" className="btn mt-6">
          Strona główna
        </Link>
      </div>
    );
  }

  const active = booking.status === "pending" || booking.status === "confirmed";
  const phone = settings.contact_phone.trim();

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div>
        <p className="kicker">{fresh ? "Rezerwacja przyjęta" : "Twoja rezerwacja"}</p>
        <h1 className="display-lg mt-3">{fresh ? "Do zobaczenia na wodzie" : `Rezerwacja ${booking.number}`}</h1>
        <span className="wake mt-6 rotate-[-3deg] w-[min(36rem,90%)]" aria-hidden="true" />
        <p className="mt-6 max-w-xl text-lg text-muted">
          {booking.status === "pending" && "Rezerwacja jest wstępna. Potwierdzimy ją telefonicznie lub e-mailem. Do tego czasu termin jest zarezerwowany dla Ciebie."}
          {booking.status === "confirmed" && "Rezerwacja jest potwierdzona. Przyjedź kwadrans przed startem z dokumentem tożsamości."}
          {booking.status === "cancelled" && "Ta rezerwacja została anulowana. Termin jest ponownie dostępny dla innych."}
          {booking.status === "completed" && "Dziękujemy za wspólny czas na wodzie."}
          {booking.status === "no_show" && "Rezerwacja oznaczona jako nieobecność. Skontaktuj się z nami, jeśli to pomyłka."}
        </p>
        <div className="mt-8 border-t-2 border-graphite pt-5">
          <p className="font-semibold">Zachowaj ten link</p>
          <p className="mt-1 text-muted">Pod nim sprawdzisz status rezerwacji i w razie potrzeby ją anulujesz.</p>
          <CopyLink />
        </div>
        {active && (
          <div className="mt-8">
            <CancelBooking number={booking.number} token={booking.token} canCancel={booking.canCancel} deadline={booking.cancelDeadline} phone={phone || null} />
          </div>
        )}
      </div>
      <aside className="on-dark self-start bg-navy p-6 text-white">
        <p className="text-white/70">Numer rezerwacji</p>
        <p className="tabular font-display text-4xl font-extrabold">{booking.number}</p>
        <dl className="mt-6 grid gap-3 border-t border-slate-line pt-5">
          {[
            ["Status", STATUS_LABELS[booking.status]],
            ["Skuter", booking.jetskiName],
            ["Start", formatDateTime(booking.start)],
            ["Zwrot", formatDateTime(booking.end)],
            ["Czas", durationLabelLong(booking.duration)],
            ["Cena", formatPrice(booking.priceGr)],
            ["Kaucja", formatPrice(booking.depositGr)],
            ["Miejsce", `${site.address.street}, ${site.address.city}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="text-white/70">{k}</dt>
              <dd className="text-right font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-sm text-white/65">Płatność i kaucja na miejscu, przed wypłynięciem.</p>
      </aside>
    </div>
  );
}

export default function ConfirmationPage(props: PageProps<"/rezerwacja/potwierdzenie">) {
  return (
    <div className="on-light bg-sand pb-24 pt-28 md:pt-36">
      <div className="wrap">
        <Suspense fallback={<p className="text-muted">Ładowanie rezerwacji…</p>}>
          <Details searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
