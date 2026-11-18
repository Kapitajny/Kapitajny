// Przycisk „Chcę podobny plan” w portfolio musi dać się kliknąć bez wymuszania (nie przesuwa się pod kursorem).
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto(process.env.PULSO_URL ?? "http://localhost:4310/", { waitUntil: "networkidle" });
let ok = true;
try {
  await page.locator('#portfolio [role="tabpanel"]:not([inert]) a', { hasText: "Chcę podobny plan" }).click({ timeout: 5000 });
  console.log("PASS  klik „Chcę podobny plan” bez force");
} catch (e) {
  ok = false;
  console.log("FAIL  klik „Chcę podobny plan”: " + e.message.split("\n")[0]);
}
await browser.close();
process.exit(ok ? 0 : 1);
