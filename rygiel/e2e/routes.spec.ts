import { allRoutes } from "../src/lib/routes";
import { expect, test } from "./fixtures";

const routes = allRoutes();

test.describe("routing i metadane", () => {
  for (const route of routes) {
    test(`${route} – status, nagłówki i metadane`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(10);
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(50);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${route === "/" ? "/?" : route}$`));
      await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /opengraph-image/);
      await expect(page.locator("html")).toHaveAttribute("lang", "pl");
    });
  }

  test("tytuły i opisy stron są unikalne", async ({ request }) => {
    const titles = new Map<string, string>();
    const descriptions = new Map<string, string>();
    for (const route of routes) {
      const html = await (await request.get(route)).text();
      const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
      const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
      expect(titles.has(title), `zduplikowany tytuł: ${title}`).toBe(false);
      expect(descriptions.has(description), `zduplikowany opis na ${route}`).toBe(false);
      titles.set(title, route);
      descriptions.set(description, route);
    }
  });

  test("wszystkie linki wewnętrzne prowadzą do istniejących stron i kotwic", async ({ page, request }) => {
    const checked = new Map<string, number>();
    for (const route of routes) {
      await page.goto(route);
      const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
      expect(hrefs, `link do „#” na ${route}`).not.toContain("#");
      for (const href of hrefs) {
        if (!href.startsWith("/") && !href.startsWith("#")) continue;
        const [path, hash] = href.startsWith("#") ? [route, href.slice(1)] : href.split("#");
        const target = (path ?? route).split("?")[0] || "/";
        if (!checked.has(target)) checked.set(target, (await request.get(target)).status());
        expect(checked.get(target), `${route} → ${href}`).toBe(200);
        if (hash && target === route) await expect(page.locator(`[id="${hash}"]`), `${route} → #${hash}`).toHaveCount(1);
      }
    }
  });

  test("sitemap.xml i robots.txt", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const route of routes) expect(sitemap).toContain(route === "/" ? "/</loc>" : `${route}</loc>`);
    expect(sitemap.match(/<loc>/g)?.length).toBe(routes.length);
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Sitemap:");
  });

  test("strony mieszczą się na ekranie 320 px – powiększenie 400% (WCAG 1.4.10)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    const overflowing: string[] = [];
    for (const route of routes) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) overflowing.push(`${route} (+${overflow}px)`);
    }
    expect(overflowing).toEqual([]);
  });

  test("nieistniejąca strona zwraca 404 z nawigacją", async ({ page }) => {
    const response = await page.goto("/nie-ma-takiej-strony");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tej strony nie ma pod tym adresem");
    await page.getByRole("link", { name: "Strona główna" }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("nagłówki bezpieczeństwa", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).toContain("object-src 'none'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("serwis nie zapisuje cookies ani danych w pamięci przeglądarki", async ({ page, context }) => {
    for (const route of ["/", "/kontakt", "/realizacje"]) await page.goto(route);
    expect(await context.cookies()).toEqual([]);
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
  });
});

test.describe("układ na telefonie", () => {
  for (const route of routes) {
    test(`${route} – brak przewijania w poziomie @mobile-only`, async ({ page }) => {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
