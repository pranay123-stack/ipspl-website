# IPS-PL — Website

A redesign of the [Innovative Process Solutions Pvt. Ltd.](https://www.ips-pl.com/)
website, positioning IPS-PL as an international engineering manufacturer rather
than a regional product catalogue.

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide.

---

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

---

## The one thing to understand

**No copy, image URL or specification is written inside a component.**
Everything the visitor sees comes from `src/data/`. Replacing mock content with
final client content is a data edit — the UI does not change.

```
src/data/
  company.ts      Company facts, contact details, certifications, trust metrics,
                  global locations (map coordinates included)
  products.ts     4 product categories + 7 product detail pages
  industries.ts   8 industries, each with a full detail page
  projects.ts     Case studies — ALL MOCK, no real client named
  insights.ts     Editorial articles — ALL MOCK
  navigation.ts   Header, mega menu, footer and legal navigation.
                  Product and industry links are DERIVED from products.ts /
                  industries.ts, so a name can only be changed in one place.
  capabilities.ts Engineering process, manufacturing stages, quality pillars
  legal.ts        Privacy / terms / cookies — structural placeholders only
  images.ts       CENTRALISED IMAGE REGISTRY — every image on the site
  worldMap.ts     Generated dot matrix for the global presence map
```

Add a product by appending one object to `products.ts`; its page, SEO metadata,
sitemap entry and mega-menu link follow automatically. The same is true for
industries and insights.

### Swapping the photography

`src/data/images.ts` is the only file with image URLs in it. Components receive
keys (`"productValves"`), never URLs.

Placeholders are licence-free industrial photography served from Unsplash. To
use final photography, drop files into `public/images/` and change the `src`
values:

```ts
productValves: {
  src: "/images/lined-ball-valve.jpg",
  alt: "Descriptive alt text for screen readers and SEO",
},
```

Then remove the Unsplash entry from `remotePatterns` in `next.config.ts`.

---

## Content IPS-PL still needs to supply

Nothing has been invented. Where a fact was not verifiable from the public
website it is marked in the data and, where it appears on screen, rendered as a
visible placeholder.

Find every outstanding item:

```bash
grep -rn "TO BE CONFIRMED\|TO BE PROVIDED\|WITHHELD\|PLACEHOLDER TEXT" src/data/
grep -rn "unverified: true" src/data/
```

| Area | Status |
|---|---|
| Company history, year of incorporation | Placeholder narrative on `/about` |
| Trust-strip figures (20+ years, 40+ products) | **Unverified — confirm or remove** |
| Technical specifications (bore, pressure, temperature) | Indicative values typical of ASTM F1545 lined equipment. A sign-off note renders under every spec block. |
| ISO 9001 certificate number & current revision | Not shown — no number invented |
| Case studies | **All four are mock.** No real client named. Obtain written customer permission before publishing any name. |
| Insights articles | All six are mock editorial |
| Technical document downloads (PDF/datasheets) | Links are placeholders |
| Regional office contacts | Countries are real (from the current contact page); named representatives and their direct numbers were **deliberately withheld** from this demo. Supply them if they should appear publicly. |
| Privacy / Terms / Cookie policies | Structural placeholders only — **not legal advice, not fit to publish.** Currently `noindex` and disallowed in `robots.ts`. |
| Logo asset | Typographic mark stands in — see `src/components/navigation/Logo.tsx` |
| LinkedIn URL | Placeholder `#` in `company.ts` |

**Verified from the current public website** and used as-is: company name and
positioning, product range and category structure, registered office address,
telephone numbers, working hours, ISO 9001:2008 and ASTM F1545 references,
sectors served, and the five countries of presence.

---

## Wiring up the RFQ form

`/quote` is a complete, validated B2B RFQ interface — contact details,
requirement, process conditions (media, temperature, pressure), free-text
message and multi-file attachments (PDF, DWG, DXF, XLSX, DOCX, PNG, JPG, 25 MB
each) with client-side validation and accessible error handling.

It is **not connected to a backend.** The integration point is marked in
`src/components/forms/QuoteForm.tsx`:

```ts
// INTEGRATION POINT — no backend is wired up in this demo.
// POST `form` and `files` (multipart/form-data) to the IPS-PL endpoint,
// CRM or ERP here, then surface real success and failure states.
```

Add a Next.js route handler (`src/app/api/quote/route.ts`) or point it at an
existing CRM/ERP endpoint. The form state is already shaped for a single
multipart POST.

---

## Design system

Tokens live in the `@theme` block of `src/app/globals.css` — colour, type scale,
section rhythm, radii and easing. Change them there, not in components.

- **Palette** — dark-dominant. Three near-adjacent surfaces
  (`--color-surface-base` / `-raised` / `-card`); separation comes from
  hairline borders and grain rather than heavy tonal steps. One accent
  (`--color-accent: #0f5fd4`), with `accent-bright` used wherever the accent
  carries text — the base accent only reaches 3.2:1 on dark and fails AA.
- **Text on dark** — `steel-100` primary, `steel-300` secondary,
  `steel-350` tertiary. `steel-400` and `steel-500` are **not** usable for text
  on these surfaces (4.0:1 and 2.5:1); `steel-350` exists specifically because
  a compliant tertiary tone was needed.
- **Grain** — a fixed, pointer-transparent noise layer on `body::after` at 4%.
  This is what stops a dark palette reading as flat black.
- **Type** — Inter for text, IBM Plex Mono for technical labels, indices and
  specification values. Scale runs `display-2xl` → `label`, fluid via `clamp()`.
  **Clamp maxima are bounded by the container, not the viewport.** The display
  sizes scale on `vw` while `Container` caps at 1400px, so an over-generous
  maximum makes headlines wrap above ~1500px — which is not caught by an
  overflow check, because wrapping is not overflow.
- **Micro-labels** — exactly two: `.tech-label` (11px) and `.tech-label-xs`
  (10px), both uppercase mono at 0.16em. Use these rather than writing
  `text-[0.625rem] tracking-[0.14em]` inline; that drift is what produced nine
  near-identical variants in the first place.
- **Measure** — body copy is capped around 65–75 characters. Small type needs a
  proportionally narrower container, not the same `max-w-2xl` used for body.
- **Geometry** — deliberately sharp. Max radius is 3px.
- **Motion** — one shared easing curve; reveals fire once on scroll. Everything
  is suppressed under `prefers-reduced-motion`.

### Hero motion

The hero photograph carries two transform-only animations, both CSS:

- **Ambient drift** (`.hero-drift`) — 30s scale-and-translate, alternating. A
  still photograph behind large type reads as a slide; drifting at roughly
  0.3%/second reads as cinematic without registering as "an animation".
- **Scroll parallax** (`.hero-parallax`) — the image falls away more slowly
  than the copy. Gated behind `@supports (animation-timeline: view())`, so
  browsers without scroll-driven animation simply keep the drift.

Both composite on the GPU, so Lighthouse is unchanged. The layer is oversized
(`-inset-y-[8%]`) so neither animation can expose an edge, and the keyframes
start already scaled so the reduced-motion end state is a sensible still frame.

Scrims are weighted to the left, where the headline sits, rather than applied
uniformly — that keeps the photograph legible on the right instead of
flattening the whole frame.

---

## Verified

Checks run against a production build (`next build` + `next start`), not the dev server.

**Build**
- `npm run lint` — clean
- `npx tsc --noEmit` — clean
- `npm run build` — 38 pages prerendered, ~177 KB initial JS

**Lighthouse** (Chrome, production build)

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Desktop | 99–100 | 100 | 100 | 100 |
| Mobile | 91 (median of 4) | 100 | 100 | 100 |

CLS 0 on every page measured. Mobile TBT ~100–130 ms.

**Accessibility**
- axe-core (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `best-practice`):
  **0 violations** across 13 routes × 2 viewports
- Hero headline contrast measured against the *brightest pixel* behind the
  text (heading hidden, background sampled): 5.45:1 – 9.54:1, all above the
  4.5:1 AA threshold
- Exactly one `<h1>` per page; heading order never skips a level
- Every image carries alt text; skip-to-content is the first tab stop

**Imagery**
- Every placeholder photograph was reviewed at the aspect ratio it is actually
  rendered at, not just as a thumbnail. That pass replaced an automotive
  assembly line, a hobby-desk bicycle sketch, a medical blood-collection tube,
  an electronics PCB machine, an unreadably blurred close-up, and a shot
  carrying a third-party institutional badge.
- Case-study images were made distinct from their industry-page counterparts,
  which previously repeated the same photograph twice on one page.

**Layout**
- No horizontal overflow at 390 / 768 / 1280 / 1440 / 1920 px across 14 routes
- All 202 scroll-reveal elements resolve to visible across 13 routes

---

## Performance notes

Two deliberate decisions, both made after measuring:

**The hero is a server component with CSS-driven entrance animation.** It was
originally Framer Motion. Holding the hero copy at `opacity: 0` until hydration
made that paragraph the LCP element at 3.8 s on throttled mobile. Moving the
entrance to CSS keyframes took LCP to ~2.7 s and removed the first screen's
dependency on JavaScript entirely.

**Framer Motion is loaded on interaction, not on load.** It drives the mega
menu and mobile drawer — stateful enter/exit and height-auto transitions that
CSS handles poorly. But the header sits in the root layout, so that cost was
being paid on every route for two surfaces that do not exist until the user
opens them. Both are now `next/dynamic` imports mounted on first interaction.

The ~100 scroll reveals went the other way: they were only ever a two-property
transition, so they now run on `IntersectionObserver` plus a CSS class
(`src/components/ui/Reveal.tsx`). Same API, no call-site changes. Together these
cut mobile TBT from 260–550 ms to ~100–130 ms.

A `<noscript>` rule in the root layout forces revealed content visible when
JavaScript is unavailable.
