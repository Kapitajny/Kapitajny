/* QA: zrzuty ekranu desktop/mobile + błędy konsoli.
 * Użycie: node qa/screens.cjs [baseUrl] [ścieżka ...]
 * Wymaga Playwright (require('playwright')). Zrzuty trafiają do qa/screens/. */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const base = process.argv[2] || "http://localhost:3100";
const routes = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ["/", "/realizacje", "/realizacje/villa-natura", "/o-pracowni", "/oferta", "/proces", "/kontakt", "/polityka-prywatnosci", "/nie-ma-takiej-strony"];
const out = path.join(__dirname, "screens");
fs.mkdirSync(out, { recursive: true });

const viewports = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(140);
  }
  await page.waitForTimeout(1600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
}

(async () => {
  const browser = await chromium.launch();
  const report = [];
  for (const [name, vp] of Object.entries(viewports)) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor, isMobile: vp.isMobile, hasTouch: vp.hasTouch, locale: "pl-PL" });
    for (const r of routes) {
      const page = await ctx.newPage();
      const errors = [];
      page.on("console", (m) => {
        if (m.type() === "error" || m.type() === "warning") errors.push(`[${m.type()}] ${m.text()}`);
      });
      page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
      const t0 = Date.now();
      const res = await page.goto(base + r, { waitUntil: "networkidle" });
      const loadMs = Date.now() - t0;
      await page.waitForTimeout(2600);
      const slug = (r === "/" ? "home" : r.replace(/\//g, "_").replace(/^_/, "")) + "-" + name;
      await page.screenshot({ path: path.join(out, slug + "-fold.png") });
      await scrollThrough(page);
      await page.screenshot({ path: path.join(out, slug + "-full.png"), fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      report.push({ viewport: name, route: r, status: res && res.status(), loadMs, horizontalOverflow: overflow, errors });
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2));
  for (const x of report) console.log(`${x.viewport.padEnd(8)} ${String(x.status).padEnd(4)} ${String(x.loadMs).padStart(5)}ms overflow=${x.horizontalOverflow} ${x.route}${x.errors.length ? "\n    " + x.errors.join("\n    ") : ""}`);
})();
