# Ashmit Sharma — Portfolio

Next.js App Router portfolio with TypeScript, Tailwind CSS, Motion, dark/light themes,
responsive navigation, project filters, internship experience, GitHub activity,
contact form, optional view counter, and SEO metadata routes.

## Run locally

Use Node.js 24 (tested). On a fresh checkout, install locked dependencies first:

```powershell
cd D:\CODING\Projects\portfolio
pnpm install --frozen-lockfile
npm run dev -- --hostname 127.0.0.1
```

Open [localhost:3000](http://localhost:3000) or [127.0.0.1:3000](http://127.0.0.1:3000).
Keep the process running. Stopping it causes `ERR_CONNECTION_REFUSED`.
If port 3000 is occupied, use the existing server or set `--port 3001` and open that port.
For production preview, use `npm run build`, then `npm run start` (stop dev first).

## Checks

```powershell
npm run lint
npm run typecheck
npm test
npm run build
# Requires the server; never sends email:
npm run check:site
```

Type checking generates Next.js route types before running TypeScript. Tests use
Node's built-in runner and native TypeScript stripping. Set `CHECK_SITE_URL` to
check a different local port.

## Editing content

- `data/site.ts`: identity, About, contact text, quote, asset paths.
- `data/projects.ts`: project cards; see `docs/ADD_PROJECT.md`.
- `data/experience.ts`: internships and education.
- `data/techstack.ts`, `data/socials.ts`, `data/navigation.ts`: skills and links.
- `app/globals.css`: themes, layout, hover effects, reduced motion.
- `components/scroll-reveal.tsx`: section entrance animations.
- `public/avatar.webp`, `public/banner.webp`: profile images, with page fallbacks.
- `public/resume.pdf`: add your real resume; its link is already reserved.

## Integrations and deployment

Create `.env.local` if configuring integrations. Never commit secrets.
Restart dev after changing environment variables. On Vercel, configure variables in
the project's Settings → Environment Variables for each deployment environment.

| Variables | Purpose |
| --- | --- |
| `GITHUB_TOKEN` | Optional server-side GitHub GraphQL access. Without a working token, activity uses GitHub's public contribution calendar. |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Email delivery with a verified sender. Without both, the form prepares an email-app draft. |
| `ENABLE_VIEW_COUNTER=true` | Enable optional counts with Redis configured. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Persistent counts and shared rate limiting. KV_REST_API_URL / KV_REST_API_TOKEN aliases are supported. |
| `NEXT_PUBLIC_SITE_URL` | Production origin for canonical URLs and sitemap. |

For Vercel, use its Next.js preset, the pnpm lockfile, `npm run build`, and the
variables above. Redeploy after changing environment variables or adding public assets.

GitHub activity can load without a token using GitHub's public calendar. When a
token is configured, it is used only on the server; authentication, rate-limit,
and network errors fall back to the public calendar. If both GitHub sources are
unavailable, the page still renders with a profile link and a retry button; check
deployment logs for messages prefixed with `[github]`.
The public fallback follows GitHub's calendar HTML and may need updating if that
markup changes. A valid `GITHUB_TOKEN` keeps the documented GraphQL API as the
preferred source. Never use a `NEXT_PUBLIC_` prefix for this token.

The activity section showcases ASHMIT-PROG's contribution calendar, total
contributions, active days, and best day. It loads through `/api/github` in the
browser, independently of the static home page. Builds no longer request GitHub
data. Upstream requests use `no-store`; only validated successful API responses
are cached at the CDN for five minutes, with up to one hour of stale data while
revalidating. The endpoint returns uncached HTTP 503 responses on failure.
Visitors can retry manually; failed refreshes preserve an already loaded calendar,
and stalled browser requests stop after 20 seconds. The Vercel function has a
30-second limit to accommodate two upstream attempts of up to eight seconds each.

Deploy the complete change, including `app/api/github/route.ts`. Check
`https://<your-domain>/api/github` after deployment: HTTP 200 should contain a
nonempty `contributions` array. If it returns 404, the new route was not deployed;
if it returns 503, check the function logs and configure a valid server-only
`GITHUB_TOKEN` in the matching Vercel environment, then redeploy. Local
`.env.local` values are not automatically uploaded to Vercel.

See [HOW_TO_FIX.md](HOW_TO_FIX.md) for current fixes, checks, and limitations.
The detailed editing guide and older history are in [MD_FILES/HOW_TO_FIX.md](MD_FILES/HOW_TO_FIX.md).
