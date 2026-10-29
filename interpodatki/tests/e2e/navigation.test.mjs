import assert from "node:assert/strict";
import { after, describe, test } from "node:test";
import { BASE_URL, ROUTES, closeBrowser, openPage } from "./helpers.mjs";

after(closeBrowser);

describe("nawigacja i responsywność", () => {
  test("menu na komputerze: rozwijane usługi, Escape i aktywna pozycja", async () => {
    const { page } = await openPage({ width: 1366 });
    await page.goto(`${BASE_URL}/`);
    const nav = page.getByRole("navigation", { name: "Główna nawigacja" });
    const services = nav.getByRole("button", { name: "Usługi" });
    assert.equal(await services.getAttribute("aria-expanded"), "false");
    await services.click();
    assert.equal(await services.getAttribute("aria-expanded"), "true");
    await page.keyboard.press("Escape");
    assert.equal(await services.getAttribute("aria-expanded"), "false");
    await services.click();
    await nav.getByRole("link", { name: /Kadry i płace/ }).click();
    await page.waitForURL(/kadry-place/);
    await page.getByRole("heading", { level: 1, name: "Kadry i płace" }).waitFor();
    await nav.getByRole("link", { name: "Cennik" }).click();
    await page.waitForURL(/cennik/);
    assert.equal(await nav.getByRole("link", { name: "Cennik" }).getAttribute("aria-current"), "page");
  });

  test("menu mobilne otwiera się, nawiguje i zamyka", async () => {
    const { page } = await openPage({ width: 375, height: 740 });
    await page.goto(`${BASE_URL}/`);
    assert.equal(await page.getByRole("navigation", { name: "Główna nawigacja" }).isVisible(), false);
    const toggle = page.getByRole("button", { name: "Otwórz menu" });
    await toggle.click();
    const mobile = page.getByRole("navigation", { name: "Nawigacja mobilna" });
    await mobile.waitFor();
    await mobile.getByRole("link", { name: "Baza wiedzy" }).click();
    await page.waitForURL(/baza-wiedzy/);
    assert.equal(await mobile.isVisible(), false, "menu zamyka się po przejściu");
    await page.getByRole("button", { name: "Otwórz menu" }).click();
    await page.keyboard.press("Escape");
    assert.equal(await mobile.isVisible(), false, "Escape zamyka menu");
  });

  test("brak poziomego przewijania na telefonie, tablecie i komputerze", async () => {
    const issues = [];
    for (const width of [320, 390, 768, 1024, 1440]) {
      const { page } = await openPage({ width, height: 800 });
      for (const route of ROUTES) {
        await page.goto(BASE_URL + route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (overflow > 1) issues.push(`${route} @${width}px: +${overflow}px`);
      }
      await page.context().close();
    }
    assert.deepEqual(issues, []);
  });

  test("obszary dotykowe przycisków i linków-przycisków mają co najmniej 24×24 px (WCAG 2.2)", async () => {
    const { page } = await openPage({ width: 390, height: 800 });
    const small = [];
    for (const route of ["/", "/kalkulator", "/wycena", "/zamowienie", "/cennik"]) {
      await page.goto(BASE_URL + route);
      const found = await page.$$eval("button, .btn, input[type=checkbox], input[type=radio]", (els) =>
        els
          .filter((el) => el.offsetParent !== null && !el.closest("[aria-hidden=true]") && !el.classList.contains("sr-only"))
          .map((el) => {
            const target = el.closest("label") ?? el;
            const r = target.getBoundingClientRect();
            return { name: el.textContent?.trim() || el.getAttribute("aria-label") || el.name, w: r.width, h: r.height };
          })
          .filter((r) => r.w < 24 || r.h < 24),
      );
      for (const f of found) small.push(`${route}: ${f.name} ${Math.round(f.w)}×${Math.round(f.h)}`);
    }
    assert.deepEqual(small, []);
  });

  test("nawigacja klawiaturą: link „Przejdź do treści” i widoczny fokus", async () => {
    const { page } = await openPage();
    await page.goto(`${BASE_URL}/kalkulator`);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Przejdź do treści" });
    assert.ok(await skip.evaluate((el) => el === document.activeElement));
    const box = await skip.boundingBox();
    assert.ok(box && box.y >= 0, "link pomijania jest widoczny po otrzymaniu fokusu");
    await page.keyboard.press("Enter");
    // Kolejne Tab-y docierają do pól kalkulatora; każdy element z fokusem ma obrys.
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      const outline = await page.evaluate(() => {
        const el = document.activeElement;
        const s = getComputedStyle(el);
        const label = el.closest("label");
        const ls = label ? getComputedStyle(label) : null;
        return s.outlineStyle !== "none" || s.boxShadow !== "none" || (ls && ls.outlineStyle !== "none");
      });
      assert.ok(outline, `element ${i} ma widoczny fokus`);
    }
  });

  test("wszystkie przyciski i linki mają dostępne nazwy i cel", async () => {
    const { page } = await openPage();
    const problems = [];
    for (const route of ROUTES) {
      await page.goto(BASE_URL + route);
      const bad = await page.$$eval("a, button", (els) =>
        els
          .filter((el) => {
            const name = (el.getAttribute("aria-label") || el.textContent || "").trim();
            if (!name) return true;
            if (el.tagName === "A" && !el.getAttribute("href")) return true;
            return false;
          })
          .map((el) => el.outerHTML.slice(0, 80)),
      );
      for (const b of bad) problems.push(`${route}: ${b}`);
    }
    assert.deepEqual(problems, []);
  });

  test("ograniczenie animacji przy prefers-reduced-motion", async () => {
    const { page } = await openPage();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/`);
    const duration = await page.$eval(".hero-enter", (el) => getComputedStyle(el).animationDuration);
    assert.ok(parseFloat(duration) < 0.01, `animacja: ${duration}`);
  });
});
