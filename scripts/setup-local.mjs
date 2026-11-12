// Przygotowuje plik .env.local do uruchomienia strony na własnym komputerze:
// jeśli go nie ma, tworzy losowe hasło do panelu (/panel) i sekret sesji, a potem wypisuje hasło.
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = ".env.local";
if (!existsSync(file)) {
  const words = ["fala", "kilwater", "molo", "zatoka", "mewa", "boja", "ster", "rufa"];
  const pick = () => words[randomBytes(1)[0] % words.length];
  const password = `${pick()}-${pick()}-${randomBytes(3).toString("hex")}`;
  writeFileSync(
    file,
    [
      "# Utworzone automatycznie przez scripts/setup-local.mjs (tylko do użytku lokalnego).",
      `ADMIN_PASSWORD=${password}`,
      `ADMIN_SESSION_SECRET=${randomBytes(36).toString("base64url")}`,
      "",
    ].join("\n"),
  );
}
const pass = /^ADMIN_PASSWORD=(.*)$/m.exec(readFileSync(file, "utf8"))?.[1]?.trim();
console.log(pass ? `\n Panel administratora: http://localhost:3000/panel\n Hasło: ${pass}  (zmienisz je w pliku .env.local)\n` : "\n Panel: ustaw ADMIN_PASSWORD w pliku .env.local\n");
