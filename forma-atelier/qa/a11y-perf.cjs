/* QA: audyt dostępności (axe-core, WCAG 2.1 A/AA) i metryki wydajności (LCP, CLS, transfer).
 * Uruchamiać na buildzie produkcyjnym: npm run build && npm start, potem node qa/a11y-perf.cjs http://localhost:3000 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const base = process.argv[2] || "http://localhost:3000";
const routes = ["/", "/realizacje", "/realizacje/villa-natura", "/realizacje/urban-harmony", "/o-pracowni", "/oferta", "/proces", "/kontakt", "/polityka-prywatnosci"];
const axeSrc = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

(async () => {
  const browser = await chromium.launch();
  const rows = [];
  for (const [name, vp] of [
    ["desktop", { width: 1440, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    const ctx = await browser.newContext({ viewport: vp, isMobile: name === "mobile", deviceScaleFactor: name === "mobile" ? 2 : 1 });
    for (const r of routes) {
      const page = await ctx.newPage();
      await page.addInitScript(() => {
        window.__lcp = 0;
        window.__cls = 0;
        new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__lcp = e.startTime))).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (window.__cls += e.value))).observe({ type: "layout-shift", buffered: true });
      });
      let bytes = 0;
      page.on("response", async (res) => {
        const len = Number(res.headers()["content-length"] || 0);
        bytes += len;
      });
      await page.goto(base + r, { waitUntil: "load" });
      await page.waitForTimeout(2500);
      const lcp = await page.evaluate(() => window.__lcp);
      const lcpBytes = bytes;
      // przewiń, aby wszystkie sekcje się odsłoniły, potem audyt
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 600) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(1800);
      const cls = await page.evaluate(() => window.__cls);
      await page.addScriptTag({ content: axeSrc });
      const res = await page.evaluate(async () => {
        const r = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } });
        return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, help: v.help, target: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) }));
      });
      rows.push({ viewport: name, route: r, lcpMs: Math.round(lcp), cls: Number(cls.toFixed(4)), initialKB: Math.round(lcpBytes / 1024), violations: res });
      console.log(`${name.padEnd(8)} LCP ${String(Math.round(lcp)).padStart(5)}ms  CLS ${cls.toFixed(3)}  load ${String(Math.round(lcpBytes / 1024)).padStart(5)} KB  axe:${res.length}  ${r}`);
      for (const v of res) console.log(`    [${v.impact}] ${v.id} ×${v.n}: ${v.help}\n      ${v.target.join("\n      ")}`);
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  fs.mkdirSync(path.join(__dirname, "screens"), { recursive: true });
  fs.writeFileSync(path.join(__dirname, "screens", "a11y-perf.json"), JSON.stringify(rows, null, 2));
})();
