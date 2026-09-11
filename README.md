# RJ Insulation landing page

Live website: [rj-insulation-landing.netlify.app](https://rj-insulation-landing.netlify.app/).

The page includes the insulation and loft boarding calculators and their thank-you pages, the tighter layout, and the integrated survey panel.

## Deployment

The site is published on Netlify. Automatic deployment from GitHub is not yet linked.

To enable automatic deployments, open the existing Netlify project's repository settings, link this GitHub repository, and select the `main` branch. Build configuration is committed in `netlify.toml`:

| Setting | Value |
| --- | --- |
| Build command | `pnpm build` |
| Publish directory | `.next` |
| Node.js | `22` |
| pnpm | `11.19.0` |

The configuration explicitly enables Netlify's Next.js adapter.

## Local development

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Verification commands

```sh
pnpm build
pnpm lint
pnpm typecheck
pnpm test:integration
```
