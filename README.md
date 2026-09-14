# RJ Insulation campaign landing pages

Live site: https://rj-insulation-landing.netlify.app/

The current production source is in **`site/`**: a static HTML, CSS and JavaScript site covering the generic campaign page, `/loft-insulation/`, `/loft-storage-rooms/` and both thank-you pages. No dependencies or build step are required.

## Preview

```sh
python3 -m http.server 8765 --directory site
```

Open http://localhost:8765/. Calculator forms run in demo mode on localhost. Production enquiries use the existing Netlify Forms setup.

## Deployment

The existing Netlify project is published through manual uploads; automatic GitHub deployment is not linked. Upload the contents of `site/` as a ZIP to the existing **rj-insulation-landing** project's Deploys page. Its `netlify.toml` preserves the site's headers and redirects. For a future Git-based deployment, the root configuration points to `site/`.

See `site/readme.md` for forms, tracking and content documentation. Preserve `data-netlify="true"`, form names and honeypot attributes when editing.

## September 2026 visual updates

- Align the header phone icon with the phone number, including mobile.
- Add structured fact cards, consistent dividers and readable labels to all three pages.
- Add 24px above the property-era links, 0.85rem between calculator questions and hints, and 24px above and below the included-features panel.
- Use responsive WebP imagery with concise captions: enhanced project photography for storage and a clean illustrative loft image for insulation. Original project photos remain available and are used in the package cards.
- Match font URL casing to the actual assets so local and production fonts load consistently.

The static source was recovered from Netlify production deploy `6aa7e6c4106ca38a6508bbfb` on 14 September 2026. The former Next.js implementation remains in the repository for reference but is not the current published site.
