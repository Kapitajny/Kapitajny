import { expect, test } from "./fixtures";

test("nawigacja główna prowadzi do sekcji i oznacza aktywną stronę", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Główna nawigacja" });
  await nav.getByRole("link", { name: "Realizacje" }).click();
  await expect(page).toHaveURL(/\/realizacje$/);
  await expect(nav.getByRole("link", { name: "Realizacje" })).toHaveAttribute("aria-current", "page");
  await page.getByRole("banner").getByRole("link", { name: "Umów konsultację" }).click();
  await expect(page).toHaveURL(/\/kontakt$/);
});

test("link „Przejdź do treści” przenosi fokus do treści", async ({ page }) => {
  await page.goto("/uslugi");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Przejdź do treści" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#tresc$/);
});

test("przełącznik filarów w przekroju infrastruktury", async ({ page }) => {
  await page.goto("/uslugi");
  const group = page.getByRole("group", { name: "Pokaż zakres usługi na przekroju" });
  const cloud = group.getByRole("button", { name: "Chmura i infrastruktura" });
  await cloud.click();
  await expect(cloud).toHaveAttribute("aria-pressed", "true");
  await expect(group.getByRole("button", { name: "Obsługa IT" })).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("link", { name: "Szczegóły: Chmura i infrastruktura" })).toHaveAttribute("href", "/uslugi/chmura-i-infrastruktura");
});

test("akordeon FAQ działa z klawiatury", async ({ page }) => {
  await page.goto("/");
  const question = page.getByRole("button", { name: "Czy można zacząć od jednej usługi?" });
  const panel = page.getByRole("region", { name: "Czy można zacząć od jednej usługi?" });
  await expect(question).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();
  await page.keyboard.press("Space");
  await expect(question).toHaveAttribute("aria-expanded", "false");
  await question.click();
  await expect(panel).toContainText("przeglądu środowiska");
});

test("menu mobilne otwiera się, zamyka i blokuje tło @mobile-only", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  const panel = page.getByRole("navigation", { name: "Nawigacja mobilna" });
  await expect(panel).toBeVisible();
  await expect(page.getByRole("button", { name: "Zamknij" })).toHaveAttribute("aria-expanded", "true");
  expect(await page.locator("#tresc").evaluate((element) => (element as HTMLElement).inert)).toBe(true);

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
  expect(await page.locator("#tresc").evaluate((element) => (element as HTMLElement).inert)).toBe(false);

  await page.getByRole("button", { name: "Menu" }).click();
  await panel.getByRole("link", { name: "Baza wiedzy" }).click();
  await expect(page).toHaveURL(/\/baza-wiedzy$/);
  await expect(page.getByRole("navigation", { name: "Nawigacja mobilna" })).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Baza wiedzy");
});
