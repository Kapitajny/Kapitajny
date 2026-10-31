/* Nagranie spaceru po stronie (Playwright recordVideo). Użycie: node qa/walkthrough.cjs [baseUrl] [desktop|mobile] */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const base = process.argv[2] || "http://localhost:3000";
const mode = process.argv[3] || "desktop";
const vp = mode === "mobile" ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const dir = path.join(__dirname, "screens", "video-" + mode);

async function glide(page, distance, speed = 900) {
  // płynne przewijanie z prędkością px/s
  const steps = Math.ceil(Math.abs(distance) / (speed / 60));
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, distance / steps);
    await page.waitForTimeout(16);
  }
}

(async () => {
  fs.rmSync(dir, { recursive: true, force: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: 1,
    isMobile: mode === "mobile",
    hasTouch: mode === "mobile",
    recordVideo: { dir, size: vp },
  });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(4500);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  await glide(page, h * 0.36, mode === "mobile" ? 1400 : 1000);
  await page.waitForTimeout(800);
  await glide(page, h * 0.64, mode === "mobile" ? 1600 : 1300);
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1500);

  // menu
  await page.getByRole("button", { name: "Otwórz menu" }).click();
  await page.waitForTimeout(1600);
  if (mode === "desktop") {
    for (const name of ["O pracowni", "Realizacje", "Oferta", "Proces projektowy"]) {
      await page.getByRole("dialog").getByRole("link", { name }).hover();
      await page.waitForTimeout(700);
    }
  }
  await page.getByRole("dialog").getByRole("link", { name: "Realizacje" }).click();
  await page.waitForURL("**/realizacje");
  await page.waitForTimeout(2200);

  // przejście do realizacji (morph okładki)
  await page.getByRole("link", { name: /Sandstone House/ }).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.getByRole("link", { name: /Sandstone House/ }).first().click();
  await page.waitForURL("**/sandstone-house");
  await page.waitForTimeout(2500);
  const ph = await page.evaluate(() => document.documentElement.scrollHeight);
  await glide(page, ph * 0.75, 1000);
  await page.waitForTimeout(1200);

  // kontakt
  await page.goto(base + "/kontakt?zakres=pod-klucz", { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  await page.getByRole("button", { name: "Wyślij zapytanie" }).click();
  await page.waitForTimeout(1800);

  await ctx.close();
  await browser.close();
  const f = fs.readdirSync(dir).find((x) => x.endsWith(".webm"));
  console.log(path.join(dir, f));
})();
