# RJ Insulation landing page — Netlify

Netlify-compatible source for the latest RJ Insulation landing page, including the tighter layout and the survey panel beneath the insulation introduction.

## Deploy through GitHub

1. Use the `main` branch of [generateleadsonline/rj-insulation-landing](https://github.com/generateleadsonline/rj-insulation-landing). The build configuration is in `netlify.toml` at the repository root.
2. In Netlify, import an existing project from GitHub and select that repository and branch.
3. Netlify reads these settings from the committed configuration:

   | Setting | Value |
   | --- | --- |
   | Build command | `pnpm build` |
   | Publish directory | `.next` |
   | Node.js | `22` |
   | pnpm | `11.19.0` |

4. Deploy. Netlify automatically applies its Next.js adapter. Subsequent pushes to the connected branch trigger deployments.
5. Test an enquiry from each calculator on the live address and check its receipt and saved record. Local tests do not verify Netlify account configuration or the live adapter.

The Netlify deployment has not yet been created. A Netlify account connection is required to complete publishing.

## Domain and SEO

The production canonical URL, metadata and sitemap use Netlify's built-in `URL`. If a custom campaign domain is connected, set `SITE_URL` to its full HTTPS address and redeploy. Netlify provides `CONTEXT` automatically; deploy previews and local builds are marked `noindex`. Both thank-you pages always remain `noindex`.

## Enquiries

- Both calculators submit to `POST /api/enquiries`.
- The server validates contact details and recalculates the recommendation before storing it in Netlify Blobs.
- Production records live in `rj-enquiries-production`. Preview and local records use separate stores.
- Repeated submissions with the same request ID do not overwrite the original enquiry.
- Each thank-you page reads a scoped HTTP-only receipt cookie. No saved receipt means no success message.
- In the Netlify project dashboard, open **Data & Storage → Blobs → rj-enquiries-production** to view or download saved enquiry JSON. There is no public lead-list endpoint.
- Netlify provides storage credentials to its server functions; no account token should be committed or embedded in browser code.

This is a fresh Netlify store. Existing Cloudflare records are not copied by deploying this code. Email/CRM delivery and Google Ads conversion tracking are not configured.

## Local development and verification

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm lint
pnpm typecheck
pnpm test:integration
```

`pnpm dev` runs the interface locally. Use `netlify dev` with the Netlify CLI for the full local Netlify environment. Running plain Next.js without a Blobs environment will intentionally reject enquiry saves rather than show a false confirmation.

The integration suite uses the installed Netlify Blobs local server and a real Next.js production process. It verifies both enquiry flows, server-side recommendations, retry handling, receipt rendering, validation, origin checks and storage failure handling. Its temporary test data is deleted after execution.

## Campaign launch items

- RJ's linked privacy policy needs its unfinished template content replaced.
- Package figures are guide starting prices; survey, final specification and applicable taxes determine the quote.
- Lighthouse has not been measured on the Netlify deployment.

## References

- [Netlify's Next.js deployment guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
- [Netlify Blobs storage documentation](https://docs.netlify.com/build/data-and-storage/netlify-blobs/)
- [Netlify's pnpm setup for Next.js](https://docs.netlify.com/snippets/frameworks/nextjs-pnpm-support/)
