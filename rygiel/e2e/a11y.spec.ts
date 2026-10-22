import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const pages = [
  "/",
  "/uslugi",
  "/uslugi/obsluga-it",
  "/uslugi/cyberbezpieczenstwo",
  "/uslugi/chmura-i-infrastruktura",
  "/realizacje",
  "/realizacje/kopie-zapasowe-pracowni-projektowej",
  "/baza-wiedzy",
  "/baza-wiedzy/phishing-w-malej-firmie",
  "/o-nas",
  "/kontakt",
  "/polityka-prywatnosci",
];

for (const path of pages) {
  test(`axe: ${path} bez naruszeń WCAG A/AA @mobile`, async ({ page }) => {
    await page.goto(path);
    // Otwieramy akordeony, żeby sprawdzić także ukrytą treść.
    for (const button of await page.locator("button[aria-expanded='false'][aria-controls]").all()) {
      if (!(await button.isVisible())) continue;
      // Klawiatura zamiast kliknięcia – przyklejony nagłówek mógłby przesłonić przycisk.
      await button.focus();
      await page.keyboard.press("Enter");
    }
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

test("formularz z błędami nie ma naruszeń dostępności", async ({ page }) => {
  await page.goto("/kontakt");
  await page.getByRole("button", { name: "Wyślij zapytanie" }).click();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});
