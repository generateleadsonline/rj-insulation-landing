# RJ Insulation — Google Ads landing site (v3 design)

Live site: https://rj-insulation-landing.netlify.app/

A hand-built static site (HTML, CSS, vanilla JS). No framework, no build step, no dependencies.
Everything you need to deploy is in this folder.

This is the **v3 visual direction**: RJ's colours, font and button style, but a layout that is deliberately
different from rjinsulation.co.uk (white hero with a dark green calculator card, gold underline headings,
photo band with stats, timeline of property eras, storage "ladder", green planner band, editorial reviews).

## Deploying (drag and drop)

1. Open the Netlify project → **Project overview** (or **Deploys**).
2. Drag this whole folder onto the "Drag and drop your project folder here" box.
3. Netlify publishes it in a few seconds. Done.

### One-time setup so enquiries reach the team

Netlify Forms handles the two calculator forms (`insulation-enquiry` and `storage-room-enquiry`).

1. Netlify → **Project configuration → Forms → Enable form detection**, then redeploy (drag the folder again).
2. Netlify → **Forms** → open each form → **Form notifications → Add notification → Email** and enter
   the address(es) that should receive leads (e.g. GLO, Alfie for insulation, Ross for storage rooms).
3. Optional: add a Zapier / Make notification to push leads into HubSpot.

Each submission includes: name, phone, email, postcode, optional message, the calculator selection
(property age + recommendation, or wish-list features + matched option and price), the service, and
`gclid` / `utm_*` / `landing_page` for attribution. A honeypot field (`company`) filters bots.

### Optional: deploy from GitHub instead

Link the repo in Netlify → Project configuration → Build & deploy → Link repository.
Build command: *(leave empty)*. Publish directory: `.` (or the folder name if this sits in a sub-folder).

## Editing content

| What | Where |
| --- | --- |
| Page copy, sections, FAQs, prices shown in the package cards | `index.html`, `loft-insulation/index.html`, `loft-storage-rooms/index.html` |
| Thank-you page copy | `thank-you/insulation/index.html`, `thank-you/loft-storage/index.html` |
| Calculator logic: recommendations by property age, package names/prices/inclusions | `assets/site.js` → `CONFIG` block at the top |
| Google Tag Manager container ID | `assets/site.js` → `CONFIG.gtmId` (currently `GTM-PQV9P7T`, the RJ WordPress container) |
| Colours, type, spacing | `assets/site.css` → `:root` variables (values match rjinsulation.co.uk: green #027368, gold #BF9445, navy #022859, grey #F2F2F2) |
| Canonical URL / sitemap domain | `index.html` (`<link rel="canonical">`, `og:url`, JSON-LD), `robots.txt`, `sitemap.xml` |

Prices appear in three places: the package cards in `index.html`, the JSON-LD `hasOfferCatalog` in `index.html`,
and `CONFIG.packages` in `assets/site.js`. Change all three together.

## Tracking

`assets/site.js` pushes these events to `window.dataLayer` for GTM triggers:

- `calculator_step` (calculator, step, property_age / option)
- `calculator_change` (storage planner selection changed)
- `generate_lead` (fired on successful submit, before redirect) — form_name, service, package_option, property_age
- `conversion_thank_you` (fired once on the thank-you page — use this for the Google Ads conversion)
- `call_click`, `brochure_download`, `book_call`

GTM is loaded after the first user interaction or 2.5 s after page load so it does not affect page speed.

## The three pages

| URL | Use as the final URL for | Hero |
| --- | --- | --- |
| `/` | Generic loft insulation ads (and anything else) | Insulation finder, with the storage planner lower down |
| `/loft-insulation/` (short: `/insulation`) | Insulation and material campaigns (sheep's wool, foil, recycled) | Insulation finder; insulation-only content |
| `/loft-storage-rooms/` (short: `/storage`) | Storage Rooms campaign | Storage room planner with live "from" price; storage-only content |

The current pages are maintained directly in this folder. Update shared header, footer and calculator markup across all applicable pages together; the CSS and JavaScript are shared.

The storage photo bands use enhanced versions of the original RJ project photograph. The insulation band uses an illustrative image of a clean insulated loft, with a general service caption. The original photos remain in `images/` and in the package cards. The enhanced WebP images are supplied in three responsive sizes.

## Files

```
index.html                  hub landing page
loft-insulation/            insulation campaign page
loft-storage-rooms/         storage room campaign page
thank-you/insulation/       thank-you page for the insulation finder (personalised from the calculator)
thank-you/loft-storage/     thank-you page for the storage room planner
assets/site.css, site.js    styles and behaviour
fonts/                      Proxima Nova (RJ brand font, copied from rjinsulation.co.uk — covered by RJ's licence)
images/                     real RJ project photos (responsive WebP), logos, icons, OG share image
netlify.toml                headers (security + caching), redirects
robots.txt, sitemap.xml, site.webmanifest, favicon.svg, 404.html
```

## Notes for the team

- Never say "free survey" — the client's wording is "free phone consultation", then an "assessor visit".
- Only four accreditations are shown (Which? Trusted Trader, Trading Standards Approved, NIA, IWA), per the client.
- Storage room prices are guide starting prices for complete rooms, not boarding-only jobs.
- The Which?/NIA/IWA logos are currently text badges; drop the official logo files into `images/` and swap them in the trust strip if the client supplies them.
