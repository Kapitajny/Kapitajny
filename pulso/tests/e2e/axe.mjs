// Audyt dostępności axe-core (WCAG 2.1 AA + best practice) na zbudowanej stronie, z formularzem na kroku 1 i 6.
// Użycie: AXE_CORE=/ścieżka/do/axe.min.js node tests/e2e/axe.mjs   (serwer: npx serve out -l 4310)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const URL = process.env.PULSO_URL ?? "http://localhost:4310/";
const axeSrc = readFileSync(process.env.AXE_CORE ?? require.resolve("axe-core/axe.min.js"), "utf8");

async function run(page) {
  await page.addScriptTag({ content: axeSrc });
  return page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] });
    return r.violations.map((v) => `${v.impact} ${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
  });
}

let total = 0;
const browser = await chromium.launch();
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" })).newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  const v1 = await run(page);
  const f = page.locator("#kontakt-formularz");
  await f.locator("label", { hasText: "Meta Ads" }).click();
  await f.getByRole("button", { name: /Dalej/ }).click();
  await f.locator("label", { hasText: "Pozyskanie klientów" }).click();
  await f.getByRole("button", { name: /Dalej/ }).click();
  await f.locator("label", { hasText: "Jeszcze nie wiem" }).click();
  await f.getByRole("button", { name: /Dalej/ }).click();
  await f.getByLabel("Nazwa firmy").fill("Testowa");
  await f.getByLabel("Branża").fill("usługi");
  await f.getByRole("button", { name: /Dalej/ }).click();
  await f.getByLabel("Imię").fill("Ola");
  await f.getByLabel("Adres e-mail").fill("ola@testowa.pl");
  await f.getByLabel("Numer telefonu").fill("600100200");
  await f.getByRole("button", { name: /Dalej/ }).click();
  const v6 = await run(page);
  for (const [label, v] of [["krok 1", v1], ["krok 6", v6]]) {
    console.log(`${w}px ${label}: ${v.length ? "FAIL" : "PASS"}`);
    v.forEach((x) => console.log("   " + x));
    total += v.length;
  }
}
await browser.close();
process.exit(total ? 1 : 0);
