import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// Playwright nie jest zależnością projektu – używamy instalacji globalnej (NODE_PATH) albo lokalnej (npm i -D playwright).
const { chromium } = require("playwright");

export const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");

export const ROUTES = [
  "/",
  "/ksiegowosc-jdg",
  "/ksiegowosc-spolki",
  "/doradztwo-podatkowe",
  "/kadry-place",
  "/cennik",
  "/kalkulator",
  "/wycena",
  "/o-nas",
  "/baza-wiedzy",
  "/baza-wiedzy/co-wplywa-na-cene-ksiegowosci",
  "/kontakt",
  "/zamowienie",
  "/platnosc-demo",
  "/potwierdzenie",
  "/panel-demo",
  "/polityka-prywatnosci",
  "/regulamin",
  "/cookies",
];

let browserPromise;
export function browser() {
  browserPromise ??= chromium.launch();
  return browserPromise;
}

export async function closeBrowser() {
  if (browserPromise) await (await browserPromise).close();
}

/** Nowa karta z rejestrowaniem błędów konsoli i błędów stron. */
export async function openPage({ width = 1280, height = 900, context } = {}) {
  const ctx = context ?? (await (await browser()).newContext({ viewport: { width, height }, locale: "pl-PL" }));
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error" && !/status of 404/.test(m.text())) errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  return { page, errors, context: ctx };
}

/** Kwota z tekstu „1 200 zł” → 1200. */
export function money(text) {
  return Number(String(text).replace(/[^\d]/g, ""));
}
