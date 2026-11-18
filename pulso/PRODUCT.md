# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router, TypeScript, Tailwind CSS 4) built as a **static export** (`output: "export"`), so it can be
hosted on GitHub Pages (e.g. as `demo/pulso` in the existing portfolio on the `gh-pages` branch) or on Vercel.
Chosen by the user from three offered options (Next.js static / Next.js with server / plain HTML).
No server runtime: anything that needs a backend (form delivery) goes through a third-party endpoint configured later.

## Users

Owners and marketing decision-makers of small and mid-sized Polish businesses (local services, e-commerce, B2B)
who are considering outsourcing paid social / search / video advertising. They arrive comparing agencies, often
burned by vague promises before, and want to understand what they would pay, what they get, and who they would
be working with before booking a consultation.

## Product Purpose

PULSO Digital Advertising Agency runs paid advertising campaigns on Meta (Facebook/Instagram), Google Ads,
YouTube Ads and TikTok Ads. The website exists to build trust, explain the services and the way of working,
present transparent pricing, and turn visitors into consultation requests via one multi-step contact form.
Success = qualified enquiries through the form (service, goal, budget, company, contact).

## Positioning

Strategy and data before spend; transparent, fixed monthly management fee published on the site; ad budget paid
by the client directly to the platforms (never marked up or hidden in the fee); honest about which platform fits
which business instead of selling every channel to everyone.

## Operating Context

- Visitors browse on phones (social traffic) and desktops (search traffic, comparing agencies).
- The site is Polish-language; the tagline is English: "Your growth. Our strategy."
- Every contact CTA ("Kontakt", "Umów konsultację", "Rozpocznij współpracę", "Wybieram pakiet") leads to the single
  form at `#kontakt`, carrying the chosen package / service when relevant.

## Capabilities and Constraints

- Services: Meta Ads, Google Ads (search + relevant networks), YouTube Ads (video), TikTok Ads.
- Working pricing (draft, to be approved, must stay editable in config): START 799 zł netto/mies. (1 platform),
  GROWTH 1 399 zł netto/mies. (2 platforms), PROFESSIONAL 2 199 zł netto/mies. (up to 4 platforms).
  Ad budget is NOT included.
- Process: consultation → business & market analysis → strategy → campaign setup → launch → optimisation & reporting.
- Contact form delivery: **not configured yet** (user will connect later). Until an endpoint is set in config, the
  form must say plainly that sending is not enabled; it must never fake a successful send.
- Undecided: company legal details, address, phone, e-mail, social profiles, privacy-policy owner data. Must be
  config placeholders, never invented.

## Brand Commitments

- Name: PULSO; full name: PULSO Digital Advertising Agency; tagline: "Your growth. Our strategy."
- Character (user-stated): premium, modern, professional, minimal, technological, transparent, results-oriented.
- Voice: responsible, strategic, partner-like; no hype, no empty slogans, no guaranteed sales promises.
- Logo: typographic PULSO wordmark plus a proposed graphic mark (to be designed).
- User-stated avoid list: random gradients, excessive glow, heavy glassmorphism, typical SaaS templates, random
  animations, overloaded sections, auto-generated look, the same layout repeated in every section.
- Official platform logos should be used for the four services.

## Evidence on Hand

None yet (confirmed by user). No real clients, campaigns, results, testimonials, statistics, team, or contact data.
- Portfolio and case studies: only clearly labelled DEMO projects with demonstration data.
- Testimonials: empty state, ready to fill later.
- Agency statistics: hidden until real numbers exist; structure ready in config.
- No founder story, no awards, no client logos may be invented.

## Product Principles

1. Transparency over persuasion: prices, what is included, what is not (ad budget), and what is demo are always explicit.
2. Fit before channel: recommend platforms per business, never imply every platform suits everyone.
3. One path to contact: every CTA ends at the same form, preserving the visitor's choices.
4. Data is shown, not claimed: numbers appear only when real or labelled as demonstration.

## Accessibility & Inclusion

Target WCAG 2.1 AA: keyboard-operable navigation, tabs, accordions and multi-step form; visible focus;
`prefers-reduced-motion` respected for all scroll-driven storytelling; readable 16px+ body text on mobile.
