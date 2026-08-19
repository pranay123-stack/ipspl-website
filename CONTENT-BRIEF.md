# Content brief — IPS-PL website

Everything below has **working code waiting behind it**. Supply the content and it
renders; nothing needs rebuilding.

Two generated documents track this in detail, straight from the code:

- **[docs/content-gaps.md](docs/content-gaps.md)** — every outstanding field,
  with its file and line (`npm run docs:gaps`)
- **[docs/photography-brief.md](docs/photography-brief.md)** — every image slot
  with the page, crop and delivery size read out of the layout
  (`npm run docs:photography`)

Two commands show you what is outstanding at any time:

```bash
grep -rn "TODO(content)" src/     # 44 markers
npm run check:images              # 42 placeholder images
```

---

## 1. Photography — highest priority

All 42 images are licence-free stock. For a manufacturer whose pitch is *"we make
this in Vadodara"*, this is the largest credibility gap on the site: a buyer who
reverse-image-searches a product shot will find it on Unsplash.

The build refuses to ship stock once you flip the guard (see PRE-LAUNCH.md).

> The full slot-by-slot brief — crop, delivery size and art direction for each
> of the 42 images — is generated at
> [docs/photography-brief.md](docs/photography-brief.md). The summary below is
> the priority order.

### Shot list, in priority order

| # | Shot | Replaces | Why it matters |
|---|---|---|---|
| 1 | **Flaring operation** — liner being formed over a flange face | `manufacturingLining` | The single process that defines the product. Nothing generic substitutes. |
| 2 | **Finished lined spools**, racked and tagged | `linedPipe`, `productPiping` | What the buyer receives. Currently a stock pump skid. |
| 3 | **Flange faces, close** — flared PTFE, bolt holes visible | `linedFittings`, `productComponents` | Proves the joint detail the entire pitch rests on. |
| 4 | **CNC machining a PTFE component**, swarf visible | `productPtfe`, `ptfeMoulded` | Backs the in-house machining claim. |
| 5 | **Inspection / QC** — spark test or caliper on a real part | `qualityInspection`, `qualityTesting` | Backs the documentation claim. |
| 6 | **Vadodara works, wide** — the floor in operation | `manufacturingFloor` | The "made in Vadodara" shot. Used on /about and /capabilities. |
| 7 | **Warehouse / despatch**, packed spools | — | Signals real capacity and volume. |
| 8 | **Lined valve range**, grouped on a bench | `productValves`, `linedValves` | Currently a generic actuated valve that is not yours. |
| 9 | **Engineering team** at a drawing or screen | `engineeringTeam` | Replaces a shot that reads as a college workshop. |
| 10 | **Dip pipes / bellows**, actual units | `dipPipes`, `bellows` | Lowest priority — the current stand-ins are at least plausible. |

**Shots 1–3 close most of the gap.** They are the ones a buyer checks.

### Specification

- Landscape **3:2 or 16:9**, minimum **2000px** on the long edge
- Well-lit, in-focus, no motion blur; a phone camera in good light is fine
- No identifiable faces without written consent
- No competitor branding or third-party logos in frame
- Deliver as JPEG or PNG; we optimise on the way in

### How to install one

1. Drop the file at `public/images/<key>.jpg` (key from the table above)
2. In `src/data/images.ts`, update that entry:
   ```ts
   manufacturingLining: {
     src: "/images/manufacturingLining.jpg",
     alt: "Operator flaring a PTFE liner over a flange face",  // describe the action
     isPlaceholder: false,                                      // remove `credit`
   },
   ```
3. `npm run check:images` — it counts down as you go

Alt text should describe **what is happening**, not what the object is. "Operator
flaring a PTFE liner over a flange face" beats "factory photo".

---

## 2. Regional network — 4 offices

`/contact` and the footer currently show country and role only. This is the finding
that most undermines the "global engineering network" claim: four countries listed
with no way to contact any of them.

**File:** `src/data/company.ts` → `globalLocations`

| Country | Needed |
|---|---|
| Thailand | city, address line, direct phone, regional email |
| Vietnam | city, address line, direct phone, regional email |
| China | address line, direct phone, regional email (city = Shanghai already known) |
| Canada | city, address line, direct phone, regional email |

```ts
{
  country: "Thailand",
  role: "Regional representation",
  city: "Bangkok",
  addressLine: "…",
  phone: "+66 …",
  email: "…@ips-pl.com",
  x: 77.92, y: 49.82,     // map coordinates — do not change
},
```

Supply whatever exists. A country with only a phone still renders correctly; the
fields are individually optional. **Do not invent an address** — an empty field is
better than a wrong one.

> **Note on named representatives.** The current public site lists individuals by
> name with personal mobile numbers. Those were deliberately left out. Confirm
> whether each person consents to their name and number being published before
> they go back in.

---

## 3. LinkedIn URL — one field, outsized effect

**File:** `src/data/company.ts` → `contact.linkedin`

```ts
linkedin: "https://www.linkedin.com/company/…",
```

This single value drives two things:

1. The **footer social link** (currently hidden — the code renders nothing rather
   than a dead link)
2. **`Organization.sameAs`** in structured data

That second one matters more than it looks. `sameAs` is how Google connects the
website to the company's other verified profiles, and it is a primary input to the
knowledge panel. It is currently **correctly absent rather than invented** — but
absent means an incomplete entity signal. This is the cheapest SEO win on the list.

Add any further profiles (YouTube, trade bodies, IndiaMART) to `contact.social`;
they render as labelled links and join `sameAs` automatically.

---

## 4. Case studies — 13 markers

**File:** `src/data/projects.ts`

Four reference installations render with duty and scope blocks. What is missing is
the data that makes them persuasive.

Per case study:

| Field | Status |
|---|---|
| `duty.media` | Present on all four |
| `duty.temperature` | **TODO** ×4 |
| `duty.pressure` | **TODO** ×4 |
| `outcome` | **TODO** ×4 — the measurable result |
| `client` | Currently "Client confidential" |

`outcome` is the one that converts. "Service interval extended from 8 months to
4 years" is worth more than the rest of the page. If a customer will let you name
them, replace `client` too — a named reference is the strongest signal in
industrial procurement.

Any field still containing `TODO(content)` is **automatically hidden at render
time** (`src/lib/content.ts`), so partial data never shows half-finished.

---

## 5. Technical specifications — confirm before launch

The specification figures were written as values *typical of ASTM F1545 lined
equipment*. They are plausible and internally consistent, but they are **not
sourced from IPS-PL datasheets**.

**File:** `src/data/products.ts` → each product's `specifications` and `standards`

17 further rows carry a `TODO(content)` marker — figures a specifying engineer
asks for that IPS-PL has not published (test pressures, bend radii, torque
figures, fire-safe status). They were left unanswered rather than filled with
class-typical values. See [docs/content-gaps.md](docs/content-gaps.md).

Sign a figure off by adding a `source` to its row; the "indicative" note under
the spec table disappears once every row on that table carries one.

Every figure needs an engineer's eye before launch, because they now appear in three
places that a customer or a search engine may treat as a commitment:

- the visible spec table on each product page
- the **comparison table** on /products
- **`Product.additionalProperty`** in structured data

Priority: nominal bore ranges, design pressures, service temperatures, liner
thicknesses.

---

## 6. Editorial — optional, valuable

Six articles exist, attributed to "IPS-PL Engineering". Eight further titles were
proposed, each mapped to a commercial keyword a product page already targets:

1. PTFE vs PFA vs FEP: choosing a liner for your duty
2. How to specify a lined pipe spool: the eight figures we need
3. Flush bottom valves: eliminating the reactor dead leg
4. Dip pipe and sparger design for reactor sub-surface addition
5. Bolt torque and gasket seating on PTFE lined flanges
6. Filled vs virgin PTFE: when creep resistance beats purity
7. Chlor-alkali service: what attacks a lined system first
8. FGD chloride excursions and liner grade reselection

Add to `src/data/insights.ts`. Set `relatedProductSlugs` and the cross-links to
product pages generate themselves.

---

## 7. Legal pages

**File:** `src/data/legal.ts`

Privacy, terms and cookie pages carry section scaffolding but no approved text.
They are currently indexable, so they need real content reviewed by counsel —
covering India plus the export markets.

The terms page should state that published specifications are indicative and that
binding data is issued with a quotation. That matters given the spec figures now
appear in structured data.
