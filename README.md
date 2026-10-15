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

Copy `.env.example` to `.env.local` if configuring integrations. Never commit secrets.
Restart dev after changing environment variables.

| Variables | Purpose |
| --- | --- |
| `GITHUB_TOKEN` | Server-side contributions; failures show a GitHub profile link. |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Email delivery with a verified sender. Without both, the form prepares an email-app draft. |
| `ENABLE_VIEW_COUNTER=true` | Enable optional counts with Redis configured. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Persistent counts and shared rate limiting. KV_REST_API_URL / KV_REST_API_TOKEN aliases are supported. |
| `NEXT_PUBLIC_SITE_URL` | Production origin for canonical URLs and sitemap. |

For Vercel, use its Next.js preset, the pnpm lockfile, `npm run build`, and the
variables above. Rebuild after adding public assets. This repair task does not deploy.

See [HOW_TO_FIX.md](HOW_TO_FIX.md) for current fixes, checks, and limitations.
The detailed editing guide and older history are in [MD_FILES/HOW_TO_FIX.md](MD_FILES/HOW_TO_FIX.md).
