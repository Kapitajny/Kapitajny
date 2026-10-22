import { expect, test } from "./fixtures";

test("filtry realizacji aktualizują wyniki i obsługują pusty stan", async ({ page }) => {
  await page.goto("/realizacje");
  const list = page.locator("main ul").filter({ has: page.getByRole("heading", { level: 2 }) }).first();
  await expect(list.getByRole("heading", { level: 2 })).toHaveCount(4);

  const area = page.getByRole("group", { name: "Filtr: Obszar" });
  const sector = page.getByRole("group", { name: "Filtr: Branża" });

  await area.getByRole("button", { name: "Kopie i ciągłość działania" }).click();
  await expect(page.getByRole("status")).toHaveText("Pasujące: 1 realizacja z 4");
  await expect(page.getByRole("heading", { level: 2, name: /Kopie zapasowe i odtwarzanie/ })).toBeVisible();

  await area.getByRole("button", { name: "Bezpieczeństwo" }).click();
  await sector.getByRole("button", { name: "Handel internetowy" }).click();
  await expect(page.getByText("Brak realizacji dla tego połączenia filtrów.")).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Pasujące: 0 realizacji z 4");

  await page.getByRole("button", { name: "Pokaż wszystkie realizacje" }).click();
  await expect(page.getByRole("status")).toHaveText("Wszystkie realizacje: 4");
  await expect(area.getByRole("button", { name: "Wszystkie" })).toHaveAttribute("aria-pressed", "true");
});

test("filtry obsługują klawiaturę i prowadzą do szczegółów realizacji", async ({ page }) => {
  await page.goto("/realizacje");
  const button = page.getByRole("group", { name: "Filtr: Branża" }).getByRole("button", { name: "Ochrona zdrowia" });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: "Standard stanowisk i obsługa zmian kadrowych w przychodni" }).click();
  await expect(page).toHaveURL(/\/realizacje\/standard-stanowisk-w-przychodni$/);
  await expect(page.getByText("Projekt demonstracyjny").first()).toBeVisible();
});

test("filtr bazy wiedzy i nawigacja między artykułami", async ({ page }) => {
  await page.goto("/baza-wiedzy");
  await page.getByRole("button", { name: "Kopie zapasowe" }).click();
  await expect(page.getByRole("status")).toContainText("Kopie zapasowe");
  await expect(page.locator("main ol h2")).toHaveCount(1);
  await page.getByRole("link", { name: /Kopie zapasowe 3-2-1 w praktyce/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Kopie zapasowe 3-2-1");
  await page.getByRole("navigation", { name: "Poprzedni i następny artykuł" }).getByRole("link", { name: /Następny artykuł/ }).click();
  await expect(page).toHaveURL(/spf-dkim-dmarc/);
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(jsonLd.some((text) => JSON.parse(text)["@type"] === "Article")).toBe(true);
});
