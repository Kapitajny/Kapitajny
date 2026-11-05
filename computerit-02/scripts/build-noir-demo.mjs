// Buduje wersję demonstracyjną NOIR COFFEE (projekt z katalogu nadrzędnego) jako statyczną stronę
// w public/demo/noir-coffee. Płatności, newsletter i statusy zamówień wymagają serwera, więc w demo są wyłączone.
// Concept 02: zamówienie kończy się podsumowaniem „zamówienie demo” (bez płatności, bez wysyłki danych),
// a koszyk jest czyszczony. Zmiany dotyczą wyłącznie kopii roboczej – źródła NOIR COFFEE zostają bez zmian.
//
// Użycie (z katalogu computerit-02/, po `npm install` w katalogu nadrzędnym):  node scripts/build-noir-demo.mjs

import { execSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE_PATH = "/demo/noir-coffee";
const here = dirname(fileURLToPath(import.meta.url));
const noirRoot = join(here, "..", "..");
const target = join(here, "..", "public", "demo", "noir-coffee");
const work = mkdtempSync(join(tmpdir(), "noir-demo-"));

const tracked = execSync("git ls-files", { cwd: noirRoot, encoding: "utf8" })
  .split("\n")
  .filter((file) => file && !/^(computerit|computerit-02|\.claude|\.agents)\//.test(file));
for (const file of tracked) cpSync(join(noirRoot, file), join(work, file));
// Turbopack nie rozwiązuje modułów spoza katalogu projektu, więc node_modules kopiujemy zamiast linkować.
cpSync(join(noirRoot, "node_modules"), join(work, "node_modules"), { recursive: true, verbatimSymlinks: true });

const edit = (file, from, to) => {
  const path = join(work, file);
  const source = readFileSync(path, "utf8");
  if (!source.includes(from)) throw new Error(`Nie znaleziono fragmentu do podmiany w ${file}: ${from.slice(0, 120)}`);
  writeFileSync(path, source.replace(from, to));
};

for (const dir of ["src/app/api", "src/app/zamowienie/sukces", "src/app/zamowienie/anulowano", "src/app/robots.ts", "src/app/sitemap.ts", "tests"]) {
  rmSync(join(work, dir), { recursive: true, force: true });
}

// Statyczny eksport: bez Cache Components / PPR i bez nagłówków serwera.
edit("next.config.ts", "  cacheComponents: true,\n  partialPrefetching: true,\n", `  output: "export",\n  basePath: "${BASE_PATH}",\n`);
edit("next.config.ts", "  images: {\n", "  images: {\n    unoptimized: true,\n");
const config = readFileSync(join(work, "next.config.ts"), "utf8").replace(/ {2}async headers\(\) \{\n[\s\S]*?\n {2}\},\n/, "");
writeFileSync(join(work, "next.config.ts"), config);
edit("src/components/layout/SiteFooter.tsx", 'import { cacheLife } from "next/cache";\n', "");
edit("src/components/layout/SiteFooter.tsx", '  "use cache";\n  cacheLife("days");\n', "");
// Ścieżki zdjęć z manifestu nie dostają basePath automatycznie.
edit("src/lib/images.server.ts", "src: exists ? publicPath : null", `src: exists ? \`${BASE_PATH}\${publicPath}\` : null`);
// Zamówienie bez płatności – formularz pokazuje komunikat, że płatności nie są skonfigurowane.
edit("src/app/zamowienie/page.tsx", 'import { connection } from "next/server";\n', "");
edit("src/app/zamowienie/page.tsx", 'import { getPaymentsMode } from "@/lib/server/env";\n', "");
edit(
  "src/app/zamowienie/page.tsx",
  "async function CheckoutWithConfig() {\n  // Konfigurację płatności czytamy przy każdym żądaniu (klucze mogą być ustawione dopiero na serwerze).\n  await connection();\n  return <CheckoutFlow paymentsMode={getPaymentsMode()} />;\n}",
  '// Wersja demonstracyjna w portfolio ComputerIT: płatności są wyłączone, zamówienie kończy się podsumowaniem demo.\nfunction CheckoutWithConfig() {\n  return <CheckoutFlow paymentsMode="demo" />;\n}',
);

// --- Zamówienie demo w CheckoutFlow (kopia robocza)
const flow = "src/components/checkout/CheckoutFlow.tsx";
edit(flow, 'type PaymentsMode = "test" | "live" | "unconfigured";', 'type PaymentsMode = "test" | "live" | "unconfigured" | "demo";');
edit(flow, 'type Step = "details" | "summary";', 'type Step = "details" | "summary" | "done";');
edit(
  flow,
  "  const headingRef = useRef<HTMLHeadingElement>(null);\n",
  "  const headingRef = useRef<HTMLHeadingElement>(null);\n  const [demoOrder, setDemoOrder] = useState<{ number: string; lines: { name: string; quantity: number; total: number; options: string[] }[]; total: number; pickup: string; location: string } | null>(null);\n",
);
edit(
  flow,
  "    setSubmitting(true);\n    setFormError(null);\n    const payload = {",
  `    if (paymentsMode === "demo") {
      // Wersja demonstracyjna: nic nie jest wysyłane, żadna płatność nie jest pobierana.
      setDemoOrder({
        number: "NOIR-DEMO-" + Math.random().toString(36).slice(2, 6).toUpperCase(),
        lines: cart.lines.map((l) => ({ name: l.name, quantity: l.quantity, total: l.lineTotal, options: l.optionLabels })),
        total: cart.total,
        pickup: activeDate && pickupTime ? formatPickup(activeDate, pickupTime, now ?? undefined) : "",
        location: location?.name ?? "",
      });
      cart.clearCart();
      try {
        window.sessionStorage.removeItem(CONTACT_KEY);
      } catch {}
      goTo("done");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    const payload = {`,
);
edit(
  flow,
  "  if (cart.lines.length === 0) {\n",
  `  if (step === "done" && demoOrder) {
    return (
      <div className="container-x pb-24 pt-14 lg:pb-32 lg:pt-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-paper p-7 sm:p-10">
          <p className="eyebrow">Zamówienie demonstracyjne</p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-[clamp(2rem,1.4rem+2vw,3rem)] outline-none">
            Dziękujemy – to było zamówienie demo
          </h1>
          <p className="mt-4 text-muted">
            Numer zamówienia demo: <strong className="text-roast">{demoOrder.number}</strong>
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <SummaryItem label="Lokal">{demoOrder.location}</SummaryItem>
            <SummaryItem label="Odbiór">{demoOrder.pickup}</SummaryItem>
          </dl>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {demoOrder.lines.map((line, i) => (
              <li key={i} className="flex justify-between gap-4 py-3">
                <span>
                  {line.name} × {line.quantity}
                  {line.options.length > 0 && <span className="block text-xs text-muted">{line.options.join(" · ")}</span>}
                </span>
                <span className="tabular-nums">{formatPrice(line.total)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between font-medium">
            <span>Razem</span>
            <span className="font-serif text-2xl text-roast tabular-nums">{formatPrice(demoOrder.total)}</span>
          </p>
          <p className="mt-6 text-sm leading-relaxed text-espresso">
            To wersja demonstracyjna przygotowana przez ComputerIT. <strong>Żadna płatność nie została pobrana</strong>, zamówienie nie trafiło do
            kawiarni, a Twoje dane nie zostały nigdzie wysłane.
          </p>
          <Link href="/#menu" className="btn btn-primary mt-8">
            Wróć do menu
          </Link>
        </div>
      </div>
    );
  }

  if (cart.lines.length === 0) {
`,
);
edit(
  flow,
  'next.acceptTerms = "Zaakceptuj regulamin, aby przejść do płatności.";',
  'next.acceptTerms = paymentsMode === "demo" ? "Zaakceptuj regulamin, aby złożyć zamówienie demo." : "Zaakceptuj regulamin, aby przejść do płatności.";',
);
edit(
  flow,
  '{submitting ? "Przekierowujemy do płatności…" : `Zamawiam i płacę ${formatPrice(cart.total)}`}',
  '{paymentsMode === "demo" ? `Złóż zamówienie demo (${formatPrice(cart.total)})` : submitting ? "Przekierowujemy do płatności…" : `Zamawiam i płacę ${formatPrice(cart.total)}`}',
);
edit(
  flow,
  '                Płatność odbywa się na bezpiecznej stronie Stripe. Zamówienie przekażemy do lokalu po potwierdzeniu płatności przez operatora.',
  '                {paymentsMode === "demo" ? "Wersja demonstracyjna: zamówienie nie zostanie zrealizowane i nie przejdziesz do płatności." : "Płatność odbywa się na bezpiecznej stronie Stripe. Zamówienie przekażemy do lokalu po potwierdzeniu płatności przez operatora."}',
);
edit(
  flow,
  '  if (mode === "live") return null;\n',
  `  if (mode === "live") return null;
  if (mode === "demo") {
    return (
      <p role="note" className="mt-6 flex gap-3 rounded-xl border border-dashed border-latte/70 px-4 py-3 text-sm leading-relaxed text-espresso">
        <InfoIcon size={18} className="mt-0.5 shrink-0 text-latte" />
        <span>
          <strong className="font-semibold">Wersja demonstracyjna.</strong> Płatności są wyłączone – po kliknięciu zobaczysz podsumowanie zamówienia demo.
          Nic nie zostanie pobrane ani wysłane.
        </span>
      </p>
    );
  }
`,
);

execSync("npx next build", { cwd: work, stdio: "inherit", env: { ...process.env, NEXT_PUBLIC_SITE_URL: `http://localhost:3000${BASE_PATH}` } });
rmSync(target, { recursive: true, force: true });
cpSync(join(work, "out"), target, { recursive: true });
rmSync(work, { recursive: true, force: true });
// Pasek ComputerIT – ten sam co w pozostałych wersjach demonstracyjnych.
execSync("node scripts/add-demo-bar.mjs", { cwd: join(here, ".."), stdio: "inherit" });
console.log(`Gotowe: ${target}`);
