import { lang as rootLang } from "next/root-params";
import { hasLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import styles from "./subpage.module.css";

export default async function NotFound() {
  const raw = await rootLang();
  const lang = hasLocale(raw) ? raw : "pl";
  const t = await getDictionary(lang);
  return (
    <main id="main" className={styles.page}>
      <div className={`container ${styles.narrow}`}>
        <h1 className={styles.title}>{t.notFound.title}</h1>
        <p className="lead">{t.notFound.text}</p>
        <a href={localePath(lang, "/")} className="btn btn-primary" style={{ justifySelf: "start" }}>
          {t.notFound.home}
        </a>
      </div>
    </main>
  );
}
