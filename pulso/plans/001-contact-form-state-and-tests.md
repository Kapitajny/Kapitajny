# Plan 001: The contact form has DOM tests, cannot double-submit, keeps CTA choices and focus in every state

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected
> result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not
> improvise. When done, update the status row for this plan in `pulso/plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 7923f59..HEAD -- pulso/src/components/form pulso/src/lib pulso/tests pulso/vitest.config.mts pulso/package.json`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code;
> on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug + tests + security
- **Planned at**: commit `7923f59`, 2026-11-18

## Why this matters

The multi-step form at `#kontakt` is the only conversion path of the PULSO site. Today:
(a) clicking any contact CTA while a submission is in flight flips status from `sending` back to `editing`, re-enabling
the submit button — a second click sends a duplicate lead;
(b) a CTA clicked while the form is on step 6 or on the success screen scrolls but focuses nothing, and on the success
screen the chosen package/service is merged into data that `reset()` then throws away;
(c) server rejections (4xx/5xx) and network failures show the same "check your connection" message, and a failed
clipboard copy (the only fallback while no endpoint is configured) shows nothing;
(d) there is no bot honeypot;
(e) `update()` calls `setErrors` inside a `setData` updater (impure updater).
None of this is covered by tests: only pure functions in `src/lib` are tested, in a `node` environment.

## Current state

- `pulso/src/components/form/ContactForm.tsx` — client component, the whole form (steps 1–6, success screen).
  - Intent effect (~line 46–53):
    ```tsx
    const intent = useSyncExternalStore(subscribeIntent, getIntent, () => serverIntent);
    useEffect(() => {
      if (intent.nonce === 0) return;
      setData((d) => applyIntent(d, intent));
      setErrors((e) => ({ ...e, services: undefined }));
      setStatus((s) => (s === "sent" ? s : "editing"));
    }, [intent]);
    ```
  - `update()` (~line 63):
    ```tsx
    setData((d) => {
      const next = { ...d, [key]: value };
      if (attempted.has(step)) setErrors(validateStep(step, next));
      return next;
    });
    ```
  - `submit()` (~line 103) has no in-flight guard; result mapping: `else setStatus(res.reason === "not-configured" ? "not-configured" : "error");`
  - `copySummary()` swallows the failure (`catch { setCopied(false); }`).
  - Step 6 consent `<input type="checkbox" data-field="consent" ...>` has no `data-autofocus`; the success view has none either.
- `pulso/src/lib/contact-intent.ts` — `openContact()` scrolls to `#kontakt-formularz` and focuses `[data-autofocus]` inside it in a `requestAnimationFrame`.
- `pulso/src/lib/contact-form.ts` — pure model; `submitContact(endpoint, data, accessKey, fetchImpl)` returns `{ok:true}` or `{ok:false, reason: "not-configured"|"network"|"rejected"}`; `buildPayload(d, accessKey)` builds the JSON.
- `pulso/src/config/site.ts` — `contactForm.endpoint` is `null` by default (no backend). The form must never pretend to send when it is null.
- Tests: `pulso/tests/*.test.ts`, vitest, `environment: "node"` (`pulso/vitest.config.mts`). Pattern to follow: `pulso/tests/contact-form.test.ts` (describe/it in Polish, `@/` alias).

## Commands you will need (run inside `pulso/`)

| Purpose   | Command | Expected on success |
|-----------|---------|---------------------|
| Install   | `npm install` | exit 0 |
| Typecheck | `npm run typecheck` | exit 0 |
| Lint      | `npm run lint` | exit 0, no warnings |
| Tests     | `npm test` | all pass |
| Build     | `npm run build` | exit 0, `out/index.html` exists |

## Scope

**In scope**: `pulso/src/components/form/ContactForm.tsx`, `pulso/src/lib/contact-form.ts`, `pulso/vitest.config.mts`,
`pulso/package.json` (+ lock, dev deps only), `pulso/tests/contact-form-ui.test.tsx` (create), `pulso/tests/contact-form.test.ts`.

**Out of scope**: any section component, `contact-intent.ts` public API (`openContact`, `ContactLink` callers must not change), visual design of the form.

## Git workflow

Work on the current session branch; one commit per step group; imperative English subject like the repo log ("Add …", "Fix …").

## Steps

### Step 1: Add a DOM test environment and failing tests first
- `npm i -D jsdom @testing-library/react @testing-library/user-event`.
- In `vitest.config.mts` keep `environment: "node"` as default and include `tests/**/*.test.{ts,tsx}`; the new UI file starts with `// @vitest-environment jsdom`.
- Create `tests/contact-form-ui.test.tsx` with tests that FAIL on current code:
  1. endpoint null → completing all 6 steps and clicking "Wyślij zgłoszenie" shows "nie zostało wysłane" and never "Zgłoszenie dotarło"; `fetch` is never called.
  2. intent during sending: mock `contactForm.endpoint` to a URL and `fetch` to a never-resolving promise; submit; call `setIntent({ package: "start" })`; the submit button stays `disabled`.
  3. intent on success screen: resolve fetch `{ok:true}`; after "Zgłoszenie dotarło", `setIntent({ services: ["tiktok"] })` → the form is back on step 1 with TikTok checked.
  4. step 6 has an element with `[data-autofocus]`; the success screen has one too.
  5. rejected response shows a message that does NOT mention "połączenie"; network error does.
  6. honeypot: when the hidden field is filled, submit does not call fetch.
  (Mock `@/config/site` with `vi.mock` to switch the endpoint per test.)

**Verify**: `npm test` → the new tests 2, 3, 4, 5, 6 fail; test 1 passes (it is a guard).

### Step 2: Fix the state machine
- Intent effect: `setStatus((s) => (s === "sending" ? s : "editing"))`; when status was `"sent"`, start a fresh form with the intent applied: `setData(applyIntent(emptyForm, intent))`, `setStep(1)`, `setAttempted(new Set())`.
- `submit()`: add `const sendingRef = useRef(false)` guard; set before awaiting, clear in `finally`.
- Disable "Wstecz", "Popraw" and step buttons while `status === "sending"`.
- Keep the failure reason: `status` becomes `"error-network" | "error-rejected"`; rejected message: "Serwer formularza odrzucił zgłoszenie. Spróbuj ponownie za chwilę albo skopiuj podsumowanie." plus the copy button.
- `copySummary` failure → render the summary in a read-only `<textarea>` with label "Podsumowanie do skopiowania".
- `update()`: compute `next` from current `data` (not inside the updater), then `setData(next)` and, if attempted, `setErrors(validateStep(step, next))`.
- Add `data-autofocus` to the consent checkbox and to the "Wyślij kolejne zgłoszenie" button.

**Verify**: `npm test` → all tests pass.

### Step 3: Honeypot
- `ContactFormData` gains `website2: string` (empty default), rendered as a visually hidden input (`className="absolute -left-[9999px]"`, `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"`, label "Nie wypełniaj tego pola").
- `buildPayload` sends it as `_gotcha` and `botcheck`; `submitContact` returns `{ ok: true }` without calling fetch when it is non-empty (silently drop bots).
- Add unit tests in `tests/contact-form.test.ts`.

**Verify**: `npm test` → all pass; `npm run typecheck && npm run lint && npm run build` → exit 0.

## Test plan

New file `tests/contact-form-ui.test.tsx` (6 cases above) + 2 honeypot cases in `tests/contact-form.test.ts`. Pattern: `tests/contact-form.test.ts`.

## Done criteria

- [ ] `npm test` exits 0 with ≥ 30 tests
- [ ] `npm run typecheck`, `npm run lint`, `npm run build` exit 0
- [ ] `grep -n 's === "sent" ? s : "editing"' src/components/form/ContactForm.tsx` → no match
- [ ] Only in-scope files modified

## STOP conditions

- `@testing-library/react` cannot render the component under React 19.3 (peer error) after one retry with the latest version.
- Fixing requires changing `openContact()` or any `ContactLink` caller.

## Maintenance notes

If a server-rendered endpoint replaces the third-party one, keep `submitContact`'s result shape so the UI states stay valid.
