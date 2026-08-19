# IPS-PL — Innovative Process Solutions Pvt. Ltd.

Marketing and lead-generation site for a PTFE-lined piping manufacturer in
Vadodara, India, selling into chemical, pharmaceutical, refinery and power
plant across five countries.

The site has one job: turn a process engineer researching a corrosion problem
into a completed enquiry carrying enough process data for IPS-PL's engineers to
quote without a round trip.

```bash
npm install
npm run dev            # http://localhost:3000
```

---

## Contents

- [Stack](#stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [How the site is built](#how-the-site-is-built)
- [The enquiry pipeline](#the-enquiry-pipeline)
- [Security](#security)
- [Testing](#testing)
- [Build guards](#build-guards)
- [Performance](#performance)
- [Deploying to Vercel](#deploying-to-vercel)
- [Before launch](#before-launch)
- [Project documents](#project-documents)

---

## Stack

| | |
|---|---|
| Framework | Next.js 16.3.1 (App Router) |
| Language | TypeScript, strict |
| UI | React 19.2, Tailwind CSS v4 (CSS-first, no config file) |
| Validation | zod v4, one schema shared by client and server |
| Email | Resend, behind a swappable provider interface |
| Rate limiting | Upstash Redis, with an in-process fallback |
| Bot challenge | Cloudflare Turnstile, dormant until keys are set |
| Analytics | Plausible, cookieless, proxied through this domain |
| Testing | Playwright — 91 end-to-end tests |
| Icons | lucide-react |

**38 pages, 3 server routes.** Every page is prerendered to static HTML at build
time. The only code that runs per request is the enquiry handler, the CSP report
endpoint and the thank-you page.

---

## Getting started

```bash
git clone <this repo>
cd ipspl-website
npm install
cp .env.example .env.local     # optional — everything runs without it
npm run dev
```

**Nothing is required to run locally.** Without credentials the site still
works: emails log to the console instead of sending, rate limiting falls back to
in-process counters, analytics stays off, and every optional link renders
nothing rather than a dead button.

That is deliberate, and it is also why a misconfigured production deploy fails
quietly. See [Before launch](#before-launch).

### Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server, hot reload |
| `npm run build` | Production build + all three build guards |
| `npm start` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |
| `npm run test:e2e` | Playwright suite (builds first) |
| `npm run check:images` | Count remaining placeholder photographs |
| `npm run check:seo` | Title and description lengths across all routes |
| `npm run docs:gaps` | Regenerate `docs/content-gaps.md` |
| `npm run docs:photography` | Regenerate `docs/photography-brief.md` |
| `npm run lh` | Lighthouse against a running production build |
| `npm run lh:assert` | Fail if any route breached its budget |

---

## Environment variables

Full documentation with defaults is in [`.env.example`](.env.example).

### Secrets — server only

| Variable | Effect if missing |
|---|---|
| `RESEND_API_KEY` | **Every enquiry is logged, not sent. Leads are lost silently.** |
| `RESEND_FROM` | Falls back to `enquiries@mail.ips-pl.com` — must be verified in Resend |
| `SALES_INBOX_EMAIL` | Where enquiries are delivered. Defaults to `sales@ips-pl.com` |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Rate limiting degrades to per-process counters |
| `TURNSTILE_SECRET_KEY` | Bot challenge stays off |
| `ALERT_WEBHOOK_URL` | A failed delivery is logged and nobody is told |

### Public — inlined at build time

`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`,
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_BOOKING_URL`,
`NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE`,
`NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`,
`NEXT_PUBLIC_SALES_EMAIL`, `NEXT_PUBLIC_PHONES`

Two things to know about these:

**They are baked in at build time, not read per request.** Changing one in the
hosting dashboard takes effect on the next deploy, not immediately. What that
buys is that the change happens in Vercel rather than in TypeScript.

**Every URL among them is validated.** A malformed value is treated as absent,
because the likely failure is a typo in a dashboard field, and a link that goes
nowhere is worse than no link at all. See [`src/lib/env.ts`](src/lib/env.ts).

> `NEXT_PUBLIC_SALES_EMAIL` is what visitors **see**. `SALES_INBOX_EMAIL` is
> where mail is **delivered**. They can differ.

---

## How the site is built

### Content lives in typed data, not a CMS

Everything the site says is a TypeScript object in [`src/data/`](src/data/):

```
products.ts     7 products with specifications, standards, documents
industries.ts   8 industries, each linked to the products it specifies
insights.ts     6 technical articles as structured blocks
projects.ts     4 reference installations
company.ts      contact details, certifications, global locations
legal.ts        privacy, terms, cookie policy
images.ts       42 image slots with alt text and art direction
standards.ts    ASTM / ISO / ASME / CEN, with outbound links
```

**Derived, never duplicated.** Adding one product object gives you its page, SEO
metadata, sitemap entry, OG card, mega-menu link, comparison-table row, FAQ
block and `Product` structured data automatically. Navigation is generated from
the product and industry data. FAQs are derived from each product's own
specification rows. Nothing is maintained in two places.

### `TODO(content)` markers never reach a reader

Where domain knowledge is required and IPS-PL has not supplied it, the field
carries a `TODO(content)` marker rather than a plausible-looking figure. Those
markers stay grep-able in the data files, and
[`src/lib/content.ts`](src/lib/content.ts) strips them at render time — so an
unanswered question shows as an absent row, never as an invented one.

They are also stripped from structured data, so `Product.additionalProperty`
cannot claim a pressure rating nobody approved.

```bash
grep -rn "TODO(content)" src/    # every outstanding item
npm run docs:gaps                # the same thing, as a document
```

### Images

All 42 are self-hosted under `public/images/`. No external host, no CDN, no
remote loader. Components reference a **key**, never a URL:

```tsx
const image = getImage("linedPipe");
```

Replacing a photograph is three lines in `images.ts` and no component changes.
Per-slot crops, rendered widths and delivery sizes are generated from the layout
code itself into [`docs/photography-brief.md`](docs/photography-brief.md), so
the brief cannot drift from what the site actually renders.

---

## The enquiry pipeline

`POST /api/enquiry` handles both the quote form and the contact form, separated
by a `kind` discriminator.

1. **Rate limit** — 5 per 10 minutes per IP, applied to valid and invalid
   submissions alike. Every response carries `X-RateLimit-*`; a refusal carries
   `Retry-After`.
2. **Size precheck** — the platform rejects bodies over 4.5 MB before the
   handler runs, so the client caps at 4 MB total, 3 MB per file, 5 files, and
   offers to send the enquiry without drawings.
3. **Server-side validation** — the same zod schema the browser used, re-parsed
   independently. Client validation is a convenience, not a control.
4. **Honeypot** — a filled hidden field returns a normal success response and
   sends nothing, so a bot learns nothing.
5. **Turnstile** — skipped entirely while unconfigured; a precondition for
   delivery once keys exist. A Cloudflare outage allows the submission and logs
   it, because a challenge failing must not cost a lead.
6. **Attachments** — extension, declared type and size checked, filenames
   sanitised. Rejected files are named back to the sender rather than dropped.
7. **Reference** — e.g. `IPS-260819-K4M2`, from an alphabet with no I/O/0/1 so
   it survives being read down a phone line.
8. **Two emails** — the internal notification first, so if the acknowledgement
   fails the lead is already captured. Reply-To on the internal mail is the
   enquirer, so replying reaches the customer directly.
9. **On failure** — 502, plus an alert to `ALERT_WEBHOOK_URL`, awaited so a
   frozen serverless process cannot drop it.

### Enquiries are not stored

Once the email sends, the lead lives in the sales inbox and nowhere else. There
is no database. If delivery fails the visitor is told to email `sales@`
directly, and an alert fires — but the submission itself is gone.

**Writing enquiries to storage before attempting delivery is the single most
valuable outstanding change.** Roughly a day: one table, one insert, before
step 8.

---

## Security

Every response carries eight headers: `Strict-Transport-Security`,
`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`, `Cross-Origin-Opener-Policy`,
`Cross-Origin-Resource-Policy` and a Content Security Policy.
`X-Powered-By` is off.

**The CSP ships as report-only**, with violations posted to `/api/csp-report`.
It currently reports zero violations across every route with both forms
exercised, and enforced mode has been smoke-tested clean. Set `CSP_ENFORCE=1`
after watching the reports on real traffic for a week.

It is deliberately **not nonce-based**, and the reasoning is recorded in
[`src/lib/securityHeaders.ts`](src/lib/securityHeaders.ts): Next injects nonces
during server rendering, so a nonce would force all 38 prerendered routes to
render per request. Hash-based `script-src` was measured as the alternative and
leaves ten inline RSC-payload scripts per page unhashable.

**Nothing is loaded cross-origin.** Fonts are self-hosted by `next/font`,
analytics is proxied through this domain, and a Playwright test asserts zero
third-party requests. The only external origins that can ever appear are the
Turnstile and Google Maps frames, each of which exists only once its
environment variable is set.

---

## Testing

```bash
npm run test:e2e        # builds, starts a production server, runs 91 tests
```

Tests run against a **production build**, never the dev server — dev-mode
layout and timing are not representative.

| Suite | Covers |
|---|---|
| `enquiry-pipeline` | Delivery asserted against a capture provider, not a 200 |
| `security-headers` | Eight headers, CSP shape, rate limiting, `Retry-After` |
| `seo` | Schema types, feed, legal indexing, outbound links, no leaked markers |
| `accessibility` | Focus trap, inert background, `aria-current`, skip link, icons |
| `header-overflow` | 320 → 1920px, sixteen widths |
| `anchor-scroll` | Deep-link landing position |
| `page-weight` | DOM budgets, no cross-origin requests, hero `sizes` |
| `local-hours` | Time-zone conversion against four real zones |
| `booking-link` | Stays a link-out; CSP would still block an embed |
| `env-config` | Configured *and* unconfigured states of every optional value |
| `reading-time` | Read-time label cannot overstate the article |

---

## Build guards

`npm run build` runs three checks and fails on any of them:

- **`check:breadcrumbs`** — a page showing a breadcrumb trail must emit
  matching `BreadcrumbList` structured data.
- **`check:images`** — fails on any remaining placeholder photograph.
  *Currently downgraded to a warning* while stock is still in use; remove
  `CHECK_IMAGES=warn` from the `check` script at launch.
- **`check:seo`** — reads the prerendered HTML and fails on a title outside
  50–60 characters, a description outside 140–158, a duplicate of either, or a
  reappearing `keywords` tag. It checks what a search engine actually receives,
  template composition included.

---

## Performance

Measured against a production build. Full report with methodology in
[`docs/performance.md`](docs/performance.md).

| Route | Score | LCP | CLS | JS |
|---|---|---|---|---|
| `/` | 89 | 3.5 s | 0.000 | 262 KB |
| `/products` | 93 | 3.0 s | 0.000 | 262 KB |
| `/products/ptfe-lined-pipes` | 92 | 3.2 s | 0.000 | 273 KB |
| `/industries/chemical` | 92 | 3.1 s | 0.000 | 262 KB |
| `/quote` | 93 | 3.1 s | 0.000 | 255 KB |

**CLS is 0.000 on every route.** Every image reserves its box.

Budgets are enforced by `npm run lh:assert` and by
`.github/workflows/performance.yml` on every pull request.

> Lighthouse's simulated throttling multiplies observed timings, so a busy
> machine inflates the numbers several-fold — the same unchanged build measured
> 66 and 94 minutes apart during development. Check `uptime` before trusting a
> run, and prefer `--select best`.

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. Go to **[vercel.com/new](https://vercel.com/new)** and import it.
3. Framework preset is detected automatically. Leave the build settings alone.
4. Add the environment variables (below) **before** the first deploy.
5. Deploy.

### Minimum variables for a working deployment

```
RESEND_API_KEY=re_...
RESEND_FROM=IPS-PL Enquiries <enquiries@mail.ips-pl.com>
SALES_INBOX_EMAIL=sales@ips-pl.com
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
ALERT_WEBHOOK_URL=https://hooks.slack.com/...
NEXT_PUBLIC_SITE_URL=https://www.ips-pl.com
```

> **Deploying without `RESEND_API_KEY` produces a site that looks like it
> works.** The form accepts the enquiry, shows a reference number, and sends
> nothing. Set it first.

### Custom domain

Add `www.ips-pl.com` in **Settings → Domains**, then point the DNS record at
Vercel as instructed there. Set `NEXT_PUBLIC_SITE_URL` to match, or canonicals,
`hreflang`, the sitemap and the structured data will all reference the wrong
host.

### Email domain

Verify a **subdomain** (`mail.ips-pl.com`) in Resend so the SPF and DKIM
records never touch the existing `ips-pl.com` mail flow. Then send one real
enquiry end to end and confirm both emails arrive and the attachment opens.

---

## Before launch

Full checklist in [`PRE-LAUNCH.md`](PRE-LAUNCH.md). The blockers:

- [ ] `RESEND_API_KEY` set and a live test enquiry received
- [ ] Upstash configured — in-process counters do not work across instances
- [ ] `ALERT_WEBHOOK_URL` set and tested
- [ ] **42 placeholder photographs replaced**, then make the image guard fail
      the build
- [ ] Specification figures confirmed by an engineer — they appear in the spec
      table, the comparison table and in structured data, where a customer may
      read them as a commitment
- [ ] Privacy and Terms supplied by counsel
- [ ] Regional office contact details, or the "global network" copy softened

There is also one known landmine: **`DatasheetRequest` does not render the
Turnstile widget.** Nothing is broken today because no keys exist, but the day
Turnstile is enabled every datasheet request on all seven product pages will
fail with a 403. Fix it before setting the keys.

---

## Project documents

| Document | What it is |
|---|---|
| [`PRE-LAUNCH.md`](PRE-LAUNCH.md) | Deployment checklist, known limitations, architecture notes |
| [`CONTENT-BRIEF.md`](CONTENT-BRIEF.md) | Everything IPS-PL needs to supply, and what it unlocks |
| [`docs/content-gaps.md`](docs/content-gaps.md) | Every `TODO(content)` marker, with file and line |
| [`docs/photography-brief.md`](docs/photography-brief.md) | All 42 image slots with crop, size and art direction |
| [`docs/performance.md`](docs/performance.md) | Lighthouse results and the methodology behind them |

The last three are **generated from the codebase** — `npm run docs:gaps`,
`npm run docs:photography` — so they cannot drift as items are ticked off.

---

## Licence

Proprietary. Built for Innovative Process Solutions Pvt. Ltd.

Photography is currently licence-free stock standing in for commissioned work
and must be replaced before launch.
