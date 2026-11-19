import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { canSelfManage, findByToken } from "@/lib/server/bookings";
import { ManageBooking } from "@/components/booking/ManageBooking";
import styles from "../../subpage.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/rezerwacja/[token]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: { absolute: t.manage.metaTitle }, robots: { index: false, follow: false }, referrer: "no-referrer" };
}

/** Zarządzanie rezerwacją przez link z e-maila (token w adresie, w bazie tylko jego hash). */
export default async function ManagePage({ params }: PageProps<"/[lang]/rezerwacja/[token]">) {
  const { lang, token } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const booking = await findByToken(token);

  return (
    <main id="main" className={styles.page}>
      <div className={`container ${styles.narrow}`} style={{ maxWidth: "calc(60rem + var(--gutter) * 2)" }}>
        <a href={localePath(lang, "/")} className={styles.back}>
          {t.manage.home}
        </a>
        <h1 className={styles.title}>{t.manage.title}</h1>
        {booking ? (
          <ManageBooking
            lang={lang}
            t={t}
            token={token}
            initial={{
              status: booking.status,
              service: booking.service,
              durationMin: booking.durationMin,
              startsAt: booking.startsAt,
              endsAt: booking.endsAt,
              name: booking.name,
              canManage: canSelfManage(booking),
            }}
          />
        ) : (
          <p className={styles.message} data-tone="error" role="alert">
            {t.manage.notFound}
          </p>
        )}
      </div>
    </main>
  );
}
