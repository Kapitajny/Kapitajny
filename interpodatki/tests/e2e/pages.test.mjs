import assert from "node:assert/strict";
import { after, describe, test } from "node:test";
import { createRequire } from "node:module";
import { BASE_URL, ROUTES, closeBrowser, openPage } from "./helpers.mjs";

const require = createRequire(import.meta.url);
const axeSource = require("fs").readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

after(closeBrowser);

describe("podstrony, linki i SEO", () => {
  test("każda podstrona odpowiada 200, ma jeden H1, tytuł, opis i brak błędów konsoli", async () => {
    const { page, errors } = await openPage();
    for (const route of ROUTES) {
      const res = await page.goto(BASE_URL + route, { waitUntil: "networkidle" });
      assert.equal(res.status(), 200, `${route} status`);
      assert.equal(await page.locator("h1").count(), 1, `${route}: liczba H1`);
      const title = await page.title();
      assert.ok(title.length > 10 && title.includes("InterPodatki"), `${route}: tytuł „${title}”`);
      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      assert.ok(desc && desc.length > 50, `${route}: meta description`);
      assert.equal(await page.locator('html[lang="pl"]').count(), 1);
    }
    assert.deepEqual(errors, []);
  });

  test("tytuły i opisy stron są unikalne", async () => {
    const { page } = await openPage();
    const titles = new Set();
    const descriptions = new Set();
    for (const route of ROUTES) {
      await page.goto(BASE_URL + route);
      titles.add(await page.title());
      descriptions.add(await page.locator('meta[name="description"]').getAttribute("content"));
    }
    assert.equal(titles.size, ROUTES.length);
    assert.equal(descriptions.size, ROUTES.length);
  });

  test("wszystkie wewnętrzne linki prowadzą do istniejących stron", async () => {
    const { page } = await openPage();
    const links = new Set();
    for (const route of ROUTES) {
      await page.goto(BASE_URL + route);
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
      for (const href of hrefs) {
        if (href.startsWith("/") ) links.add(href.split("#")[0] || "/");
        else if (href.startsWith("#")) continue;
        else if (!href.startsWith("http")) links.add(href);
      }
    }
    const broken = [];
    for (const link of links) {
      const res = await page.request.get(BASE_URL + link);
      if (res.status() !== 200) broken.push(`${link} → ${res.status()}`);
    }
    assert.deepEqual(broken, [], `Niedziałające linki: ${broken.join(", ")}`);
    assert.ok(links.size > 30, `sprawdzono ${links.size} linków`);
  });

  test("kotwice # na stronach wskazują istniejące elementy", async () => {
    const { page } = await openPage();
    for (const route of ROUTES) {
      await page.goto(BASE_URL + route);
      const missing = await page.$$eval('a[href^="#"]', (as) =>
        as.map((a) => a.getAttribute("href").slice(1)).filter((id) => id && !document.getElementById(id)),
      );
      // Podsumowanie błędów formularza linkuje do pól, które pojawiają się dopiero w danym kroku.
      assert.deepEqual(missing, [], `${route}: brakujące kotwice`);
    }
  });

  test("nieistniejący adres zwraca stronę 404 z nawigacją", async () => {
    const { page } = await openPage();
    const res = await page.goto(`${BASE_URL}/to-nie-istnieje`);
    assert.equal(res.status(), 404);
    await page.getByRole("heading", { name: /nie ma w naszej ewidencji/ }).waitFor();
    assert.ok(await page.getByRole("link", { name: "Wróć na stronę główną" }).isVisible());
    const article = await page.goto(`${BASE_URL}/baza-wiedzy/nie-ma-takiego-artykulu`);
    assert.equal(article.status(), 404);
  });

  test("robots.txt, sitemap.xml, Open Graph i dane strukturalne", async () => {
    const { page } = await openPage();
    const robots = await (await page.request.get(`${BASE_URL}/robots.txt`)).text();
    assert.match(robots, /User-Agent: \*/i);
    const sitemap = await (await page.request.get(`${BASE_URL}/sitemap.xml`)).text();
    assert.match(sitemap, /\/kalkulator<\/loc>/);
    assert.match(sitemap, /\/baza-wiedzy\/jdg-a-spolka-z-oo<\/loc>/);
    assert.doesNotMatch(sitemap, /platnosc-demo|panel-demo/);
    const og = await page.request.get(`${BASE_URL}/opengraph-image`);
    assert.equal(og.status(), 200);
    assert.equal(og.headers()["content-type"], "image/png");

    await page.goto(`${BASE_URL}/baza-wiedzy/jdg-a-spolka-z-oo`);
    const ld = await page.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => JSON.parse(x.textContent)));
    const types = ld.map((x) => x["@type"]);
    assert.ok(types.includes("Article") && types.includes("BreadcrumbList") && types.includes("WebSite"));
    // Brak fałszywych ocen, opinii i danych firmy w danych strukturalnych.
    const json = JSON.stringify(ld);
    assert.doesNotMatch(json, /aggregateRating|Review|LocalBusiness|taxID|telephone/);
    assert.ok(await page.locator('meta[property="og:title"]').count());
  });

  test("dostępność: brak naruszeń WCAG 2.2 A/AA wykrywanych przez axe-core", async () => {
    const { page } = await openPage();
    const results = [];
    for (const route of ["/", "/kalkulator", "/cennik", "/wycena", "/zamowienie", "/kontakt", "/baza-wiedzy", "/panel-demo", "/ksiegowosc-spolki"]) {
      await page.goto(BASE_URL + route, { waitUntil: "networkidle" });
      await page.addScriptTag({ content: axeSource });
      const violations = await page.evaluate(async () => {
        const r = await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
        });
        return r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length}× ${v.nodes[0].target.join(" ")}`);
      });
      if (violations.length) results.push(`${route}: ${violations.join("; ")}`);
    }
    assert.deepEqual(results, []);
  });
});
