"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ServiceId } from "@/data/services";
import type { SoundId } from "@/data/sounds";
import { tracks } from "@/data/tracks";

/* ───────────── audio ───────────── */

interface AudioApi {
  trackId: string;
  playing: boolean;
  error: boolean;
  volume: number;
  muted: boolean;
  /** Odtwarza wskazany utwór (albo bieżący) – wywoływać z gestu użytkownika. */
  play: (id?: string) => void;
  pause: () => void;
  toggle: (id?: string) => void;
  seek: (seconds: number) => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  getElement: () => HTMLAudioElement | null;
  getAnalyser: () => AnalyserNode | null;
}

/* ───────────── intencja rezerwacji ───────────── */

export interface BookingIntent {
  service?: ServiceId;
  durationMin?: number;
  date?: string;
  time?: string;
  /** Zmienia się przy każdym wywołaniu, żeby formularz zareagował również na tę samą wartość. */
  nonce: number;
}

interface SiteApi {
  audio: AudioApi;
  intent: BookingIntent;
  /** Kierunek brzmienia wybrany w sekcji Brzmienia lub w formularzu (stan współdzielony). */
  sound: SoundId | "";
  setSound: (sound: SoundId | "") => void;
  /** Jednorazowo wypełnia usługę / termin w formularzu rezerwacji i przewija do niego. */
  requestBooking: (intent: Omit<BookingIntent, "nonce">, opts?: { scroll?: boolean }) => void;
}

const SiteContext = createContext<SiteApi | null>(null);

export function useSite(): SiteApi {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite poza SiteProvider");
  return ctx;
}

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  // fokus na nagłówku sekcji – czytnik ekranu i klawiatura trafiają tam, gdzie wzrok
  const heading = el.querySelector<HTMLElement>("[data-focus-target]");
  heading?.focus({ preventScroll: true });
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const graphRef = useRef<{ ctx: AudioContext; analyser: AnalyserNode } | null>(null);
  const [trackId, setTrackId] = useState<string>(tracks[0].id);
  const trackIdRef = useRef(trackId);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [intent, setIntent] = useState<BookingIntent>({ nonce: 0 });
  const [sound, setSound] = useState<SoundId | "">("");

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.preload = "metadata";
      a.volume = 0.8;
      a.addEventListener("play", () => setPlaying(true));
      a.addEventListener("pause", () => setPlaying(false));
      a.addEventListener("error", () => {
        setPlaying(false);
        setError(true);
      });
      a.addEventListener("ended", () => {
        // automatycznie przechodzimy do kolejnego utworu z listy
        const i = tracks.findIndex((t) => t.id === trackIdRef.current);
        const nextTrack = tracks[(i + 1) % tracks.length];
        trackIdRef.current = nextTrack.id;
        setTrackId(nextTrack.id);
        a.src = nextTrack.src;
        a.play().catch(() => setPlaying(false));
      });
      audioRef.current = a;
    }
    return audioRef.current;
  }, []);

  /** Graf Web Audio (analizator dla spektrum) – tworzony dopiero po geście użytkownika. */
  const ensureGraph = useCallback(() => {
    if (graphRef.current || typeof window === "undefined" || !("AudioContext" in window)) return;
    try {
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(getAudio());
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.78;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      graphRef.current = { ctx, analyser };
    } catch {
      // bez analizatora odtwarzacz nadal działa – wizualizacje przechodzą w tryb spoczynku
    }
  }, [getAudio]);

  const play = useCallback(
    (id?: string) => {
      const a = getAudio();
      const target = tracks.find((t) => t.id === (id ?? trackIdRef.current)) ?? tracks[0];
      if (!a.src || target.id !== trackIdRef.current || !a.src.endsWith(target.src)) {
        a.src = target.src;
        trackIdRef.current = target.id;
        setTrackId(target.id);
      }
      setError(false);
      ensureGraph();
      void graphRef.current?.ctx.resume();
      a.play().catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(true);
        setPlaying(false);
      });
    },
    [ensureGraph, getAudio],
  );

  const pause = useCallback(() => audioRef.current?.pause(), []);

  const toggle = useCallback(
    (id?: string) => {
      const a = audioRef.current;
      const same = !id || id === trackIdRef.current;
      if (a && same && !a.paused) a.pause();
      else play(id);
    },
    [play],
  );

  const seek = useCallback(
    (seconds: number) => {
      const a = getAudio();
      if (!a.src) a.src = tracks.find((t) => t.id === trackIdRef.current)!.src;
      a.currentTime = Math.max(0, seconds);
    },
    [getAudio],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      const i = tracks.findIndex((t) => t.id === trackIdRef.current);
      const target = tracks[(i + dir + tracks.length) % tracks.length];
      const wasPlaying = audioRef.current ? !audioRef.current.paused : false;
      if (wasPlaying) play(target.id);
      else {
        trackIdRef.current = target.id;
        setTrackId(target.id);
        if (audioRef.current) audioRef.current.src = target.src;
      }
    },
    [play],
  );

  const setVolume = useCallback(
    (v: number) => {
      const a = getAudio();
      a.volume = Math.min(1, Math.max(0, v));
      a.muted = false;
      setMuted(false);
      setVolumeState(a.volume);
    },
    [getAudio],
  );

  const toggleMute = useCallback(() => {
    const a = getAudio();
    a.muted = !a.muted;
    setMuted(a.muted);
  }, [getAudio]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const requestBooking = useCallback((next: Omit<BookingIntent, "nonce">, opts: { scroll?: boolean } = {}) => {
    setIntent((prev) => ({ ...next, nonce: prev.nonce + 1 }));
    if (opts.scroll !== false) requestAnimationFrame(() => scrollToSection("rezerwacja"));
  }, []);

  const audio = useMemo<AudioApi>(
    () => ({
      trackId,
      playing,
      error,
      volume,
      muted,
      play,
      pause,
      toggle,
      seek,
      next: () => step(1),
      prev: () => step(-1),
      setVolume,
      toggleMute,
      getElement: () => audioRef.current,
      getAnalyser: () => graphRef.current?.analyser ?? null,
    }),
    [trackId, playing, error, volume, muted, play, pause, toggle, seek, step, setVolume, toggleMute],
  );

  const value = useMemo(() => ({ audio, intent, requestBooking, sound, setSound }), [audio, intent, requestBooking, sound]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
