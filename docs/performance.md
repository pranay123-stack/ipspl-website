# Performance — production measurements

Everything in the original audit was measured against the Turbopack dev server,
where the devtools chunk and roughly 3.8 MB of unminified JavaScript make every
number meaningless. Nothing here is a dev-mode figure.

```bash
npm run build
npx next start -p 3300
npm run lh -- --port 3300 --out .lighthouse/now --label now --runs 3 --select best
npm run lh:assert -- --in .lighthouse/now
```

## Read this before the numbers

Lighthouse's simulated throttling works by multiplying *observed* timings. On a
machine that is already busy, observed timings are inflated and TBT balloons
several-fold — the same build measured minutes apart scored 66 and 94 on
`/products`, a route whose bytes did not change at all.

The measurements below were taken on a shared workstation running unrelated
compile jobs, with load average moving between 3 and 30 during the session. So:

- **The structural numbers are exact.** DOM element counts and transferred
  bytes are counted, not timed, and do not move with load.
- **The Lighthouse scores and timings are provisional.** They are the best of
  several runs per route, since contention can only ever make a run worse — but
  they should be re-taken on a quiet machine before being quoted to anyone.

That distinction is kept explicit below rather than presenting one table and
hoping.

## Structural changes — exact, load-independent

| Measure | Before | After | Change |
|---|---|---|---|
| `/` DOM elements | 3,202 | **1,033** | −68% |
| `/` HTML, uncompressed | 590 KB | **438 KB** | −26% |
| `/` HTML, over the wire (gzip) | 49 KB | **47 KB** | −4% |
| World map SVG elements | ~2,200 `<circle>` | **1 `<path>`** | −99.9% |
| Optimised image `max-age` | 14,400 s (4 h) | **31,536,000 s (1 y)** | 219× |
| Hero `sizes` peak request | 110vw | **100vw** | no wasted candidate |

### Where the DOM went

The homepage rendered 3,202 elements for 1,558 words. 2,237 of them — 69% of
the page — were in one section: the world map, drawn as one `<circle>` per land
cell in a 110×52 dot matrix.

It is now a single `<path>`, with each dot as a two-arc subpath in the `d`
string. Identical rendering, one element for the browser to style, lay out and
paint instead of ~2,200. Nothing about the map's appearance or its interactive
country list changed.

The brief also flagged 621 KB of homepage HTML. Uncompressed it was 590 KB and
is now 438 KB — but **over the wire it was already 49 KB**, because gzip
collapses a repetitive RSC payload extremely well. It was never the problem the
raw figure made it look like; the DOM count was.

### The hero image

The brief's diagnosis was right and worth recording precisely.

`sizes` read `(max-width: 768px) 260vw, (max-width: 1280px) 170vw, 110vw`. The
values above 100vw are not a mistake in themselves: the hero fills a 112svh-tall
full-width box with `object-cover`, so the drawn width is
`max(100vw, containerHeight × 4/3)` — on a 390×780 phone the image really is
painted 1,165 px wide, which is 299vw. Describing that as 100vw would fetch a
candidate a third of the size actually painted.

What *was* wrong:

- **`110vw` on desktop.** Above roughly a 4:3 viewport the crop becomes
  width-driven and the drawn width is exactly 100vw. That 10% was pure waste.
- **The breakpoints did not match the arithmetic.** They now do, from measured
  values: 300vw below 480px, 200vw to 768px, 150vw to 1024px, 100vw above.

The remaining half of the problem is the source file, and it is a content
blocker, not a code one. `hero.jpg` is 1,400×1,050; every source image caps at
1,400 px on its long edge. Verified against the optimiser: requesting `w=1920`
or `w=2560` both return 1,400×1,050 — **Next does not upscale**, so the oversized
request wastes a cache entry and tells the browser it has detail it does not
have. At 2× DPR the hero is roughly 1.6× upscaled by the browser.

Per-slot delivery sizes are in [photography-brief.md](./photography-brief.md).
Full-bleed slots need 4,000 px originals.

### Image caching

Optimised images returned `max-age=14400` — four hours, the Next 16 default.
Every returning visitor refetched every photograph on the fifth hour, on a site
whose imagery changes a few times a year. Now one year.

Safe because replacing a photograph changes its URL: stock lives at
`/images/placeholder/<key>.jpg` and real photography goes to
`/images/<key>.jpg`, so the handover step that swaps an image busts its cache.
**If that convention is abandoned, `minimumCacheTTL` must come down.**

## Lighthouse — provisional, mobile preset, simulated throttling

Best of several runs per route. Re-take on a quiet machine before quoting.

| Route | Score before → after | LCP | CLS | TBT before → after | JS | Images | HTML | DOM before → after |
|---|---|---|---|---|---|---|---|---|
| `/` | 82 → **89** | 3.5 s | 0.000 | 370 → **177 ms** | 262 KB | 88 KB | 49 → 47 KB | 3202 → **1033** |
| `/products` | 94 → 93 | 3.0 s | 0.000 | 81 → 128 ms | 262 KB | 41 KB | 22 KB | 538 |
| `/products/ptfe-lined-pipes` | 93 → 92 | 3.2 s | 0.000 | 110 → 140 ms | 273 KB | 18 KB | 28 KB | 755 |
| `/industries/chemical` | 90 → 92 | 3.1 s | 0.000 | 186 → 150 ms | 262 KB | 57 KB | 20 KB | 409 |
| `/quote` | 92 → 93 | 3.1 s | 0.000 | 146 → 100 ms | 255 KB | 27 KB | 14 KB | 312 |

**Only `/` was changed by this phase.** The other four routes are byte-identical
between the two builds, so every difference in their rows — including the two
that got slightly *worse* — is run-to-run variance. They are shown precisely so
that variance is visible, and so the `/` numbers can be read against it: a
±2-point wobble is noise, `/` moving 82 → 89 with TBT halving and the DOM
falling by two thirds is not.

Across the session the same unchanged `/products` build measured anywhere from
66 to 94 depending on machine load. That is the size of the noise floor here,
and it is why the structural table above is the one to trust.

**CLS is 0.000 on every route**, before and after. Every image reserves its box.

**INP is not measured here.** It needs field data from real sessions. TBT is its
lab proxy, and `max-potential-FID` is reported in the JSON. Once Plausible is
live, real INP will come from Chrome UX Report data for the domain.

### `/quote` is no longer the outlier

It was 85 at the end of the five-phase brief and flagged as a known limitation:
242 KB of JS, 77 KB unused, because the whole form and its validation schema
loaded up front. It now measures in line with the rest of the site. Two Phase 3
changes are the plausible cause — `z.config({ jitless: true })` removed zod's
JIT compilation path, and the schema is no longer doing eval-based codegen at
startup — but this has not been isolated, and the note is here as an
observation rather than a claim.

## Budgets

`scripts/lighthouse-assert.mjs` fails the build on regression. Budgets are
ceilings on what shipped, with headroom for variance, not aspirations.

| | score ≥ | LCP ≤ | CLS ≤ | TBT ≤ | JS ≤ | images ≤ | HTML ≤ | DOM ≤ |
|---|---|---|---|---|---|---|---|---|
| most routes | 80 | 4.0 s | 0.1 | 600 ms | 300 KB | 250 KB | 60 KB | 1500 |
| `/` | 70 | 4.2 s | 0.1 | 900 ms | 300 KB | 250 KB | 60 KB | 1500 |
| `/products` | 70 | 4.2 s | 0.1 | 900 ms | 300 KB | 250 KB | 40 KB | 900 |

`budget.json` additionally sets **zero third-party requests**, which is worth
protecting deliberately: this site loads nothing cross-origin at all. Analytics
is proxied through its own domain, fonts are self-hosted by `next/font`, and the
only external origins that can ever appear are the Turnstile and Google Maps
frames, each of which only exists once its environment variable is set.

`.github/workflows/performance.yml` runs this on every pull request and uploads
the reports as artifacts.

## What would move the numbers next

In order of value, none of it done:

1. **Commission the photography at the sizes in the brief.** The hero is
   upscaled on every retina phone. This is the single largest visual-quality
   gain available and it is a content task, not a code one.
2. **262 KB of JavaScript on every route** is the floor set by the App Router
   plus the client components in the shell — header, mega menu, reveal system,
   sticky bar. Worth an audit of which of those genuinely need to be client
   components.
3. **LCP sits at ~3.0–3.5 s** across the site under simulated 4G. It is the
   hero image on `/` and the `PageHero` image elsewhere. Smaller, better-cropped
   sources would move it more than any code change.
