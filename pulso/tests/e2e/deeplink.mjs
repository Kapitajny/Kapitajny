// Sprawdzenie w przeglądarce (Playwright): głębokie linki trafiają w cel, a przypięty proces nadal działa.
// Użycie: zbuduj stronę (npm run build), uruchom `npx serve out -l 4310`, potem `node tests/e2e/deeplink.mjs`.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const URL = process.env.PULSO_URL ?? "http://localhost:4310/";

const failures = [];
const check = (name, cond, info) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}  ${info ?? ""}`);
  if (!cond) failures.push(name);
};

const browser = await chromium.launch();
try {
  // 1. Głęboki link do formularza na desktopie
  let page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto(`${URL}#kontakt`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const top = await page.evaluate(() => Math.round(document.getElementById("kontakt-formularz").getBoundingClientRect().top));
  check("desktop /#kontakt: formularz w widoku", top >= 0 && top <= 450, `top=${top}`);

  // 2. Przypięty proces zmienia aktywny etap podczas przewijania
  const procTop = await page.evaluate(() => document.getElementById("proces").getBoundingClientRect().top + scrollY);
  await page.evaluate((t) => scrollTo(0, t + 200), procTop);
  await page.waitForTimeout(400);
  const a1 = await page.locator("#proces .process-detail p").first().innerText().catch(() => "");
  await page.evaluate((t) => scrollTo(0, t + innerHeight * 1.9), procTop);
  await page.waitForTimeout(400);
  const a2 = await page.locator("#proces .process-detail p").first().innerText().catch(() => "");
  check("desktop: proces zmienia aktywny etap", !!a1 && !!a2 && a1 !== a2, `${a1} → ${a2}`);

  // 3. Telefon i ograniczony ruch: statyczna lista 6 etapów
  for (const [name, opts] of [
    ["telefon", { viewport: { width: 390, height: 844 } }],
    ["ograniczony ruch", { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" }],
  ]) {
    page = await (await browser.newContext(opts)).newPage();
    await page.goto(URL, { waitUntil: "networkidle" });
    const n = await page.locator('#proces ol[aria-label="Opis etapów"] > li:visible').count();
    check(`${name}: widoczna lista etapów`, n === 6, `widocznych=${n}`);
  }
} finally {
  await browser.close();
}
process.exit(failures.length ? 1 : 0);
