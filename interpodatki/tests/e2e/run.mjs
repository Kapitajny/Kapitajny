// Uruchamia testy end-to-end (node:test + Playwright) na działającym serwerze: BASE_URL (domyślnie http://localhost:3100).
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith(".test.mjs")).map((f) => join(dir, f));
const result = spawnSync(process.execPath, ["--test", "--test-concurrency=1", ...files], { stdio: "inherit" });
process.exit(result.status ?? 1);
