"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { fmt, type Dictionary } from "@/i18n/dictionaries";
import { tracks } from "@/data/tracks";
import { useSite } from "@/components/providers/SiteProvider";
import { Cover } from "@/components/work/Cover";
import { InfoIcon, MuteIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, VolumeIcon } from "@/components/ui/Icons";
import styles from "./Work.module.css";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** SEKCJA 5 – DIGITAL SHOWCASE: odtwarzacz ze spektrum (Web Audio API) i siatka realizacji. */
export function Work({ lang, t }: { lang: Locale; t: Dictionary["work"] }) {
  const { audio } = useSite();
  const track = tracks.find((x) => x.id === audio.trackId) ?? tracks[0];
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef(audio);
  useEffect(() => {
    audioRef.current = audio;
  }, [audio]);

  // czas odtwarzania
  useEffect(() => {
    const el = audio.getElement();
    if (!el) return;
    const update = () => setTime(el.currentTime || 0);
    update();
    el.addEventListener("timeupdate", update);
    el.addEventListener("seeked", update);
    el.addEventListener("emptied", update);
    return () => {
      el.removeEventListener("timeupdate", update);
      el.removeEventListener("seeked", update);
      el.removeEventListener("emptied", update);
    };
  }, [audio, audio.trackId, audio.playing]);

  // spektrum
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const BARS = 72;
    const levels = new Float32Array(BARS);
    let data: Uint8Array<ArrayBuffer> | null = null;
    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    function draw() {
      const analyser = audioRef.current.playing ? audioRef.current.getAnalyser() : null;
      if (analyser) {
        if (!data || data.length !== analyser.frequencyBinCount) data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
      }
      const nyquist = (analyser?.context.sampleRate ?? 44100) / 2;
      ctx!.clearRect(0, 0, w, h);
      const gap = 3;
      const bw = (w - gap * (BARS - 1)) / BARS;
      const grad = ctx!.createLinearGradient(0, h, 0, 0);
      grad.addColorStop(0, "#3be8ff");
      grad.addColorStop(1, "#8a63ff");
      for (let i = 0; i < BARS; i++) {
        // skala logarytmiczna 30 Hz – 16 kHz
        let target = 0;
        if (data) {
          const f0 = 30 * Math.pow(16000 / 30, i / BARS);
          const f1 = 30 * Math.pow(16000 / 30, (i + 1) / BARS);
          const b0 = Math.floor((f0 / nyquist) * data.length);
          const b1 = Math.max(b0 + 1, Math.floor((f1 / nyquist) * data.length));
          let sum = 0;
          for (let b = b0; b < b1; b++) sum += data[b];
          target = sum / (b1 - b0) / 255;
        }
        levels[i] += (target - levels[i]) * (target > levels[i] ? 0.6 : 0.12);
        const bh = Math.max(2, levels[i] * h);
        ctx!.fillStyle = data ? grad : "rgba(233,237,243,0.12)";
        ctx!.fillRect(i * (bw + gap), h - bh, bw, bh);
      }
    }

    const loop = () => {
      if (visible && !document.hidden) draw();
      raf = requestAnimationFrame(loop);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const current = audio.trackId === track.id ? time : 0;
  const progress = Math.min(1, current / track.duration);
  const status = fmt(audio.playing ? t.player.playing : t.player.paused, { title: track.title });

  return (
    <section id="realizacje" className={`section ${styles.section}`} aria-labelledby="work-title">
      <div className="container">
        <header className="section-head">
          <h2 id="work-title" className="section-title" tabIndex={-1} data-focus-target>
            {t.title}
          </h2>
          <p className="lead">{t.lead}</p>
        </header>

        <p className={`demo-note ${styles.notice}`}>
          <InfoIcon size={16} />
          {t.demoNotice}
        </p>

        <div className={styles.player} role="region" aria-label={t.player.label}>
          <div className={styles.deck}>
            <div className={styles.coverLarge}>
              <Cover track={track} uid="player" />
            </div>

            <div className={styles.info}>
              <p className={styles.now}>
                <span className={`${styles.led} ${audio.playing ? styles.ledOn : ""}`} aria-hidden="true" />
                {t.player.nowPlaying}
                <span className={styles.badge}>{t.demoBadge}</span>
              </p>
              <h3 className={styles.title}>{track.title}</h3>
              <dl className={styles.meta}>
                <div>
                  <dt>{t.meta.type}</dt>
                  <dd>{track.type[lang]}</dd>
                </div>
                <div>
                  <dt>{t.meta.bpm}</dt>
                  <dd className="tabular">{track.bpm} BPM</dd>
                </div>
                <div>
                  <dt>{t.meta.key}</dt>
                  <dd>{track.key[lang]}</dd>
                </div>
                <div>
                  <dt>{t.meta.length}</dt>
                  <dd className="tabular">{clock(track.duration)}</dd>
                </div>
              </dl>

              <div className={styles.transport}>
                <button type="button" className={styles.tbtn} onClick={audio.prev} aria-label={t.player.prev}>
                  <PrevIcon />
                </button>
                <button type="button" className={`${styles.tbtn} ${styles.playBtn}`} onClick={() => audio.toggle()} aria-label={audio.playing ? t.player.pause : t.player.play}>
                  {audio.playing ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
                </button>
                <button type="button" className={styles.tbtn} onClick={audio.next} aria-label={t.player.next}>
                  <NextIcon />
                </button>
                <span className={`${styles.time} tabular`} aria-hidden="true">
                  {clock(current)} / {clock(track.duration)}
                </span>
                <div className={styles.volume}>
                  <button type="button" className={styles.tbtn} onClick={audio.toggleMute} aria-label={audio.muted ? t.player.unmute : t.player.mute} aria-pressed={audio.muted}>
                    {audio.muted ? <MuteIcon /> : <VolumeIcon />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={audio.muted ? 0 : audio.volume}
                    onChange={(e) => audio.setVolume(Number(e.target.value))}
                    aria-label={t.player.volume}
                    aria-valuetext={`${Math.round((audio.muted ? 0 : audio.volume) * 100)}%`}
                    className={styles.range}
                  />
                </div>
              </div>
            </div>
          </div>

          <canvas ref={canvasRef} className={styles.spectrum} role="img" aria-label={t.player.spectrum} />

          <div className={styles.seek} style={{ "--progress": progress } as React.CSSProperties}>
            <svg viewBox={`0 0 ${track.peaks.length * 4} 40`} preserveAspectRatio="none" aria-hidden="true" className={styles.peaks}>
              {track.peaks.map((p, i) => {
                const hgt = Math.max(2, p * 38);
                return <rect key={i} x={i * 4} y={20 - hgt / 2} width="2.4" height={hgt} className={i / track.peaks.length < progress ? styles.peakOn : styles.peak} />;
              })}
            </svg>
            <input
              type="range"
              min={0}
              max={track.duration}
              step={0.5}
              value={current}
              onChange={(e) => audio.seek(Number(e.target.value))}
              aria-label={t.player.seek}
              aria-valuetext={`${clock(current)} / ${clock(track.duration)}`}
              className={styles.seekInput}
            />
          </div>

          {audio.error && (
            <p className={styles.error} role="alert">
              {t.player.error}
            </p>
          )}
          <p className="sr-only" aria-live="polite">
            {audio.playing || current > 0 ? status : ""}
          </p>
        </div>

        <ul role="list" className={styles.grid}>
          {tracks.map((tr) => {
            const active = tr.id === audio.trackId;
            const playing = active && audio.playing;
            return (
              <li key={tr.id} className={styles.card} data-active={active || undefined}>
                <div className={styles.cardCover}>
                  <Cover track={tr} uid="card" />
                  <button
                    type="button"
                    className={styles.cardPlay}
                    onClick={() => audio.toggle(tr.id)}
                    aria-label={fmt(playing ? t.pauseTrack : t.playTrack, { title: tr.title })}
                    aria-pressed={playing}
                  >
                    {playing ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
                  </button>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{tr.title}</h3>
                  <p className={styles.cardType}>{tr.type[lang]}</p>
                  <p className={`${styles.cardMeta} tabular`}>
                    <span>{tr.bpm} BPM</span>
                    <span>{tr.key[lang]}</span>
                    <span>{clock(tr.duration)}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
