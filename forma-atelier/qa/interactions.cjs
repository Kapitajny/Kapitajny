/* QA interakcji: menu, formularz, galeria, film, reduced motion, linki.
 * Użycie: node qa/interactions.cjs [baseUrl] */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const base = process.argv[2] || "http://localhost:3100";
const out = path.join(__dirname, "screens");
fs.mkdirSync(out, { recursive: true });
const results = [];
const check = (name, ok, info = "") => {
  results.push({ name, ok, info });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${info ? "  — " + info : ""}`);
};

(async () => {
  const browser = await chromium.launch();

  // --- desktop: menu
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
  await page.goto(base + "/", { waitUntil: "networkidle" });

  const video = page.locator("section video");
  const attrs = await video.evaluate((v) => ({ muted: v.muted, loop: v.loop, playsInline: v.playsInline, autoplay: v.autoplay, fit: getComputedStyle(v).objectFit }));
  check("video: muted/loop/playsInline/autoplay/object-fit:cover", attrs.muted && attrs.loop && attrs.playsInline && attrs.autoplay && attrs.fit === "cover", JSON.stringify(attrs));
  await page.waitForTimeout(4000);
  const vstate = await video.evaluate((v) => ({ src: v.currentSrc, paused: v.paused, readyState: v.readyState, time: v.currentTime }));
  check("video: source chosen and playing", !!vstate.src && !vstate.paused && vstate.time > 0, JSON.stringify(vstate));

  const btn = page.getByRole("button", { name: "Otwórz menu" });
  await btn.click();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: path.join(out, "menu-desktop.png") });
  const dialog = page.getByRole("dialog", { name: "Menu" });
  check("menu: opens as dialog", await dialog.isVisible());
  const links = await dialog.getByRole("navigation", { name: "Główna" }).getByRole("link").allInnerTexts();
  check("menu: 6 items in order", links.join("|") === "Strona główna|O pracowni|Realizacje|Oferta|Proces projektowy|Kontakt", links.join("|"));
  const focused = await page.evaluate(() => document.activeElement && document.activeElement.textContent);
  check("menu: focus moves into menu", /Strona główna/.test(focused || ""), focused || "");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  check("menu: Esc closes", !(await dialog.isVisible().catch(() => false)));
  const back = await page.evaluate(() => document.activeElement && document.activeElement.getAttribute("aria-label"));
  check("menu: focus returns to toggle", back === "Otwórz menu", back || "");

  // --- navigation through menu
  await btn.click();
  await page.waitForTimeout(900);
  await dialog.getByRole("link", { name: "Realizacje" }).click();
  await page.waitForURL("**/realizacje");
  await page.waitForTimeout(1200);
  check("menu: link navigates and closes", page.url().endsWith("/realizacje") && !(await dialog.isVisible().catch(() => false)));

  // --- project page + lightbox
  await page.goto(base + "/realizacje/sandstone-house", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(1500);
  const tile = page.getByRole("button", { name: /Powiększ zdjęcie/ }).first();
  await tile.click();
  await page.waitForTimeout(900);
  const lb = page.getByRole("dialog", { name: /galeria/ });
  check("gallery: lightbox opens", await lb.isVisible());
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(700);
  const counter = await lb.locator("p").first().innerText();
  check("gallery: arrow key advances", /3 \/ 4/.test(counter), counter);
  await page.screenshot({ path: path.join(out, "lightbox.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  check("gallery: Esc closes", !(await lb.isVisible().catch(() => false)));

  // --- contact form
  await page.goto(base + "/kontakt?zakres=pod-klucz", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  check("form: scope prefilled from ?zakres", await page.getByRole("radio", { name: "Projekt pod klucz" }).isChecked());
  await page.getByRole("button", { name: "Wyślij zapytanie" }).click();
  await page.waitForTimeout(500);
  const errCount = await page.locator("[id$='-error']").count();
  check("form: empty submit shows field errors", errCount >= 5, `${errCount} errors`);
  const active = await page.evaluate(() => document.activeElement && document.activeElement.getAttribute("name"));
  check("form: focus moves to first invalid field", active === "name", active || "");
  await page.screenshot({ path: path.join(out, "form-errors.png"), fullPage: true });
  await page.getByLabel("Imię i nazwisko").fill("Anna Testowa");
  await page.getByLabel("Adres e-mail").fill("anna@example");
  await page.getByLabel("Adres e-mail").blur();
  await page.waitForTimeout(200);
  check("form: invalid e-mail message", await page.getByText("Sprawdź adres e-mail").isVisible());
  await page.getByLabel("Adres e-mail").fill("anna@example.com");
  await page.getByLabel("Telefon (opcjonalnie)").fill("+48 600 100 200");
  await page.getByLabel("Rodzaj nieruchomości").selectOption("Apartament");
  await page.getByLabel("Metraż (m²)").fill("115");
  await page.getByLabel("Opis projektu").fill("Apartament na Żoliborzu, stan deweloperski, chcemy zacząć prace wiosną.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Wyślij zapytanie" }).click();
  await page.waitForTimeout(1500);
  const notConfigured = await page.getByText("Wiadomość nie została wysłana.").isVisible().catch(() => false);
  const sent = await page.getByText("Dziękujemy, wiadomość została wysłana.").isVisible().catch(() => false);
  check("form: valid submit → honest status (not sent without backend / sent with webhook)", notConfigured || sent, notConfigured ? "not_configured" : sent ? "sent" : "none");
  await page.screenshot({ path: path.join(out, "form-status.png") });

  // --- API validation directly
  const api = await page.evaluate(async () => {
    const r = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "x" }) });
    return r.status;
  });
  check("api: rejects invalid payload (422)", api === 422, String(api));

  // --- all internal links resolve
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const hrefs = await page.evaluate(() => [...new Set([...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href").split("#")[0]))]);
  const bad = [];
  for (const h of hrefs) {
    const r = await page.request.get(base + h);
    if (r.status() >= 400) bad.push(`${h} ${r.status()}`);
  }
  check("links: all internal links on home resolve", bad.length === 0, `${hrefs.length} links ${bad.join(", ")}`);
  check("console: no runtime errors on desktop journey", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();

  // --- reduced motion: film must not load
  const rctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const rp = await rctx.newPage();
  await rp.goto(base + "/", { waitUntil: "networkidle" });
  await rp.waitForTimeout(2500);
  const rsrc = await rp.locator("section video").evaluate((v) => v.currentSrc);
  check("reduced motion: film not loaded, poster stays", !rsrc, rsrc || "no src");
  check("reduced motion: play button offered", await rp.getByRole("button", { name: "Odtwórz film w tle" }).isVisible());
  await rctx.close();

  // --- mobile: menu + 720p source
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mp = await mctx.newPage();
  await mp.goto(base + "/", { waitUntil: "networkidle" });
  await mp.waitForTimeout(3500);
  const msrc = await mp.locator("section video").evaluate((v) => v.currentSrc);
  check("mobile: lighter 720p film selected", /720\.(mp4|webm)$/.test(msrc), msrc);
  await mp.getByRole("button", { name: "Otwórz menu" }).tap();
  await mp.waitForTimeout(1400);
  await mp.screenshot({ path: path.join(out, "menu-mobile.png") });
  check("mobile: menu opens", await mp.getByRole("dialog", { name: "Menu" }).isVisible());
  await mctx.close();

  await browser.close();
  fs.writeFileSync(path.join(out, "interactions.json"), JSON.stringify(results, null, 2));
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
})();
