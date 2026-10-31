const { chromium } = require("playwright");
(async () => {
  const [url, out, w, h, wait, scrollY] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: +h } });
  p.on("pageerror", (e) => console.log("pageerror", e.message));
  await p.goto(url, { waitUntil: "networkidle" });
  if (scrollY) { await p.evaluate((y) => window.scrollTo(0, +y), scrollY); }
  await p.waitForTimeout(+wait);
  await p.screenshot({ path: out });
  await b.close();
})();
