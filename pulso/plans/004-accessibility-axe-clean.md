# Plan 004: The page passes axe (WCAG 2.1 AA + best practice) at desktop and mobile

> **Executor instructions**: Follow step by step, verify each step, honour STOP conditions, update `pulso/plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 7923f59..HEAD -- pulso/src/components pulso/src/app/globals.css`

## Status

- **Priority**: P1 · **Effort**: S · **Risk**: LOW · **Depends on**: 001 (touches `ContactForm.tsx` summary) · **Category**: a11y
- **Planned at**: commit `7923f59`, 2026-11-18

## Why this matters

An axe run (axe-core 4.10, tags wcag2a/wcag2aa/wcag21aa/best-practice) on the built page reports, at 1440 and 390 px:
`definition-list` + `dlitem` (22 nodes) in the form summary, `aria-prohibited-attr` (aria-label on a plain span in the
hero plan), `color-contrast` on the red DEMO stamps (4.2:1 on white, needs 4.5:1), `aria-allowed-role`
(`<article role="tabpanel">` in Portfolio) and, on mobile, `scrollable-region-focusable` (pricing comparison table).
Smaller gaps from code review: CaseStudies tabs lack Home/End keys; the privacy link opens a new tab without saying so.

## Current state

- Form summary (`ContactForm.tsx`, step 6): `<dl>` → `<div grid>` → `<div grid>` → `<div className="contents"><dt/><dd/></div>` — dt/dd too deeply nested.
- `HeroPlan.tsx` report row: `<span className="week-grid ..." aria-label="Raport co 4 tygodnie">`.
- `.stamp-demo text-youtube` in `Portfolio.tsx` and `CaseStudies.tsx`; `--color-youtube: #e2412f` in `globals.css`.
- `Portfolio.tsx`: `<article ... role="tabpanel">`.
- `Pricing.tsx`: `<div className="relative mt-5 overflow-x-auto ...">` wrapping the comparison `<table>`.

## Scope

In scope: `ContactForm.tsx`, `HeroPlan.tsx`, `Portfolio.tsx`, `CaseStudies.tsx`, `Pricing.tsx`, `globals.css`. Out of scope: copy, layout changes beyond what each fix needs.

## Steps

1. Summary: render one `<dl>` per step group whose direct children are `<div>` wrappers containing exactly one `<dt>` and one `<dd>` (allowed by HTML); keep the "Popraw" button outside the `<dl>`.
2. Hero report row: drop `aria-label` from the span; add `<span className="sr-only">Raport co 4 tygodnie</span>` inside the row label cell.
3. Add token `--color-stamp: #c8371f` (4.82:1 on #f6f6f2, 5.22:1 on white) and use `text-stamp` for both stamps.
4. Portfolio: change `<article role="tabpanel">` to `<div role="tabpanel">`.
5. Pricing: the scroll container gets `tabIndex={0}`, `role="region"`, `aria-label="Porównanie pakietów (przewijane)"`.
6. CaseStudies tabs: handle `Home`/`End` like Portfolio/Faq.
7. Privacy link: append `<span className="sr-only"> (otwiera się w nowej karcie)</span>`.

**Verify each**: rebuild, serve `out/` on 4310 and run an axe check script (Playwright + `axe-core` from a scratch dir,
`runOnly: ['wcag2a','wcag2aa','wcag21aa','best-practice']`) at 1440×900 and 390×844, with the form navigated to step 6
(fill the steps with valid data first) so the summary is in the DOM.

## Done criteria

- [ ] axe reports 0 violations at both widths, with the form on step 1 and on step 6
- [ ] `npm run typecheck && npm run lint && npm test && npm run build` exit 0

## STOP conditions

- A contrast fix would require changing the four channel colours (they are the brand system) — report instead.

## Maintenance notes

New red text must use `--color-stamp`, never `--color-youtube` (fill-only colour).

## Execution notes

- Failing check first: `tests/e2e/axe.mjs` (axe-core path via `AXE_CORE`) reported aria-allowed-role, aria-prohibited-attr, color-contrast ×2, definition-list, dlitem ×20 and (mobile) scrollable-region-focusable.
- After all 7 steps: 0 violations at 1440 and 390 px, form on step 1 and step 6.
- Gates: typecheck, lint, 30/30 tests, build — pass.
