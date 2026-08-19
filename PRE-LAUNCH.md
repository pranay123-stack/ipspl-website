# Pre-launch checklist — IPS-PL website

Work top to bottom. Blockers first: the site should not go live with any of them
outstanding.

---

## Environment variables

Copy `.env.example` to your host's environment. **Nothing is required for the repo
to run** — without credentials, emails log to the console, rate limiting no-ops and
analytics stays off. That is deliberate for local development, and it is also why a
misconfigured production deploy fails silently. Verify each one below.

| Variable | Required in production | Effect if missing |
|---|---|---|
| `RESEND_API_KEY` | **Yes** | **Enquiries are logged, not sent. Every lead is lost.** |
| `RESEND_FROM` | **Yes** | Falls back to `enquiries@mail.ips-pl.com` — must be a domain verified in Resend |
| `SALES_INBOX_EMAIL` | Recommended | Defaults to `sales@ips-pl.com` |
| `UPSTASH_REDIS_REST_URL` | **Yes** | No rate limiting; the form is open to scripted abuse |
| `UPSTASH_REDIS_REST_TOKEN` | **Yes** | As above |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Yes | No analytics — you cannot measure anything |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonicals, hreflang and schema fall back to `www.ips-pl.com` |
| `NEXT_PUBLIC_BOOKING_URL` | Optional | No "Book a call" button |
| `NEXT_PUBLIC_LINKEDIN_URL` | Recommended | No footer link, and `Organization.sameAs` stays absent |
| `NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE` | Recommended | No Directions link on `/contact` |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `_SALES_EMAIL` / `_PHONES` | Optional | Falls back to the published details |
| `ALERT_WEBHOOK_URL` | **Yes** | **A failed enquiry is logged and nobody is told.** |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Recommended | No bot challenge; the honeypot alone |
| `CSP_ENFORCE` | Later | CSP stays report-only — see below |

### A note on `NEXT_PUBLIC_*`

These are **inlined when the site is built**, not read when a visitor loads a
page. Changing one in the hosting dashboard takes effect on the next deploy,
not immediately. The gain is that the change happens in Vercel rather than in
TypeScript — a different person's job.

Every URL among them is validated: a malformed value is treated as absent, so
a typo hides the link rather than publishing one that goes nowhere. Verified
by `tests/env-config.spec.ts`.

`NEXT_PUBLIC_SALES_EMAIL` is what visitors **see**. `SALES_INBOX_EMAIL` is
where enquiry mail is **delivered**. They can differ, and on a busy site they
probably should.

### Email domain setup

Use a **subdomain** (`mail.ips-pl.com`) so the SPF and DKIM records do not touch the
existing `ips-pl.com` mail flow. Verify it in Resend before launch and send one test
enquiry end to end.

---

## Blockers

- [ ] **`RESEND_API_KEY` set and a live test enquiry received** at `sales@ips-pl.com`,
      with an acknowledgement arriving at the enquirer address. Check the attachment
      arrives and opens.
- [ ] **Upstash configured.** In-memory rate limiting does not work across serverless
      instances, so without this there is no limit at all.
- [ ] **Replace the 42 placeholder images** — see
      [docs/photography-brief.md](docs/photography-brief.md) for the crop and
      delivery size of every slot. Then make the
      guard strict so stock can never ship again:
      ```jsonc
      // package.json — remove CHECK_IMAGES=warn
      "check": "npm run check:breadcrumbs && npm run check:images"
      ```
      The build will then fail while any `isPlaceholder: true` remains.
- [ ] **Confirm the technical specifications** (CONTENT-BRIEF.md §5,
      [docs/content-gaps.md](docs/content-gaps.md)). They appear in
      the comparison table and in `Product.additionalProperty` structured data — a
      customer or a search engine may treat them as a commitment.
- [ ] **Legal pages** reviewed by counsel. They are indexable.
- [ ] **Regional office details** (CONTENT-BRIEF.md §2).
- [ ] **`ALERT_WEBHOOK_URL` set and tested.** Post a test payload to it, then
      confirm the alert arrives. Without this a delivery failure is a log line:
      the enquirer is told to email `sales@` directly and most will not.

---

## Open questions — each changes a decision

**1. What scans `sales@ips-pl.com`?**
Attachment validation is extension + declared MIME type + size. Declared MIME is
spoofable and DWG/DXF have no registered type, so the real control is whatever scans
the inbox. Google Workspace or Microsoft 365 makes the current approach
proportionate. An unscanned cPanel mailbox does not — tell us and we will revisit.

**2. Do DWG sets routinely exceed 4 MB?**
Vercel rejects request bodies over 4.5 MB *before* the handler runs, so the cap is
4 MB total / 3 MB per file / 5 files. If drawing sets are typically larger, a
significant share of enquiries will degrade into "email us your drawings separately"
— which works, but is a worse funnel. Moving to Vercel Blob client-side uploads
avoids the limit entirely; it is a different build and much cheaper to do before
launch than after.

**3. Vercel plan tier?**
On Pro, Vercel Firewall does rate limiting at the platform level — a one-file swap
that removes `@upstash/ratelimit` and `@upstash/redis`.

---

## Security posture

Every response carries `Strict-Transport-Security`, `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
`Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy`. `X-Powered-By`
is off. These are asserted by `tests/security-headers.spec.ts` on three routes.

### Content Security Policy — report-only, and how to enforce it

The policy ships as `Content-Security-Policy-Report-Only` with violations POSTed
to `/api/csp-report`, which logs them. It currently reports **zero violations**
across every route with both forms exercised, and the site was smoke-tested with
the policy enforced: no console errors, forms fully interactive.

It is still shipped report-only because one clean pass on one machine is not a
week of real traffic through real browsers with real extensions. **Watch the
logs for `[csp]` entries for a week, then set `CSP_ENFORCE=1`.** That switches
the header name and adds `upgrade-insecure-requests`. Nothing else changes.

**Why the policy is not nonce-based.** The brief asked for a nonce. Next.js
injects nonces during server-side rendering, so a nonce requires every page to
be dynamically rendered — all 38 routes here are prerendered, and making them
per-request would remove CDN caching and put the performance budget out of
reach. Hash-based `script-src` was measured too: with `experimental.sri`
enabled, Next emits `integrity` on the six external bundles but leaves ten
inline scripts per page carrying the RSC payload, which differs per page and per
build and so cannot be hashed in a static header. The policy is therefore strict
everywhere it can be and accepts `'unsafe-inline'` for scripts and styles, which
is precisely the set the framework emits. The reasoning is recorded in full in
`src/lib/securityHeaders.ts`.

If IPS-PL later decides a nonce is worth dynamic rendering, it is one
`proxy.ts` (Next 16 renamed `middleware.ts`) plus `await connection()` in each
page.

**One real finding came out of report-only:** zod probes for `new Function` to
decide whether it can JIT-compile validators. The probe is caught and degrades
safely, but browsers still file a `script-src` violation for it, and it was the
only report the policy ever produced. `z.config({ jitless: true })` in
`src/lib/schemas/enquiry.ts` disables the probe — and with it the last reason
`'unsafe-eval'` would ever be needed.

## Enquiry pipeline

- **Rate limiting** applies to every submission, valid or not. Upstash when
  configured; otherwise a per-process in-memory limiter, which is real
  protection against a naive script and none against a distributed one. Five
  submissions per ten minutes per IP. Every response carries `X-RateLimit-Limit`,
  `-Remaining` and `-Reset`; a 429 carries `Retry-After`.
- **Turnstile** is off unless both keys are set, and enforced the moment they
  are — no code change. If Cloudflare is unreachable the submission is allowed
  through and logged, because a challenge outage must not cost a lead.
- **Delivery is tested, not assumed.** `tests/enquiry-pipeline.spec.ts` posts a
  real enquiry against a capture provider and asserts what the email layer was
  actually handed: recipient, Reply-To, reference, body content and attachment
  bytes. It also covers the 502 delivery-failure path, the honeypot answering
  like a success while sending nothing, and validation messages being free of
  zod's internal wording.

## Verification before go-live

```bash
npm run check      # breadcrumbs + placeholder images
npm run lint
npx tsc --noEmit
npm run build      # 82 routes
npx next start -p 3005
```

Then, against the production build:

- [ ] **Google Rich Results Test** on `/`, a product page, an article and
      `/products`. Structural validation passes locally, but Google's verdict is the
      one that counts. Expect: Organization, WebSite, BreadcrumbList, Product,
      FAQPage, Article, ItemList.
- [ ] **Share a URL on LinkedIn and WhatsApp** — every route should show a branded
      1200×630 card.
- [ ] **Submit `/quote` with a real attachment** and confirm delivery.
- [ ] **Submit `/quote` with a 5 MB file** and confirm the "Send the enquiry without
      drawings" path produces a reference and an internal email headed
      `DRAWINGS NOT ATTACHED`.
- [ ] **Tab the whole site** at 390px as well as desktop, menu open and closed. Focus must stay inside the mega
      menu and the mobile drawer; Escape closes both and returns focus to the trigger.
- [ ] **Click the two unverified standards links** (CONTENT-BRIEF.md §2d).
      astm.org and iso.org block automated checks, so those URLs are the only
      outbound links on the site that have not been confirmed to load.
- [ ] **Watch `[csp]` log entries for a week**, then set `CSP_ENFORCE=1`.
- [ ] **Trigger a delivery failure deliberately** (revoke the Resend key for one
      submission) and confirm the alert arrives at `ALERT_WEBHOOK_URL`.
- [ ] **Lighthouse mobile** on production, on a machine that is not busy —
      see [docs/performance.md](docs/performance.md) for why that caveat is not
      pedantry. `npm run lh -- --port 3300 --select best` then
      `npm run lh:assert`. Budgets fail the CI job on regression.

---

## Known limitations

**The hero photograph is upscaled on every retina phone.** `hero.jpg` is
1,400×1,050 and every source image caps at 1,400 px on its long edge. The
optimiser does not upscale — a `w=2560` request returns 1,400 px — so at 2× DPR
the browser stretches it roughly 1.6×. The `sizes` attribute is now correct;
the remaining half is a content task. See
[docs/photography-brief.md](docs/photography-brief.md) for per-slot delivery
sizes. **This is the largest visual-quality gap left in the build.**

**262 KB of JavaScript ships on every route.** That is the floor set by the App
Router plus the client components in the shell — header, mega menu, reveal
system, sticky bar, footer nav. Worth auditing which of those genuinely need to
be client components before adding more.

**`/quote` is no longer the outlier it was.** It measured 85 at the end of the
five-phase brief; it now measures in line with the rest of the site. The
plausible cause is `z.config({ jitless: true })` from Phase 3, but this has not
been isolated and is recorded as an observation, not a claim.

**The mobile quote CTA is a shortened label, not a separate control.** Below
640px the header button reads "Quote" rather than "Request Quote" — the logo and
the menu trigger leave no room for the full wording at 320px, but they do leave
room for the action. Previously it was `hidden` below 640px, so on a phone the
primary conversion path existed only inside the drawer. The sticky bar still
appears at 40% scroll; the two are complementary, not alternatives.

**Map tooltips are hover-only.** The four country labels on the global-presence map
(Thailand, Vietnam, China, Canada) appear on hover and are `pointer-events: none`, so
keyboard and touch users never see them. This is not a content loss — the map pins
are `aria-hidden` decoration, the interactive list beneath the map carries every
country as a real control, and the footer repeats the list as text. Worth revisiting
if the map ever becomes the primary way to reach regional contacts.

**Legal pages index themselves when approved.** `pending: true` in
`src/data/legal.ts` drives both `noindex` and exclusion from the sitemap. The
cookie policy is already approved and indexable because it states verifiable
fact; privacy and terms stay hidden while they read "describe the personal data
collected". Clear the flag when counsel signs off and both follow — there is no
second edit to remember.

**`Product.offers` publishes no price, deliberately.** Everything is quoted
against process data, so there is no list price. Search Console will report
"Missing field price" as a non-critical warning on the seven product pages.
That is the correct trade: a figure invented to silence the warning would be a
price IPS-PL has not agreed to honour. The position is stated in
`priceSpecification` instead, and the reasoning is in `src/lib/schema.ts`.

**`og:type` is `website` on product pages, not `product`.** Next's metadata API
restricts `og:type` to a fixed union that excludes `product`; emitting it anyway
would produce two conflicting tags. The commercial value sits in the `Product`
JSON-LD, which is complete (`sku`, `additionalProperty`, `offers`).

**`dateModified` mirrors `datePublished`** on articles. The `updated` field exists
and is wired through to schema — set it when an article is genuinely revised. It is
not auto-populated, because asserting an edit that did not happen is false
structured data.

**Datasheet requests post as `kind: "contact"`** with the document name in the
message body. They reach the same inbox and fire a `datasheet_request` analytics
event. If you want them separated in reporting, they need their own `kind`.

---

## What to watch after launch

Plausible fires: `quote_start`, `quote_step_1_complete`, `quote_step_2_complete`,
`quote_submitted`, `contact_submitted`, `datasheet_request`,
`datasheet_download`, `booking_click`, `phone_click`, `email_click`.

`phone_click` and `email_click` were previously declared but never fired from
anywhere — the two highest-intent actions short of the form, unmeasured. They
now come from one delegated listener covering all fifteen `tel:`/`mailto:`
links, including the ones in server components.

The two numbers worth watching in week one:

- **`quote_start` → `quote_step_1_complete`** — a large drop means step 1 asks too much
- **`quote_step_2_complete` → `quote_submitted`** — these two should be nearly
  equal. A gap means the server is rejecting valid submissions, which is the one
  funnel loss that is otherwise invisible.

`datasheet_request` volume tells you which documents to prioritise producing.

---

## Architecture notes for whoever maintains this

**All content lives in `src/data/*.ts`** as typed data, not MDX and not inline JSX.
Adding a product means appending one object to `products.ts`; its page, SEO metadata,
sitemap entry, OG card, mega-menu link, comparison row, FAQ block and Product schema
all follow automatically.

**Derived, never duplicated.** Navigation is generated from `products.ts` and
`industries.ts`. FAQs are derived from each product's own specification rows. The
comparison table, the product cards and `Product.additionalProperty` all read through
`src/lib/productSpecs.ts`. Cross-links come from the data model. Nothing is
hand-maintained in two places.

**Two generated handover documents.** `docs/content-gaps.md` and
`docs/photography-brief.md` are produced by scripts that read the repo — the
gaps list from `TODO(content)` markers and the manifest, the photography brief
from the prerendered HTML, so every crop and pixel width in it is what the site
actually renders. Regenerate with `npm run docs:gaps` and
`npm run docs:photography`. Edit the data files, not the documents.

**Three build guards.** Two run before `next build`, one after:
- `check:breadcrumbs` — fails if a page renders the visible breadcrumb nav without a
  matching `BreadcrumbList`
- `check:images` — fails on any `isPlaceholder: true` (currently warns)
- `check:seo` — fails if any route's title falls outside 50–60 characters, any
  description outside 140–158, if two routes share either, or if a `keywords`
  tag reappears. It reads the prerendered HTML, so it checks what a search
  engine actually receives rather than what the source intended.

**Provider boundaries.** Email goes through `EmailProvider` (`src/lib/email/`) and
rate limiting through `RateLimiter` (`src/lib/rateLimit.ts`). Swapping Resend or
Upstash is one file each; the route handler never imports either directly.

**The endpoint is `/api/enquiry`, not `/api/quote`.** The original findings doc
specified `/api/quote`; the implemented route is `/api/enquiry`, handling both quote
and contact submissions via a `kind` discriminator. Anyone cross-referencing that
doc against this repo will search for `/api/quote`, find nothing, and conclude
Phase 1 did not land. It did.

**Validation is shared but not trusted.** Client and server import the same zod
schema from `src/lib/schemas/enquiry.ts`; the server re-parses independently. Every
field carries a custom message, so a validation response can be rendered verbatim
without leaking zod's internal wording to a customer.
