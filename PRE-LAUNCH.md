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
- [ ] **Tab the whole site**, menu open and closed. Focus must stay inside the mega
      menu and the mobile drawer; Escape closes both and returns focus to the trigger.
- [ ] **Lighthouse mobile** on production. Last measured: `/` **91**, `/products`
      **92**, `/quote` **85**. Accessibility, best-practices and SEO are **100**
      across all three.

---

## Known limitations

**`/quote` Lighthouse Performance is 85, against a ≥90 target.** It is the heaviest
client page — the two-step form, in-browser validation and the file input, 242 KB JS
of which 77 KB is unused. Fixable by validating only the current step and importing
the schema lazily. Not done; flagged rather than hidden.

**Map tooltips are hover-only.** The four country labels on the global-presence map
(Thailand, Vietnam, China, Canada) appear on hover and are `pointer-events: none`, so
keyboard and touch users never see them. This is not a content loss — the map pins
are `aria-hidden` decoration, the interactive list beneath the map carries every
country as a real control, and the footer repeats the list as text. Worth revisiting
if the map ever becomes the primary way to reach regional contacts.

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

Plausible fires: `quote_start`, `quote_step_2`, `quote_submit`, `contact_submit`,
`datasheet_request`, `tel_click`, `mailto_click`.

The two numbers worth watching in week one:

- **`quote_start` → `quote_step_2`** — a large drop means step 1 is asking too much
- **`quote_step_2` → `quote_submit`** — a large drop means the process fields or the
  file upload are the obstacle

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

**Two build guards** run before `next build`:
- `check:breadcrumbs` — fails if a page renders the visible breadcrumb nav without a
  matching `BreadcrumbList`
- `check:images` — fails on any `isPlaceholder: true` (currently warns)

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
