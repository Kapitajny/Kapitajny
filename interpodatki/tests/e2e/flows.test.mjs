import assert from "node:assert/strict";
import { after, describe, test } from "node:test";
import { BASE_URL, closeBrowser, money, openPage } from "./helpers.mjs";

after(closeBrowser);

const FALSE_CLAIMS = [/wiadomość została wysłana/i, /e-mail został wysłany/i, /płatność została zrealizowana/i, /pobraliśmy/i, /obciążyliśmy/i];

async function assertNoFalseClaims(page) {
  const text = await page.locator("body").innerText();
  for (const re of FALSE_CLAIMS) assert.doesNotMatch(text, re);
}

describe("formularz wyceny", () => {
  test("walidacja kroków, podsumowanie z edycją i zapis demonstracyjny", async () => {
    const { page, errors } = await openPage();
    await page.goto(`${BASE_URL}/wycena`);
    await page.getByRole("button", { name: "Dalej" }).click();
    await page.getByText(/Popraw \d pola/).waitFor();
    assert.ok(await page.getByText("Wybierz rodzaj działalności.").first().isVisible());
    assert.ok(await page.getByText("Zaznacz co najmniej jedną usługę.").first().isVisible());
    assert.equal(await page.getByLabel("Rodzaj działalności").getAttribute("aria-invalid"), "true");

    await page.getByLabel("Rodzaj działalności").selectOption("jdg");
    await page.getByLabel("Miesięczna liczba dokumentów").fill("30");
    await page.getByLabel("Liczba pracowników").fill("0");
    await page.getByRole("checkbox", { name: "Księgowość" }).check();
    await page.getByRole("button", { name: "Dalej" }).click();

    await page.getByLabel("Orientacyjny budżet").selectOption("do-1200");
    await page.getByLabel("Preferowany termin rozpoczęcia").selectOption("do-miesiaca");
    await page.getByRole("button", { name: "Dalej" }).click();

    await page.getByLabel("Imię").fill("Ewa");
    await page.getByLabel("Adres e-mail").fill("niepoprawny");
    await page.getByRole("button", { name: "Przejdź do podsumowania" }).click();
    await page.getByText("Wpisz poprawny adres e-mail, np. jan@firma.pl.").first().waitFor();
    await page.getByLabel("Adres e-mail").fill("ewa@przyklad.pl");
    await page.getByLabel(/Wyrażam zgodę/).check();
    await page.getByRole("button", { name: "Przejdź do podsumowania" }).click();

    await page.getByRole("heading", { name: "Podsumowanie" }).waitFor();
    assert.ok((await page.locator("body").innerText()).includes("ewa@przyklad.pl"));
    // Edycja danych przed wysłaniem
    await page.getByRole("button", { name: "Edytuj: Oczekiwania" }).click();
    await page.getByLabel("Preferowany termin rozpoczęcia").selectOption("pozniej");
    await page.getByRole("button", { name: "Dalej" }).click();
    await page.getByRole("button", { name: "Przejdź do podsumowania" }).click();
    assert.ok((await page.locator("body").innerText()).includes("Później / jeszcze nie wiem"));

    await page.waitForTimeout(2600); // minimalny czas wypełniania (ochrona antyspamowa)
    await page.getByRole("button", { name: "Wyślij zgłoszenie (demo)" }).click();
    await page.getByText("Zgłoszenie zapisane w środowisku demonstracyjnym").waitFor();
    assert.ok(await page.getByText("Nie wysłano żadnej wiadomości e-mail.").isVisible());
    await assertNoFalseClaims(page);
    assert.deepEqual(errors, []);
  });

  test("formularz kontaktowy: walidacja i komunikat demonstracyjny", async () => {
    const { page } = await openPage();
    await page.goto(`${BASE_URL}/kontakt`);
    await page.getByRole("button", { name: "Wyślij wiadomość (demo)" }).click();
    await page.getByText(/Popraw \d pola/).waitFor();
    await page.getByLabel("Imię").fill("Piotr");
    await page.getByLabel("Adres e-mail").fill("piotr@przyklad.pl");
    await page.getByLabel("Temat").selectOption("cennik");
    await page.getByRole("textbox", { name: "Wiadomość" }).fill("Proszę o informację o cenie dla spółki.");
    await page.getByLabel(/Wyrażam zgodę/).check();
    await page.waitForTimeout(2600);
    await page.getByRole("button", { name: "Wyślij wiadomość (demo)" }).click();
    await page.getByText("Wiadomość zapisana w trybie demonstracyjnym").waitFor();
    assert.match(await page.locator("body").innerText(), /nie została wysłana/);
    await assertNoFalseClaims(page);
  });
});

describe("zamówienie i płatność demonstracyjna", () => {
  async function createOrder(page, packageName = "Pakiet Biznes") {
    await page.goto(`${BASE_URL}/cennik`);
    await page.getByRole("link", { name: packageName.replace("Pakiet", "Wybierz pakiet") }).click();
    await page.waitForURL(/zamowienie\?pakiet=/);
    assert.ok(await page.getByRole("radio", { name: new RegExp(packageName) }).isChecked());
    await page.getByRole("button", { name: "Dalej" }).click();
    await page.getByText("Zasady abonamentu (przykładowe)").waitFor();
    await page.getByRole("button", { name: "Dalej" }).click();
    await page.getByRole("button", { name: "Dalej" }).click();
    await page.getByText(/Popraw \d pola/).waitFor();
    await page.getByLabel("Imię").fill("Jan");
    await page.getByLabel("Adres e-mail").fill("jan@przyklad.pl");
    await page.getByLabel(/Akceptuję/).check();
    await page.getByLabel(/Rozumiem/).check();
    await page.getByRole("button", { name: "Dalej" }).click();
    await page.getByRole("button", { name: "Przejdź do płatności demo" }).click();
    await page.waitForURL(/platnosc-demo\?zamowienie=/);
  }

  test("scenariusz sukcesu: rozdzielenie opłat, baner demo i potwierdzenie", async () => {
    const { page, errors } = await openPage();
    await createOrder(page);
    await page.getByText("TRYB DEMONSTRACYJNY — PŁATNOŚCI NIE SĄ REALIZOWANE").waitFor();
    const summary = await page.getByLabel("Podsumowanie zamówienia").innerText();
    assert.match(summary, /Opłata miesięczna\s+1\s200\szł/);
    assert.match(summary, /Opłata jednorazowa\s+500\szł/);
    assert.match(summary, /Do zapłaty teraz\s+1\s700\szł/);
    // Brak pól na dane karty
    assert.equal(await page.locator('input[autocomplete^="cc-"], input[name*="card" i]').count(), 0);

    await page.getByRole("radio", { name: /Karta płatnicza/ }).check();
    await page.getByRole("radio", { name: /Płatność zaakceptowana/ }).check();
    await page.getByRole("button", { name: /Zapłać 1\s700\szł \(symulacja\)/ }).click();
    await page.waitForURL(/potwierdzenie\?zamowienie=/);
    assert.match(await page.getByTestId("confirmation-message").textContent(), /Nie pobrano żadnych środków/);
    assert.ok(await page.getByText("To nie jest potwierdzenie rzeczywistej płatności").isVisible());
    await assertNoFalseClaims(page);

    await page.getByRole("link", { name: "Przejdź do panelu klienta (demo)" }).click();
    await page.waitForURL(/panel-demo/);
    assert.equal(await page.getByTestId("panel-package").textContent(), "Biznes");
    assert.ok(await page.getByText("Opłacone w trybie demo").first().isVisible());
    // Podgląd faktury DEMO w oknie dialogowym
    await page.getByRole("button", { name: /Podgląd: Faktura/ }).first().click();
    await page.getByRole("dialog").getByText(/Nie jest fakturą VAT/).waitFor();
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").count(), 0);
    assert.deepEqual(errors, []);
  });

  test("scenariusz błędu: komunikat, ponowna próba i powrót do zamówienia", async () => {
    const { page } = await openPage();
    await createOrder(page, "Pakiet Start");
    await page.getByRole("radio", { name: /Płatność odrzucona/ }).check();
    await page.getByRole("button", { name: /Zapłać/ }).click();
    await page.getByText("Płatność demonstracyjna nie powiodła się").waitFor();
    assert.equal(await page.getByTestId("order-status").textContent(), "Płatność demonstracyjna nieudana");

    await page.getByRole("radio", { name: /Błąd operatora/ }).check();
    await page.getByRole("button", { name: "Spróbuj ponownie (symulacja)" }).click();
    await page.getByText(/Symulowany błąd operatora/).waitFor();
    assert.equal(await page.getByText("Odrzucona (demo)").count(), 2);

    // Strona potwierdzenia nie udaje sukcesu dla nieopłaconego zamówienia
    const orderUrl = new URL(page.url());
    await page.goto(`${BASE_URL}/potwierdzenie${orderUrl.search}`);
    await page.getByRole("heading", { name: "Zamówienie nie zostało opłacone" }).waitFor();

    await page.goto(`${BASE_URL}/platnosc-demo${orderUrl.search}`);
    await page.getByRole("link", { name: "Wróć do zamówienia" }).click();
    await page.waitForURL(/zamowienie\?zamowienie=/);
    await page.getByText(/Edytujesz zamówienie DEMO-ZAM/).waitFor();
    assert.ok(await page.getByRole("radio", { name: /Pakiet Start/ }).isChecked());
  });

  test("konfiguracja z kalkulatora trafia do zamówienia z ceną liczoną przez serwer", async () => {
    const { page } = await openPage();
    await page.goto(`${BASE_URL}/kalkulator?typ=spzoo&forma=spzoo&uslugi=ksiegowosc,vat&dokumenty=60&pracownicy=0&skala=mikro&zlozonosc=standard`);
    const expected = money(await page.getByTestId("calc-monthly").textContent());
    await page.getByRole("link", { name: "Wybierz abonament" }).click();
    await page.waitForURL(/zamowienie\?/);
    assert.ok(await page.getByRole("radio", { name: /Twoja konfiguracja z kalkulatora/ }).isChecked());
    const summary = await page.getByLabel("Podsumowanie kosztów").innerText();
    assert.equal(money(summary.match(/Opłata miesięczna\s+([\d\s ]+)zł/)[1]), expected);
  });

  test("pakietu Enterprise nie da się zamówić online", async () => {
    const { page } = await openPage();
    await page.goto(`${BASE_URL}/zamowienie`);
    assert.ok(await page.getByRole("radio", { name: /Pakiet Enterprise/ }).isDisabled());
    await page.getByRole("button", { name: "Dalej" }).click();
    await page.getByText("Wybierz abonament, aby przejść dalej.").waitFor();
  });

  test("bezpośrednie wejście na checkout bez zamówienia pokazuje komunikat", async () => {
    const { page } = await openPage();
    await page.goto(`${BASE_URL}/platnosc-demo?zamowienie=00000000-0000-0000-0000-000000000000`);
    await page.getByText("Nie znaleziono zamówienia testowego").waitFor();
    await page.getByText("TRYB DEMONSTRACYJNY — PŁATNOŚCI NIE SĄ REALIZOWANE").waitFor();
  });
});

