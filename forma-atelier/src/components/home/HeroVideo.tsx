"use client";

import { Pause, Play } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import poster from "@/assets/film/hero-poster.jpg";

const SOURCES = {
  webm: "/video/forma-atelier-hero-1080.webm",
  mp4: "/video/forma-atelier-hero-1080.mp4",
  mobileWebm: "/video/forma-atelier-hero-720.webm",
  mobile: "/video/forma-atelier-hero-720.mp4",
};

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/** Czy warto w ogóle pobierać film? Przy oszczędzaniu danych i wolnym łączu zostaje poster. */
function connectionAllowsVideo() {
  const c = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!c) return true;
  if (c.saveData) return false;
  return !["slow-2g", "2g", "3g"].includes(c.effectiveType ?? "");
}

function pickSource(video: HTMLVideoElement) {
  const small = window.matchMedia("(max-width: 820px)").matches;
  // H.264 MP4 działa wszędzie poza przeglądarkami bez kodeków własnościowych — tam wybieramy VP9
  const h264 = video.canPlayType('video/mp4; codecs="avc1.640028"') !== "";
  const vp9 = video.canPlayType('video/webm; codecs="vp9"') !== "";
  if (small) return h264 ? SOURCES.mobile : SOURCES.mobileWebm;
  return vp9 ? SOURCES.webm : SOURCES.mp4;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroVideo() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState<"pending" | "video" | "poster">("pending");

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Film ładujemy dopiero po wyrenderowaniu strony (poster jest LCP), nigdy przy reduced motion.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !connectionAllowsVideo()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- jednorazowa decyzja zależna od API przeglądarki
      setMode("poster");
      setPaused(true);
      return;
    }
    const start = () => {
      v.src = pickSource(v);
      v.load();
      v.play().catch(() => {
        // autoplay zablokowany (np. tryb oszczędzania energii) — zostaje poster z przyciskiem odtwarzania
        setPaused(true);
      });
      setMode("video");
    };
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle ? window.requestIdleCallback(start, { timeout: 1200 }) : globalThis.setTimeout(start, 300);
    return () => {
      if (hasIdle) window.cancelIdleCallback(handle as number);
      else globalThis.clearTimeout(handle);
    };
  }, []);

  // Pauza, gdy hero jest poza ekranem — oszczędza baterię i procesor.
  useEffect(() => {
    const v = video.current;
    const el = section.current;
    if (!v || !el || mode !== "video") return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !paused) v.play().catch(() => setPaused(true));
      else v.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [mode, paused]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (mode !== "video") {
      v.src = pickSource(v);
      setMode("video");
    }
    if (v.paused) {
      v.play()
        .then(() => setPaused(false))
        .catch(() => setPaused(true));
    } else {
      v.pause();
      setPaused(true);
    }
  };

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.4, ease, delay: reduce ? 0 : delay },
  });

  return (
    <section ref={section} aria-label="FORMA ATELIER — film" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-graphite text-paper">
      <motion.div className="absolute inset-0" style={{ scale: mediaScale }}>
        <Image src={poster} alt="" fill preload sizes="100vw" quality={82} className="object-cover" placeholder="blur" />
        <video
          ref={video}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-[var(--ease-out-soft)] ${ready ? "opacity-100" : "opacity-0"}`}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          poster={poster.src}
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          onPlaying={() => {
            setReady(true);
            setPaused(false);
          }}
        />
      </motion.div>

      {/* warstwa czytelności: delikatne przyciemnienie całości + mocniej u dołu, gdzie stoi tekst pomocniczy */}
      <div aria-hidden="true" className="absolute inset-0 bg-[rgb(26_24_20/0.34)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgb(26_24_20/0.55),transparent)]" />
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="grain" />
      </div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="shell relative flex h-full flex-col items-center justify-center text-center">
        <motion.p className="t-caps mb-7 text-[0.8125rem] tracking-[0.42em] text-paper/90" {...enter(0.2)}>
          Forma Atelier
        </motion.p>
        <motion.h1 className="t-display max-w-[14ch]" {...enter(0.45)}>
          Przestrzeń, która ma znaczenie.
        </motion.h1>
        <motion.p className="t-caps mt-8 text-paper/85" {...enter(0.7)}>
          Architektura wnętrz <span aria-hidden="true" className="mx-3 text-sand">|</span>
          <span className="sr-only">, </span>Warszawa
        </motion.p>
        <motion.div className="mt-11" {...enter(0.9)}>
          <Link href="/realizacje" className="btn btn-light t-caps min-h-14 px-9 text-[0.75rem] tracking-[0.22em]" transitionTypes={["nav-forward"]}>
            Odkryj nasze realizacje
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="shell pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between pb-8 md:pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: reduce ? 0 : 1.4 }}
      >
        <p className="t-meta hidden max-w-[19rem] text-paper/80 lg:block">
          Tworzymy wnętrza, w których estetyka spotyka się z funkcjonalnością. Od pierwszej koncepcji po finalny detal.
        </p>
        <a
          href="#pracownia"
          className="pointer-events-auto absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 text-paper/80 md:bottom-10"
        >
          <span className="t-caps text-[0.6875rem] tracking-[0.3em] whitespace-nowrap">Scroll to explore</span>
          <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-paper/25">
            <span className="scroll-cue-line absolute inset-0 bg-paper" />
          </span>
        </a>
        <div className="pointer-events-auto ml-auto flex items-center justify-end gap-6">
          <Link href="/kontakt" className="t-meta link-line hidden text-paper/90 md:inline">
            Porozmawiajmy o projekcie
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-label={paused ? "Odtwórz film w tle" : "Zatrzymaj film w tle"}
            className="grid h-10 w-10 place-items-center rounded-full border border-paper/40 text-paper transition-colors duration-500 hover:border-paper hover:bg-paper hover:text-graphite"
          >
            {paused ? <Play size={14} strokeWidth={1.5} aria-hidden="true" /> : <Pause size={14} strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
