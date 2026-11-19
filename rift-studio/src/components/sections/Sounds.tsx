"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { sounds, type SoundId } from "@/data/sounds";
import { useSite } from "@/components/providers/SiteProvider";
import { CheckIcon, PauseIcon, PlayIcon } from "@/components/ui/Icons";
import styles from "./Sounds.module.css";

/**
 * SEKCJA 2 – WYBÓR BRZMIENIA. „Przeglądarka presetów”: sześć pasów, wybrany rozszerza się
 * i pokazuje własną estetykę kierunku. Demo gra we wspólnym odtwarzaczu strony.
 */
export function Sounds({ lang, t }: { lang: Locale; t: Dictionary["sounds"] }) {
  const [open, setOpen] = useState<SoundId>("futuristic");
  const { audio, sound, setSound } = useSite();

  return (
    <section id="brzmienia" className={`section ${styles.section}`} aria-labelledby="sounds-title">
      <div className="container">
        <header className="section-head">
          <h2 id="sounds-title" className="section-title" tabIndex={-1} data-focus-target>
            {t.title}
          </h2>
          <p className="lead">{t.lead}</p>
        </header>

        <ul role="list" className={styles.strips} aria-label={t.listLabel}>
          {sounds.map((s) => {
            const isOpen = open === s.id;
            const isPlaying = audio.playing && audio.trackId === s.trackId;
            const chosen = sound === s.id;
            const panelId = `sound-${s.id}`;
            return (
              <li key={s.id} className={styles.strip} data-style={s.id} data-open={isOpen || undefined}>
                <h3 className={styles.stripHead}>
                  <button type="button" className={styles.toggle} aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(s.id)}>
                    <span className={styles.stripName}>{s.name}</span>
                    <span className={styles.stripTempo}>{s.tempo}</span>
                  </button>
                </h3>

                <div id={panelId} className={styles.panel} hidden={!isOpen}>
                  <div className={styles.media}>
                    <Image src={s.image} alt={s.imageAlt[lang]} fill sizes="(min-width: 960px) 50vw, 100vw" quality={70} className={styles.image} />
                  </div>
                  <div className={styles.body}>
                    <p className={styles.name} aria-hidden="true">
                      {s.name}
                    </p>
                    <p className={styles.tagline}>{s.tagline[lang]}</p>
                    <p className={styles.desc}>{s.description[lang]}</p>
                    <dl className={styles.meta}>
                      <div>
                        <dt>{t.tempo}</dt>
                        <dd className="tabular">{s.tempo}</dd>
                      </div>
                      <div>
                        <dt>{t.traits}</dt>
                        <dd>{s.traits[lang].join(", ")}</dd>
                      </div>
                      <div className={styles.metaWide}>
                        <dt>{t.chain}</dt>
                        <dd>{s.chain[lang]}</dd>
                      </div>
                    </dl>
                    <div className={styles.actions}>
                      <button type="button" className={`btn btn-small ${styles.listen}`} aria-pressed={isPlaying} onClick={() => audio.toggle(s.trackId)}>
                        {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                        {isPlaying ? t.pause : t.listen}
                      </button>
                      <button
                        type="button"
                        className={`btn btn-small ${styles.choose}`}
                        aria-pressed={chosen}
                        onClick={() => setSound(chosen ? "" : s.id)}
                      >
                        {chosen && <CheckIcon size={16} />}
                        {chosen ? t.chosen : t.choose}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
