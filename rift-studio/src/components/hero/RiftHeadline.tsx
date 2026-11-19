"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, useSite } from "@/components/providers/SiteProvider";
import styles from "./RiftHeadline.module.css";

/**
 * Nagłówek rozcięty żywą falą dźwięku – „szczelina” marki RIFT.
 * Fala reaguje na kursor (rośnie amplituda w jego pobliżu), a gdy gra demo z odtwarzacza –
 * na prawdziwy sygnał z analizatora Web Audio. Przy `prefers-reduced-motion` rysuje się statycznie.
 */
export function RiftHeadline({ top, bottom }: { top: string; bottom: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audio } = useSite();
  const audioRef = useRef(audio);
  useEffect(() => {
    audioRef.current = audio;
  }, [audio]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const pointer = { x: -9999, energy: 0, target: 0 };
    const started = performance.now();
    let samples: Uint8Array<ArrayBuffer> | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw(started + 4000);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      // energia zależy od odległości kursora od linii fali
      const dy = Math.abs(e.clientY - (rect.top + rect.height / 2));
      pointer.target = Math.max(0, 1 - dy / 320);
    };
    const onLeave = () => (pointer.target = 0);

    function draw(now: number) {
      ctx!.clearRect(0, 0, w, h);
      const mid = h / 2;
      const t = now;
      const intro = reduce ? 1 : Math.min(1, (now - started) / 1400);
      const reveal = 1 - Math.pow(1 - intro, 3);
      pointer.energy += (pointer.target - pointer.energy) * 0.06;

      // sygnał z odtwarzacza (jeśli gra)
      const analyser = audioRef.current.playing ? audioRef.current.getAnalyser() : null;
      if (analyser) {
        if (!samples || samples.length !== analyser.fftSize) samples = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(samples);
      }

      // linia bazowa – szczelina na całą szerokość
      ctx!.fillStyle = "rgba(233,237,243,0.08)";
      ctx!.fillRect(0, mid - 0.5, w, 1);

      const end = w * reveal;
      const amp = (x: number) => {
        const idle = h * (0.17 + 0.06 * Math.sin(t * 0.0007 + x * 0.002));
        const bump = pointer.energy * h * 0.3 * Math.exp(-((x - pointer.x) ** 2) / (2 * 140 ** 2));
        let live = 0;
        if (samples && analyser) {
          const i = Math.floor((x / w) * (samples.length - 1));
          live = Math.abs(samples[i] - 128) / 128 * h * 0.42;
        }
        // zanik na krawędziach
        const edge = Math.min(1, x / 60, (w - x) / 60);
        return (idle + bump + live) * Math.max(0, edge);
      };
      const y = (x: number, k: number) =>
        mid + amp(x) * k * (0.62 * Math.sin(x * 0.017 + t * 0.0021) + 0.28 * Math.sin(x * 0.041 - t * 0.0034) + 0.1 * Math.sin(x * 0.12 + t * 0.006));

      const path = (k: number) => {
        ctx!.beginPath();
        for (let x = 0; x <= end; x += 2) {
          if (x === 0) ctx!.moveTo(x, y(x, k));
          else ctx!.lineTo(x, y(x, k));
        }
      };

      // fiolet – szeroka poświata
      ctx!.save();
      ctx!.shadowColor = "rgba(138,99,255,0.9)";
      ctx!.shadowBlur = 18;
      ctx!.strokeStyle = "rgba(138,99,255,0.55)";
      ctx!.lineWidth = 2;
      path(-1.25);
      ctx!.stroke();
      ctx!.restore();

      // cyjan – główny sygnał
      ctx!.save();
      ctx!.shadowColor = "rgba(59,232,255,0.85)";
      ctx!.shadowBlur = 12;
      const grad = ctx!.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "rgba(59,232,255,0)");
      grad.addColorStop(0.12, "rgba(59,232,255,1)");
      grad.addColorStop(0.88, "rgba(120,170,255,1)");
      grad.addColorStop(1, "rgba(138,99,255,0)");
      ctx!.strokeStyle = grad;
      ctx!.lineWidth = 2.5;
      path(1);
      ctx!.stroke();
      ctx!.restore();

      // głowica rysowania przy wejściu
      if (reveal < 1) {
        ctx!.fillStyle = "rgba(233,237,243,0.9)";
        ctx!.fillRect(end - 1, mid - h * 0.3, 2, h * 0.6);
      }
    }

    const loop = (now: number) => {
      if (visible && !document.hidden) draw(now);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let io: IntersectionObserver | undefined;
    if (!reduce) {
      io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      io.observe(canvas);
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const chars = Math.max(top.length, bottom.length);
  return (
    <h1 className={styles.h1} style={{ "--chars": chars } as React.CSSProperties}>
      <span className={styles.top}>{top}</span>
      <span className={styles.wave} aria-hidden="true">
        <canvas ref={canvasRef} />
      </span>
      <span className={styles.bottom}>{bottom}</span>
    </h1>
  );
}
