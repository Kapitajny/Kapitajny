#!/usr/bin/env node
/**
 * Generuje demonstracyjne podkłady RIFT Studio (100% syntezy, bez sampli i cudzych nagrań).
 *
 *   npm run audio:generate        (wymaga ffmpeg w PATH)
 *
 * Wynik:
 *   public/audio/<id>.mp3          – pliki dla odtwarzacza
 *   src/data/track-peaks.json      – szczyty fali (do rysowania paska postępu przed odtworzeniem)
 *
 * Te nagrania są wyłącznie materiałem demonstracyjnym. Zastąp je realizacjami studia
 * (po uzyskaniu zgody artystów) – patrz README.md.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SR = 44100;
const TAU = Math.PI * 2;

/* ───────────────────────── narzędzia ───────────────────────── */

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const NOTE = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 };
const n = (name) => {
  const [, p, o] = name.match(/^([A-G][#b]?)(-?\d)$/);
  return mtof(NOTE[p] + (Number(o) + 1) * 12);
};

/** Filtr dwubiegunowy (RBJ). `filter.set(freq)` zmienia odcięcie bez utraty stanu. */
function biquad(type, freq, q = 0.707) {
  let b0, b1, b2, a1, a2;
  const set = (f) => {
    const w = (TAU * Math.min(f, SR * 0.45)) / SR;
    const cos = Math.cos(w);
    const alpha = Math.sin(w) / (2 * q);
    const a0 = 1 + alpha;
    if (type === "lp") [b0, b1, b2] = [(1 - cos) / 2, 1 - cos, (1 - cos) / 2];
    else if (type === "hp") [b0, b1, b2] = [(1 + cos) / 2, -(1 + cos), (1 + cos) / 2];
    else [b0, b1, b2] = [alpha, 0, -alpha]; // band-pass
    [b0, b1, b2, a1, a2] = [b0 / a0, b1 / a0, b2 / a0, (-2 * cos) / a0, (1 - alpha) / a0];
  };
  set(freq);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  const filter = (x) => {
    const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    return y;
  };
  filter.set = set;
  return filter;
}

/** Bufor stereo z miksowaniem dźwięków w czasie. */
class Mix {
  constructor(seconds) {
    this.length = Math.ceil(seconds * SR);
    this.L = new Float32Array(this.length);
    this.R = new Float32Array(this.length);
    this.sendL = new Float32Array(this.length);
    this.sendR = new Float32Array(this.length);
  }
  add(buf, time, { gain = 1, pan = 0, send = 0 } = {}) {
    const start = Math.round(time * SR);
    const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
    const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
    for (let i = 0; i < buf.length; i++) {
      const j = start + i;
      if (j < 0 || j >= this.length) continue;
      this.L[j] += buf[i] * gl;
      this.R[j] += buf[i] * gr;
      if (send) {
        this.sendL[j] += buf[i] * gl * send;
        this.sendR[j] += buf[i] * gr * send;
      }
    }
  }
}

const buffer = (seconds) => new Float32Array(Math.max(1, Math.round(seconds * SR)));

/* ───────────────────────── instrumenty ───────────────────────── */

function kick({ f0 = 150, f1 = 46, decay = 0.38, punch = 0.012, drive = 1.6 } = {}) {
  const b = buffer(decay * 2.2);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const f = f1 + (f0 - f1) * Math.exp(-t / 0.035);
    ph += (TAU * f) / SR;
    const env = Math.exp(-t / decay);
    const click = t < punch ? (1 - t / punch) * 0.5 : 0;
    b[i] = Math.tanh((Math.sin(ph) * env + click) * drive);
  }
  return b;
}

function snare(r, { tone = 185, decay = 0.17, noiseAmt = 0.8, hpFreq = 1200 } = {}) {
  const b = buffer(decay * 3);
  const hp = biquad("hp", hpFreq);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    ph += (TAU * tone * (1 + 0.4 * Math.exp(-t / 0.01))) / SR;
    const body = Math.sin(ph) * Math.exp(-t / 0.06) * 0.6;
    const noise = hp(r() * 2 - 1) * Math.exp(-t / decay) * noiseAmt;
    b[i] = Math.tanh((body + noise) * 1.4);
  }
  return b;
}

function clap(r) {
  const b = buffer(0.5);
  const bp = biquad("bp", 1400, 1.2);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const bursts = [0, 0.011, 0.022].reduce((a, o) => a + (t >= o ? Math.exp(-(t - o) / (o === 0.022 ? 0.11 : 0.008)) : 0), 0);
    b[i] = bp(r() * 2 - 1) * bursts * 1.6;
  }
  return b;
}

function hat(r, { open = false, decay } = {}) {
  const d = decay ?? (open ? 0.22 : 0.035);
  const b = buffer(d * 4);
  const hp = biquad("hp", 7500);
  const hp2 = biquad("hp", 9000);
  for (let i = 0; i < b.length; i++) b[i] = hp2(hp(r() * 2 - 1)) * Math.exp(-i / SR / d);
  return b;
}

function rim(r) {
  const b = buffer(0.08);
  const bp = biquad("bp", 1800, 4);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    b[i] = (bp(r() * 2 - 1) * 2 + Math.sin(TAU * 820 * t) * 0.6) * Math.exp(-t / 0.015);
  }
  return b;
}

/** 808 z opcjonalnym poślizgiem wysokości. */
function bass808(freq, dur, { glideFrom = null, glideTime = 0.08, drive = 2.2 } = {}) {
  const b = buffer(dur + 0.25);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const f = glideFrom ? freq + (glideFrom - freq) * Math.exp(-t / glideTime) : freq;
    ph += (TAU * f) / SR;
    const env = Math.min(1, t / 0.004) * (t < dur ? Math.exp(-t / (dur * 1.4)) : Math.exp(-dur / (dur * 1.4)) * Math.exp(-(t - dur) / 0.05));
    b[i] = Math.tanh(Math.sin(ph) * drive) * env * 0.8;
  }
  return b;
}

function subBass(freq, dur, { attack = 0.01, release = 0.12, harm = 0.15 } = {}) {
  const b = buffer(dur + release);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const env = Math.min(1, t / attack) * (t < dur ? 1 : Math.exp(-(t - dur) / (release / 4)));
    b[i] = (Math.sin(TAU * freq * t) + harm * Math.sin(TAU * freq * 2 * t)) * env * 0.7;
  }
  return b;
}

/** Piła (z prostym wygładzeniem PolyBLEP) – baza dla padów, arpeggio i dęciaków. */
function sawVoice(freqs, dur, { detune = 0.12, cutoff = 1800, cutoffEnd = cutoff, q = 0.9, attack = 0.01, release = 0.2, r } = {}) {
  const b = buffer(dur + release);
  const voices = freqs.flatMap((f) => [f * 2 ** (-detune / 12), f, f * 2 ** (detune / 12)]);
  const phases = voices.map(() => (r ? r() : Math.random()));
  const blep = (t, dt) => {
    if (t < dt) { t /= dt; return t + t - t * t - 1; }
    if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; }
    return 0;
  };
  const lp = biquad("lp", cutoff, q);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    if (i % 64 === 0) lp.set(cutoff * (cutoffEnd / cutoff) ** Math.min(1, t / Math.max(dur, 0.001)));
    let s = 0;
    for (let v = 0; v < voices.length; v++) {
      const dt = voices[v] / SR;
      phases[v] = (phases[v] + dt) % 1;
      s += 2 * phases[v] - 1 - blep(phases[v], dt);
    }
    const env = Math.min(1, t / attack) * (t < dur ? 1 : Math.exp(-(t - dur) / (release / 4)));
    b[i] = lp(s / voices.length) * env;
  }
  return b;
}

/** Elektryczne pianino FM. */
function epiano(freqs, dur, { brightness = 1.4, release = 0.35 } = {}) {
  const b = buffer(dur + release);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const env = Math.exp(-t / 1.6) * (t < dur ? 1 : Math.exp(-(t - dur) / (release / 4)));
    const idx = brightness * Math.exp(-t / 0.25);
    let s = 0;
    for (const f of freqs) s += Math.sin(TAU * f * t + idx * Math.sin(TAU * f * t)) + 0.2 * Math.sin(TAU * f * 4 * t) * Math.exp(-t / 0.05);
    b[i] = (s / freqs.length) * env * (1 + 0.15 * Math.sin(TAU * 4.5 * t)) * Math.min(1, t / 0.003);
  }
  return b;
}

/** Krótkie „pianino” z harmonicznymi – do chopów boom-bap. */
function keys(freqs, dur, { decay = 0.9 } = {}) {
  const b = buffer(dur + 0.3);
  const lp = biquad("lp", 2600);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    let s = 0;
    for (const f of freqs) for (let h = 1; h <= 5; h++) s += Math.sin(TAU * f * h * t * (1 + 0.0007 * h)) * Math.exp(-t * h * 1.1) / h;
    const env = Math.exp(-t / decay) * (t < dur ? 1 : Math.exp(-(t - dur) / 0.04)) * Math.min(1, t / 0.002);
    b[i] = lp(s / freqs.length) * env * 0.8;
  }
  return b;
}

function pluck(freq, dur, { r } = {}) {
  return sawVoice([freq], dur, { detune: 0.05, cutoff: 5200, cutoffEnd: 500, q: 2.2, attack: 0.002, release: 0.08, r });
}

function bell(freq, dur) {
  const b = buffer(dur + 1.2);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    b[i] = Math.sin(TAU * freq * t + 2.2 * Math.exp(-t / 0.4) * Math.sin(TAU * freq * 3.5 * t)) * Math.exp(-t / 0.9) * 0.6;
  }
  return b;
}

/** Rozbudowane uderzenie kinowe. */
function boom(r) {
  const k = kick({ f0: 110, f1: 32, decay: 1.1, drive: 2.4 });
  const lp = biquad("lp", 600);
  for (let i = 0; i < k.length; i++) k[i] += lp(r() * 2 - 1) * Math.exp(-i / SR / 0.6) * 0.5;
  return k;
}

/* ───────────────────────── efekty mastera ───────────────────────── */

function reverb(mix, { size = 1, damp = 0.3, wet = 1 } = {}) {
  const combs = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116].map((d) => Math.round(d * size));
  const alls = [556, 441, 341, 225];
  for (const [src, dst, spread] of [[mix.sendL, mix.L, 0], [mix.sendR, mix.R, 23]]) {
    const cBufs = combs.map((d) => new Float32Array(d + spread));
    const cIdx = combs.map(() => 0);
    const cLp = combs.map(() => 0);
    const aBufs = alls.map((d) => new Float32Array(d + spread));
    const aIdx = alls.map(() => 0);
    for (let i = 0; i < mix.length; i++) {
      const x = src[i] * 0.015;
      let out = 0;
      for (let c = 0; c < cBufs.length; c++) {
        const buf = cBufs[c];
        const y = buf[cIdx[c]];
        cLp[c] = y * (1 - damp) + cLp[c] * damp;
        buf[cIdx[c]] = x + cLp[c] * 0.84;
        cIdx[c] = (cIdx[c] + 1) % buf.length;
        out += y;
      }
      for (let a = 0; a < aBufs.length; a++) {
        const buf = aBufs[a];
        const y = buf[aIdx[a]];
        buf[aIdx[a]] = out + y * 0.5;
        aIdx[a] = (aIdx[a] + 1) % buf.length;
        out = y - out;
      }
      dst[i] += out * wet;
    }
  }
}

function crackle(mix, r, amount = 1) {
  const hp = biquad("hp", 2500);
  for (let i = 0; i < mix.length; i++) {
    const hiss = hp(r() * 2 - 1) * 0.004 * amount;
    const pop = r() < 0.00025 * amount ? (r() * 2 - 1) * 0.18 : 0;
    mix.L[i] += hiss + pop;
    mix.R[i] += hiss + pop * 0.7;
  }
}

/** Wow & flutter + nasycenie taśmy. */
function tape(mix, { depth = 0.0018, rate = 0.55, lpFreq = 6500 } = {}) {
  for (const ch of [mix.L, mix.R]) {
    const src = Float32Array.from(ch);
    const lp = biquad("lp", lpFreq);
    for (let i = 0; i < ch.length; i++) {
      const t = i / SR;
      const delay = (depth * (1 + Math.sin(TAU * rate * t)) + 0.0003 * Math.sin(TAU * 7 * t)) * SR;
      const pos = i - delay;
      const p0 = Math.floor(pos);
      const frac = pos - p0;
      const s = p0 >= 0 && p0 + 1 < src.length ? src[p0] * (1 - frac) + src[p0 + 1] * frac : 0;
      ch[i] = lp(Math.tanh(s * 1.3));
    }
  }
}

function finalize(mix, { fadeIn = 0.05, fadeOut = 2.5, ceiling = 0.89 } = {}) {
  // delikatny glue kompresor + normalizacja
  let peak = 0;
  for (const ch of [mix.L, mix.R]) for (let i = 0; i < ch.length; i++) {
    ch[i] = Math.tanh(ch[i] * 1.1);
    peak = Math.max(peak, Math.abs(ch[i]));
  }
  const g = ceiling / (peak || 1);
  const fi = fadeIn * SR, fo = fadeOut * SR;
  for (const ch of [mix.L, mix.R]) for (let i = 0; i < ch.length; i++) {
    let env = 1;
    if (i < fi) env = i / fi;
    if (i > ch.length - fo) env = Math.max(0, (ch.length - i) / fo);
    ch[i] *= g * env;
  }
}

/* ───────────────────────── aranżacje ───────────────────────── */

const beat = (bpm) => 60 / bpm;

/** Trap / futurystyczny – 140 BPM, f-moll. */
function trackFuturistic() {
  const r = rng(140);
  const bpm = 140, B = beat(bpm), bars = 24;
  const mix = new Mix(bars * 4 * B + 3);
  const prog = [["F2", ["F4", "Ab4", "C5", "Eb5"]], ["Db2", ["Db4", "F4", "Ab4", "C5"]], ["Bb1", ["Bb3", "Db4", "F4", "Ab4"]], ["C2", ["C4", "Eb4", "G4", "Bb4"]]];
  const K = kick({ f0: 170, f1: 50, decay: 0.25 }), S = clap(r), H = hat(r), HO = hat(r, { open: true });
  for (let bar = 0; bar < bars; bar++) {
    const t0 = bar * 4 * B;
    const [root, chord] = prog[Math.floor(bar / 2) % 4];
    const intro = bar < 4, drop = bar >= 4 && bar < 20;
    if (bar % 2 === 0) mix.add(sawVoice(chord.map(n), 8 * B, { cutoff: 900, cutoffEnd: 2400, attack: 0.6, release: 1.2, detune: 0.18, r }), t0, { gain: 0.32, send: 0.6 });
    // arpeggio
    for (let s = 0; s < 16; s++) {
      if (!intro && s % 4 === 3) continue;
      const note = n(chord[(s * 3) % chord.length].replace(/\d/, (o) => String(Number(o) + 1)));
      mix.add(pluck(note, B / 4, { r }), t0 + (s * B) / 4, { gain: intro ? 0.12 : 0.16, pan: s % 2 ? 0.45 : -0.45, send: 0.35 });
    }
    if (intro) continue;
    // perkusja
    for (const k of drop ? [0, 2.75] : [0]) mix.add(K, t0 + k * B, { gain: 0.9 });
    mix.add(S, t0 + 2 * B, { gain: 0.55, send: 0.25 });
    for (let s = 0; s < 8; s++) {
      const roll = drop && (bar % 4 === 3) && s >= 6;
      const step = roll ? 3 : 1;
      for (let q = 0; q < step; q++) mix.add(H, t0 + (s * B) / 2 + (q * B) / 6, { gain: 0.22, pan: 0.2 });
    }
    if (bar % 2 === 1) mix.add(HO, t0 + 3.5 * B, { gain: 0.16, pan: -0.2 });
    // 808
    if (drop) {
      mix.add(bass808(n(root), 1.4 * B), t0, { gain: 0.8 });
      mix.add(bass808(n(root), 0.9 * B, { glideFrom: n(root) * 1.5 }), t0 + 2.75 * B, { gain: 0.75 });
    }
  }
  mix.add(bell(n("C6"), 2), 4 * 4 * B, { gain: 0.25, pan: 0.3, send: 0.8 });
  reverb(mix, { size: 1.15, damp: 0.25, wet: 0.9 });
  finalize(mix);
  return { mix, bpm, key: "F minor" };
}

/** Boom-bap / underground – 90 BPM, a-moll, z trzaskami winylu. */
function trackUnderground() {
  const r = rng(90);
  const bpm = 90, B = beat(bpm), bars = 16;
  const mix = new Mix(bars * 4 * B + 3);
  const swing = B * 0.09;
  const K = kick({ f0: 120, f1: 48, decay: 0.3, drive: 2.4 }), S = snare(r, { tone: 200, decay: 0.2 }), H = hat(r, { decay: 0.05 });
  const chops = [["A3", "C4", "E4"], ["F3", "A3", "C4"], ["D3", "F3", "A3"], ["E3", "G#3", "B3"]];
  for (let bar = 0; bar < bars; bar++) {
    const t0 = bar * 4 * B;
    const ch = chops[bar % 4];
    mix.add(keys(ch.map(n), 1.4 * B), t0, { gain: 0.5, pan: -0.15, send: 0.3 });
    mix.add(keys(ch.map(n), 0.5 * B), t0 + 1.5 * B + swing, { gain: 0.32, pan: -0.15, send: 0.3 });
    mix.add(keys([n(ch[2]) * 2], 0.4 * B), t0 + 3 * B + swing, { gain: 0.22, pan: 0.3, send: 0.3 });
    if (bar < 2) continue;
    mix.add(K, t0, { gain: 0.95 });
    mix.add(K, t0 + 1.75 * B, { gain: 0.6 });
    mix.add(K, t0 + 2.5 * B + swing, { gain: 0.8 });
    mix.add(S, t0 + B, { gain: 0.7, send: 0.2 });
    mix.add(S, t0 + 3 * B, { gain: 0.7, send: 0.2 });
    for (let s = 0; s < 8; s++) mix.add(H, t0 + (s * B) / 2 + (s % 2 ? swing : 0), { gain: s % 2 ? 0.14 : 0.22, pan: 0.25 });
    mix.add(subBass(n(ch[0]) / 2, 1.8 * B, { harm: 0.35 }), t0, { gain: 0.6 });
    mix.add(subBass(n(ch[0]) / 2, 0.8 * B, { harm: 0.35 }), t0 + 2.5 * B + swing, { gain: 0.5 });
  }
  reverb(mix, { size: 0.7, damp: 0.5, wet: 0.6 });
  crackle(mix, r, 1.2);
  finalize(mix);
  return { mix, bpm, key: "A minor" };
}

/** Luxury / R&B – 75 BPM, Db-dur, elektryczne pianino. */
function trackLuxury() {
  const r = rng(75);
  const bpm = 75, B = beat(bpm), bars = 12;
  const mix = new Mix(bars * 4 * B + 4);
  const prog = [["Db3", ["F3", "Ab3", "C4", "Eb4"]], ["Bb2", ["Db4", "F4", "Ab3", "C4"]], ["Gb2", ["Bb3", "Db4", "F4", "Ab4"]], ["Ab2", ["C4", "Eb4", "Gb4", "Bb4"]]];
  const K = kick({ f0: 110, f1: 44, decay: 0.35, drive: 1.2 }), R = rim(r), H = hat(r, { decay: 0.03 });
  for (let bar = 0; bar < bars; bar++) {
    const t0 = bar * 4 * B;
    const [root, chord] = prog[bar % 4];
    mix.add(epiano(chord.map(n), 1.8 * B, { brightness: 1.1 }), t0, { gain: 0.42, pan: -0.2, send: 0.55 });
    mix.add(epiano(chord.slice(1).map(n), 1.2 * B, { brightness: 0.9 }), t0 + 2.5 * B, { gain: 0.3, pan: 0.2, send: 0.55 });
    if (bar < 1) continue;
    mix.add(K, t0, { gain: 0.8 });
    mix.add(K, t0 + 2.25 * B, { gain: 0.55 });
    mix.add(R, t0 + B, { gain: 0.32, send: 0.4 });
    mix.add(R, t0 + 3 * B, { gain: 0.32, send: 0.4 });
    for (let s = 0; s < 16; s++) if (s % 2 === 0 || s % 3 === 0) mix.add(H, t0 + (s * B) / 4, { gain: 0.1 + (s % 4 === 0 ? 0.05 : 0), pan: 0.35 });
    mix.add(subBass(n(root), 2.8 * B, { attack: 0.03 }), t0, { gain: 0.55 });
  }
  reverb(mix, { size: 1.3, damp: 0.4, wet: 1 });
  finalize(mix, { fadeOut: 3.5 });
  return { mix, bpm, key: "Db major" };
}

/** Analog / lo-fi – 84 BPM, taśma i nasycenie. */
function trackAnalog() {
  const r = rng(84);
  const bpm = 84, B = beat(bpm), bars = 14;
  const mix = new Mix(bars * 4 * B + 3);
  const swing = B * 0.12;
  const prog = [["D3", ["F3", "A3", "C4", "E4"]], ["G2", ["F3", "A3", "B3", "E4"]], ["C3", ["E3", "G3", "B3", "D4"]], ["A2", ["G3", "C4", "E4", "A4"]]];
  const K = kick({ f0: 100, f1: 45, decay: 0.28, drive: 2 }), S = snare(r, { tone: 170, decay: 0.12, hpFreq: 900 }), H = hat(r, { decay: 0.045 });
  for (let bar = 0; bar < bars; bar++) {
    const t0 = bar * 4 * B;
    const [root, chord] = prog[bar % 4];
    mix.add(keys(chord.map(n), 3.6 * B, { decay: 2.2 }), t0, { gain: 0.45, send: 0.45 });
    if (bar % 2 === 1) mix.add(epiano([n(chord[3]) * 2], 0.5 * B), t0 + 3 * B + swing, { gain: 0.18, pan: 0.4, send: 0.6 });
    if (bar < 2) continue;
    mix.add(K, t0, { gain: 0.85 });
    mix.add(K, t0 + 2.5 * B + swing, { gain: 0.7 });
    mix.add(S, t0 + B, { gain: 0.55, send: 0.25 });
    mix.add(S, t0 + 3 * B, { gain: 0.55, send: 0.25 });
    for (let s = 0; s < 8; s++) mix.add(H, t0 + (s * B) / 2 + (s % 2 ? swing : 0), { gain: s % 2 ? 0.1 : 0.17, pan: -0.25 });
    mix.add(subBass(n(root), 3.4 * B, { harm: 0.25 }), t0, { gain: 0.55 });
  }
  reverb(mix, { size: 0.9, damp: 0.6, wet: 0.7 });
  tape(mix, { depth: 0.0022, rate: 0.5, lpFreq: 5200 });
  crackle(mix, r, 0.6);
  finalize(mix);
  return { mix, bpm, key: "D minor" };
}

/** Minimal – 120 BPM, puste przestrzenie, sinusy i kliknięcia. */
function trackMinimal() {
  const r = rng(120);
  const bpm = 120, B = beat(bpm), bars = 20;
  const mix = new Mix(bars * 4 * B + 3);
  const K = kick({ f0: 130, f1: 52, decay: 0.18, drive: 1.1 }), H = hat(r, { decay: 0.012 }), R = rim(r);
  const seq = ["E4", null, "G4", null, null, "B4", null, "E5", null, null, "D5", null, "B4", null, null, null];
  for (let bar = 0; bar < bars; bar++) {
    const t0 = bar * 4 * B;
    seq.forEach((note, s) => {
      if (note && (bar >= 2 || s < 8)) mix.add(bell(n(note), 0.2), t0 + (s * B) / 4, { gain: 0.16, pan: s % 3 ? 0.5 : -0.5, send: 0.7 });
    });
    if (bar < 4) continue;
    for (let q = 0; q < 4; q++) mix.add(K, t0 + q * B, { gain: 0.75 });
    for (let s = 0; s < 16; s++) mix.add(H, t0 + (s * B) / 4, { gain: s % 4 === 2 ? 0.22 : 0.07, pan: 0.15 });
    if (bar % 2) mix.add(R, t0 + 3.75 * B, { gain: 0.25, send: 0.5 });
    if (bar >= 8) mix.add(subBass(n("E1"), 0.4 * B, { harm: 0.05 }), t0 + 0.5 * B, { gain: 0.6 });
    if (bar >= 8) mix.add(subBass(n("E1"), 0.4 * B, { harm: 0.05 }), t0 + 2.5 * B, { gain: 0.6 });
  }
  reverb(mix, { size: 1.4, damp: 0.2, wet: 0.8 });
  finalize(mix);
  return { mix, bpm, key: "E minor" };
}

/** Cinematic – 70 BPM, c-moll, pady, dęciaki i wielkie uderzenia. */
function trackCinematic() {
  const r = rng(70);
  const bpm = 70, B = beat(bpm), bars = 12;
  const mix = new Mix(bars * 4 * B + 6);
  const prog = [["C2", ["C3", "G3", "Eb4", "G4"]], ["Ab1", ["Ab2", "Eb3", "C4", "Eb4"]], ["Eb2", ["Eb3", "Bb3", "G4", "Bb4"]], ["Bb1", ["Bb2", "F3", "D4", "F4"]]];
  const BOOM = boom(r), S = snare(r, { tone: 160, decay: 0.35, hpFreq: 600 }), H = hat(r, { decay: 0.06 });
  for (let bar = 0; bar < bars; bar++) {
    const t0 = bar * 4 * B;
    const [root, chord] = prog[bar % 4];
    mix.add(sawVoice(chord.map(n), 4 * B, { cutoff: 500, cutoffEnd: 1500, attack: 1.2, release: 2, detune: 0.2, r }), t0, { gain: 0.38, send: 0.9 });
    mix.add(subBass(n(root), 3.9 * B, { attack: 0.4, release: 1 }), t0, { gain: 0.5 });
    if (bar >= 4) {
      // „dęciaki”: narastający filtr
      mix.add(sawVoice([n(chord[1]), n(chord[2])], 1.8 * B, { cutoff: 300, cutoffEnd: 3000, attack: 0.3, release: 0.6, detune: 0.08, r }), t0 + 2 * B, { gain: 0.3, pan: 0.2, send: 0.7 });
      mix.add(BOOM, t0, { gain: 0.95, send: 0.5 });
      mix.add(S, t0 + 2 * B, { gain: 0.6, send: 0.8 });
      for (let s = 0; s < 8; s++) mix.add(H, t0 + (s * B) / 2, { gain: 0.08, pan: -0.3 });
    }
    if (bar >= 8) for (let s = 0; s < 8; s++) mix.add(pluck(n(chord[(s * 2) % 4]) * 2, B / 2, { r }), t0 + (s * B) / 2, { gain: 0.1, pan: s % 2 ? 0.6 : -0.6, send: 0.6 });
  }
  mix.add(BOOM, bars * 4 * B, { gain: 1, send: 1 });
  reverb(mix, { size: 1.6, damp: 0.35, wet: 1.1 });
  finalize(mix, { fadeOut: 5 });
  return { mix, bpm, key: "C minor" };
}

/* ───────────────────────── zapis ───────────────────────── */

function wav(mix) {
  const data = Buffer.alloc(mix.length * 4);
  for (let i = 0; i < mix.length; i++) {
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, mix.L[i])) * 32767), i * 4);
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, mix.R[i])) * 32767), i * 4 + 2);
  }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

function peaks(mix, count = 96) {
  const size = Math.floor(mix.length / count);
  const out = [];
  for (let p = 0; p < count; p++) {
    let sum = 0;
    for (let i = p * size; i < (p + 1) * size; i++) sum += (mix.L[i] ** 2 + mix.R[i] ** 2) / 2;
    out.push(Math.sqrt(sum / size));
  }
  const max = Math.max(...out);
  return out.map((v) => Math.round((v / max) * 100) / 100);
}

const TRACKS = {
  "neon-drift": trackFuturistic,
  beton: trackUnderground,
  velvet: trackLuxury,
  "tasma-13": trackAnalog,
  "pusty-pokoj": trackMinimal,
  horyzont: trackCinematic,
};

const outDir = join(ROOT, "public/audio");
mkdirSync(outDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), "rift-audio-"));
const meta = {};
try {
  for (const [id, render] of Object.entries(TRACKS)) {
    const started = Date.now();
    const { mix, bpm, key } = render();
    const wavPath = join(tmp, `${id}.wav`);
    writeFileSync(wavPath, wav(mix));
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wavPath, "-codec:a", "libmp3lame", "-b:a", "160k",
      "-metadata", `title=${id} (demo)`, "-metadata", "artist=RIFT Studio – materiał demonstracyjny",
      join(outDir, `${id}.mp3`)]);
    meta[id] = { duration: Math.round((mix.length / SR) * 10) / 10, bpm, key, peaks: peaks(mix) };
    console.log(`✓ ${id}  ${meta[id].duration}s  (${Date.now() - started} ms)`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
writeFileSync(join(ROOT, "src/data/track-peaks.json"), JSON.stringify(meta) + "\n");
console.log("Zapisano src/data/track-peaks.json");
