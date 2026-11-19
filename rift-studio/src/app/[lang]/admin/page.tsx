import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { isAdminConfigured, isAdminRequest } from "@/lib/server/admin-auth";
import { AdminDashboard, AdminLogin } from "@/components/admin/Admin";
import styles from "../subpage.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/admin">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: { absolute: t.admin.metaTitle }, robots: { index: false, follow: false } };
}

/** Panel studia: lista rezerwacji, potwierdzanie / anulowanie, blokady terminów. */
export default async function AdminPage({ params }: PageProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  // zawsze renderowany na żądanie: stan logowania i konfiguracja ENV są sprawdzane w czasie działania
  await connection();
  const t = await getDictionary(lang);
  const configured = isAdminConfigured();
  const loggedIn = configured && (await isAdminRequest());

  return (
    <main id="main" className={styles.page}>
      <div className={`container ${styles.wide}`}>
        <h1 className={styles.title}>{t.admin.title}</h1>
        {!configured ? (
          <p className={styles.message} data-tone="error">
            {t.admin.notConfigured}
          </p>
        ) : loggedIn ? (
          <AdminDashboard lang={lang} t={t} />
        ) : (
          <AdminLogin t={t.admin} />
        )}
      </div>
    </main>
  );
}
