import { test as base, expect } from "@playwright/test";

/** Każdy test zbiera błędy konsoli i nieobsłużone wyjątki – na końcu nie może ich być. */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() !== "error") return;
        // Strona 404 celowo odpowiada statusem 404 – przeglądarka zgłasza to jako błąd zasobu dokumentu.
        const isDocument404 = message.text().includes("status of 404") && message.location().url === page.url();
        if (!isDocument404) errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(String(error)));
      await use(errors);
      expect(errors, "błędy w konsoli przeglądarki").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
