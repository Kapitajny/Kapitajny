import { expect, test } from "./fixtures";

// Pułapka czasowa odrzuca formularze wysłane szybciej niż w 3 sekundy.
const HUMAN_DELAY = 3_200;

async function fillValid(page: import("@playwright/test").Page) {
  await page.getByLabel("Imię").fill("Anna");
  await page.getByLabel("Służbowy adres e-mail").fill("anna@firma.pl");
  await page.getByLabel("Interesująca usługa").selectOption("obsluga-it");
  await page.getByLabel("Opis problemu lub potrzeby").fill("Szukamy stałej obsługi IT dla biura na 15 stanowisk.");
  await page.getByRole("checkbox", { name: /Potwierdzam zapoznanie/ }).check();
}

test("walidacja po stronie klienta pokazuje błędy przy polach", async ({ page }) => {
  await page.goto("/kontakt");
  await page.getByRole("button", { name: "Wyślij zapytanie" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Formularz wymaga poprawek" })).toBeVisible();
  await expect(page.getByLabel("Imię")).toBeFocused();
  await expect(page.getByLabel("Imię")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Podaj adres e-mail, na który mamy odpowiedzieć.", { exact: true })).toBeVisible();

  await page.getByLabel("Służbowy adres e-mail").fill("anna@firma");
  await page.getByLabel("Służbowy adres e-mail").blur();
  const emailError = page.getByText("Sprawdź adres e-mail – powinien mieć postać nazwa@firma.pl.", { exact: true });
  await expect(emailError).toBeVisible();
  await page.getByLabel("Służbowy adres e-mail").fill("anna@firma.pl");
  await expect(emailError).toBeHidden();
});

test("wysłanie w trybie demonstracyjnym jasno informuje, że wiadomość nie została wysłana", async ({ page }) => {
  await page.goto("/kontakt");
  await expect(page.getByText("Tryb demonstracyjny.")).toBeVisible();
  await fillValid(page);
  await page.waitForTimeout(HUMAN_DELAY);
  await page.getByRole("button", { name: "Wyślij zapytanie" }).click();
  const heading = page.getByRole("heading", { name: "Wiadomość nie została wysłana – tryb demonstracyjny" });
  await expect(heading).toBeVisible();
  await expect(heading).toBeFocused();
  await expect(page.getByText("nikt nie otrzymał Twojej wiadomości")).toBeVisible();

  await page.getByRole("button", { name: "Wróć do formularza" }).click();
  await expect(page.getByLabel("Imię")).toHaveValue("Anna");
});

test("formularz wysłany zbyt szybko jest odrzucany przez serwer", async ({ page }) => {
  await page.goto("/kontakt");
  await fillValid(page);
  await page.getByRole("button", { name: "Wyślij zapytanie" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "szybciej, niż zwykle robi to człowiek" })).toBeVisible();
});

test("wypełnione pole-pułapka powoduje odrzucenie", async ({ page }) => {
  await page.goto("/kontakt");
  await fillValid(page);
  await page.locator('input[name="strona_www"]').evaluate((input: HTMLInputElement) => {
    input.value = "https://spam.example";
  });
  await page.waitForTimeout(HUMAN_DELAY);
  await page.getByRole("button", { name: "Wyślij zapytanie" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Nie udało się przyjąć formularza" })).toBeVisible();
});

test("usługa z adresu jest wstępnie wybrana", async ({ page }) => {
  await page.goto("/kontakt?usluga=chmura-i-infrastruktura");
  await expect(page.getByLabel("Interesująca usługa")).toHaveValue("chmura-i-infrastruktura");
  await page.goto("/kontakt?usluga=<script>");
  await expect(page.getByLabel("Interesująca usługa")).toHaveValue("");
});

test("CTA usługi prowadzi do formularza z wybraną usługą", async ({ page }) => {
  await page.goto("/uslugi/cyberbezpieczenstwo");
  await page.getByRole("link", { name: "Zapytaj o audyt" }).click();
  await expect(page).toHaveURL(/\/kontakt\?usluga=cyberbezpieczenstwo$/);
  await expect(page.getByLabel("Interesująca usługa")).toHaveValue("cyberbezpieczenstwo");
});

test("formularz działa na telefonie @mobile-only", async ({ page }) => {
  await page.goto("/kontakt");
  await fillValid(page);
  await page.waitForTimeout(HUMAN_DELAY);
  await page.getByRole("button", { name: "Wyślij zapytanie" }).click();
  await expect(page.getByRole("heading", { name: /tryb demonstracyjny/ })).toBeVisible();
});
