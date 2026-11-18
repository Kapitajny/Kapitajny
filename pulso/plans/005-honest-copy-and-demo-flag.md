# Plan 005: Demo content is driven by data, and no copy implies a track record

> **Executor instructions**: Follow step by step, verify each step, honour STOP conditions, update `pulso/plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 7923f59..HEAD -- pulso/src/data pulso/src/config/pricing.ts pulso/src/components/sections pulso/src/app/page.tsx pulso/src/components/ui/RevealObserver.tsx`

## Status

- **Priority**: P2 · **Effort**: S · **Risk**: LOW · **Depends on**: 004 (both touch Portfolio/CaseStudies stamps) · **Category**: honesty / tech-debt
- **Planned at**: commit `7923f59`, 2026-11-18

## Why this matters

The brief forbids invented clients, results or claims. The demo items have an `isDemo` flag that the UI never reads
(stamps and "PULSO dopiero buduje portfolio" are hard-coded), so a future real project would still be stamped "demo".
Three copy lines read as track record or nudging: "Co zrobiliśmy w tej kampanii" on fictional data, "Pytania, które
słyszymy najczęściej" (implies an existing client base), and the pricing selector pre-selects 2 platforms so GROWTH
shows "Twój wybór" before the visitor chose anything. `PricingPackage.featured` ("najczęstszy wybór") is unused and
invites an unsupported "most popular" badge. `RevealObserver` is mounted but no element has `data-reveal` (dead JS).
Portfolio back sheets carry an `onClick` that can never fire because they are `inert`. Several components repeat
`services.find(...)!` though `serviceById` exists.

## Current state (all under `pulso/src/`)

- `data/demo.ts`: `isDemo: true` on each portfolio item and case.
- `components/sections/Portfolio.tsx`: `<span className="stamp-demo ...">Projekt demonstracyjny</span>`; intro copy hard-coded; back sheets `inert={!isActive}` + `onClick={() => !isActive && go(i)}`; `setTilt` on pointermove.
- `components/sections/CaseStudies.tsx`: stamp "Dane demonstracyjne"; `<h4 ...>Co zrobiliśmy w tej kampanii</h4>`.
- `components/sections/Faq.tsx`: heading "Pytania, które słyszymy najczęściej".
- `components/sections/Pricing.tsx`: `const [count, setCount] = useState<number>(2);` and badge "Twój wybór".
- `config/pricing.ts`: `featured?: boolean` + `featured: true` on GROWTH.
- `app/page.tsx`: `<RevealObserver />`; `components/ui/RevealObserver.tsx`; `.js [data-reveal]` rules in `app/globals.css`.

## Scope

Files listed above plus `tests/pricing-and-data.test.ts`. Out of scope: visual layout.

## Steps

1. Stamps and demo intro render only when `p.isDemo` / `c.isDemo` / `portfolio.some(p => p.isDemo)`; non-demo intro: "Wybrane realizacje".
2. Copy: "Co zrobilibyśmy w takiej kampanii (przykład)"; FAQ heading "Pytania, które warto zadać przed współpracą"; pricing: initial `count` = `null` → no card highlighted, all buttons secondary, helper text "Zaznacz, ile platform chcesz prowadzić, a podświetlimy pasujący pakiet."; badge text "Pasuje do Twojego wyboru".
3. Remove `featured` from the type and data.
4. Delete `RevealObserver.tsx`, its import/mount and the `[data-reveal]` CSS.
5. Portfolio: remove the dead `onClick`; route lookups through `serviceById` (`PlatformIcon`, `MiniPlan`, `Portfolio`, `HeroPlan`).
6. Test: a component-free test asserting every `isDemo` item's name appears with a stamp is out of reach without DOM; instead assert in `tests/pricing-and-data.test.ts` that `PricingPackage` has no `featured` key on any package.

**Verify**: `grep -rn "Co zrobiliśmy\|słyszymy najczęściej\|featured\|data-reveal\|RevealObserver" src` → no matches; `npm run typecheck && npm run lint && npm test && npm run build` → exit 0.

## Done criteria

- [ ] grep above returns nothing
- [ ] All four gates exit 0

## STOP conditions

- Removing the pre-selection breaks the "Wybieram pakiet" CTA hand-off to the form (the CTA must still pass the package).

## Maintenance notes

When real projects arrive: set `isDemo: false`; stamps disappear automatically.
