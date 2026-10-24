import assert from "node:assert/strict";
import { after, describe, test } from "node:test";
import { BASE_URL, closeBrowser, money, openPage } from "./helpers.mjs";

after(closeBrowser);

async function monthly(page) {
  return money(await page.getByTestId("calc-monthly").textContent());
}

describe("kalkulator abonamentu", () => {
  test("JDG: wartość domyślna, dokumenty, usługi i reset", async () => {
    const { page, errors } = await openPage();
    await page.goto(`${BASE_URL}/kalkulator`);
    assert.equal(await monthly(page), 700);
    assert.equal(await page.getByTestId("calc-package").textContent(), "Start");

    // 50 dokumentów: 30 ponad limit × 9 zł
    await page.getByLabel("Dokumenty księgowe miesięcznie", { exact: true }).fill("50");
    assert.equal(await monthly(page), 970);

    // Zaznaczenie i odznaczenie usługi VAT (+150 zł dla JDG)
    const vat = page.getByRole("checkbox", { name: /Rozliczenia VAT/ });
    await vat.check();
    assert.equal(await monthly(page), 1120);
    await vat.uncheck();
    assert.equal(await monthly(page), 970);

    // Adres URL odzwierciedla konfigurację
    assert.match(page.url(), /dokumenty=50/);

    // Przycisk „+” zwiększa liczbę dokumentów o 1
    await page.getByRole("button", { name: "Zwiększ: Dokumenty księgowe miesięcznie" }).click();
    assert.equal(await monthly(page), 980);

    await page.getByRole("button", { name: "Resetuj kalkulator" }).click();
    assert.equal(await monthly(page), 700);
    assert.doesNotMatch(page.url(), /dokumenty=51/);
    assert.deepEqual(errors, []);
  });

  test("spółka z o.o.: kadry, pracownicy, skala i złożoność", async () => {
    const { page } = await openPage();
    await page.goto(`${BASE_URL}/kalkulator`);
    await page.getByRole("radio", { name: /Spółka z o\.o\./ }).check();
    assert.equal(await monthly(page), 1500);

    await page.getByRole("checkbox", { name: /Kadry i płace/ }).check();
    await page.getByLabel("Liczba pracowników", { exact: true }).fill("10");
    // 1500 + 150 + 10 × 60
    assert.equal(await monthly(page), 2250);
    assert.equal(await page.getByTestId("calc-package").textContent(), "Biznes");

    await page.getByRole("radio", { name: /^Mała/ }).check();
    // 2250 × 1,1 = 2475 → 2480
    assert.equal(await monthly(page), 2480);
    await page.getByRole("radio", { name: /^Wysoka/ }).check();
    // 2475 × 1,35 = 3341,25 → 3350
    assert.equal(await monthly(page), 3350);
    assert.equal(await page.getByTestId("calc-package").textContent(), "Pro");

    const range = await page.getByTestId("calc-range").textContent();
    const [min, max] = range.split("–").map(money);
    assert.ok(min <= 3350 && max >= 3350 && min >= 700, range);
  });

  test("brak usług blokuje wynik, a duża skala wymaga indywidualnej wyceny", async () => {
    const { page } = await openPage();
    await page.goto(`${BASE_URL}/kalkulator`);
    await page.getByRole("checkbox", { name: /^Księgowość/ }).uncheck();
    await page.getByText("Brak wybranych usług").waitFor();
    assert.equal(await page.getByRole("link", { name: "Wybierz abonament" }).count(), 0);

    await page.goto(`${BASE_URL}/kalkulator?typ=spzoo&forma=spzoo&uslugi=ksiegowosc,vat,kadry&dokumenty=1500&pracownicy=80&skala=duza&zlozonosc=wysoka`);
    assert.ok((await monthly(page)) >= 10000);
    assert.equal(await page.getByTestId("calc-package").textContent(), "Enterprise");
    assert.equal(await page.getByRole("link", { name: "Wybierz abonament" }).count(), 0);
    await page.getByText(/nie można zamówić go online/).waitFor();
  });

  test("nieprawidłowe parametry w adresie nie dają ujemnych ani błędnych cen", async () => {
    const { page, errors } = await openPage();
    await page.goto(`${BASE_URL}/kalkulator?typ=<script>&dokumenty=-500&pracownicy=abc&uslugi=ksiegowosc,hack&godziny=-4`);
    assert.equal(await monthly(page), 700);
    await page.getByLabel("Dokumenty księgowe miesięcznie", { exact: true }).fill("-20");
    await page.getByText(/Dozwolony zakres/).waitFor();
    assert.ok((await monthly(page)) >= 700);
    assert.deepEqual(errors, []);
  });

  test("przejście z kalkulatora do wyceny zachowuje dane", async () => {
    const { page } = await openPage();
    await page.goto(`${BASE_URL}/kalkulator`);
    await page.getByRole("radio", { name: /Sklep internetowy/ }).check();
    await page.getByLabel("Dokumenty księgowe miesięcznie", { exact: true }).fill("120");
    const expected = await monthly(page);
    await page.getByRole("link", { name: "Przejdź do indywidualnej wyceny" }).click();
    await page.waitForURL(/\/wycena\?/);
    assert.equal(await page.getByLabel("Rodzaj działalności").inputValue(), "ecommerce");
    assert.equal(await page.getByLabel("Miesięczna liczba dokumentów").inputValue(), "120");
    assert.ok(await page.getByRole("checkbox", { name: "Dokumentacja e-commerce" }).isChecked());
    const aside = await page.getByLabel("Informacje o wycenie").textContent();
    assert.ok(money(aside.match(/Szacunek([\d\s ]+)zł/)[1]) === expected, "szacunek przeniesiony do formularza");
  });

  test("skrócony kalkulator na stronie głównej otwiera pełny z tą samą konfiguracją", async () => {
    const { page } = await openPage();
    await page.goto(`${BASE_URL}/`);
    await page.getByRole("form", { name: "Szybki kalkulator abonamentu" }).getByRole("radio", { name: "Spółka z o.o." }).check();
    await page.getByRole("link", { name: "Otwórz pełny kalkulator" }).click();
    await page.waitForURL(/kalkulator\?typ=spzoo/);
    // księgowość spółki 1500 + VAT 250
    assert.equal(await monthly(page), 1750);
  });
});
