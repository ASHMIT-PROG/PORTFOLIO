# Portfolio fixes — 2026-10-15

Repairs from the “fix all the issues and run it” request. The full editing guide and
older history remain in [MD_FILES/HOW_TO_FIX.md](MD_FILES/HOW_TO_FIX.md).

## Smooth header motion — 2026-10-15

- Added soft hover/focus backgrounds and a spring-animated active-page dot using
  the existing Motion dependency. Link weight stays constant to avoid width jumps.
- Replaced the wide rectangular header focus outline with a closer, rounded
  keyboard-focus ring. Only the current page retains the active dot.
- Added eased open/close animations for More and the mobile drawer, a rotating
  chevron, gentle button press feedback, and rotating/fading theme icons.
- Preserved reduced-motion support: the active marker becomes static and CSS
  transitions/animations use the existing reduced-motion overrides.
- TypeScript and targeted ESLint passed. Browser checks covered desktop route
  changes, dropdown open/Escape dismissal, keyboard focus, both themes, and mobile
  drawer opening/closing at 390px. No browser console errors were observed.
- The updated development preview runs at `http://127.0.0.1:3000` using webpack.
  These changes have not been deployed to Vercel.

## GitHub activity on Vercel and navigation — 2026-10-15

The reported production screenshot showed an unavailable contribution calendar.
The home page fetched GitHub data during static generation and could bake a
temporary failure into its HTML. Upstream responses were also cached before
validation, including HTTP 200 responses containing GraphQL errors or invalid
calendar markup. Production logs were not available, so the exact deployed
upstream failure is unconfirmed.

- Removed GitHub fetching from the home-page build. The calendar now loads from
  the Node.js `/api/github` route after the page opens.
- Upstream requests bypass the Next.js data cache. The API caches only valid,
  nonempty data for five minutes at the CDN, with a one-hour stale-revalidation
  window. Failures return HTTP 503 with `Cache-Control: no-store` and
  `Retry-After: 60`, so a later request can recover.
- Preserved authenticated GraphQL with a public-calendar fallback. Tokens remain
  server-side. Added a 30-second function budget for both eight-second attempts,
  a 20-second browser timeout, and a manual retry that retains loaded data if a
  refresh fails.
- Kept the activity summary, calendar, profile link, and retry UI from the existing
  workspace changes.
- Removed the navigation hover underline that appeared alongside the current
  page's dot. Hover/focus changes text color; only the current route has the dot
  and `aria-current="page"`, including in the mobile menu.

### Deploy and verify

1. Deploy all changed files, including the new `app/api/github/route.ts`.
2. In Vercel, use the Next.js framework preset. If using `GITHUB_TOKEN`, set it in
   **Settings → Environment Variables** for Production (and Preview if needed),
   then redeploy. `.env.local` is ignored by Git and is not uploaded automatically.
   Never name the token `NEXT_PUBLIC_GITHUB_TOKEN`.
3. Open `/api/github` on the deployed domain. Expect HTTP 200 and a nonempty
   `contributions` array. HTTP 404 means this route is missing from that deployment;
   HTTP 503 means both upstream sources failed. Inspect `[github]` function logs
   for authentication, rate-limit, invalid-data, or network errors.
4. Open Home and use **Refresh activity**. Check that activity renders, then hover
   Experience: Home should retain its dot without an underline under Experience.
   Navigate to Experience and confirm that the dot moves to that page.

References: [Vercel cache headers](https://vercel.com/docs/caching/cache-control-headers),
[GitHub GraphQL authentication](https://docs.github.com/en/graphql/guides/forming-calls-with-graphql).

### Verification for this change

- All 14 Node regression tests passed, including runtime HTTP failure/recovery,
  token fallback, invalid upstream data, and uncached retry behavior.
- TypeScript and targeted ESLint checks passed.
- `next build --webpack` passed and generated all 13 pages. The output confirms
  `/` is static and `/api/github` runs on demand.
- The default Turbopack build hit a local CSS-worker startup crash. Webpack was
  used for production-preview verification; the project's build command was not
  changed. A Vercel build has not been run in this task.
- The real local production endpoint returned HTTP 200 with 369 days and the
  expected success cache headers. The browser displayed the contribution graph,
  summary totals, and working refresh button. The public fallback also returned
  real data in a separate token-free request.
- The browser showed a single Home indicator without hover underlines and could
  navigate through the mobile menu. HTTP checks confirmed exactly one current
  navigation link on Home, Projects, and Experience.
- Existing HTTP smoke checks passed using `http://localhost:3000`. Using
  `127.0.0.1` for those POST checks triggers the existing origin guard because
  Next.js resolves the internal request origin as `localhost`.
- The production preview is running at `http://localhost:3000`; no deployment or
  Vercel environment-variable changes were made.

## Issues fixed

| Issue | Fix | Files |
| --- | --- | --- |
| Build failed: default export missing for `/icon` | Changed the ordinary `GET` handler to the default function required for a Next.js metadata icon; declared WebP content type. | `app/icon.tsx` |
| Favicon updates could remain cached for a year | Replaced immutable one-year caching with one-hour caching and revalidation. | `app/icon.tsx` |
| Three TypeScript errors in animation wrappers | Used `HTMLMotionProps` instead of incompatible native drag/animation event types, including reduced-motion rendering. | `components/scroll-reveal.tsx` |
| Strict lint failed | Removed the unused `Experience` type import. | `components/experience-preview.tsx` |
| CSS and Motion competed for section opacity/position | Removed the duplicate persistent `page-enter` animation. ScrollReveal now owns the entrance effects. | `app/globals.css` |
| Reduced-motion preference missed stagger children and hover movement | Disabled child movement/delays and CSS hover transforms when reduced motion is requested. | `components/scroll-reveal.tsx`, `app/globals.css` |
| Sections could be invisible without JavaScript | Added a no-script style restoring the server-rendered reveal content's opacity and position. | `app/layout.tsx` |
| Fixed thumbnail text/icon sizes could clip in narrow cards | Added bounded container-relative title, icon, spacing, and padding sizes. | `components/project-card.tsx`, `app/globals.css` |
| Rounded dots and badges inherited CTA hover effects | Scoped lift/shadow styles to actual Button components. | `app/globals.css` |
| A failed image prevented loading a replacement URL | Track the failed source rather than a permanent failure flag; a new URL gets a load attempt. Also migrated deprecated Next image `priority` to `preload`. | `components/fallback-image.tsx` |
| Pasted email addresses with outer whitespace failed | Trim before validation in the shared client/server schema. | `lib/contact-schema.ts` |
| “Open email draft” button only prepared the draft | Renamed that button to “Prepare email draft”; the resulting mailto link remains “Open email draft”. | `components/contact-form.tsx`, `data/site.ts` |
| `application/jsonp` passed the JSON content-type check | Match the complete media type while supporting case differences and charset parameters. | `lib/request.ts` |
| Strict Mode could send duplicate visitor increments | Share in-flight requests across mounts; cleanup ignores the unmounted consumer instead of aborting and repeating a server increment. Failures remain retryable. This is client request deduplication, not cross-device visitor identification. | `lib/view-count.ts`, `components/view-counter.tsx` |
| Type checking depended on generated route types already existing | Run `next typegen` before `tsc --noEmit`. | `package.json` |
| Loopback dev assets could fail origin checks | Added `127.0.0.1` to development origins alongside Next's default localhost support. | `next.config.ts` |
| Location and quote retained editing brackets | Removed brackets while preserving Chennai, the quote, and its attribution. | `data/site.ts` |
| README still described obsolete Phase 1 placeholders | Updated actual pages, run commands, checks, configuration, and deployment guidance; corrected the animation guide. | `README.md`, `MD_FILES/HOW_TO_FIX.md` |
| No repeatable checks for the validation and view-request bugs | Added seven built-in Node tests and safe local HTTP smoke checks. Declared the package's existing ESM format to remove Node's ambiguous-module warning. | `tests/*.test.mjs`, `scripts/check-site.mjs`, `package.json` |
| Local preview refused connections | Started the missing Next.js server on loopback port 3000 and verified HTTP responses. Keep its process running. | Runtime; `README.md` |

## Earlier repair verification

At the end of the earlier repair: lint passed with zero warnings; generated route types and TypeScript
passed; all 7 regression tests passed; the production build generated all 12 pages
successfully; all local HTTP smoke checks passed. That run used a development
server on port 3000; see the current verification above for this run.

```powershell
npm run lint
npm run typecheck
npm test
npm run build
# Requires a running server:
npm run check:site
```

HTTP checks cover Home, Projects, Experience, Contact, icon, Open Graph image,
robots, sitemap, avatar, banner, missing-page 404, invalid/malformed/oversized contact
payloads, incorrect media types, cross-origin rejection, email trimming, honeypot,
and the configured email-app fallback. They do not send email or increment visitor
counts. Seven unit tests additionally cover actual UTF-8 byte limits and concurrent
view requests, failures, retries, and invalid counts.

## Run / restart

```powershell
cd D:\CODING\Projects\portfolio
npm run dev -- --hostname 127.0.0.1
```

Open [localhost:3000](http://localhost:3000) or [127.0.0.1:3000](http://127.0.0.1:3000).
Reload an old error page. Closing the server process stops the preview.

## Remaining inputs and verification limits

- `public/resume.pdf` is missing. Per the original request, Resume links retain that
  URL until the real file is supplied. No resume was invented.
- The current configuration uses the email-app fallback. Live Resend delivery and
  Redis-backed counters were not exercised against external services.
- Browser automation's security policy blocked the existing preview tab. Compilation
  and HTTP checks pass, but visual checks at mobile/tablet/desktop widths and
  interactive keyboard/theme verification could not be completed in this repair run.
  Reload the preview to inspect those; no policy bypass was attempted.
- The icon reads the supplied `public/avatar.webp`; retain it when building.
  Asset changes in a deployed static build require a rebuild.
- This task does not publish or deploy the site.
